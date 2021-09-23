const socket = io();

// Elements
const chatForm = document.getElementById('chat');
const messageInput = document.getElementById('messageContent');
const sendButton = document.getElementById('sendMessage');
const shareLocationButton = document.getElementById('shareLocation');
const messages = document.getElementById('messages');
const usersList = document.getElementById('usersList');

// Options
const { pseudo, room } = Qs.parse(location.search, { ignoreQueryPrefix: true });

const autoscroll = () => {
    const newMessage = messages.lastElementChild;
    const newMessageStyles = getComputedStyle(newMessage);
    const newMessageMargin = parseInt(newMessageStyles.marginBottom);
    const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
    const visibleHeight = messages.offsetHeight;
    const containerHeight = messages.scrollHeight;
    const scrollOffset = messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        messages.scrollTop = messages.scrollHeight;
    }
}

const generateHTMLMessage = (message) => {
    const { pseudo, text, createdAt, isURL } = message
    let formattedText = text;
    if (isURL) {
        formattedText = `<a href='${text}' target='_blank'>My current location`;
    }
    const date = moment(createdAt).format('h:mm a');
    return `<div class='message'>
        <p>
            <span class='message__name'>${pseudo}</span>
            <span class='message__meta'>${date}</span>
        </p>
        <p>${formattedText}</p>
    </div>`;
}

const generateHTMLUsersList = (users) => {
    let html = '';
    users.forEach((user) => {
        html += `<li>${user.pseudo}</li>`
    });
    return html;
}

socket.on('message', (message) => {
    messages.insertAdjacentHTML('beforeend', generateHTMLMessage(message));
    autoscroll();
});

socket.on('roomData', ({ room, users }) => {
    document.getElementById('roomTitle').innerHTML = room;
    usersList.innerHTML = '';
    usersList.insertAdjacentHTML('beforeend', generateHTMLUsersList(users));
})

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

socket.emit('join', { pseudo, room }, (error) => {
    if (error) {
        alert(error);
        location.href = '/';
    }
});
