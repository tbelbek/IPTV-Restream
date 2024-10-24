const { spawn } = require('child_process');
require('dotenv').config();

let currentFFmpegProcess = null;
const BASE_URL = process.env.BASE_URL;

function startFFmpeg(channelId) {
    if (currentFFmpegProcess) {
        console.log('Terminate previous ffmpeg-Prozess...');
        currentFFmpegProcess.kill('SIGTERM');
    }

    const streamUrl = `${BASE_URL}${channelId}`;
    console.log(`Start ffmpeg with URL: ${streamUrl}`);

    currentFFmpegProcess = spawn('ffmpeg', [
        '-i', streamUrl,
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-preset', 'veryfast',
        '-f', 'hls',
        '-hls_time', '8',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments',
        '/mnt/streams/playlist.m3u8'
    ]);

    currentFFmpegProcess.stdout.on('data', (data) => {
        console.log(`stdout: ${data}`);
    });

    currentFFmpegProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
    });

    currentFFmpegProcess.on('close', (code) => {
        console.log(`ffmpeg-Process terminated with code: ${code}`);
    });
}

function stopFFmpeg() {
    if (currentFFmpegProcess) {
        console.log('Terminate ffmpeg-Process...');
        currentFFmpegProcess.kill('SIGTERM');
        currentFFmpegProcess = null;
    }
}

function isFFmpegRunning() {
    return currentFFmpegProcess !== null;
}

module.exports = {
    startFFmpeg,
    stopFFmpeg,
    isFFmpegRunning
};
