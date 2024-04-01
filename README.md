# PasteBin auto-RAG

This web-app allows a user to provide a PasteBin URL and then ask the contained text questions. The text acts as the basis for retrieval augmented generation, it gets split into parts, then stored in a vector databse. When a user submits a question, the vector database is queried for relevent context, then the underlying LLM responds based on the question and provided context.

# Set-up

Create a .env file and in it paste OPENAI_API_KEY="your openAI Key here"

Run "npm i" in the parent directory and the my-app directory

In the parent directory run 'node server.js'

In the my-app directory run 'npm start'

You should be good to go.
