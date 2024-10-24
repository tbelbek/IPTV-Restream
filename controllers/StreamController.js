const ffmpegService = require('../services/FFmpegService');

let currentChannelId = process.env.DEFAULT_CHANNEL_ID;

function setChannel(req, res) {
    const { id: channelId } = req.params;
    if (channelId) {
        currentChannelId = channelId;
        ffmpegService.startFFmpeg(channelId);
        res.status(200).json({ status: 'success', channelId: currentChannelId });
    } else {
        res.status(400).json({ status: 'error', message: 'No channel set' });
    }
}

function getChannel(_, res) {
    if (currentChannelId) {
        res.status(200).json({ channelId: currentChannelId });
    } else {
        res.status(404).json({ status: 'error', message: 'No channel set' });
    }
}

function stop(req, res) {
    if (ffmpegService.isFFmpegRunning()) {
        ffmpegService.stopFFmpeg();
        res.status(200).json({ status: 'success', message: 'ffmpeg-Process terminated' });
    } else {
        res.status(400).json({ status: 'error', message: 'No ffmpeg-process running' });
    }
}

module.exports = {
    setChannel,
    getChannel,
    stop
};
