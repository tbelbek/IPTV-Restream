//Implement this interface for your specific session provider
interface SessionHandler {
    createSession(interval?: number): Promise<void>;
    destroySession(): boolean;
    //getSessionQuery(): string;
    type(): string;
}

export type { SessionHandler };