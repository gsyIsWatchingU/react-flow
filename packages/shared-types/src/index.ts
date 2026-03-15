export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
}

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
  GUEST = 'GUEST'
}

export enum Permission {
  READ_USERS = 'READ_USERS',
  WRITE_USERS = 'WRITE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  READ_DASHBOARD = 'READ_DASHBOARD',
  ADMIN_ACCESS = 'ADMIN_ACCESS'
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface SearchRequest {
  query: string;
  page?: number;
  limit?: number;
}

export interface SearchResult {
  id: string;
  title: string;
  description: string;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
}

export interface Notification {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  message: string;
  timestamp: Date;
  read: boolean;
}

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}
