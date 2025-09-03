"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { AuthUser } from "./auth";
import { loadMe } from "./auth";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, set_user] = useState<AuthUser | null>(null);
  const [loading, set_loading] = useState(true);

  useEffect(() => {
    loadMe().then((u) => {
      set_user(u);
      set_loading(false);
    });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    set_user(null);
  }, []);

  return <AuthContext.Provider value={{ user, loading, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
