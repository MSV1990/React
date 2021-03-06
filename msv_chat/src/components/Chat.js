import React, { Component } from 'react'
import Websocket from 'react-websocket';
import ChatInput from './Chat_input'
import ChatMessage from './Message'
import Status from './Status'
import icons_chats from '../imgs/icons_chats.png'
import badgeicon from '../imgs/badge.png'

const URL = 'wss://msvserver.herokuapp.com/';
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('worker.js');
}

let flag = true;

class Chat extends Component {
  state = {
    from: 'John Doe',
    messages: [],
  }

  componentDidMount() {
if(localStorage.getItem('User')) {
    this.setState({
      from: localStorage.getItem('User')
    })
}


}

  showNotification = (title,options) => {
    Notification.requestPermission(function(result) {
      if (result === 'granted') {
       navigator.serviceWorker.ready.then(registration => {
          registration.showNotification(title,options);
      })
      }
    });
    
  }
  
  
  wsOpen = () => {
    this.setState({
      status: 'Connected',
      style: 'Online',
    })
    const options = {
      icon: icons_chats,
      badge: badgeicon,
      vibrate: [500],
  };
    flag = true;
    this.showNotification('Welcome to MSV1990 chat', options)
  }

  wsMessage = (data) => {
    const message = JSON.parse(data);
    this.addMessage(message);
  }
  
  wsClose = () => {  
    if(flag){
      const options = {
        icon: icons_chats,
        badge: badgeicon,
        vibrate: [500],
    };
    this.showNotification('Disconnected', options);
    flag = false;
    this.setState({
      status: 'Disconnected',
      style: 'Offline',
    })
    }
  }
  

  addMessage = (message) =>{
    this.setState(state => ({ messages: message.concat(state.messages) }
        ))
    }

  submitMessage = messageString => {
    const message = { from: this.state.from, message: messageString }
    this.refWebSocket.sendMessage(JSON.stringify(message))
  }

  changeName = (newName) => {
    this.setState({ from: newName })
    localStorage.setItem('User', newName)
  }

  render() {
    
    return (
      <>
      <Websocket url={URL}
       onMessage={this.wsMessage.bind(this)}
       onClose={this.wsClose.bind(this)}
       onOpen={this.wsOpen.bind(this)}
       reconnect={true} debug={true}
       ref={Websocket => {
       this.refWebSocket = Websocket}}/>
             
        <Status status={this.state.status} style={this.state.style}/>
        <div className = 'bottomInputPanel'>
        <div className="userNameContainer">
        <label className="userNameLabel" htmlFor="name">
          Name:&nbsp;
          <input className="userNameInput"
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.from}
            onChange={e => this.changeName(e.target.value)} 
          />
        </label>
        </div>
        <ChatInput className="messageInput"
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        </div>
        <div className="messagesContainer">
        {this.state.messages.map((message, index) =>
        <div className='message' key={index}>
          <ChatMessage
            message={message.message}
            from={message.from}
            time={message.time}
            id={message.id}
          />
          </div>
          ,
        )}
        </div>
      </>
    )
  }
}

export default Chat