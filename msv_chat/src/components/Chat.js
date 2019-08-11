import React, { Component } from 'react'
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

  ws = new WebSocket(URL);

 

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
        this.setState({
          ws: new WebSocket(URL),
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

  changeName = (newName) =>{
    this.setState({ from: newName })
    localStorage.setItem('User', newName)
  }

  render() {
    
    return (
      <>
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