import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';
import { toast } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('🔧 API Configuration:', {
  baseURL: API_BASE_URL,
  environment: import.meta.env.MODE
});

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
  withCredentials: false, // Set to false to avoid CORS issues
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);

    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response: AxiosResponse) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  async (error: AxiosError) => {
    console.error('❌ API Response Error:', {
      message: error.message,
      status: error.response?.status,
      url: error.config?.url,
      code: error.code
    });

    // Handle CORS errors
    if (error.message.includes('CORS') || error.response?.status === 0) {
      const corsMessage = 'Unable to connect to server. This might be a CORS or network issue.';
      toast.error(corsMessage);
      return Promise.reject({ ...error, message: corsMessage });
    }

    // Handle network errors
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your internet connection.');
      return Promise.reject({ ...error, message: 'Request timeout. Please try again.' });
    }

    // Handle network failures
    if (error.code === 'ERR_NETWORK' || error.code === 'ERR_FAILED') {
      const networkMessage = 'Network error. Please check if the server is running.';
      toast.error(networkMessage);
      return Promise.reject({ ...error, message: networkMessage });
    }

    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // If it's a login page, don't redirect to login again
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }

    // Handle other error statuses
    if (error.response) {
      const responseData = error.response?.data as { message?: string } | undefined;
      const message = responseData?.message || 'An error occurred';

      // Don't show toasts for 404 errors or if the request was cancelled
      if (error.response.status !== 404 && error.code !== 'ERR_CANCELED') {
        toast.error(message);
      }

      return Promise.reject({ ...error, message });
    }

    // Handle network errors
    if (!window.navigator.onLine) {
      toast.error('No internet connection. Please check your network.');
      return Promise.reject({ ...error, message: 'No internet connection' });
    }

    // For any other errors
    toast.error('An unexpected error occurred. Please try again.');
    return Promise.reject(error);
  }
);

// Helper function for making API requests with better error handling
export const apiRequest = async <T>(
  config: Omit<AxiosRequestConfig, 'headers'> & { headers?: Record<string, string> }
): Promise<T> => {
  try {
    const response = await api({
      ...config,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
        ...config.headers,
      },
    });
    return response.data;
  } catch (error) {
    // Error is already handled by the interceptor
    throw error;
  }
};
