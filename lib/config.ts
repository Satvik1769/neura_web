/**
 * Application configuration
 * Access environment variables through this centralized config
 */

export const config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  // Add other config values here
} as const;

// Helper function to build API endpoints
export const getApiUrl = (path: string) => {
  const baseUrl = config.apiUrl.endsWith('/') 
    ? config.apiUrl.slice(0, -1) 
    : config.apiUrl;
  const endpoint = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${endpoint}`;
};
