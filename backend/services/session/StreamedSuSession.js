const SessionHandler = require('./SessionHandler');

class StreamedSuSession extends SessionHandler {
    constructor(channel) {
        super();
        this.channel = channel;
    }
    
    async createSession() {

        console.log('Creating session:', this.channel.url);

        try {
            const parts = this.channel.url.split("/");
            const bodyData = { source: parts[3], id: parts[5], streamNo: parts[6] };

            const headers = this.channel.headers.reduce((acc, header) => {
                acc[header.key] = header.value;
                return acc;
            }, {});

            const response = await fetch('https://embedme.top/fetch', {
                method: "POST",
                headers: headers,
                body: JSON.stringify(bodyData)
            });

            if (!response.ok) {
                console.log('Failed to initialize session: ', response);
                throw new Error('Failed to initialize session');
            }

            const encryptedData = await response.text();

            console.log('Session encrypted:', encryptedData);
            const decryptUrl = `https://streamed-decrypter.vercel.app/api/decrypt?data=${encodeURIComponent(encryptedData)}`;

            const decryptRes = await fetch(decryptUrl, { method: "GET" });
            if (!decryptRes.ok) {
                console.log('Failed to decrypt session: ', response);
                throw new Error('Failed to decrypt session');
            }

            const sessionDecrypted = await decryptRes.json();
            console.log('Session decrypted:', sessionDecrypted);
            this.channel.sessionUrl = sessionDecrypted.ok;
            return sessionDecrypted.ok;

        } catch (error) {
            console.error('Session initialization failed:', error);
            throw error;
        }
    }

}

module.exports = StreamedSuSession;