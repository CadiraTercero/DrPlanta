import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@drplantes:auth_token',
  USER_DATA: '@drplantes:user_data',
  THEME_PREFERENCE: '@drplantes:theme',
  ONBOARDING_COMPLETED: '@drplantes:onboarding_completed',
} as const;

/**
 * Get authentication token from storage
 */
export const getAuthToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

/**
 * Set authentication token in storage
 */
export const setAuthToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
  } catch (error) {
    console.error('Error setting auth token:', error);
    throw error;
  }
};

/**
 * Clear authentication token from storage
 */
export const clearAuthToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
  } catch (error) {
    console.error('Error clearing auth token:', error);
    throw error;
  }
};

/**
 * Get user data from storage
 */
export const getUserData = async <T = any>(): Promise<T | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting user data:', error);
    return null;
  }
};

/**
 * Set user data in storage
 */
export const setUserData = async (userData: any): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  } catch (error) {
    console.error('Error setting user data:', error);
    throw error;
  }
};

/**
 * Clear user data from storage
 */
export const clearUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  } catch (error) {
    console.error('Error clearing user data:', error);
    throw error;
  }
};

/**
 * Check if onboarding has been completed
 */
export const isOnboardingCompleted = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return value === 'true';
  } catch (error) {
    console.error('Error checking onboarding status:', error);
    return false;
  }
};

/**
 * Mark onboarding as completed
 */
export const setOnboardingCompleted = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, 'true');
  } catch (error) {
    console.error('Error setting onboarding status:', error);
    throw error;
  }
};

/**
 * Clear all app data from storage
 */
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.error('Error clearing all data:', error);
    throw error;
  }
};
