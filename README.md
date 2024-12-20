# IPTV StreamHub

A simple IPTV `restream` and `synchronization` (watch2gether) application with web frontend. Share your iptv playlist and watch it together with your friends.

## ✨ Features 
**Restreaming** - Proxy your iptv streams through the backend.

**Synchronization** - The playback of the stream is perfectly synchronized for all viewers.

**Channels** - Add multiple iptv streams, you can switch between.

**Live chat** - chat with other viewers with randomized profile.


## 💡Use Cases
- Connect with multiple Devices to 1 IPTV Stream, if your provider limits current devices.
- Proxy all Requests through one IP.
  - Helps with CORS issues.
- Synchronize IPTV streaming with multiple devices: Synchronized playback and channel selection.
- Share your iptv and watch together with your friends.
  - The actual iptv stream-url is unvisible to them if you restream [upcomming feature]

## 🛠️ Architecture

### `Frontend`
A simple React webpage that can stream iptv streams in hls-format. Provides synchronized playback by using a constant delay. Also supports multiple IPTV streams (channel selection) and a chat if using together with the backend.

### `Backend`
A simple NodeJS web server that retrieves your IPTV stream, caches it, and converts it into an HLS stream, making it accessible via the web. Also supports multiple IPTV streams (channel selection).


## 🚀 Run

### Run with Docker (Preferred)

Clone the repo

```bash
git clone https://github.com/antebrl/IPTV-Restream.git
```

Make sure to have docker up & running. Start with docker compose
```bash
docker compose up -d
```
Open http://localhost

> [!IMPORTANT]  
> If a channel/playlist won't work, please try with `restream through backend` option enabled. This fixes most of the problems! It leads to longer initial loading times. If you don't need synchronization, turn it off in the ⚙️ or set the delay in the [config](docker-compose.yml).


### Run components seperately

If you only need the **restream** functionality and want to use another iptv player (e.g. VLC), you may only run the [backend](/backend/README.md).
<br>
If you only need the **synchronization** functionality, you may only run the [frontend](/frontend/README.md).


Be aware, that this'll require additional configuration/adaption and won't be officially supported. It is recommended to [run the whole project as once](#run-with-docker).

## Preview
![Frontend Preview](/frontend/ressources/frontend-preview.png)
![Add channel](/frontend/ressources/add-channel.png)

## FAQ & Common Mistakes

> Error: `Bind for 0.0.0.0:80 failed: port is already allocated`

To fix this, change the [port mapping in the docker-compose](docker-compose.yml#L40) to `X:80` e.g. `8080:80`. Make also sure that port X is open in the firewall configuration if you want to expose the application.

## Contribute & Contact
Feel free to open discussions and issues for any type of requests. Don't hesitate to contact me, if you have any problems with the setup.


If you like the project and want to support future development, please leave a ⭐.
[![Stargazers repo roster for @antebrl/IPTV-Restream](https://reporoster.com/stars/dark/antebrl/IPTV-Restream)](https://github.com/antebrl/IPTV-Restream/stargazers)
