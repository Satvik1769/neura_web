# Authentication & Token Storage Guide

## 🔐 Security Best Practices

### Token Storage Options (Ranked by Security)

#### ✅ OPTION 1: HTTP-only Cookies (MOST SECURE - Recommended)

**How it works:**
- Backend sets the token as an HTTP-only cookie
- Cookie is automatically sent with every request
- JavaScript cannot access the cookie (XSS protection)

**Backend Implementation (Your backend should do this):**
```javascript
// Express.js example
res.cookie('auth_token', token, {
  httpOnly: true,    // Prevents JavaScript access
  secure: true,      // HTTPS only (use in production)
  sameSite: 'strict', // CSRF protection
  maxAge: 3600000    // 1 hour
});
```

**Frontend Setup (Already done):**
- `credentials: 'include'` in fetch requests ✅
- No client-side token storage needed ✅

**Your backend MUST:**
- Set `Access-Control-Allow-Credentials: true`
- Set `Access-Control-Allow-Origin` to your frontend URL (not `*`)

---

#### ⚠️ OPTION 2: localStorage with Bearer Token (Less Secure)

**Use this ONLY if:**
- Your backend returns the token in the response body
- Your backend doesn't support HTTP-only cookies

**How to implement:**

1. **When backend returns token in response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

2. **In `lib/auth-context.tsx`, uncomment these lines:**
```typescript
// After successful login/signup:
if (response.token) {
  tokenStorage.setToken(response.token);
  if (response.refreshToken) {
    tokenStorage.setRefreshToken(response.refreshToken);
  }
}
```

3. **Update `lib/api.ts` to send token in headers:**
```typescript
import { tokenStorage } from './auth-storage';

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = getApiUrl(endpoint);
  const token = tokenStorage.getToken();
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  });
  // ... rest of the code
}
```

---

## 📝 Current Implementation

### What's Already Set Up:

1. ✅ **Environment variables** (`.env.local`)
   - `NEXT_PUBLIC_API_URL=http://localhost:8080`

2. ✅ **API client** (`lib/api.ts`)
   - `authApi.login(email, password)`
   - `authApi.register(email, password, name)`
   - `authApi.logout()`
   - Supports cookies with `credentials: 'include'`

3. ✅ **Auth context** (`lib/auth-context.tsx`)
   - Calls backend API
   - Handles login/signup/logout
   - Manages user state

4. ✅ **Token storage utilities** (`lib/auth-storage.ts`)
   - `tokenStorage` for localStorage (if needed)
   - `secureCookieStorage` for client-side cookies

---

## 🚀 How to Use

### In Your Signup Page:

The current implementation already works! Just make sure your backend is running.

```typescript
// app/signup/page.tsx - Already implemented
const { signup } = useAuth();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  try {
    await signup(email, password, name); // This calls the backend API
  } catch (error) {
    console.error("Signup failed:", error);
  } finally {
    setIsLoading(false);
  }
};
```

---

## 🔄 Backend Response Formats

### Format 1: HTTP-only Cookie (Recommended)
```
HTTP/1.1 200 OK
Set-Cookie: auth_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...; HttpOnly; Secure; SameSite=Strict

{
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

### Format 2: Token in Response Body
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "email": "user@example.com",
    "name": "John Doe"
  }
}
```

---

## 🛡️ Security Checklist

### Backend Must Have:
- [ ] CORS configured with credentials
- [ ] Token expiration (e.g., 1 hour for access token)
- [ ] Refresh token mechanism (optional but recommended)
- [ ] HTTPS in production
- [ ] Rate limiting on auth endpoints

### Frontend (Already done):
- [x] `credentials: 'include'` in API calls
- [x] Token storage utilities
- [x] Error handling for expired tokens
- [x] Logout clears all auth data

---

## 🔧 Next Steps

1. **Start your backend server** at `http://localhost:8080`

2. **Test registration:**
   ```bash
   # Your backend should receive:
   POST http://localhost:8080/api/auth/register
   {
     "email": "test@example.com",
     "password": "password123",
     "name": "Test User"
   }
   ```

3. **If using HTTP-only cookies:**
   - No changes needed! ✅
   
4. **If backend returns token in body:**
   - Uncomment the token storage lines in `lib/auth-context.tsx`
   - Update `lib/api.ts` to send Authorization header

5. **Restart Next.js dev server** after changing `.env.local`:
   ```bash
   # Stop the server (Ctrl+C) and restart
   npm run dev
   ```

---

## 📚 Files Reference

- `lib/api.ts` - API client with fetch wrapper
- `lib/auth-context.tsx` - Authentication state management
- `lib/auth-storage.ts` - Token storage utilities
- `lib/config.ts` - Environment configuration
- `.env.local` - Environment variables (git-ignored)
- `.env.example` - Environment template (committed)
