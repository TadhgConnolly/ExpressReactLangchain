const CheerioWebBaseLoader = require("langchain/document_loaders/web/cheerio").CheerioWebBaseLoader;
const RecursiveCharacterTextSplitter = require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const MemoryVectorStore = require("langchain/vectorstores/memory").MemoryVectorStore;
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { pull } = require("langchain/hub");
const { PromptTemplate } = require("@langchain/core/prompts");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableSequence } = require("@langchain/core/runnables");
const { formatDocumentsAsString } = require("langchain/util/document");

exports.processData = async (req, res) => {
    try {
      // Extracting the question from the request body
      const { question, pastebinURL } = req.body;

      const url = "https://pastebin.com/raw/".concat(pastebinURL)
      console.log("fetching data from url:", url)
  
      //scrape data from url
      const loader = new CheerioWebBaseLoader(url);
      const docs = await loader.load();
  
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      //splits the data into smaller pieces
      const splits = await textSplitter.splitDocuments(docs);
  
      //creates a vector store based on the splits
      const vectorStore = await MemoryVectorStore.fromDocuments(splits, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}));
  
      const retriever = vectorStore.asRetriever();

      const promptTemplate = PromptTemplate.fromTemplate(`You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use six sentences maximum and keep the answer concise. Question: {question} Context: {context}`)
      const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY });
  

      const ragChain = RunnableSequence.from([
        promptTemplate,
        llm
      ]);
  
      //retriever searches the vector store for pieces of split data that are relevent to the user question
      const retrievedDocs = await retriever.getRelevantDocuments(question);
  
      console.log("Info we've fetched from datasource", retrievedDocs)

      //call the LLM with the question from the user and the relevent context retrieved from the vector store
      const response = await ragChain.invoke({
        question: question,
        context: retrievedDocs,
      });
  
      // Sending back the response to the client
      res.json({ response });
    } catch (error) {
      console.error("Error processing data:", error);
      res.status(500).send("Failed to process data.");
    }
  };