const ChannelService = require('../services/ChannelService');

module.exports = {
    getChannels(req, res) {
        res.json(ChannelService.getChannels());
    },

    getCurrentChannel(req, res) {
        res.json(ChannelService.getCurrentChannel());
    },

    deleteChannel(req, res) {
        try {
            const { channelId } = req.params;
            ChannelService.deleteChannel(channelId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    updateChannel(req, res) {
        try {
            const { channelId } = req.params;
            const updatedChannel = ChannelService.updateChannel(channelId, req.body);
            res.json(updatedChannel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },

    addChannel(req, res) {
        try {
            //const { name, url, avatar, restream, headersJson, group, playlist } = req.body;
            const newChannel = ChannelService.addChannel(req.body);
            res.status(201).json(newChannel);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    },
};