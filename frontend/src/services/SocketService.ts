import { io, Socket } from 'socket.io-client';
import { Channel, ChatMessage } from '../types';

class SocketService {
  private socket: Socket | null = null;

  private listeners: Map<string, ((data: any) => void)[]> = new Map();

  // Initialize
  connect() {
    if (this.socket?.connected) return;

    console.log('Connecting to WebSocket server');
    this.socket = io("http://34.159.173.219");

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    this.socket.on('app-error', (error) => {
      console.error('Failed:', error);
    });


    // Listen for incoming custom events
    this.socket.onAny((event: string, data: any) => {
      const eventListeners = this.listeners.get(event);
      if (eventListeners) {
        eventListeners.forEach((listener) => listener(data));
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  subscribeToEvent<T>(event: string, listener: (data: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(listener);
  }

  // Event abbestellen
  unsubscribeFromEvent<T>(event: string, listener: (data: T) => void) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      this.listeners.set(
        event,
        eventListeners.filter((existingListener) => existingListener !== listener)
      );
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