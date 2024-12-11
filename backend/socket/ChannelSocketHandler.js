const ChannelService = require('../services/ChannelService');

module.exports = (io, socket) => {

    socket.on('add-channel', ({ name, url, avatar, restream, headersJson}) => {
        try {
            const newChannel = ChannelService.addChannel(name, url, avatar, restream, headersJson);
            io.emit('channel-added', newChannel); // Broadcast to all clients
        } catch (err) {
            socket.emit('app-error', { message: err.message });
        }
    });


    socket.on('set-current-channel', (id) => {
        try {
            const nextChannel = ChannelService.setCurrentChannel(id);
            io.emit('channel-selected', nextChannel); // Broadcast to all clients
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });

    socket.on('delete-channel', (id) => {
        try {
            const current = ChannelService.deleteChannel(id);
            io.emit('channel-deleted', id); // Broadcast to all clients
            io.emit('channel-selected', current); 
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });

    socket.on('update-channel', ({ id, updatedAttributes }) => {
        try {
            const updatedChannel = ChannelService.updateChannel(id, updatedAttributes);
            io.emit('channel-updated', updatedChannel); // Broadcast to all clients
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });
};
