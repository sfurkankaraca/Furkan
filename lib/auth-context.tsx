"use client";

import { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";

export type PublicUser = {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
};

export type ClubAccessPayload = {
  applicationApproved: boolean;
  subscriptionActive: boolean;
  fullMember: boolean;
  periodEnd: string | null;
};

type AuthContextType = {
  user: PublicUser | null;
  needsOnboarding: boolean;
  isLoggedIn: boolean;
  isAdminNav: boolean;
  /** Kulüp başvurusu / abonelik özeti (giriş yoksa null) */
  club: ClubAccessPayload | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string; needsOnboarding?: boolean }>;
  register: (email: string, password: string, name?: string) => Promise<{ ok: boolean; error?: string; needsOnboarding?: boolean }>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<PublicUser | null>(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [isAdminNav, setIsAdminNav] = useState(false);
  const [club, setClub] = useState<ClubAccessPayload | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setUser(data?.user ?? null);
      setNeedsOnboarding(!!data?.needsOnboarding);
      setClub(data?.club ?? null);
    } catch {
      setUser(null);
      setNeedsOnboarding(false);
      setClub(null);
    }
    try {
      const a = await fetch("/api/auth/admin-session", { credentials: "include" });
      const j = await a.json().catch(() => ({}));
      setIsAdminNav(!!j?.admin);
    } catch {
      setIsAdminNav(false);
    }
  }, []);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || "Giriş başarısız" };
    }
    setUser(data.user ?? null);
    setNeedsOnboarding(!!data.needsOnboarding);
    await refresh();
    return { ok: true, needsOnboarding: !!data.needsOnboarding };
  };

  const register = async (email: string, password: string, name?: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password, name }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return { ok: false, error: data?.error || "Kayıt başarısız" };
    }
    setUser(data.user ?? null);
    setNeedsOnboarding(!!data.needsOnboarding);
    await refresh();
    return { ok: true, needsOnboarding: !!data.needsOnboarding };
  };

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setUser(null);
    setNeedsOnboarding(false);
    setClub(null);
    setIsAdminNav(false);
    await refresh();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        needsOnboarding,
        isLoggedIn: !!user,
        isAdminNav,
        club,
        loading,
        refresh,
        login,
        register,
        logout,
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
