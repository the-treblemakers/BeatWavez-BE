const { ADJECTIVES, NOUNS } = require("./roomNamesArrays");
const app = require("../app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});


// MESSAGE send format: {message: '', stageName: ''}
// MESSAGE rendered format: stageName, message, timeStamp(set FE to avoid server time inconsistency)

// only host(or singer if feature built) has access to party room
// host passes off to first person in array, on host leaving (host will be first in array)
// host could be handed off to singer
// room object deleted when no more users in room
// room setting where host is set to singer

// state[roomName] = {
//     hostId: socket.id,
//     passcode: passcode(),  // show on front end
//     queueArray: [],  // build controls for change orderv
//     guestArray: [], // host will always be first in array
//       ** SONG OBJECT { songInfo, orderInfo, guestObject }
//       ** GUEST OBJECT { stageName, socket.id }
// }

// Const state = { ‘Large Instigator’: { hostId: ‘some host id, queue: [{ song }, { song }], passcode: ‘hunter2’ } }

const generatePasscode = () => {
    let passcode = ''
    for (let i = 0; i < 5; i++) {
        passcode = `${passcode}${Math.ceil(Math.random() * 9)}`
    }
    return passcode;
}

function generateRoomNames() {
    const fullRoomName = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)] + " " + NOUNS[Math.floor(Math.random() * NOUNS.length)];
    return fullRoomName;
}

const roomDirectory = {}

io.on("connection", (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on("CREATE_ROOM", ({ stageName }) => {

        // GENERATE AND VERIFY NEW ROOM NAME
        let roomName = generateRoomNames();
        while (roomDirectory.hasOwnProperty(roomName)) {
            roomName = generateRoomNames();
        }
        io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: true }));
        socket.join(roomName);

        // CREATE ROOM OBJECT IN ROOM DIRECTORY OBJECT
        roomDirectory[roomName] = {
            hostId: socket.id,
            passcode: generatePasscode(),
            queueArray: [],
            guestArray: [{ stageName: stageName, socketId: socket.id }],
        };

        // WELCOME MESSAGE, SEND UPDATED ARRAY TO ROOM, AND CONSOLE LOG CREATE ROOM EVENT
        io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `Welcome to the party in room ${roomName}!` });
        console.log(roomDirectory[roomName], 'CREATE ROOM');
    });

    socket.on("JOIN_ROOM", ({ stageName, roomName, inputPasscode }) => {

        console.log(roomName, stageName, inputPasscode);
        // VERIFY ROOMNAME - PASSCODE COMBO
        if (inputPasscode !== roomDirectory[roomName].passcode) {

            // INVALID PASSCODE-ROOMNAME COMBO EVENT AND CONSOLE LOG
            io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: false, stageName, roomName, isHost: false }));
            console.log(roomDirectory[roomName].passcode, inputPasscode, 'FAIL CODE');

        } else {

            // VALID PASSCODE-ROOMNAME COMBO EVENT, SOCKET DIRECTORY ADD, AND CONSOLE LOG
            socket.join(roomName);
            io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: false }));
            roomDirectory[roomName].guestArray = [...roomDirectory[roomName].guestArray, { stageName, socketId: socket.id }];

            // WELCOME MESSAGE, SEND UPDATED ARRAY TO ROOM, AND CONSOLE LOG JOIN ROOM EVENT
            io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `Welcome to the party in room ${roomName}!` });
            console.log(roomDirectory[roomName], 'JOIN ROOM');
        };
    });

    socket.on("ADD_TO_QUEUE", ({ title, vidId, stageName, thumbnail, roomName }) => {
        roomDirectory[roomName].queueArray = [...roomDirectory[roomName].queueArray, { title, vidId, stageName, thumbnail }];
        io.in(roomName).emit('UPDATE_QUEUE_ARRAY', ({ queueArray: roomDirectory[roomName].queueArray }));
    });

    socket.on("MESSAGE", ({ message, roomName, stageName }) => {
        io.in(roomName).emit("UPDATE_MESSAGE_ARRAY", { message, stageName });
        console.log({ message, roomName, stageName }, "MESSAGE");
    });

    socket.on('UPDATE_ROOMS_ARRAY', () => {
        console.log(Object.keys(roomDirectory));
        io.to(socket.id).emit('UPDATE_ROOMS_ARRAY', { roomsResults: Object.keys(roomDirectory) });
    })
});

module.exports = server;


// TO ROOM io.in(roomName).emit(MESSAGE STUFF)
// TO YOU  io.to(YOUR_SOCKET.ID).emit(MESSAGE STUFF)
// TO EVERYONE BUT YOU socket.broadcast.to(roomName).emit(MESSAGE STUFF)
// .emit('EVENT_STRING_NAME_TO_LISTEN_FOR)', (PAYLOAD TO SEND and/or FUNCTION TO RUN))


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
