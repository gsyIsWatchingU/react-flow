import { Server, Socket } from 'socket.io';
import { Notification } from '@react-flow/shared-types';

export const setupNotifyGateway = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    console.log('Client connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
    
    socket.on('join', (userId: string) => {
      socket.join(`user:${userId}`);
      console.log(`User ${userId} joined their room`);
    });
    
    socket.on('leave', (userId: string) => {
      socket.leave(`user:${userId}`);
      console.log(`User ${userId} left their room`);
    });
  });
  
  setInterval(() => {
    const notification: Notification = {
      id: Date.now().toString(),
      type: 'INFO',
      message: `Auto notification at ${new Date().toLocaleTimeString()}`,
      timestamp: new Date(),
      read: false
    };
    
    io.emit('notification', notification);
  }, 30000);
};

export const sendNotificationToUser = (io: Server, userId: string, notification: Notification) => {
  io.to(`user:${userId}`).emit('notification', notification);
};

export const broadcastNotification = (io: Server, notification: Notification) => {
  io.emit('notification', notification);
};
