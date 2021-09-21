const socket = io();

socket.on('message', (message) => {
    console.log(message);
});

const chatForm = document.getElementById('chat');
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = e.target.elements.messageContent.value;
    socket.emit('newMessage', message, (callbackMessage) => {
        console.log(callbackMessage);
    });
});

document.getElementById('shareLocation').addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('shareLocation', { latitude, longitude }, (callbackMessage) => {
            console.log(callbackMessage);
        });
    });
});
