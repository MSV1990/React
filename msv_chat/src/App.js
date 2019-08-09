import React from 'react';
import './App.css';
import Chat from './components/Chat'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="spin">
        <p>
        Welcome to Msv1990 Chat
        </p>
        </div>
      </header>
      <Chat />
    </div>
  );
}

export default App;
