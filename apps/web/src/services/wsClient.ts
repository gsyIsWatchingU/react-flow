import { io, Socket } from 'socket.io-client';
import { Notification } from '@react-flow/shared-types';

const API_BASE_URL = (import.meta as any).env.VITE_API_URL || '/api';
const WS_BASE_URL = API_BASE_URL.replace('/api', '');

class WsClient {
  private socket: Socket | null = null;

  connect(url: string = WS_BASE_URL) {
    if (this.socket?.connected) {
      return;
    }

    this.socket = io(url, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  join(userId: string) {
    this.socket?.emit('join', userId);
  }

  leave(userId: string) {
    this.socket?.emit('leave', userId);
  }

  onNotification(callback: (notification: Notification) => void) {
    this.socket?.on('notification', callback);
  }

  offNotification(callback: (notification: Notification) => void) {
    this.socket?.off('notification', callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

export const wsClient = new WsClient();
