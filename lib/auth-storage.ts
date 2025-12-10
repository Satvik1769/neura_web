/**
 * Authentication token storage utilities
 * 
 * SECURITY BEST PRACTICES:
 * 1. HTTP-only cookies (set by backend) - MOST SECURE ✅
 *    - Protected from XSS attacks
 *    - Automatically sent with requests
 *    - Can't be accessed by JavaScript
 * 
 * 2. Secure cookies with httpOnly + secure + sameSite flags
 * 
 * 3. localStorage - LESS SECURE (fallback only)
 *    - Vulnerable to XSS attacks
 *    - Use only if cookies are not possible
 */

// Token storage keys
const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

/**
 * OPTION 1: HTTP-only Cookies (Recommended - Backend handles this)
 * Your backend should set cookies like:
 * 
 * response.cookie('auth_token', token, {
 *   httpOnly: true,    // Prevents JavaScript access
 *   secure: true,      // HTTPS only
 *   sameSite: 'strict', // CSRF protection
 *   maxAge: 3600000    // 1 hour
 * });
 * 
 * No client-side code needed! Cookies are automatically sent.
 */

/**
 * OPTION 2: localStorage (Less secure, use only as fallback)
 * Use this ONLY if your backend doesn't support HTTP-only cookies
 */
export const tokenStorage = {
  // Get token from localStorage
  getToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  // Set token in localStorage
  setToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token from localStorage
  removeToken: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },

  // Get refresh token
  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  // Set refresh token
  setRefreshToken: (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },
};

/**
 * OPTION 3: Secure client-side cookies (Better than localStorage)
 * Use this if backend doesn't set HTTP-only cookies but you want better security
 */
export const secureCookieStorage = {
  // Set a secure cookie
  setCookie: (name: string, value: string, days: number = 7): void => {
    if (typeof window === 'undefined') return;
    
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    
    // Note: Can't set httpOnly from client-side, but can set secure and sameSite
    const cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/; SameSite=Strict${
      window.location.protocol === 'https:' ? '; Secure' : ''
    }`;
    
    document.cookie = cookie;
  },

  // Get cookie value
  getCookie: (name: string): string | null => {
    if (typeof window === 'undefined') return null;
    
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') c = c.substring(1, c.length);
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
  },

  // Delete cookie
  deleteCookie: (name: string): void => {
    if (typeof window === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  },
};

/**
 * Recommended approach based on your backend capabilities:
 * 
 * IF your backend sets HTTP-only cookies:
 *   ✅ Use credentials: 'include' in fetch (already done in api.ts)
 *   ✅ No client-side token storage needed
 *   ✅ Most secure
 * 
 * IF your backend returns token in response body:
 *   Option A: Use secureCookieStorage (better)
 *   Option B: Use tokenStorage with localStorage (acceptable but less secure)
 */
