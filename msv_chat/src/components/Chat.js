import React, { Component } from 'react'
import Websocket from 'react-websocket';
import ChatInput from './Chat_input'
import ChatMessage from './Message'
import Status from './Status'
import icons_chats from '../imgs/icons_chats.png'
import badgeicon from '../imgs/badge.png'
import * as firebase from "firebase/app"
import * as messaging from "firebase/messaging"


const URL = 'ws://st-chat.shas.tel';
const fireUrl = 'https://fcm.googleapis.com/fcm/send';
const your_api_key = 'AAAAKAtMuTQ:APA91bEvIRejaSSpydMPuWN2d28-flyoo66z9Ph6OqiK3l_s_d7ksOtsAuHwICMDTXkGAhEHN9dBW7v51-difP-Tlxg45zMudP6w4nTtSSbxQ-wlbKZaXJ8og9PMnWj7hvOPkiSCCEXT'; // Server key
const your_token_id = '171988269364'; // Client token id
let flag = true;
let token;


class Chat extends Component {
  state = {
    from: 'John Doe',
    messages: [],
    api_key: your_api_key,
    token_id: your_token_id,
  }

  componentDidMount() {
if(localStorage.getItem('User')) {
    this.setState({
      from: localStorage.getItem('User')
    })
}

firebase.initializeApp({
  messagingSenderId: your_token_id
});

  
  if (Notification.permission === 'granted') {
    this.subscribe();

}
  

}

subscribe = () => {
  const messaging = firebase.messaging();
  messaging.requestPermission()
  .then(function () {
      
      messaging.getToken()
          .then(function (currentToken) {
              if (currentToken) {
                token = currentToken;
                console.log(token);
              } else {
                  console.warn('Failed to get token');
                  
              }
          })
          .catch(function (err) {
              console.warn('Error occured during getting token', err);
          });
})
.catch(function (err) {
  console.warn('Failed to get permission', err);
});

}


sendDataToFireBase = (message) => {
  fetch(fireUrl, {
    method: 'POST',
    headers: {
    'Authorization': `key=AAAAKAtMuTQ:APA91bEvIRejaSSpydMPuWN2d28-flyoo66z9Ph6OqiK3l_s_d7ksOtsAuHwICMDTXkGAhEHN9dBW7v51-difP-Tlxg45zMudP6w4nTtSSbxQ-wlbKZaXJ8og9PMnWj7hvOPkiSCCEXT`,
    'Content-Type': 'application/json',
   },
    body: JSON.stringify({
      to: token,
      data:message})
  })
  .then(function(response) {
    console.log(response);
  })
 
}
  // showNotification = (title,options) => {
  //   Notification.requestPermission(function(result) {
  //     if (result === 'granted') {
  //       navigator.serviceWorker.ready.then(function(registration) {
  //         registration.showNotification(title, options);
  //       });
  //     }
  //   });
    
  // }
  
  
  wsOpen = () => {
    this.setState({
      status: 'Connected',
      style: 'Online',
    })
    const options = {
      icon: icons_chats,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
      badge: badgeicon,
  };
    flag = true;
    // this.showNotification('Welcome to MSV1990 chat', options)
  }

  wsMessage = (data) => {
    const message = JSON.parse(data);
    this.addMessage(message);
    if(document.hidden) {
      const options = {
        body: message[0].message,
        icon: icons_chats,
        badge: badgeicon,
    };
    this.sendDataToFireBase(message[0].message);
    // this.showNotification(`New message from ${message[0].from}`, options);
      }
  }
  
  wsClose = () => {
    console.log('disconnected')
    
    if(flag){
      const options = {
        icon: icons_chats,
        badge: badgeicon,
    };
    // this.showNotification('Disconnected', options);
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
      <button type="button" id="subscribe" onClick={this.subscribe}>Watch</button>
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