const cron = require('node-cron');
const PlaylistService = require('./PlaylistService');

class PlaylistUpdater {
  constructor() {
    this.playlists = new Set();
  }

  contains(playlist) {
    for (const existingPlaylist of this.playlists) {
        if (existingPlaylist.playlist === playlist) {
          return true;
        }
      }
      return false;
  }

  register(playlist) {
    console.log('Registering playlist:', playlist);
    this.playlists.add(playlist);
  }

  delete(playlist) {
    for (const existingPlaylist of this.playlists) {
      if (existingPlaylist.playlist === playlist) {
        this.playlists.delete(existingPlaylist);
        break;
      }
    }
  }



  startScheduler() {
    // Cron-Job: "0 3 * * *" -> Every day at 3 am
    cron.schedule('0 3 * * *', () => {
      this.updatePlaylists();
    });
  }


  updatePlaylists() {
    console.log('Updating playlists at:', new Date());
    this.playlists.forEach(async (playlist) => {
      try {
        //Fetch playlist again
        await PlaylistService.deletePlaylist(playlist.playlist);
        await PlaylistService.addPlaylist(playlist.playlist, playlist.playlistName, playlist.mode, playlist.playlistUpdate, playlist.headers);
      } catch (error) {
        console.error(`Error while updating playlist ${playlist.name}:`, error);
      }
    });
  }
}

module.exports = new PlaylistUpdater();