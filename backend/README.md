# Backend

A simple NodeJS web server that is able to proxy and restream your any iptv stream/playlist and manage multiple playlists.

## 🚀 Run

### With Docker (Preferred)

In this directory:
```bash
docker build -t iptv_restream_backend
```

```bash
docker run -d \
  -v {streams_directory}:/streams \
  -e STORAGE_PATH=/streams \
  iptv_restream_backend
```
make sure that you have created a directory for the streams storage:
e.g. create `/streams` and replace `{streams_directory}` with it.

### Bare metal

Setup a `.env` file or 
equivalent environment variables:
```env
STORAGE_PATH=/mnt/streams/recordings
```

The storage directory has to exist. There will be alot of I/O, so it makes sense to mount the storage into ram memory.

Before running, make sure you have `ffmpeg` installed on your system.

```bash
node index.js
```
Be aware, that this application is designed for Linux systems!

To use together with the frontend, [run with docker](../README.md#run-with-docker-preferred).

## 🛠️ Endpoints

### API

#### [ChannelController](./controllers/ChannelController.js)

- GET: `/api/channels/:channelId` and `/api/channels` to get information about the registered channels.
- GET: `/api/channels/current` to get the currently playing channel.
- PUT: `api/channels/:channelId` to update a channel.
- DELETE: `api/channels/:channelId` to delete a channel.
- POST: `api/channels` to create a new channel.

#### [ProxyController](./controllers/ProxyController.js)

- `/proxy/channel` to get the M3U File of the current channel
- `/proxy/segment` and `/proxy/key` will be used by the iptv player directly

#### Restream

- `/streams/{currentChannelId}/{currentChannelId}.m3u` to access the current restream.

### WebSocket

- `channel-added` and `channel-selected` events will be send to all connected clients
- chat messages: `send-chat-message` and `chat-message`
- users: `user-connected` and `user-disconnected`

## ℹ️ Usage without the frontend (with other iptv player)
If you want to watch the current stream in any other IPTV player e.g. on tv, there will be a central m3u link provided in the near future. Watch the [progress of this feature](https://github.com/antebrl/IPTV-Restream/issues/24).


If you can't wait, these are your options to watch from other IPTV players right now:
- You can use the [ProxyController](#ProxyController) standalone. Just use `{baseUrl}/proxy/channel` in your iptv player. It is also possible to watch different channels simultaneously by setting the expected query parameters: `url` (and `headers` if needed).
- Use `/streams/{currentChannelId}/{currentChannelId}.m3u` to watch the current playing restream!
- [ChannelController](#ChannelController) endpoints should be used to manage the channels. If you just want to have static channels, you can also set them directly in the [ChannelService.js](./services/ChannelService.js).
- [WebSocket](#WebSocket) is only used by the frontend for chat and channel updates. You likely won't need it!

> [!NOTE]
> These options are only tested with VLC media player as other iptv player. Use them at your own risk. Only for the usage together with the frontend will be support provided. <br>
> Support for a central m3u link for other players will be provided soon!
