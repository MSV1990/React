import React, { Component } from 'react'
import Websocket from 'react-websocket';
import ChatInput from './Chat_input'
import ChatMessage from './Message'
import Status from './Status'
import icons_chats from '../imgs/icons_chats.png'



const URL = 'ws://st-chat.shas.tel';

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

  wsOpen = () => {
    this.setState({
      status: 'Connected',
      style: 'Online',
    })
    Notification.requestPermission();
  }

  wsMessage = (data) => {
    const message = JSON.parse(data);
    this.addMessage(message);
    console.log(message)
    if(document.hidden) {
      const options = {
        body: message[0].message,
        icon: icons_chats,
    };
        new Notification(`New message from ${message[0].from}`, options);
      }
  }

  wsClose = () => {
    console.log('disconnected')
    new Notification('Disconnected');
      this.setState({
        status: 'Disconnected',
        style: 'Offline',
      })
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
          ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
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