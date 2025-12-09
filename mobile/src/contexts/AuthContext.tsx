import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getUserData,
  setUserData,
  clearUserData
} from '../utils/storage';

/**
 * User type definition
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Auth context value type
 */
interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

/**
 * Auth provider props
 */
interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth API response types
 */
interface AuthResponse {
  access_token: string;
  user: User;
}

// Create context with undefined default value
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthProvider component that manages authentication state
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Check authentication status on mount
   */
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * Check if user is authenticated by validating stored token
   */
  const checkAuth = async () => {
    try {
      setLoading(true);

      // Get stored token and user data
      const storedToken = await getAuthToken();
      const storedUser = await getUserData<User>();

      if (!storedToken) {
        setLoading(false);
        return;
      }

      // Set token state
      setToken(storedToken);

      // Validate token with API by fetching user profile
      try {
        const response = await api.get<User>('/users/profile');
        const userData = response.data;

        setUser(userData);
        await setUserData(userData);
      } catch (error) {
        // Token is invalid, clear auth data
        console.error('Token validation failed:', error);
        await clearAuthToken();
        await clearUserData();
        setToken(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login with email and password
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Make login request
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });

      const { access_token: authToken, user: userData } = response.data;

      // Store token and user data
      await setAuthToken(authToken);
      await setUserData(userData);

      // Update state
      setToken(authToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Login error response:', error.response);
      console.error('Login error data:', error.response?.data);

      // Extract meaningful error message
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Register new user
   */
  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);

      // Make register request
      const response = await api.post<AuthResponse>('/auth/register', {
        email,
        password,
        name,
      });

      const { access_token: authToken, user: userData } = response.data;

      // Store token and user data
      await setAuthToken(authToken);
      await setUserData(userData);

      // Update state
      setToken(authToken);
      setUser(userData);
    } catch (error: any) {
      console.error('Register error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Logout user and clear all auth data
   */
  const logout = async () => {
    try {
      setLoading(true);

      // Clear stored auth data
      await clearAuthToken();
      await clearUserData();

      // Clear state
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to use auth context
 * Throws error if used outside AuthProvider
 */
export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
