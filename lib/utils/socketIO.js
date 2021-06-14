const server = require('http').createServer();
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    },
});

const PORT = 4001;


// const io = socketIO(app, {
//     cors: true,
//     origin: true,
//     credentials: true,
// });


io.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on('MESSAGE', (message) => {
        console.log(message, 'MESSAGE');
        io.emit('MESSAGE', message);
    });
});

server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});