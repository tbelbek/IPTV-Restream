class Channel {
    static nextId = 0;
    constructor(name, url, avatar, restream, headers) {
        this.id = Channel.nextId++;
        this.name = name;
        this.url = url;
        this.avatar = avatar;
        this.restream = restream;
        this.headers = headers;
    }
}

module.exports = Channel;