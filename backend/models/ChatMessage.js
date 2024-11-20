class ChatMessage {
    constructor(userId, message, timestamp) {
        this.userId = userId;
        this.message = message;
        this.timestamp = timestamp;
    }
}

module.exports = ChatMessage;