import React, { Component } from 'react'
import ChatInput from './Chat_input'
import ChatMessage from './Message'
import Status from './Status'
import PageVisibility from 'react-page-visibility';
import Moment from 'react-moment'
const URL = 'ws://st-chat.shas.tel'




class Chat extends Component {
  state = {
    from: 'John Doe',
    messages: [],
    rotate: true,
  }

  ws = new WebSocket(URL)

  componentDidMount() {
if(localStorage.getItem('user')) {
    this.setState.from = localStorage.getItem('user');
}

    this.ws.onopen = () => {
      Notification.requestPermission()
      new Notification(`${this.state.from}`)
      this.setState({
        status: 'Connected',
        style: 'Online',
      })
      

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      this.addMessage(message)
      if(this.state.rotate){
        var options = {
          body: message[0].message,
      };
        new Notification(message[0].from, options);
        
      }
      }
      
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      // automatically try to reconnect on connection loss
      this.setState({
        ws: new WebSocket(URL),
        status: 'Disconnected',
        style: 'Offline',
      })
    }
  }

  handleVisibilityChange = isVisible => {
    this.setState({ rotate: !isVisible });
}
  addMessage = (message) =>{
    this.setState(state => ({ messages: message.concat(state.messages) }
        ))
    }

  submitMessage = messageString => {
    // on submitting the ChatInput form, send the message, add it to the list and reset the input
    const message = { from: this.state.from, message: messageString }
    this.ws.send(JSON.stringify(message))
  }



  render() {
    
    return (
      <div>
        <PageVisibility onChange={this.handleVisibilityChange}>
        </PageVisibility>
        <Status status={this.state.status} style={this.state.style}/>
        <label htmlFor="name">
          Name:&nbsp;
          <input
            type="text"
            id={'name'}
            placeholder={'Enter your name...'}
            value={this.state.from}
            onChange={e => this.setState({ from: e.target.value })}
          />
        </label>
        <ChatInput
          ws={this.ws}
          onSubmitMessage={messageString => this.submitMessage(messageString)}
        />
        {this.state.messages.map((message) =>
          <ChatMessage
            message={message.message}
            from={message.from}
            time={message.time}
          />,
        )}
      </div>
    )
  }
}

export default Chat