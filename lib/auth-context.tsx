"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  role: 'admin' | 'member';
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Sayfa yüklendiğinde localStorage'dan auth durumunu kontrol et
    const authData = localStorage.getItem('noqta-auth');
    if (authData) {
      try {
        const parsed = JSON.parse(authData);
        setUser(parsed);
      } catch (error) {
        localStorage.removeItem('noqta-auth');
      }
    }
  }, []);

  const login = (username: string, password: string): boolean => {
    const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Bapdor-hetsoq-8nyggu';
    const memberPassword = process.env.NEXT_PUBLIC_MEMBER_PASSWORD || 'member123';
    
    if (username === 'admin' && password === adminPassword) {
      const adminUser = { id: 'admin', username: 'admin', role: 'admin' as const };
      setUser(adminUser);
      localStorage.setItem('noqta-auth', JSON.stringify(adminUser));
      return true;
    } else if (username === 'member' && password === memberPassword) {
      const memberUser = { id: 'member', username: 'member', role: 'member' as const };
      setUser(memberUser);
      localStorage.setItem('noqta-auth', JSON.stringify(memberUser));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('noqta-auth');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      isAdmin: user?.role === 'admin',
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
