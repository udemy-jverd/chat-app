const socket = io();

const chatForm = document.getElementById('chat');
const messageInput = document.getElementById('messageContent');
const sendButton = document.getElementById('sendMessage');
const shareLocationButton = document.getElementById('shareLocation');
const messages = document.getElementById('messages');

const getHTMLMessage = (message) => {
    const { text, createdAt, isURL } = message
    let formattedText = text;
    if (isURL) {
        formattedText = `<a href='${text}' target='_blank'>My current location`;
    }
    const date = moment(createdAt).format('h:mm a');
    return `<div class='message'>
        <p>
            <span class='message__name'>Bobby</span>
            <span class='message__meta'>${date}</span>
        </p>
        <p>${formattedText}</p>
    </div>`;
}

socket.on('message', (message) => {
    messages.insertAdjacentHTML('beforeend', getHTMLMessage);
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
