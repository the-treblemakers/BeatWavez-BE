const Room = require("../models/Room");
const app = require("../app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

// MESSAGE send format: message: '', timeStamp: new Date(), ...roomInfo/shape{stageName: '', roomName: ''}
// MESSAGE rendered format: stageName, message, timeStamp
io.on("connection", (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on("CREATE_ROOM", ({ stageName, roomName }) => {
        console.log(roomName, stageName, "CREATE_ROOM", `HOST - ${socket.id}`);
        socket.join(roomName);
        // Room.insert({ roomName, host: socket.id });
        io.to(socket.id).emit("SET_HOST", { hostId: socket.id }); // set hostId & isHost
        io.to(socket.id).emit("MESSAGE", {
            stageName: "room",
            message: `Welcome to the ${roomName} room, ${stageName}!`,
            timeStamp: "",
        });
    });

    socket.on("JOIN_ROOM", ({ stageName, roomName }) => {
        console.log(roomName, stageName, "JOIN_ROOM");
        socket.join(roomName);
        socket.broadcast
            .to(roomName)
            .emit("REQUEST_HOST", { sender: socket.id }); // requests hostId
        io.to(socket.id).emit("MESSAGE", {
            stageName: "room",
            message: `Welcome to the ${roomName} room, ${stageName}!`,
            timeStamp: "",
        });
        socket.broadcast
            .to(roomName)
            .emit("MESSAGE", {
                stageName: "room",
                message: `Welcome ${stageName} to the party!`,
                timeStamp: "",
            });
    });

    socket.on("MESSAGE", (message) => {
        console.log(message, "MESSAGE");
        io.in(message.roomName).emit("MESSAGE", message);
    });

    socket.on("SEND_HOST", ({ hostId, queue, sender }) => {
        io.to(sender).emit("RECEIVE_HOST_QUEUE", { hostId, queue });
    });

    socket.on(
        "ADD_TO_QUEUE",
        ({ title, vidId, stageName, thumbnail, hostId }) => {
            io.to(hostId).emit("ADD_TO_QUEUE", {
                title,
                vidId,
                stageName,
                thumbnail,
            });
            console.log(title, "back end - add to queue");
        }
    );

    socket.on("UPDATE_QUEUE", ({ queue, roomName }) => {
        socket.broadcast.to(roomName).emit("UPDATE_QUEUE", { queue });
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

// socket.on('SONG_QUEUE', ({ queue, hostId, roomName = 'abount' }) => {
//     if (queue.length === 0 && socket.id !== hostId) {  // new user, send queue
//         io.to(hostId).emit('SONG_QUEUE', { queueRequest: queue, sender: socket.id });
//         console.log(queue, hostId, roomName, 'New User');
//     } else if (queue.length !== 0 && hostId !== socket.id) {  // send new song to host
//         io.to(hostId).emit('SONG_QUEUE', { queueRequest: queue, sender: socket.id });
//         console.log(queue, hostId, roomName, 'New Song');
//     } else if (hostId === socket.id && queue.length !== 0) {  // send current queue to everyone in room
//         io.in(roomName).emit('SONG_QUEUE', { queueRequest: queue, sender: hostId });
//         console.log(queue, hostId, roomName, 'Update Room');
//     }

// });

// check room insert
// add room delete on host disconnect ('disconnect', host.id === socket.id)
// if users authenticated for create room, push queue to user sessions
// decide session shape (song(title & vidId for replay), singer, timestamp, order)?
