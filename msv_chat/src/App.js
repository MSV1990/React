import React from 'react';
import logo from './logo.svg';
import './App.css';
import Chat from './components/Chat'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="spin">
        <p>
        <span className='heart'>&#10084;</span> Welcome to MsvChat <span className='heart'>&#10084;</span> 
        </p>
        </div>
      </header>
      <Chat />
    </div>
  );
}

export default App;
