"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "@suite/types";
import { authApi } from "@/lib/auth-api";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "@/lib/auth-tokens";

type AuthStatus = "loading" | "authenticated" | "unauthenticated";

interface AuthContextValue {
  user: User | null;
  status: AuthStatus;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (patch: {
    name?: string;
    avatarUrl?: string;
  }) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [status, setStatus] = useState<AuthStatus>("loading");

  // ── Restore session on first load ─────────────────────────────────────────
  useEffect(() => {
    let active = true;

    async function restore() {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();
      if (!accessToken && !refreshToken) {
        if (active) setStatus("unauthenticated");
        return;
      }

      try {
        const me = await authApi.me();
        if (active) {
          setUser(me);
          setStatus("authenticated");
        }
        return;
      } catch {
        // Access token likely expired — try a refresh, then retry.
      }

      try {
        if (!refreshToken) throw new Error("No refresh token");
        const tokens = await authApi.refresh(refreshToken);
        setTokens(tokens.accessToken, tokens.refreshToken);
        const me = await authApi.me();
        if (active) {
          setUser(me);
          setStatus("authenticated");
        }
      } catch {
        clearTokens();
        if (active) {
          setUser(null);
          setStatus("unauthenticated");
        }
      }
    }

    void restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const session = await authApi.login({ email, password });
    setTokens(session.accessToken, session.refreshToken);
    setUser(session.user);
    setStatus("authenticated");
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const session = await authApi.register({ name, email, password });
      setTokens(session.accessToken, session.refreshToken);
      setUser(session.user);
      setStatus("authenticated");
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Best effort — clear the local session regardless.
    }
    clearTokens();
    setUser(null);
    setStatus("unauthenticated");
  }, []);

  const updateProfile = useCallback(
    async (patch: { name?: string; avatarUrl?: string }) => {
      const updated = await authApi.updateProfile(patch);
      setUser(updated);
    },
    [],
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, login, register, logout, updateProfile }),
    [user, status, login, register, logout, updateProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
