class Channel {
    static nextId = 1;
    constructor(name, url, avatar) {
        this.id = Channel.nextId++;
        this.name = name;
        this.url = url;
        this.avatar = avatar;
    }
}

module.exports = Channel;