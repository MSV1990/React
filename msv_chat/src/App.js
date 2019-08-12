import React from 'react';
import './App.css';
import Chat from './components/Chat'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="spin">
        <h4>Welcome to Msv1990 Chat</h4>
        </div>
      </header>
      <Chat />
    </div>
  );
}

export default App;
