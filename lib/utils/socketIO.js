const app = require('../app');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    },
});

// MESSAGE send format: message: '', timeStamp: new Date(), ...roomInfo/shape{stageName: '', roomName: ''}
// MESSAGE rendered format: stageName, message, timeStamp
io.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on('CREATE_ROOM', ({ stageName, roomName }) => {
        console.log(roomName, stageName, 'CREATE_ROOM');
        socket.join(roomName);
        io.to(socket.id).emit('MESSAGE', { stageName: 'ROOM', message: `Welcome to room ${roomName}, ${stageName}!`, timeStamp: new Date() });
    });

    socket.on('JOIN_ROOM', ({ stageName, roomName }) => {
        console.log(roomName, stageName, 'JOIN_ROOM');
        socket.join(roomName);
        io.to(socket.id).emit('MESSAGE', { stageName: 'ROOM', message: `Welcome to room ${roomName}, ${stageName}!`, timeStamp: new Date() });
        socket.broadcast.to(roomName).emit('MESSAGE', { stageName: 'JOINED', message: `Welcome ${stageName} to our room.`, timeStamp: new Date() });
    });

    socket.on('MESSAGE', (message) => {
        console.log(message, 'MESSAGE');
        io.in(message.roomName).emit('MESSAGE', message);
    });

});

module.exports = server;


// EMIT CHEATSHEET

// io.on("connection", (socket) => {

//     // basic emit
//     socket.emit(/* ... */);

//     // to all clients in the current namespace except the sender
//     socket.broadcast.emit(/* ... */);

//     // to all clients in room1 except the sender
//     socket.to("room1").emit(/* ... */);

//     // to all clients in room1 and/or room2 except the sender
//     socket.to(["room1", "room2"]).emit(/* ... */);

//     // to all clients in room1
//     io.in("room1").emit(/* ... */);

//     // to all clients in room1 and/or room2 except those in room3
//     io.to(["room1", "room2"]).except("room3").emit(/* ... */);

//     // to all clients in namespace "myNamespace"
//     io.of("myNamespace").emit(/* ... */);

//     // to all clients in room1 in namespace "myNamespace"
//     io.of("myNamespace").to("room1").emit(/* ... */);

//     // to individual socketid (private message)
//     io.to(socketId).emit(/* ... */);

//     // to all clients on this node (when using multiple nodes)
//     io.local.emit(/* ... */);

//     // to all connected clients
//     io.emit(/* ... */);



// STACK OVERFLOW CHEAT SHEET

// // sending to sender-client only
// socket.emit('message', "this is a test");

// // sending to all clients, include sender
// io.emit('message', "this is a test");

// // sending to all clients except sender
// socket.broadcast.emit('message', "this is a test");

// // sending to all clients in 'game' room(channel) except sender
// socket.broadcast.to('game').emit('message', 'nice game');

// // sending to all clients in 'game' room(channel), include sender
// io.in('game').emit('message', 'cool game');

// // sending to sender client, only if they are in 'game' room(channel)
// socket.to('game').emit('message', 'enjoy the game');

// // sending to all clients in namespace 'myNamespace', include sender
// io.of('myNamespace').emit('message', 'gg');

// // sending to individual socketid
// socket.broadcast.to(socketid).emit('message', 'for your eyes only');

// // list socketid
// for (var socketid in io.sockets.sockets) {}
//  OR
// Object.keys(io.sockets.sockets).forEach((socketid) => {});