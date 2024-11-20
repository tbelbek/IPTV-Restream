const ChatMessage = require('../models/ChatMessage');

// At the moment, this service is not used! It is only a placeholder for future development for a persistent chat.
class ChatService {
    constructor() {
        this.messages = [];
    }

    addMessage(userId, message, timestamp) {
        const newChatMessage = new ChatMessage(userId, message, timestamp);
        this.messages.push(newChatMessage);
        return newChatMessage;
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = new ChatService();