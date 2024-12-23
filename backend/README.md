# Backend

A simple NodeJS web server that retrieves your IPTV stream, caches it, and converts it into an HLS stream, making it accessible via the web. Also supports multiple IPTV streams (channel selection).

## 🚀 Run

Setup a `.env` file or 
equivalent environment variables:
```env
DEFAULT_CHANNEL_URL=https://mcdn.daserste.de/daserste/de/master.m3u8
STORAGE_PATH=/mnt/streams/recordings
```

The storage directory has to exist. There will be alot of I/O, so it makes sense to mount the storage into ram memory.

Before running, make sure you have `ffmpeg` installed on your system.

```bash
node index.js
```
Be aware, that this application is designed for Linux systems!

To use together with the frontend, [run with docker](../README.md#run-with-docker-preferred).

## 🛠️ Architecture

### API

- Endpoints to add a channel, get all channels, get selected channel and set selected channel

### WebSockets

- `channel-added` and `channel-selected` events will be send to all connected clients
- chat messages: `send-chat-message` and `chat-message`
- users: `user-connected` and `user-disconnected`
