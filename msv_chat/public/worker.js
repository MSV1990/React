const URL = 'wss://wssproxy.herokuapp.com';
let ws;
let interval;

function connect(){
    let clientIsVisible;
    ws = new WebSocket(URL) ;
    ws.onmessage = (evt) => {
        self.clients.matchAll({
            type: 'window',
            includeUncontrolled: true
         })
         .then(function(windowClients) {
     
          clientIsVisible = false;
     
          for (var i = 0; i < windowClients.length; i++) {
           const windowClient = windowClients[i];
     
           if (windowClient.visibilityState==="visible") {
               clientIsVisible = true;
     
             break;
           }
         }
         console.log(clientIsVisible);
         return clientIsVisible;
       });
        const message = JSON.parse(evt.data);
        const options = {
            body: message[0].message,
            icon: '../src/imgs/icons_chats.png',
            badge: '../src/imgs/badge.png',
        };
        if(!clientIsVisible){
        self.registration.showNotification(`New message from ${message[0].from}`, options);
        }
      }
      ws.onclose = () => {
         this.interval =  setTimeout(() =>{
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