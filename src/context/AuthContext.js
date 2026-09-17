"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  // Restore session from localStorage on mount & sync profile
  useEffect(() => {
    async function restoreSession() {
      try {
        const storedToken = localStorage.getItem("tip_jwt_token");
        const storedUser = localStorage.getItem("tip_jwt_user");

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
          // Refresh profile in background
          try {
            const profileData = await api.getProfile(storedToken);
            setUser(profileData);
            localStorage.setItem("tip_jwt_user", JSON.stringify(profileData));
          } catch (e) {
            console.warn("Could not refresh profile from backend", e);
          }
        }
      } catch (err) {
        console.error("Failed to restore session from localStorage", err);
      } finally {
        setIsLoading(false);
      }
    }
    restoreSession();
  }, []);

  const fetchProfile = async (jwtToken = token) => {
    if (!jwtToken) return;
    const profileData = await api.getProfile(jwtToken);
    setUser(profileData);
    localStorage.setItem("tip_jwt_user", JSON.stringify(profileData));
    return profileData;
  };

  const login = async (credentials) => {
    const data = await api.login(credentials);
    setToken(data.token);
    localStorage.setItem("tip_jwt_token", data.token);

    try {
      const profileData = await api.getProfile(data.token);
      setUser(profileData);
      localStorage.setItem("tip_jwt_user", JSON.stringify(profileData));
    } catch {
      const authUser = {
        username: data.username,
        role: data.role,
      };
      setUser(authUser);
      localStorage.setItem("tip_jwt_user", JSON.stringify(authUser));
    }
    return data;
  };

  const register = async (userData) => {
    const data = await api.register(userData);
    setToken(data.token);
    localStorage.setItem("tip_jwt_token", data.token);

    try {
      const profileData = await api.getProfile(data.token);
      setUser(profileData);
      localStorage.setItem("tip_jwt_user", JSON.stringify(profileData));
    } catch {
      const authUser = {
        username: data.username,
        role: data.role,
        address: data.address,
      };
      setUser(authUser);
      localStorage.setItem("tip_jwt_user", JSON.stringify(authUser));
    }
    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("tip_jwt_token");
    localStorage.removeItem("tip_jwt_user");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
        fetchProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
