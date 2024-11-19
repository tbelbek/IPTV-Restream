const ChannelService = require('../services/ChannelService');

module.exports = (io, socket) => {

    socket.on('add-channel', ({ name, url }) => {
        try {
            const newChannel = ChannelService.addChannel(name, url);
            io.emit('channel-added', newChannel); // Broadcast to all clients
        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });


    socket.on('set-current-channel', (name) => {
        try {
            const currentChannel = ChannelService.setCurrentChannel(name);
            io.emit('channel-selected', currentChannel); // Broadcast to all clients
        } catch (err) {
            socket.emit('error', { message: err.message });
        }
    });
};
