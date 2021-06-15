const app = require('../app');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    },
});

io.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    console.log('CREATE_ROOM', (roomInfo) => {
        socket.join(roomInfo.roomName);
        socket.to(roomInfo.roomName).emit('MESSAGE', `Welcome to room ${roomInfo.roomName} ${roomInfo.stageName}`);
    });

    console.log('JOIN_ROOM', (roomInfo) => {
        socket.join(roomInfo.roomName);
        socket.to(roomInfo.roomName).emit('MESSAGE', `Welcome to room ${roomInfo.roomName} ${roomInfo.stageName}`);
        socket.broadcast.to(roomInfo.roomName).emit('MESSAGE', `Welcome ${roomInfo.stageName} to our room.`);
    });

    socket.on('MESSAGE', (message) => {
        console.log(message, 'MESSAGE');
        io.in(message.roomInfo).emit('MESSAGE', message);
    });

    socket.on

});

module.exports = server;


// socket.emit('message', "this is a test"); //sending to sender-client only
// socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender
// socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender
// socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)
// socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid
// io.emit('message', "this is a test"); //sending to all clients, include sender
// io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender
// io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender
// socket.emit(); //send to all connected clients
// socket.broadcast.emit(); //send to all connected clients except the one that sent the message
// socket.on(); //event listener, can be called on client to execute on server
// io.sockets.socket(); //for emiting to specific clients
// io.sockets.emit(); //send to all connected clients (same as socket.emit)
// io.sockets.on() ; //initial connection from a client.