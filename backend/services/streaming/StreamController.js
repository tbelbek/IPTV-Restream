const ffmpegService = require('./FFmpegService');
const storageService = require('./StorageService');

function start(channelUrl, channelId) {
    stop();
    if (!ffmpegService.isFFmpegRunning()) {
        ffmpegService.startFFmpeg(channelUrl, channelId);
    }
}


function stop() {
    if (ffmpegService.isFFmpegRunning()) {
        ffmpegService.stopFFmpeg();
    }
    storageService.clearStorage();
}

module.exports = {
    start,
    stop
};
