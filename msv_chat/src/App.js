import React from 'react';
import './App.css';
import Chat from './components/Chat'
import icons_chats from './imgs/icons_chats.png'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="spin">
        <img src={icons_chats} alt="img"></img>
        </div>
      </header>
      <Chat />
    </div>
  );
}

export default App;
