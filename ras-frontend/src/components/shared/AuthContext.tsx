"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface UserProfile {
  id: string;
  email: string;
  role: "candidate" | "employer" | "admin";
  full_name: string;
}

interface AuthContextType {
  token: string | null;
  user: any | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, fullName: string, role: "candidate" | "employer") => Promise<any>;
  signOut: () => Promise<void>;
  apiFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Load auth info from localStorage on mount
    const storedToken = localStorage.getItem("ras_token");
    const storedUser = localStorage.getItem("ras_user");
    const storedProfile = localStorage.getItem("ras_profile");

    if (storedToken && storedUser && storedProfile) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      setProfile(JSON.parse(storedProfile));
    }
    setIsLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign in");
      }

      const tokenValue = data.session.access_token;
      const userValue = data.user;
      
      // Get the profile details
      const profileResponse = await fetch(`${API_BASE_URL}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${tokenValue}`
        }
      });
      const profileData = await profileResponse.json();
      if (!profileResponse.ok) {
        throw new Error(profileData.error || "Failed to get user profile");
      }

      const profileValue = profileData.profile;

      setToken(tokenValue);
      setUser(userValue);
      setProfile(profileValue);

      localStorage.setItem("ras_token", tokenValue);
      localStorage.setItem("ras_user", JSON.stringify(userValue));
      localStorage.setItem("ras_profile", JSON.stringify(profileValue));

      if (profileValue.role === "employer") {
        router.push("/employer/dashboard");
      } else {
        router.push("/candidate/dashboard");
      }

      return data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, fullName: string, role: "candidate" | "employer") => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, full_name: fullName, role }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }

      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      throw error;
    }
  };

  const signOut = async () => {
    setIsLoading(true);
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/signout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Signout API error:", error);
    } finally {
      setToken(null);
      setUser(null);
      setProfile(null);
      localStorage.removeItem("ras_token");
      localStorage.removeItem("ras_user");
      localStorage.removeItem("ras_profile");
      setIsLoading(false);
      router.push("/auth/signin");
    }
  };

  const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
    const headers = new Headers(options.headers || {});
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
      headers.set("Content-Type", "application/json");
    }

    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

    return fetch(`${API_BASE_URL}${cleanEndpoint}`, {
      ...options,
      headers,
    });
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        profile,
        isLoading,
        signIn,
        signUp,
        signOut,
        apiFetch,
      }}
    >
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
