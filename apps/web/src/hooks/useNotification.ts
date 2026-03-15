import { useEffect } from 'react';
import { useEvent } from 'react-use';
import { Notification } from '@react-flow/shared-types';
import { wsClient } from '../services/wsClient';
import { useUiStore } from '../store/uiStore';
import { useAuthStore } from '../store/authStore';

export const useNotification = () => {
  const { notifications, addNotification, markNotificationAsRead, clearNotifications } = useUiStore();
  const { user } = useAuthStore();

  useEffect(() => {
    wsClient.connect();

    if (user?.id) {
      wsClient.join(user.id);
    }

    return () => {
      if (user?.id) {
        wsClient.leave(user.id);
      }
    };
  }, [user?.id]);

  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<Notification>;
    if (customEvent.detail) {
      addNotification(customEvent.detail);
    }
  };

  const handleWebSocketNotification = (notification: Notification) => {
    addNotification(notification);
  };

  useEvent('notification', handleCustomEvent, window);

  useEffect(() => {
    wsClient.onNotification(handleWebSocketNotification);
    return () => {
      wsClient.offNotification(handleWebSocketNotification);
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return {
    notifications,
    unreadCount,
    addNotification,
    markNotificationAsRead,
    clearNotifications
  };
};
