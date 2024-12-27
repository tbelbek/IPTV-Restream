const ffmpegService = require('./FFmpegService');
const storageService = require('./StorageService');
const SessionFactory = require('../session/SessionFactory');

async function start(nextChannel) {
    console.log('Starting channel', nextChannel.id);
    storageService.createChannelStorage(nextChannel.id);

    nextChannel.sessionProvider = SessionFactory.getSessionProvider(nextChannel.url);
    if(nextChannel.sessionProvider) {
        await nextChannel.sessionProvider.createSession(nextChannel.url);
    }

    ffmpegService.startFFmpeg(nextChannel);
}


async function stop(channel) {
    console.log('Stopping channel', channel.id);
    if (ffmpegService.isFFmpegRunning()) {
        await ffmpegService.stopFFmpeg();
    }

    if (channel.sessionProvider) {
        channel.sessionProvider.destroySession();
        channel.sessionProvider = null;
    }

    storageService.deleteChannelStorage(channel.id);
}

module.exports = {
    start,
    stop
};
