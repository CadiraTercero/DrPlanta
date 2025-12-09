import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import env from '../config/env';

/**
 * Axios instance configured for the DrPlantes API
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.apiUrl,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Add auth token to requests
    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error: AxiosError) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Handle common errors
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth data
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user_data');
          // Redirect to login page
          window.location.href = '/login';
        }

        // Format error message
        const errorMessage =
          (error.response?.data as { message?: string })?.message ||
          error.message ||
          'An unexpected error occurred';

        return Promise.reject({
          message: errorMessage,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    );
  }

  public getInstance(): AxiosInstance {
    return this.client;
  }
}

// Export singleton instance
const apiClient = new ApiClient();
export default apiClient.getInstance();
