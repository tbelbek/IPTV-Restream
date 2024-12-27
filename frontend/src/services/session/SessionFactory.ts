import { SessionHandler } from "./SessionHandler";
import { StreamedSuSession } from "./StreamedSuSession";

class SessionFactory {
    static getSessionProvider(channelUrl: string): SessionHandler | null {
        switch (true) {
            case channelUrl.includes('vipstreams.in'): //StreamedSU
                return new StreamedSuSession(channelUrl, 'https://secure.embedme.top');
            default:
                return null;
        }
    }

    static checkSessionProvider(channelUrl: string): boolean {
        return !!SessionFactory.getSessionProvider(channelUrl);
    }
}

export default SessionFactory;