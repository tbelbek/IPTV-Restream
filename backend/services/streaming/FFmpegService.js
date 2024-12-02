const { spawn } = require('child_process');
require('dotenv').config();

let currentFFmpegProcess = null;
const STORAGE_PATH = process.env.STORAGE_PATH;

function startFFmpeg(channelUrl, channelId) {
    if (currentFFmpegProcess) {
        console.log('Terminate previous ffmpeg-Prozess...');
        currentFFmpegProcess.kill('SIGTERM');
    }


    currentFFmpegProcess = spawn('ffmpeg', [
        '-headers', 'Origin: https://cookiewebplay.xyz',
        '-user_agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
        '-referer', 'https://cookiewebplay.xyz/',
        '-i', channelUrl,
        '-c', 'copy',
        '-f', 'hls',
        '-hls_time', '6',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments+program_date_time',
        '-start_number', Math.floor(Date.now() / 1000),
        `${STORAGE_PATH}${channelId}/${channelId}.m3u8`
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
