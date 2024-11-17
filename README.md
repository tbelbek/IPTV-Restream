# IPTV StreamHub

A simple IPTV restream and synchronization application with web frontend.

## Use Cases
- Connect with multiple Devices to 1 IPTV Stream, if your provider limits current devices.
- Proxy all Requests through one IP.
- Synchronize IPTV streaming with multiple devices: Synchronized playback and channel selection.

## Running
You can run this on your local linux pc/server to expose the stream to all devices in your home network. For test purposes you can also try it with WSL. You can also run this external server.

### Run with Docker

⚠️ A docker-compose deployment will be provided in the near future! ⚠️


### Run components seperately

If you only need the **restream** functionality and want to use a other iptv player (e.g. VLC), you may only run the [backend](/backend/README.md).
<br>
If you only need the **synchronization** functionality, you may only run the [frontend](/frontend/README.md).


Be aware, that this'll require additional configuration/adaption and won't be officially supported. It is recommended to [run the whole project as once](#run-with-docker).

## Preview
![Frontend Preview](/frontend/ressources/frontend-preview.png)

## Contribute & Contact
Feel free to open discussions and issues for any type of requests. Don't hesitate to contact me, if you have any problems with the setup.


If you like the project and want to support future development, please leave a ⭐.