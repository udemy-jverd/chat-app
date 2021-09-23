const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { generateMessage } = require('./utils/messages');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectory = path.join(__dirname, '../public');

app.use(express.static(publicDirectory));

// socket.emit call the event only for the client who ask
// socket.broadcast.emit call the event for every connected client exept the current one
// io.emit call the event for every connected client
// io.to.emit call the event for every connected client in a specific room
// socket.broadcast.to.emit call the event for every connected client exept the current one in a specific room

io.on('connection', (socket) => {
    socket.on('join', (options, callback) => {
        const { user, error } = addUser({ id: socket.id, ...options });
        if (error) {
            return callback(error);
        }
        socket.join(user.room);
        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit(
            'message',
            generateMessage('Admin', `${user.pseudo} has joined the room!`)
        );
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        });
        callback();
    });

    socket.on('newMessage', (message, callback) => {
        const user = getUser(socket.id);
        io.to(user.room).emit('message', generateMessage(user.pseudo, message));
        callback();
    });

    socket.on('shareLocation', (coords, callback) => {
        const { latitude, longitude } = coords;
        const user = getUser(socket.id);
        io.to(user.room).emit(
            'message',
            generateMessage(
                user.pseudo,
                `https://google.com/maps?q=${latitude},${longitude}`,
                true
            ),
        );
        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.pseudo} has left the room!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            });
        }
    });
});

server.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
