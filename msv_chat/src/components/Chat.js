import React, { Component } from 'react'
import ChatInput from './Chat_input'
import ChatMessage from './Message'
import Status from './Status'
import ReconnectingWebSocket from 'reconnecting-websocket';
import WS from 'ws';
import icons_chats from '../imgs/icons_chats.png'


const URL = 'ws://st-chat.shas.tel';

const options = {
  WebSocket: WS,
  maxReconnectionDelay: 5000,
  minReconnectionDelay: 1000 + Math.random() * 4000,
  connectionTimeout: 2000,
  maxRetries: Infinity,
};


class Chat extends Component {
  state = {
    from: 'John Doe',
    messages: [],
  }

  ws = new ReconnectingWebSocket(URL, [], options);

 

  componentDidMount() {
if(localStorage.getItem('User')) {
    this.setState({
      from: localStorage.getItem('User')
    })
}

    this.ws.onopen = () => {
      this.setState({
        status: 'Connected',
        style: 'Online',
      })
      Notification.requestPermission();
    }

    this.ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.addMessage(message);
      if(document.hidden) {
        const options = {
          body: message[0].message,
          icon: icons_chats,
      };
          new Notification(`New message from ${message[0].from}`, options);
        }
    }
 
    this.ws.onclose = () => {
      console.log('disconnected')
      new Notification('Disconnected');
        this.setState({
          status: 'Disconnected',
          style: 'Offline',
        })
    }

    this.ws.onerror = err => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      this.ws.close();
    };
  }

  addMessage = (message) =>{
    this.setState(state => ({ messages: message.concat(state.messages) }
        ))
    }

  submitMessage = messageString => {
    const message = { from: this.state.from, message: messageString }
    this.ws.send(JSON.stringify(message))
  }
changeName = (event) =>{
  this.setState({ from: event })
  localStorage.setItem('User', event)
}


  render() {
    
    return (
      <div>
        <Status status={this.state.status} style={this.state.style}/>
        <label className="label" htmlFor="name">
          Name:&nbsp;
          <input
          className="name_input"
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.from}
            onChange={e => this.changeName(e.target.value)} 
          />
        </label>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        <button onClick={ (e) => {
          e.preventDefault();
          this.ws.close()}
          }>Close Me</button>
        
        {this.state.messages.map((message) =>
        <div className='message'>
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
    )
  }
}

export default Chat