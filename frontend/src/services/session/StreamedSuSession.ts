import { SessionHandler } from "./SessionHandler";

class StreamedSuSession implements SessionHandler {
    private baseUrl: string;
    private channelUrl: string;
    private checkInterval: number | null;
    private sessionId: string | null;
    private setSessionQuery: React.Dispatch<React.SetStateAction<string | undefined>>;

    constructor(channelUrl: string, baseUrl: string, setSessionQuery: React.Dispatch<React.SetStateAction<string | undefined>>) {
        this.channelUrl = channelUrl;
        this.baseUrl = baseUrl;
        this.checkInterval = null;
        this.sessionId = null;
        this.setSessionQuery = setSessionQuery;
    }

    private async initSession(): Promise<any> {
        console.log('Creating session:', this.channelUrl);
        try {
            const response = await fetch(`${this.baseUrl}/init-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path: new URL(this.channelUrl).pathname,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to initialize session');
            }

            const sessionData = await response.json();
            this.sessionId = sessionData.id;
            this.setSessionQuery(`id=${this.sessionId}`);
            return sessionData.id;
        } catch (error) {
            console.error('Session initialization failed:', error);
            throw error;
        }
    }

    private async checkSession(): Promise<boolean> {
        if (!this.sessionId) {
            return false;
        }

        console.log('Checking session:', this.sessionId);
        try {
            const response = await fetch(`${this.baseUrl}/check/${this.sessionId}`);
            return response.status === 200;
        } catch (error) {
            console.error('Session check failed:', error);
            return false;
        }
    }

    private startAutoCheck(interval: number = 15000): void {
        if (this.checkInterval) {
            this.stopAutoCheck();
        }

        this.checkInterval = window.setInterval(async () => {
            const isValid = await this.checkSession();
            if (!isValid) {
                console.log('Session aborted');
                this.initSession();
            }
        }, interval);
    }

    private stopAutoCheck(): void {
        if (this.checkInterval) {
            window.clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }

    // Public Methods
    async createSession(interval: number = 15000): Promise<void> {
        if (!this.sessionId) {
            await this.initSession();
            this.startAutoCheck(interval);
        }
    }

    destroySession(): boolean {
        console.log('Destroying session:', this.sessionId);
        this.stopAutoCheck();
        this.sessionId = null;
        this.setSessionQuery(undefined);
        return true;
    }

    // getSessionQuery(): string {
    //     console.log('Session ID:', this.sessionId);
    //     if (!this.sessionId) {
    //         return '';
    //     }
    //     return `id=${this.sessionId}`;
    // }

    type(): string {
        return 'streamed-su';
    }
}

export { StreamedSuSession };