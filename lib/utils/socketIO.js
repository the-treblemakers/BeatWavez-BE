const { ADJECTIVES, NOUNS } = require("./roomNamesArrays");
const app = require("../app");
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
    },
});

// MESSAGE send format: message: '', timeStamp: new Date(), ...roomInfo/shape{stageName: '', roomName: ''}
// MESSAGE rendered format: stageName, message, timeStamp

// only host(or singer if feature built) has access to party room
// host passes off to first person in array, on host leaving (host will be first in array)
// host could be handed off to singer
// room object deleted when no more users in room
// room setting where host is set to singer

// state[roomName] = {
//     hostId: socket.id,
//     passcode: passcode(),  // show on front end
//     queueArray: [],  // build controls for change order
//     messageArray: [],  // retrieve messages
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
        socket.join(roomName);

        // CREATE ROOM OBJECT
        roomDirectory[roomName] = {
            hostId: socket.id,
            passcode: 'yolo', // generatePasscode(),
            queueArray: [],
            messageArray: [],
            guestArray: [{ stageName, socketId: socket.id }]
        };

        // WELCOME MESSAGE, SEND TO ROOM, AND CONSOLE LOG
        roomDirectory[roomName].messageArray = [...roomDirectory[roomName].messageArray, { sender: `room`, message: `Welcome to the ${roomName} room, ${stageName}!` }];
        io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { messageArray: roomDirectory[roomName].messageArray });
        console.log(roomDirectory[roomName], 'CREATE ROOM');
    });

    socket.on("JOIN_ROOM", ({ stageName, roomName, inputPasscode }) => {

        // VERIFY NEW ROOM NAME WITH PASSCODE
        console.log(roomDirectory[roomName], roomName, stageName, inputPasscode, 'ROOM');
        if (inputPasscode !== roomDirectory[roomName].passcode) {
            console.log(roomDirectory[roomName].passcode, inputPasscode, 'FAIL CODE');
            // IF PASSCODE DOESN'T MATCH
            io.to(socket.id).emit('WRONG_ROOM_PASSCODE', { message: `Provided passcode is incorrect for room ${roomName}.` });  // ADD LISTENER FE
        } else {
            console.log(inputPasscode, 'SUCCESS_CODE');
            // IF PASSCODE MATCHES
            socket.join(roomName);

            roomDirectory[roomName].guestArray = [...roomDirectory[roomName].guestArray, { stageName, socketId: socket.id }];

            console.log(roomDirectory[roomName].messageArray, 'MESSAGE_ARRAY');
            // WELCOME MESSAGE, SEND TO ROOM, AND CONSOLE LOG
            roomDirectory[roomName].messageArray = [...roomDirectory[roomName].messageArray, { sender: `room`, message: `Welcome to the ${roomName} room, ${stageName}!` }];
            io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { messageArray: roomDirectory[roomName].messageArray });
            console.log(roomDirectory[roomName], 'JOIN ROOM');
        };
    });

    // socket.on("MESSAGE", (message) => {
    //     console.log(message, "MESSAGE");
    //     roomDirectory[roomName].messageArray = [...messageArray, message];
    //     te
    //     io.in(roomName).emit("MESSAGE", message);
    // });

    // socket.on("SEND_HOST", ({ hostId, queue, sender }) => {
    //     io.to(sender).emit("RECEIVE_HOST_QUEUE", { hostId, queue });
    //     console.log("send host", hostId);
    // });

    // socket.on(
    //     "ADD_TO_QUEUE",
    //     ({ title, vidId, stageName, thumbnail, hostId }) => {
    //         io.to(hostId).emit("ADD_TO_QUEUE", {
    //             title,
    //             vidId,
    //             stageName,
    //             thumbnail,
    //         });
    //         console.log(title, "back end - add to queue");
    //     }
    // );

    // socket.on("UPDATE_QUEUE", ({ queue, roomName }) => {
    //     socket.broadcast.to(roomName).emit("UPDATE_QUEUE", { queue });
    //     console.log("update queue", queue);
    // });
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
