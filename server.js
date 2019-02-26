const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 9090 });
console.log('Server is running');

const roomRoaster = {
    room1: {
        offer: {},
        answers: []
    },
    room2: {
        offer: {},
        answers: []
    },
    room3: {
        offer: {},
        answers: []
    },
    room4: {
        offer: {},
        answers: []
    }
};

wss.on('connection', (connection) => {

    connection.on('message', (message) => {
        console.log('received message')

        let data;
        try {
            data = JSON.parse(message); 
        } catch (e) { 
            console.log('Invalid JSON error caught'); 
            data = {}; 
        } 

        console.log(data)

        switch(data.type) {
            case 'login':

            break;
            case 'offer':

                break;
            case 'answer':
            break;
            case 'candidate':
            break;
        };

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