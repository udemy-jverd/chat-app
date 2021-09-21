const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

// socket.emit call the event only for the client who ask
// socket.broadcast.emit call the event for every connected client exect the current one
// io.emit call the event for every connected client

io.on('connection', (socket) => {

    socket.emit('message', 'Welcome!');
    socket.broadcast.emit('message', 'A new user has joined the chat room!');

    socket.on('newMessage', (message, callback) => {
        io.emit('message', message);
        callback('Message delivered!');
    });
    socket.on('shareLocation', (coords, callback) => {
        const { latitude, longitude } = coords;
        io.emit('message', `https://google.com/maps?q=${latitude},${longitude}`);
        callback('Location shared!');
    });

    socket.on('disconnect', () => {
        io.emit('message', 'A user has left the chat room!');
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
