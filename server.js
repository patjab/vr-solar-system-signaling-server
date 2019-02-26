const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 9090 });
console.log('Server is running');

const roomRoaster = {
    room1: [],
    room2: [],
    room3: [],
    room4: []
};

wss.on('connection', (connection) => {
    console.log('A user connected');

    setTimeout(() => {
        sendTo(connection, {
            type: 'ASD',
            payload: 'bcas'
        });
    }, 3000)

    connection.on('message', (message) => {

        let data;
        try {
            data = JSON.parse(message); 
        } catch (e) { 
            console.log("Invalid JSON"); 
            data = {}; 
        } 

        // switch(data.type) {
        //     case 'login':
        //     break;
        //     case 'offer':
        //     break;
        //     case 'answer':
        //     break;
        //     case 'candidate':
        //     break;
        // };

    });

});

const sendTo = (connection, message) => {
    connection.send(JSON.stringify(message));
}

const broadcastToRoom = (room, message) => {
    room.forEach(connection => {
        message.send(JSON.stringify(message));
    });
}