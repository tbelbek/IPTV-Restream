//Implement this interface for your specific session provider
interface SessionHandler {
    createSession(interval?: number): Promise<string>;
    destroySession(): boolean;
    getSessionQuery(): string;
}

export type { SessionHandler };