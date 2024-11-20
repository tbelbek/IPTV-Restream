const ChatService = require('../services/ChatService');
const ChatMessage = require('../models/ChatMessage');

module.exports = (io, socket) => {
    socket.on('send-message', ({ userId, message, timestamp }) => {

        const chatMessage = ChatService.addMessage(userId, message, timestamp);
        socket.broadcast.emit('chat-message', chatMessage) // Broadcast to all clients except sender
    });
};
