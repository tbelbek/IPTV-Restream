# Frontend

A simple React webpage that can stream iptv streams in hls-format. Provides synchronized playback by using a constant delay. Also supports multiple IPTV streams (channel selection) and a chat if using together with the backend.

## 🚀 Run
Setup a `.env` file or 
equivalent environment variables:
```env
#VITE_BACKEND_URL: http://123.123.123.123:5000
VITE_STREAM_DELAY: 18
```

Run with npm:
```bash
npm install
npm run dev
```

To use together with the backend, [run with docker](../README.md#run-with-docker-preferred).
