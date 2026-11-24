'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useSyncExternalStore,
  ReactNode,
} from 'react';
import { useRouter, usePathname } from 'next/navigation';
import api from '@/services/api';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: 'REPRESENTATIVE' | 'MANAGER';
}

interface AuthContextData {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AUTH_EVENT = 'pharma-auth-change';
const SSR_SENTINEL = '__SSR__';

function subscribeAuth(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener(AUTH_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(AUTH_EVENT, callback);
  };
}

function getAuthSnapshot(): string | null {
  const token = localStorage.getItem('@pharma:token');
  const rawUser = localStorage.getItem('@pharma:user');
  if (!token || !rawUser) return null;
  return rawUser;
}

function getServerAuthSnapshot(): string | null {
  return SSR_SENTINEL;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const rawSnapshot = useSyncExternalStore(
    subscribeAuth,
    getAuthSnapshot,
    getServerAuthSnapshot
  );

  const loading = rawSnapshot === SSR_SENTINEL;

  const user = useMemo<AuthUser | null>(() => {
    if (!rawSnapshot || rawSnapshot === SSR_SENTINEL) return null;
    try {
      return JSON.parse(rawSnapshot) as AuthUser;
    } catch {
      return null;
    }
  }, [rawSnapshot]);

  useEffect(() => {
    if (loading) return;

    const isLoginPage = pathname === '/login';

    if (!user && !isLoginPage) {
      router.replace('/login');
    } else if (user && isLoginPage) {
      router.replace('/');
    }
  }, [user, loading, pathname, router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('@pharma:token', token);
      localStorage.setItem('@pharma:user', JSON.stringify(userData));
      window.dispatchEvent(new Event(AUTH_EVENT));
      router.replace('/');
    },
    [router]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const response = await api.post('/auth/register', {
        name,
        email,
        password,
      });
      const { token, user: userData } = response.data;

      localStorage.setItem('@pharma:token', token);
      localStorage.setItem('@pharma:user', JSON.stringify(userData));
      window.dispatchEvent(new Event(AUTH_EVENT));
      router.replace('/');
    },
    [router]
  );

  const logout = useCallback(() => {
    localStorage.removeItem('@pharma:token');
    localStorage.removeItem('@pharma:user');
    window.dispatchEvent(new Event(AUTH_EVENT));
    router.replace('/login');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);