const ffmpegService = require('./FFmpegService');
const storageService = require('./StorageService');

function start(nextChannel) {
    storageService.createChannelStorage(nextChannel.id);
    if (!ffmpegService.isFFmpegRunning()) {
        ffmpegService.startFFmpeg(nextChannel);
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
