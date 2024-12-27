const SessionHandler = require('./SessionHandler');

class StreamedSuSession extends SessionHandler {
    constructor(baseUrl) {
        super();
        this.baseUrl = baseUrl;
        this.checkInterval = null;
        this.sessionData = null;
    }

    async #initSession(url) {

        console.log('Creating session:', url);
        try {
            const response = await fetch(`${this.baseUrl}/init-session`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    path: new URL(url).pathname,
                })
            });

            if (!response.ok) {
                throw new Error('Failed to initialize session');
            }

            this.sessionData = await response.json();
            return this.sessionData;
        } catch (error) {
            console.error('Session initialization failed:', error);
            throw error;
        }
    }

    async #checkSession() {
        if (!this.sessionData?.id) {
            return false;
        }

        console.log('Checking session:', this.sessionData.id);
        try {
            const response = await fetch(`${this.baseUrl}/check/${this.sessionData.id}`);
            return response.status === 200;
        } catch (error) {
            console.error('Session check failed:', error);
            return false;
        }
    }

    #startAutoCheck(interval = 15000) {
        if (this.checkInterval) {
            this.stopAutoCheck();
        }

        this.checkInterval = setInterval(async () => {
            const isValid = await this.#checkSession();
            if (!isValid) {
                console.log('Session aborted');
                this.destroySession();
            }
        }, interval);
    }

    #stopAutoCheck() {
        if (this.checkInterval) {
            clearInterval(this.checkInterval);
            this.checkInterval = null;
        }
    }



// Public Methods

    async createSession(url, interval = 15000) {
        if (!this.sessionData) {
            await this.#initSession(url);
        }
        this.#startAutoCheck(interval);
        return this.getSessionQuery();
    }

    destroySession() {
        this.#stopAutoCheck();
        this.sessionData = null;
        return true;
    }

    getSessionQuery() {
        if (!this.sessionData?.id) {
            throw new Error('No active session');
        }
        return `id=${this.sessionData.id}`;
    }
}

module.exports = StreamedSuSession;