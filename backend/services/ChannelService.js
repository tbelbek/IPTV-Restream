const streamController = require('./streaming/StreamController');
const Channel = require('../models/Channel');

class ChannelService {
    constructor() {
        this.channels = [new Channel('DEFAULT_CHANNEL', process.env.DEFAULT_CHANNEL_URL, "https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/Das_Erste-Logo_klein.svg/768px-Das_Erste-Logo_klein.svg.png", false)];
        this.currentChannel = this.channels[0];
    }

    getChannels() {
        return this.channels;
    }

    addChannel(name, url, avatar, restream) {
        const existing = this.channels.some(channel => channel.url === url);
        if (existing) {
            throw new Error('Channel already exists');
        }
        const newChannel = new Channel(name, url, avatar, restream);
        this.channels.push(newChannel);
        
        return newChannel;
    }

    setCurrentChannel(id) {
        const nextChannel = this.channels.find(channel => channel.id === id);
        if (!nextChannel) {
            throw new Error('Channel does not exist');
        }

        if (this.currentChannel !== nextChannel) {
            if(nextChannel.restream) {
                streamController.stop(this.currentChannel.id);
                streamController.stop(nextChannel.id);
                streamController.start(nextChannel.url, nextChannel.id);
            } else {
                streamController.stop(this.currentChannel.id);
            }
            this.currentChannel = nextChannel;
        }
        return nextChannel;
    }

    getCurrentChannel() {
        return this.currentChannel;
    }
}

module.exports = new ChannelService();
