class Channel {
    static nextId = 0;
    constructor(name, url, avatar, restream, headers, group) {
        this.id = Channel.nextId++;
        this.name = name;
        this.url = url;
        this.avatar = avatar;
        this.restream = restream;
        this.headers = headers;
        this.group = group;
    }
}

module.exports = Channel;