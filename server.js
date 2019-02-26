const WebSocketServer = require('ws').Server;
const wss = new WebSocketServer({ port: 9090 });
console.log('Server is running');

const roomRoster = new Map([
    [
        'Room 1', 
        { 
            offer: false,
            offerer: null,
            connections: []
        }
    ],
    [
        'Room 2', 
        { 
            offer: false,
            offerer: null,
            connections: []
        }
    ],
    [
        'Room 3', 
        { 
            offer: false,
            offerer: null,
            connections: []
        }
    ],
    [
        'Room 4', 
        { 
            offer: false,
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
                handleOffer(connection, data.data);
                break;
            case 'answer':
                handleAnswer(connection, data.data);
                break;
            case 'candidate':
                break;
        };

    });
});

const handleJoin = (connection, data) => {
    const roomName = data.roomName;
    sendTo(connection, { 
        type: 'SERVER/GETOFFER', 
        payload: { 
            offer: roomRoster.get(roomName).offer 
        }
    });
}

const handleOffer = (connection, data) => {
    const roomName = data.roomName;
    const offer = data.offer;
    const newOfferDetails = { 
        offer,
        offerer: connection,
        connections: [...roomRoster.get(roomName).connections, connection]
    };
    roomRoster.set(roomName, newOfferDetails);
} 

const handleAnswer = (connection, data) => {
    const roomName = data.roomName;
    const answer = data.answer;
    const newOfferDetails = { 
        offer: false,
        offerer: null,
        connections: [...roomRoster.get(roomName).connections, connection]
    };
    roomRoster.set(roomName, newOfferDetails);

    // For more than two connections, change this
    const sendAnswerTo = roomRoster.get(roomName).connections.find(conn => conn !== connection);
    sendTo(sendAnswerTo, { 
        type: 'SERVER/GETANSWER', 
        payload: { 
            answer
        }
    });
    console.log('sending an answer back')
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