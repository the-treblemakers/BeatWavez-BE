const { ADJECTIVES, NOUNS } = require("./roomNamesArrays");
const app = require("../app");
const { use } = require("../app");
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

const userDirectory = {}

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
            guestArray: [socket.id],
        };
        socket.join(roomName);
        io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: true, passcode: roomDirectory[roomName].passcode }));

        // CREATE USER OBJECT IN USER DIRECTORY OBJECT
        userDirectory[socket.id] = {
            stageName: stageName,
            roomName: roomName,
        };

        // JOIN ROOM, AND EMIT ROOMINFO
        socket.join(roomName);
        io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: true, passcode: roomDirectory[roomName].passcode }));

        // WELCOME MESSAGE, SEND UPDATED ARRAY TO ROOM, AND CONSOLE LOG CREATE ROOM/USER EVENT
        io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `Welcome to the party in room ${roomName}, ${stageName}!` });
        console.log(roomDirectory[roomName], 'CREATE ROOM');
        console.log(userDirectory[socket.id], 'CREATE USER');
    });

    socket.on("JOIN_ROOM", ({ stageName, roomName, inputPasscode }) => {

        console.log(roomName, stageName, inputPasscode);
        // VERIFY ROOMNAME - PASSCODE COMBO
        if (inputPasscode !== roomDirectory[roomName].passcode) {

            // INVALID PASSCODE-ROOMNAME COMBO EVENT AND CONSOLE LOG
            io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: false, stageName, roomName, isHost: false, passcode: null }));
            console.log(inputPasscode, 'FAIL INPUT_PASSCODE');

        } else {

            //  IF USER STILL IN PREVIOUS ROOM, REMOVE USER BEFORE ADD TO NEW ROOM
            // if (userDirectory[socket.id].roomName) {
            //     const prevRoomName = userDirectory[socket.id].roomName;
            //     const index = roomDirectory[prevRoomName].guestArray.indexOf(socket.id);
            //     roomDirectory[prevRoomName].guestArray.splice(index, 1);
            //     socket.leave(prevRoomName);
            //     io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `${userDirectory[socket.id].stageName} has left the party.` });
            // }

            // VALID PASSCODE-ROOMNAME COMBO EVENT, ADD TO SOCKET ROOM & USER/ROOM DIRECTORIES, AND CONSOLE LOG
            socket.join(roomName);
            io.to(socket.id).emit('ROOM_JOIN_RESULT', ({ roomJoined: true, stageName, roomName, isHost: false, passcode: roomDirectory[roomName].passcode }));
            roomDirectory[roomName].guestArray = [...roomDirectory[roomName].guestArray, socket.id];
            userDirectory[socket.id] = {
                stageName: stageName,
                roomName: roomName,
            };

            // WELCOME MESSAGE, SEND UPDATED ARRAY TO ROOM, AND CONSOLE LOG JOIN ROOM EVENT
            io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `Welcome to the party in room ${roomName}, ${stageName}!` });
            console.log(roomDirectory[roomName], 'JOIN ROOM');
            console.log(userDirectory[socket.id], 'CREATE USER');
        };
    });

    socket.on("ADD_TO_QUEUE", ({ title, vidId, stageName, thumbnail, roomName }) => {
        console.log({ title, vidId, stageName, thumbnail, roomName }, 'ADD_TO_QUEUE');
        roomDirectory[roomName].queueArray = [...roomDirectory[roomName].queueArray, { title, vidId, stageName, thumbnail }];
        io.in(roomName).emit('UPDATE_QUEUE_ARRAY', ({ queueArray: roomDirectory[roomName].queueArray }));
    });

    socket.on("MESSAGE", ({ message, roomName, stageName }) => {
        console.log({ message, roomName, stageName }, "MESSAGE");
        io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { message, stageName });
    });

    socket.on('UPDATE_ROOMS_ARRAY', () => {
        console.log(Object.keys(roomDirectory), 'UPDATE_ROOMS_ARRAY');
        io.to(socket.id).emit('UPDATE_ROOMS_ARRAY', { roomsResults: Object.keys(roomDirectory) });
    });

    socket.on('disconnect', (reason) => {
        console.log(`DISCONNECT ${userDirectory[socket.id].stageName}(${socket.id}): ${reason}`);

        // SEND DEPARTURE MESSAGE TO ROOM
        const roomName = userDirectory[socket.id].roomName;
        io.in(roomName).emit('UPDATE_MESSAGE_ARRAY', { stageName: `room`, message: `${userDirectory[socket.id].stageName} has left the party.` });

        delete userDirectory[socket.id];

        index = roomDirectory[roomName].guestArray.indexOf(socket.id);
        roomDirectory[roomName].guestArray.splice(index, 1);

        if (roomDirectory[roomName].guestArray.length < 1) {
            delete roomDirectory[roomName];
        }
    });
});

module.exports = server;

// TO ROOM io.in(roomName).emit(MESSAGE STUFF)
// TO YOU  io.to(YOUR_SOCKET.ID).emit(MESSAGE STUFF)
// TO EVERYONE BUT YOU socket.broadcast.to(roomName).emit(MESSAGE STUFF)
// .emit('EVENT_STRING_NAME_TO_LISTEN_FOR)', (PAYLOAD TO SEND and/or FUNCTION TO RUN))
