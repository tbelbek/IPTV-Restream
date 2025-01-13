const PlaylistService = require('../services/PlaylistService');
const ChannelService = require('../services/ChannelService');
const Channel = require('../models/Channel');

module.exports = (io, socket) => {

    socket.on('add-playlist', async ({ playlist, playlistName, mode, headersJson }) => {
        try {
            const channels = await PlaylistService.addPlaylist(playlist, playlistName, mode, headersJson);

            if (channels) {
                channels.forEach(channel => {
                    io.emit('channel-added', channel);
                });
            }
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });


    socket.on('update-playlist', async ({ playlist, updatedAttributes }) => {
        try {
            if(playlist !== updatedAttributes.playlist) {
                //call delete-playlist
            }

            const channels =  await PlaylistService.updatePlaylist(playlist, updatedAttributes);

            channels.forEach(channel => {
                io.emit('channel-updated', channel);
            });
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });


    socket.on('delete-playlist', async (playlist) => {
        try {
            const channels = await PlaylistService.deletePlaylist(playlist);
            channels.forEach(channel => {
                io.emit('channel-deleted', channel.id);
            });
            io.emit('channel-selected', ChannelService.getCurrentChannel());
        } catch (err) {
            console.error(err);
            socket.emit('app-error', { message: err.message });
        }
    });
};
