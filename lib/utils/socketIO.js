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

        // CREATE ROOM OBJECT IN ROOM DIRECTORY OBJECT, JOIN ROOM, AND EMIT ROOMINFO
        roomDirectory[roomName] = {
            hostId: socket.id,
            passcode: generatePasscode(),
            queueArray: [],
            guestArray: [{ stageName: stageName, socketId: socket.id }],
        };
        socket.join(roomName);
        io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: true, passcode: roomDirectory[roomName].passcode }));

        // WELCOME MESSAGE, SEND UPDATED ARRAY TO ROOM, AND CONSOLE LOG CREATE ROOM EVENT
        io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `Welcome to the party in room ${roomName}!` });
        console.log(roomDirectory[roomName], 'CREATE ROOM');
    });

    socket.on("JOIN_ROOM", ({ stageName, roomName, inputPasscode }) => {

        console.log(roomName, stageName, inputPasscode);
        // VERIFY ROOMNAME - PASSCODE COMBO
        if (inputPasscode !== roomDirectory[roomName].passcode) {

            // INVALID PASSCODE-ROOMNAME COMBO EVENT AND CONSOLE LOG
            io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: false, stageName, roomName, isHost: false, passcode: null }));
            console.log(inputPasscode, 'FAIL INPUT_PASSCODE');
        } else {
            // VALID PASSCODE-ROOMNAME COMBO EVENT, SOCKET DIRECTORY ADD, AND CONSOLE LOG
            socket.join(roomName);
          
            io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: false, passcode: roomDirectory[roomName].passcode }));
            roomDirectory[roomName].guestArray = [...roomDirectory[roomName].guestArray, { stageName, socketId: socket.id }];

            // WELCOME MESSAGE, SEND UPDATED ARRAY TO ROOM, AND CONSOLE LOG JOIN ROOM EVENT
            io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `Welcome to the party in room ${roomName}!` });
            console.log(roomDirectory[roomName], 'JOIN ROOM');
        };
    });

    socket.on("ADD_TO_QUEUE", ({ title, vidId, stageName, thumbnail, roomName }) => {
        console.log({ title, vidId, stageName, thumbnail, roomName });

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
