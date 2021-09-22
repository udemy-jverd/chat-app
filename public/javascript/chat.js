const socket = io();

const chatForm = document.getElementById('chat');
const messageInput = document.getElementById('messageContent');
const sendButton = document.getElementById('sendMessage');
const shareLocationButton = document.getElementById('shareLocation');
const messages = document.getElementById('messages');

socket.on('message', (message) => {
    const { text, createdAt } = message
    const date = moment(createdAt).format('h:mm a');
    const html = `<p>${date} - ${text}</p>`;
    messages.insertAdjacentHTML('beforeend', html);
});

socket.on('location', (location) => {
    const { url, createdAt } = location;
    const date = moment(createdAt).format('h:mm a');
    const html = `<p>${date} - <a href='${url}' target='_blank'>My current location</p>`;
    messages.insertAdjacentHTML('beforeend', html);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    sendButton.setAttribute('disabled', 'disabled');
    const message = e.target.elements.messageContent.value;

    socket.emit('newMessage', message, (callbackMessage) => {
        sendButton.removeAttribute('disabled');
        messageInput.value = '';
        messageInput.focus();
        console.log(callbackMessage);
    });
});

shareLocationButton.addEventListener('click', (e) => {
    if (!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser!');
    }

    shareLocationButton.setAttribute('disabled', 'disabled');
    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit('shareLocation', { latitude, longitude }, (callbackMessage) => {
            shareLocationButton.removeAttribute('disabled');
            console.log(callbackMessage);
        });
    });
});
