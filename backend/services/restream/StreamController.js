const ffmpegService = require('./FFmpegService');
const storageService = require('./StorageService');
const SessionFactory = require('../session/SessionFactory');

function start(nextChannel) {
    storageService.createChannelStorage(nextChannel.id);
    if (!ffmpegService.isFFmpegRunning()) {
        nextChannel.sessionProvider = SessionFactory.getSessionProvider(nextChannel.url);
        if(nextChannel.sessionProvider) {
            nextChannel.sessionProvider.createSession(nextChannel);
        }

        ffmpegService.startFFmpeg(nextChannel);
    }
}


function stop(channel) {
    if (ffmpegService.isFFmpegRunning()) {
        ffmpegService.stopFFmpeg();
    }

    if (channel.sessionProvider) {
        channel.sessionProvider.destroySession();
        nextChannel.sessionProvider = null;
    }

    storageService.deleteChannelStorage(channel.id);
}

module.exports = {
    start,
    stop
};
