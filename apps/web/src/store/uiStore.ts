import { create } from 'zustand';
import { Notification } from '@react-flow/shared-types';

interface UiStore {
  notifications: Notification[];
  sidebarOpen: boolean;
  darkMode: boolean;
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  toggleSidebar: () => void;
  toggleDarkMode: () => void;
}

export const useUiStore = create<UiStore>((set, get) => ({
  notifications: [],
  sidebarOpen: true,
  darkMode: false,

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications]
    }));
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      )
    }));
  },

  clearNotifications: () => {
    set({ notifications: [] });
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  toggleDarkMode: () => {
    set((state) => ({ darkMode: !state.darkMode }));
  }
}));
