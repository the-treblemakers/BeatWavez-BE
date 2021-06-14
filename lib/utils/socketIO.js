const app = require('../app');
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*'
    },
});

io.on('connection', (socket) => {
    console.log(`New client ${socket.id} connected`);

    socket.on('MESSAGE', (message) => {
        console.log(message, 'MESSAGE');
        io.emit('MESSAGE', message);
    });
});

module.exports = server;
