# IPTV StreamHub

> [!INFO]  
>A simple IPTV `restream` and `synchronization` (watch2gether) application with `web` frontend. Share your iptv playlist and watch it together with your friends.
> Actively in devlopment and open your ideas! [Test it out](ante.is-a.dev) (Free channels for testing, use your own channels for production)

## 💡Use Cases
- [x] Connect with **multiple Devices** to 1 IPTV Stream, if your provider limits current streaming devices.
- [x] Proxy all Requests through **one IP**.
  - [x] Helps with CORS issues.
- [x] **Synchronize** IPTV streaming with multiple devices: Synchronized playback and channel selection for perfect Watch2Gether.
- [x] **Share your iptv access** without revealing your actual stream-url (privacy-mode) and watch together with your friends.

## ✨ Features 
**Restream / Proxy** - Proxy your iptv streams through the backend. <br>
**Synchronization** - The selection and playback of the stream is perfectly synchronized for all viewers. <br>
**Channels** - Add multiple iptv streams and playlists, you can switch between. <br>
**Live chat** - chat with other viewers with a randomized profile.

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

## 🖼️ Preview
![Frontend Preview](/frontend/ressources/frontend-preview.png)
![Add channel](/frontend/ressources/add-channel.png)

## ⚙️ Settings

### Channel Mode
#### `Direct`
Directly uses the source stream. Won't work with most of the streams, because of CORS, IP/Device restrictions. Is also incompatible with custom headers and privacy mode.

#### `Proxy` (Preffered)
The stream requests are proxied through the backend. Allows to set custom headers and bypass CORS. This mode is preffered. Only switch to restream mode, if proxy mode won't work for your stream or if you have synchronization issues.

#### `Restream`
The backend service caches the source stream (with ffmpeg) and restreams it. Can help with hard device restrictions of your provider. But it can lead to long initial loading times and performance issues after time.

## FAQ & Common Mistakes

> Which streaming mode should I choose for the channel?

You should try with direct mode first, switch to proxy mode if it doesn't work and switch to restream mode if this also doesn't work.

> Error: `Bind for 0.0.0.0:80 failed: port is already allocated`

To fix this, change the [port mapping in the docker-compose](docker-compose.yml#L40) to `X:80` e.g. `8080:80`. Make also sure that port X is open in the firewall configuration if you want to expose the application.

## Contribute & Contact
Feel free to open discussions and issues for any type of requests. Don't hesitate to contact me, if you have any problems with the setup.


If you like the project and want to support future development, please leave a ⭐.
[![Stargazers repo roster for @antebrl/IPTV-Restream](https://reporoster.com/stars/dark/antebrl/IPTV-Restream)](https://github.com/antebrl/IPTV-Restream/stargazers)
