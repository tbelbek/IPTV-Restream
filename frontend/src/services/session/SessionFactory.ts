import { SessionHandler } from "./SessionHandler";
import { StreamedSuSession } from "./StreamedSuSession";

class SessionFactory {
    static getSessionProvider(channelUrl: string, setSessionQuery: React.Dispatch<React.SetStateAction<string | undefined>>): SessionHandler | null {
        switch (true) {
            case channelUrl.includes('vipstreams.in'): //StreamedSU
                return new StreamedSuSession(channelUrl, 'https://secure.embedme.top', setSessionQuery);
            default:
                return null;
        }
    }
}

export default SessionFactory;