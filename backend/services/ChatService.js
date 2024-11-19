const ChatMessage = require('../models/ChatMessage');


// At the moment, this service is not used! It is only a placeholder for future development for a persistent chat.
class ChatService {
    constructor() {
        this.messages = [];
    }

    addMessage(user, message) {
        const newMessage = new ChatMessage(user, message);
        this.messages.push(newMessage);
        return newMessage;
    }

    getMessages() {
        return this.messages;
    }
}

module.exports = new ChatService();