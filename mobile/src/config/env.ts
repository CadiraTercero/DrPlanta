import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Environment configuration for the mobile app
 *
 * Usage:
 * - For local development: Update these values directly
 * - For production: These should be replaced during build process
 */

/**
 * Get the local API URL based on the platform and runtime environment
 */
const getLocalApiUrl = () => {
  // Get the host IP from Expo debugger connection (works for all platforms)
  const debuggerHost = Constants.expoConfig?.hostUri;
  console.log('🌐 [ENV] Platform:', Platform.OS);
  console.log('🌐 [ENV] Expo debuggerHost:', debuggerHost);

  if (debuggerHost) {
    // Extract IP address (format is usually "192.168.x.x:8081" or similar)
    const host = debuggerHost.split(':')[0];
    const url = `http://${host}:3000/api/v1`;
    console.log('🌐 [ENV] Using API URL from Expo host:', url);
    return url;
  }

  // Fallback for Android Emulator only (when debuggerHost is not available)
  if (Platform.OS === 'android') {
    const url = 'http://10.0.2.2:3000/api/v1';
    console.log('🌐 [ENV] Android fallback (emulator):', url);
    return url;
  }

  // Fallback to localhost (works for iOS Simulator)
  const url = 'http://localhost:3000/api/v1';
  console.log('🌐 [ENV] Fallback to localhost:', url);
  return url;
};

const ENV = {
  dev: {
    apiUrl: getLocalApiUrl(),
    environment: 'development',
  },
  staging: {
    apiUrl: 'https://drplanta-production.up.railway.app/api/v1',
    environment: 'staging',
  },
  prod: {
    apiUrl: 'https://drplanta-production.up.railway.app/api/v1',
    environment: 'production',
  },
};

const getEnvVars = (env = 'dev') => {
  if (env === 'dev' || env === 'development') return ENV.dev;
  if (env === 'staging') return ENV.staging;
  if (env === 'prod' || env === 'production') return ENV.prod;
  return ENV.dev;
};

// Detect if we're in a standalone build (not Expo Go)
const isStandaloneBuild = !Constants.expoConfig?.hostUri && !__DEV__;

// Use production environment for standalone builds, dev for Expo Go
const environment = isStandaloneBuild ? 'prod' : 'dev';

console.log('🌐 [ENV] Is Standalone Build:', isStandaloneBuild);
console.log('🌐 [ENV] Environment:', environment);

export default getEnvVars(environment);
