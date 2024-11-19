import { io, Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;

  // Initialize
  connect() {
    this.socket = io("http://34.159.173.219/");

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });
  }

  // Registriert Event-Listener
  subscribeToEvents(events) {
    if (!this.socket) throw new Error('Socket is not connected.');

    for (const [event, callback] of Object.entries(events)) {
      this.socket.on(event, callback);
    }
  }

  // Nachricht senden
  sendMessage(userId, message, timestamp) {
    if (!this.socket) throw new Error('Socket is not connected.');

    this.socket.emit('send-message', { userId, message, timestamp });
  }

  // Channel hinzufügen
  addChannel(name, url, avatar) {
    if (!this.socket) throw new Error('Socket is not connected.');

    this.socket.emit('add-channel', { name, url, avatar });
  }

  // Aktuellen Channel setzen
  setCurrentChannel(id) {
    if (!this.socket) throw new Error('Socket is not connected.');

    this.socket.emit('set-current-channel', id);
  }
}

const socketService = new SocketService();
export default socketService;