const m3uParser = require('iptv-playlist-parser');
const ChannelService = require('./ChannelService');

class PlaylistService {

    async addPlaylist(playlistUrl, mode, headersJson) {

        const response = await fetch(playlistUrl);
        const content = await response.text();

        const parsedPlaylist = m3uParser.parse(content);

        // list of added channels
        const channels = parsedPlaylist.items.map(channel => {
            //TODO: add channel.http if not '' to headers
            try {
                return ChannelService.addChannel({
                    name: channel.name,
                    url: channel.url,
                    avatar: channel.tvg.logo,
                    mode: mode,
                    headersJson: headersJson,
                    group: channel.group.title,
                    playlist: playlistUrl
                });
            } catch (error) {
                console.error(error);
                return null;
            }
        })
        .filter(result => result !== null);

        return channels;
    }


    async updatePlaylist(playlistUrl, updatedAttributes) {
        const channels = ChannelService
                            .getChannels()
                            .filter(channel => channel.playlist === playlistUrl);

        for(let channel of channels) {
            channel = await ChannelService.updateChannel(channel.id, updatedAttributes);
        }

        return channels;
    }

    async deletePlaylist(playlistUrl) {
        const channels = ChannelService
                            .getChannels()
                            .filter(channel => channel.playlist === playlistUrl);
                            
        for(const channel of channels) {
            await ChannelService.deleteChannel(channel.id);
        }

        return channels;
    }
}

module.exports = new PlaylistService();
