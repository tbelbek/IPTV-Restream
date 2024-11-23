const { ChatMessage, User } = require('../models/ChatMessage');

// At the moment, this service is not used! It is only a placeholder for future development for a persistent chat.
class ChatService {
    constructor() {
        this.messages = [];
    }

    addMessage(userName, userAvatar, message, timestamp) {
        const newChatMessage = new ChatMessage(new User(userName, userAvatar), message, timestamp);
        this.messages.push(newChatMessage);
        return newChatMessage;
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = new ChatService();