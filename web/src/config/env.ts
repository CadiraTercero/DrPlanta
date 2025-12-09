/**
 * Environment configuration for the web app
 *
 * Usage:
 * - For local development: Create a .env file based on .env.example
 * - Environment variables must be prefixed with VITE_
 */

interface EnvConfig {
  apiUrl: string;
  environment: string;
}

const env: EnvConfig = {
  apiUrl: import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1',
  environment: import.meta.env.MODE || 'development',
};

export default env;
