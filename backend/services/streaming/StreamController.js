const ffmpegService = require('./FFmpegService');
const storageService = require('./StorageService');

function start(channelUrl) {
    stop();
    if (!ffmpegService.isFFmpegRunning()) {
        ffmpegService.startFFmpeg(channelUrl);
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
