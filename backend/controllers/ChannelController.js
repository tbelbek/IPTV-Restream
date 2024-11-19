const ChannelService = require('../services/ChannelService');

module.exports = {
    getChannels(req, res) {
        res.json(ChannelService.getChannels());
    },

    getCurrentChannel(req, res) {
        res.json(ChannelService.getCurrentChannel());
    },
};