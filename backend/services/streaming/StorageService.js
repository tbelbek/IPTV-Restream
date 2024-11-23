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

module.exports = {
    clearStorage
};