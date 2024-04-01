import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatComponent from './ChatComponent';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <p>PasteBin insta-rag</p>
        <p>Enter the suffix of your PasteBin url to query the document like an LLM</p>
        <ChatComponent/>
      </header>
    </div>
  );
}

export default App;
