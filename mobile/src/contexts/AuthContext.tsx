import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import api from '../services/api';
import {
  getAuthToken,
  setAuthToken,
  clearAuthToken,
  getUserData,
  setUserData,
  clearUserData,
  isGuestMode as checkGuestMode,
  setGuestMode,
  hasLocalGuestData,
  clearGuestData,
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
  isGuestMode: boolean;
  hasLocalData: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  skipAuthentication: () => Promise<void>;
  syncGuestData: () => Promise<void>;
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
  const [isGuest, setIsGuest] = useState<boolean>(false);
  const [hasLocal, setHasLocal] = useState<boolean>(false);

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

      // Check if user is in guest mode
      const guestMode = await checkGuestMode();
      setIsGuest(guestMode);

      // Check if guest has local data
      const localData = await hasLocalGuestData();
      setHasLocal(localData);

      if (guestMode) {
        // User is in guest mode, skip authentication check
        setLoading(false);
        return;
      }

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

      // Exit guest mode
      await setGuestMode(false);
      setIsGuest(false);

      // Sync guest data if exists
      // Note: syncGuestData will be called separately by the UI after registration
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

      // Enter guest mode after logout
      await setGuestMode(true);
      setIsGuest(true);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Skip authentication and enter guest mode
   */
  const skipAuthentication = async () => {
    try {
      setLoading(true);

      // Set guest mode flag
      await setGuestMode(true);
      setIsGuest(true);
    } catch (error) {
      console.error('Error skipping authentication:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sync guest data to backend after registration/login
   * This is a placeholder - actual implementation will be in the sync service
   */
  const syncGuestData = async () => {
    try {
      setLoading(true);

      // Check if there's local data to sync
      const localData = await hasLocalGuestData();

      if (!localData) {
        console.log('No local data to sync');
        return;
      }

      // TODO: Implement actual sync logic
      // This will be implemented in a separate sync service
      console.log('Sync functionality will be implemented in sync service');

      // After successful sync, clear guest data and exit guest mode
      await clearGuestData();
      await setGuestMode(false);
      setIsGuest(false);
      setHasLocal(false);
    } catch (error) {
      console.error('Error syncing guest data:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextValue = {
    user,
    token,
    loading,
    isGuestMode: isGuest,
    hasLocalData: hasLocal,
    login,
    register,
    logout,
    checkAuth,
    skipAuthentication,
    syncGuestData,
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
