const URL = 'wss://wssproxy.herokuapp.com';
let ws;
let interval;
function connect(){
    ws = new WebSocket(URL) ;
    ws.onmessage = (evt) => {
        const message = JSON.parse(evt.data);
        const options = {
            body: message[0].message,
            icon: '../src/imgs/icons_chats.png',
            badge: '../src/imgs/badge.png',
        };
        if(true){
        self.registration.showNotification(`New message from ${message[0].from}`, options);
        }
      }
      ws.onclose = () => {
         this.interval =  setTimeout(() =>{
              console.log('attempt')
              connect()
          }, 2000)
      }
    
      ws.onopen = () => {
        if(interval){
            clearInterval(interval)
        }
    }
}


connect()