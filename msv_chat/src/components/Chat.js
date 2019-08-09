import React, { Component } from 'react'
import ChatInput from './Chat_input'
import ChatMessage from './Message'
import Status from './Status'
import PageVisibility from 'react-page-visibility';

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
    this.setState({
      from: localStorage.getItem('user')
    })
}

    this.ws.onopen = () => {
      this.setState({
        status: 'Connected',
        style: 'Online',
      })
      

    this.ws.onmessage = evt => {
      // on receiving a message, add it to the list of messages
      const message = JSON.parse(evt.data)
      this.addMessage(message)
      if(this.state.rotate && message){
        const options = {
          body: message[0].message,
          vibrate: [200, 100, 200, 100, 200, 100, 200],
          tag: message[0].from,
      };

        Notification.requestPermission(function(result) {
          if (result === 'granted' && message[0]) {
            navigator.serviceWorker.ready.then(function(registration) {
              registration.showNotification(`New message from ${message[0].from}`, options);
            });
          }
        });
        
      }
      }
      
    }

    this.ws.onclose = () => {
      console.log('disconnected')
      navigator.serviceWorker.showNotification('Disconnected');
        this.setState({
          status: 'Disconnected',
          style: 'Offline',
        })
        setTimeout( () => {
          this.setState({
            status: 'Disconnected',
            style: 'Offline',
          })}, 1000)
    }

    this.ws.onerror = err => {
      console.error('Socket encountered error: ', err.message, 'Closing socket');
      this.ws.close();
    };
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
        <label className="label" htmlFor="name">
          Name:&nbsp;
          <input
          className="name_input"
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
          />
          </div>
          ,
        )}
      </div>
    )
  }
}

export default Chat