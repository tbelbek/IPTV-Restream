const { spawn } = require('child_process');
require('dotenv').config();

let currentFFmpegProcess = null;
const STORAGE_PATH = process.env.STORAGE_PATH;

function startFFmpeg(channelUrl, startNumber) {
    if (currentFFmpegProcess) {
        console.log('Terminate previous ffmpeg-Prozess...');
        currentFFmpegProcess.kill('SIGTERM');
    }

    console.log(`Start ffmpeg with URL: ${channelUrl}`);

    currentFFmpegProcess = spawn('ffmpeg', [
        '-i', channelUrl,
        '-c', 'copy',
        '-f', 'hls',
        '-hls_time', '8',
        '-hls_list_size', '5',
        '-hls_flags', 'delete_segments+program_date_time',
        '-start_number', startNumber,
        `${STORAGE_PATH}/playlist.m3u8`
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
