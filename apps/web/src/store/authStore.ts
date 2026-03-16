import { create } from 'zustand';
import { User, LoginRequest, LoginResponse } from '@react-flow/shared-types';
import { api } from '../services/apiClient';

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (credentials: LoginRequest) => {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    const { user, token, refreshToken } = response as unknown as LoginResponse;
    
    localStorage.setItem('token', token);
    localStorage.setItem('refreshToken', refreshToken);
    localStorage.setItem('user', JSON.stringify(user));
    
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    
    set({ user: null, token: null, isAuthenticated: false });
  },

  setUser: (user: User | null) => set({ user })
}));

const savedUser = localStorage.getItem('user');
if (savedUser && savedUser !== 'undefined' && savedUser !== 'null') {
  try {
    useAuthStore.getState().setUser(JSON.parse(savedUser));
  } catch (error) {
    console.error('Failed to parse user from localStorage:', error);
    localStorage.removeItem('user');
  }
}
