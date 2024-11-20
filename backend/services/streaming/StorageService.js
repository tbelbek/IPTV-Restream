const fs = require('fs');

const STORAGE_PATH = process.env.STORAGE_PATH;

function clearStorage() {
    fs.rmSync(STORAGE_PATH, { recursive: true, force: true  });
    fs.mkdirSync(STORAGE_PATH);
}


function getNextSegmentNumber() {
    try {
        const data = fs.readFileSync(`${STORAGE_PATH}/playlist.m3u8`, 'utf8');

        const match = data.match(/#EXT-X-MEDIA-SEQUENCE:(\d+)/);

        const nextSequence = match ? parseInt(match[1]) + 20 : 0;

        return nextSequence;
    } catch (err) {
        console.error('Error reading playlist:', err);
        return 0; 
    }
}

module.exports = {
    clearStorage,
    getNextSegmentNumber
};