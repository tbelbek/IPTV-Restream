const fs = require('fs');
const path = require("path");

const STORAGE_PATH = process.env.STORAGE_PATH;

function clearStorage() {

    fs.readdir(STORAGE_PATH, (err, files) => {
        if (err) throw err;
        
        for (const file of files) {
            fs.unlink(path.join(STORAGE_PATH, file), (err) => {
            if (err) throw err;
            });
        }
    });
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