const ffmpegService = require('./FFmpegService');
const storageService = require('./StorageService');

function start(channelUrl, channelId) {
    storageService.createChannelStorage(channelId);
    if (!ffmpegService.isFFmpegRunning()) {
        ffmpegService.startFFmpeg(channelUrl, channelId);
    }
}


function stop(channelId) {
    if (ffmpegService.isFFmpegRunning()) {
        ffmpegService.stopFFmpeg();
    }
    storageService.deleteChannelStorage(channelId);
}

module.exports = {
    start,
    stop
};
