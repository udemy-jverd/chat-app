const users = [];

const addUser = ({ id, pseudo, room }) => {
    pseudo = pseudo.trim().toLowerCase();
    room = room.trim().toLowerCase();

    if (!pseudo || !room) {
        return { error: 'Pseudo and room are required fields!' }
    }

    const existingUser = users.find((user) => {
        return user.room === room && user.pseudo === pseudo
    });
    if (existingUser) {
        return { error: 'This pseudo is in use!' }
    }

    const user = { id, pseudo, room }
    users.push(user);
    return { user };
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
}

const getUser = (id) => {
    return users.find((user) => user.id === id);
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase();
    return users.filter((user) => user.room === room);
}

module.exports = { addUser, removeUser, getUser, getUsersInRoom }
