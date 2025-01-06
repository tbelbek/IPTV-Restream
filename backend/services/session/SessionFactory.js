const StreamedSuSession = require('./StreamedSuSession');

class SessionFactory {
    static getSessionProvider(channelUrl) {
        switch (true) {
            case channelUrl.includes('vipstreams.in'): //StreamedSU
                return new StreamedSuSession(channelUrl, 'https://secure.embedme.top');
            default:
                return null;
        }
    }
}
  
module.exports = SessionFactory;