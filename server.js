const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 9090 });
console.log('Server is running');

const roomRoster = new Map([
    [
        'Room 1', 
        { 
            offer: null,
            offerer: null,
            connections: []
        }
    ],
    [
        'Room 2', 
        { 
            offer: null,
            offerer: null,
            connections: []
        }
    ],
    [
        'Room 3', 
        { 
            offer: null,
            offerer: null,
            connections: []
        }
    ],
    [
        'Room 4', 
        { 
            offer: null,
            offerer: null,
            connections: [] 
        }
    ],
]);

wss.on('connection', (connection) => {

    connection.on('message', (message) => {
        let data = sanitizeData(message);
        switch(data.type) {
            case 'join':
                handleJoin(connection, data.data);
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

const handleJoin = (connection, data) => {
    const roomName = data.roomName;

    sendTo(connection, { 
        type: 'SERVER/INITIAL', 
        payload: { 
            expectedData: roomRoster.get(roomName).offer ? 'answer' : 'offer' 
        }
    });
}

const sanitizeData = (message) => {
    try {
        return JSON.parse(message); 
    } catch (e) { 
        console.log('Invalid JSON error caught'); 
        return {}; 
    } 
}

const sendTo = (connection, message) => {
    connection.send(JSON.stringify(message));
}

const broadcastToRoom = (room, message) => {
    room.forEach(connection => {
        message.send(JSON.stringify(message));
    });
}