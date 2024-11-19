const ChatService = require('../services/ChatService');

module.exports = (io, socket) => {
    socket.on('send-message', ({ user, message }) => {
        ChatService.addMessage(user, message);
        socket.broadcast.emit('chat-message', { message: message, name: user }) // Broadcast to all clients except sender
    });
};
