/**
 * API client utilities for making requests to the backend
 */

import { getApiUrl } from './config';

// Response types
interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  token?: string;
  refreshToken?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Base fetch wrapper with error handling
 */
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include', // Important: Send cookies with requests
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMessage = 'An error occurred';
    let errorData: unknown = null;

    // First, try to get the response as text
    let responseText = '';
    try {
      responseText = await response.text();
    } catch {
      responseText = '';
      
    }

    // Try to parse as JSON
    if (responseText) {
      try {
        errorData = JSON.parse(responseText);
        
        // Extract message from JSON object
        if (typeof errorData === 'object' && errorData !== null) {
          if ('message' in errorData) {
            errorMessage = String(errorData.message);
          } else if ('error' in errorData) {
            errorMessage = String(errorData.error);
          }
        } else if (typeof errorData === 'string') {
          errorMessage = errorData;
        }
      } catch {
        // If JSON parsing fails, use the text as-is (plain string response)
        errorMessage = responseText;
      }
    }

    throw new ApiError(errorMessage, response.status, errorData);
  }

  return response.json();
}

/**
 * Authentication API calls
 */
export const authApi = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (email: string, password: string, name: string): Promise<AuthResponse> => {
    return apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },

  logout: async (): Promise<void> => {
    return apiFetch<void>('/api/auth/logout-device', {
      method: 'PUT',
    });
  },

  getCurrentUser: async (): Promise<AuthResponse['user']> => {
    return apiFetch<AuthResponse['user']>('/api/auth/me', {
      method: 'GET',
    });
  },
};

/**
 * Device/Engine API calls
 */
export const deviceApi = {
  getDevices: async (page: number = 0, size: number = 9) => {
    return apiFetch(`/api/devices/getDevices?page=${page}&size=${size}`, {
      method: 'GET',
    });
  },

  getDeviceById: async (deviceId: string) => {
    return apiFetch(`/api/devices/getDeviceById/${deviceId}`, {
      method: 'GET',
    });
  },

  getDeviceParameters: async (deviceId: string) => {
    return apiFetch(`/api/devices/detail/${deviceId}`, {
      method: 'GET',
    });
  },

  getDeviceCSV: async (deviceId: string): Promise<Blob> => {
    const url = getApiUrl(`/api/devices/csv/${deviceId}`);

    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new ApiError('Failed to download CSV', response.status);
    }

    return response.blob();
  },

  searchDevices: async (query: string): Promise<any[]> => {
    return apiFetch<any[]>(`/api/devices/search?keyword=${encodeURIComponent(query)}`, {
      method: 'GET',
    });
  },

  updateDeviceHealth: async (deviceId: number, healthData: {
    temperature: number | null;
    vibration: number | null;
    rpm: number | null;
    acoustic: number | null;
  }) => {
    return apiFetch(`/api/devices/health`, {
      method: 'POST',
      body: JSON.stringify({
        deviceId,
        ...healthData
      }),
    });
  },
};
