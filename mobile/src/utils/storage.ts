import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Storage keys used throughout the app
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: '@drplantes:auth_token',
  USER_DATA: '@drplantes:user_data',
  THEME_PREFERENCE: '@drplantes:theme',
  ONBOARDING_COMPLETED: '@drplantes:onboarding_completed',
  // Guest mode keys
  IS_GUEST_MODE: '@drplantes:is_guest_mode',
  GUEST_DATA_SYNCED: '@drplantes:guest_data_synced',
  GUEST_PLANTS: '@drplantes:guest_plants',
  GUEST_PHOTOS: '@drplantes:guest_photos',
  GUEST_WATER_EVENTS: '@drplantes:guest_water_events',
  SPECIES_CACHE: '@drplantes:species_cache',
  SPECIES_VERSION: '@drplantes:species_version',
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

// ============================================
// Guest Mode Storage Utilities
// ============================================

/**
 * Check if user is in guest mode
 */
export const isGuestMode = async (): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(STORAGE_KEYS.IS_GUEST_MODE);
    return value === 'true';
  } catch (error) {
    console.error('Error checking guest mode:', error);
    return false;
  }
};

/**
 * Set guest mode flag
 */
export const setGuestMode = async (isGuest: boolean): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_GUEST_MODE, isGuest ? 'true' : 'false');
  } catch (error) {
    console.error('Error setting guest mode:', error);
    throw error;
  }
};

/**
 * Get guest plants from local storage
 */
export const getGuestPlants = async <T = any>(): Promise<T[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_PLANTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting guest plants:', error);
    return [];
  }
};

/**
 * Set guest plants in local storage
 */
export const setGuestPlants = async (plants: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_PLANTS, JSON.stringify(plants));
  } catch (error) {
    console.error('Error setting guest plants:', error);
    throw error;
  }
};

/**
 * Get guest photos from local storage
 */
export const getGuestPhotos = async <T = any>(): Promise<T[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_PHOTOS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting guest photos:', error);
    return [];
  }
};

/**
 * Set guest photos in local storage
 */
export const setGuestPhotos = async (photos: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_PHOTOS, JSON.stringify(photos));
  } catch (error) {
    console.error('Error setting guest photos:', error);
    throw error;
  }
};

/**
 * Get guest water events from local storage
 */
export const getGuestWaterEvents = async <T = any>(): Promise<T[]> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.GUEST_WATER_EVENTS);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error getting guest water events:', error);
    return [];
  }
};

/**
 * Set guest water events in local storage
 */
export const setGuestWaterEvents = async (events: any[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.GUEST_WATER_EVENTS, JSON.stringify(events));
  } catch (error) {
    console.error('Error setting guest water events:', error);
    throw error;
  }
};

/**
 * Check if guest has any local data
 */
export const hasLocalGuestData = async (): Promise<boolean> => {
  try {
    const plants = await getGuestPlants();
    const photos = await getGuestPhotos();
    const events = await getGuestWaterEvents();

    return plants.length > 0 || photos.length > 0 || events.length > 0;
  } catch (error) {
    console.error('Error checking guest data:', error);
    return false;
  }
};

/**
 * Clear all guest mode data
 */
export const clearGuestData = async (): Promise<void> => {
  try {
    await Promise.all([
      AsyncStorage.removeItem(STORAGE_KEYS.IS_GUEST_MODE),
      AsyncStorage.removeItem(STORAGE_KEYS.GUEST_DATA_SYNCED),
      AsyncStorage.removeItem(STORAGE_KEYS.GUEST_PLANTS),
      AsyncStorage.removeItem(STORAGE_KEYS.GUEST_PHOTOS),
      AsyncStorage.removeItem(STORAGE_KEYS.GUEST_WATER_EVENTS),
    ]);
  } catch (error) {
    console.error('Error clearing guest data:', error);
    throw error;
  }
};
