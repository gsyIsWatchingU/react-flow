import express from 'express';
import { Notification, ApiResponse } from '@react-flow/shared-types';

const router = express.Router();

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'INFO',
    message: 'Welcome to React Flow!',
    timestamp: new Date(),
    read: false
  },
  {
    id: '2',
    type: 'SUCCESS',
    message: 'Your profile has been updated',
    timestamp: new Date(Date.now() - 3600000),
    read: true
  }
];

router.get('/', (req, res) => {
  const response: ApiResponse<Notification[]> = {
    success: true,
    data: mockNotifications
  };
  
  res.json(response);
});

router.patch('/:id/read', (req, res) => {
  const notification = mockNotifications.find(n => n.id === req.params.id);
  
  if (!notification) {
    const response: ApiResponse = {
      success: false,
      message: 'Notification not found',
      data: null
    };
    return res.status(404).json(response);
  }
  
  notification.read = true;
  
  const response: ApiResponse<Notification> = {
    success: true,
    data: notification
  };
  
  res.json(response);
});

export default router;
