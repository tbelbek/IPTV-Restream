class Channel {
    static nextId = 0;
    constructor(name, url, avatar, mode, headers = [], group = null, playlist = null, playlistName = null) {
        this.id = Channel.nextId++;
        this.name = name;
        this.url = url;
        this.sessionProvider = null;
        this.avatar = avatar;
        this.mode = mode;
        this.headers = headers;
        this.group = group;
        this.playlist = playlist;
        this.playlistName = playlistName;
    }

    restream() {
        return this.mode === 'restream';
    }

    toFrontendJson() {
        if(!this.sessionProvider) {
            return this;
        }
        //Remove sessionProvider
        const { sessionProvider, ...sanitizedObject } = this;
        return sanitizedObject;
    }
}

module.exports = Channel;