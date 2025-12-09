import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import env from '../config/env';
import { getAuthToken, clearAuthToken } from '../utils/storage';

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
      async (config: InternalAxiosRequestConfig) => {
        const token = await getAuthToken();
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
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Token expired or invalid - clear auth data
          await clearAuthToken();
          // You can add navigation to login screen here
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
