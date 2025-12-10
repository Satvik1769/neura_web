"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "./api";
import { tokenStorage } from "./auth-storage";

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    // OPTION 1: If using HTTP-only cookies, backend will validate automatically
    // OPTION 2: If using localStorage, check for token
    const checkAuth = async () => {
      try {
        // If your backend returns token in response, uncomment this:
        // const token = tokenStorage.getToken();
        // if (!token) {
        //   setIsLoading(false);
        //   return;
        // }

        // Try to fetch current user from backend
        // const userData = await authApi.getCurrentUser();
        // setUser(userData);

        // Temporary: Check localStorage for user (remove when backend is ready)
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // Token might be expired, clear it
        tokenStorage.removeToken();
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      // OPTION 1: If backend sets HTTP-only cookies
      // Just set the user data, token is in cookies
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // OPTION 2: If backend returns token in response body
      // Uncomment if your backend returns { token, user }
      // if (response.token) {
      //   tokenStorage.setToken(response.token);
      //   if (response.refreshToken) {
      //     tokenStorage.setRefreshToken(response.refreshToken);
      //   }
      // }
      // if (response.user) {
      //   setUser(response.user);
      //   localStorage.setItem("user", JSON.stringify(response.user));
      // }

      router.push("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      const response = await authApi.register(email, password, name);
      
      // OPTION 1: If backend sets HTTP-only cookies
      if (response.user) {
        setUser(response.user);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      // OPTION 2: If backend returns token in response body
      // Uncomment if your backend returns { token, user }
      // if (response.token) {
      //   tokenStorage.setToken(response.token);
      //   if (response.refreshToken) {
      //     tokenStorage.setRefreshToken(response.refreshToken);
      //   }
      // }
      // if (response.user) {
      //   setUser(response.user);
      //   localStorage.setItem("user", JSON.stringify(response.user));
      // }

      router.push("/dashboard");
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      // Clear all auth data
      setUser(null);
      tokenStorage.removeToken();
      localStorage.removeItem("user");
      router.push("/login");
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}