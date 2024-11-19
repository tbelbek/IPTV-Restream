let io;

function setSocketIO(socketIOInstance) {
    io = socketIOInstance;
}

function getSocketIO() {
    if (!io) {
        throw new Error('Socket.IO instance not initialized');
    }
    return io;
}

module.exports = { setSocketIO, getSocketIO };