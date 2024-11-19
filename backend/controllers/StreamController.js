const ffmpegService = require('../services/streaming/FFmpegService');
const storageService = require('../services/streaming/StorageService');

function start() {
    if (!ffmpegService.isFFmpegRunning()) {
        const segmentNumber = storageService.getNextSegmentNumber();
        storageService.clearStorage();
        ffmpegService.startFFmpeg(process.env.DEFAULT_CHANNEL_URL, segmentNumber);
    }
}


function stop() {
    if (ffmpegService.isFFmpegRunning()) {
        ffmpegService.stopFFmpeg();
    }
}

module.exports = {
    start,
    stop
};
