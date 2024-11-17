# Frontend
⚠️ The Application is currently under active development. A dockerized solution will be provided in the near future! ⚠️

## Run

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
