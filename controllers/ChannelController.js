const ffmpegService = require('../services/FFmpegService');
const storageService = require('../services/StorageService');
const Channel = require('../models/Channel'); 

let channels = [new Channel('DEFAULT_CHANNEL', process.env.DEFAULT_CHANNEL_URL)];
let currentChannel = channels[0];

function setCurrent(req, res) {
    const { channelName } = req.body || {};

    if (!channelName) {
        return res.status(400).json({ status: 'error', message: 'channelName is required' });
    }

    const nextChannel = channels.find(channel => channel.name === channelName);
    if (!nextChannel) {
        res.status(400).json({ status: 'error', message: 'Channel does not exist' });
    }

    if (currentChannel !== nextChannel) {
        const segmentNumber = storageService.getNextSegmentNumber();
        storageService.clearStorage();
        currentChannel = nextChannel;
        ffmpegService.startFFmpeg(nextChannel.url, segmentNumber);   
    } 
    res.status(200).json({ status: 'success', channelUrl: currentChannel.url });
}


function getCurrent(_, res) {
    if (currentChannel) {
        res.status(200).json({ channelName: currentChannel.name, channelUrl: currentChannel.url });
    } else {
        res.status(404).json({ status: 'error', message: 'No channel active' });
    }
}


function getChannels(_, res) {
    res.status(200).json({ channels });
}

function addChannel(req, res) {
    const { name, url } = req.body;

    if (!name || !url) {
        return res.status(400).json({ status: 'error', message: 'Channel name and URL are required' });
    }

    const channelExists = channels.some(channel => channel.url === url);
    if (channelExists) {
        return res.status(409).json({ status: 'error', message: 'Channel already exists' });
    }

    const newChannel = new Channel(name, url);
    channels.push(newChannel);
    res.status(201).json({ status: 'success', message: 'Channel added', channel: newChannel });
}


module.exports = {
    setCurrent,
    getCurrent,
    getChannels,
    addChannel
};
