class SessionFactory {
    static getSessionProvider(channelDomain) {
        switch (true) {
            case channelDomain.includes('vipstreams.in'): //StreamedSU
                return new StreamedSuSession('https://secure.embedme.top');
            default:
                return null;
        }
    }
}
  
module.exports = new SessionFactory;