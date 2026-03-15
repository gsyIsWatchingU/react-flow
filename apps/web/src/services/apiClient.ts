import axios, { AxiosInstance } from 'axios';
import { ApiResponse } from '@react-flow/shared-types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T = any>(url: string, config?: any) => apiClient.get<ApiResponse<T>>(url, config),
  post: <T = any>(url: string, data?: any, config?: any) => apiClient.post<ApiResponse<T>>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => apiClient.put<ApiResponse<T>>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: any) => apiClient.patch<ApiResponse<T>>(url, data, config),
  delete: <T = any>(url: string, config?: any) => apiClient.delete<ApiResponse<T>>(url, config)
};

export default apiClient;
