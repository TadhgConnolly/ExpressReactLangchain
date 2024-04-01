const CheerioWebBaseLoader = require("langchain/document_loaders/web/cheerio").CheerioWebBaseLoader;
const RecursiveCharacterTextSplitter = require("langchain/text_splitter").RecursiveCharacterTextSplitter;
const MemoryVectorStore = require("langchain/vectorstores/memory").MemoryVectorStore;
const { OpenAIEmbeddings, ChatOpenAI } = require("@langchain/openai");
const { pull } = require("langchain/hub");
const { PromptTemplate } = require("@langchain/core/prompts");
const { createStuffDocumentsChain } = require("langchain/chains/combine_documents");
const { StringOutputParser } = require("@langchain/core/output_parsers");
const { RunnableSequence } = require("@langchain/core/runnables");

exports.processData = async (req, res) => {
    try {
      // Extracting the question from the request body
      const { question } = req.body;
  
      const loader = new CheerioWebBaseLoader("https://lilianweng.github.io/posts/2023-06-23-agent/");
      const docs = await loader.load();
  
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });
      const splits = await textSplitter.splitDocuments(docs);
  
      const vectorStore = await MemoryVectorStore.fromDocuments(splits, new OpenAIEmbeddings({openAIApiKey: process.env.OPENAI_API_KEY}));
  
      const retriever = vectorStore.asRetriever();
      const promptTemplate = PromptTemplate.fromTemplate(`You are an assistant for question-answering tasks. Use the following pieces of retrieved context to answer the question. If you don't know the answer, just say that you don't know. Use three sentences maximum and keep the answer concise. Question: ${question}`)
      //   const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
      const llm = new ChatOpenAI({ modelName: "gpt-3.5-turbo", temperature: 0, openAIApiKey: process.env.OPENAI_API_KEY });
  
      console.log(new StringOutputParser())

      const ragChain = RunnableSequence.from([
        promptTemplate,
        llm
      ]);
  
      const retrievedDocs = await retriever.getRelevantDocuments(question);
  
      const response = await ragChain.invoke({
        question,
        context: retrievedDocs,
      });
  
      // Sending back the response to the client
      res.json({ response });
    } catch (error) {
      console.error("Error processing data:", error);
      res.status(500).send("Failed to process data.");
    }
  };