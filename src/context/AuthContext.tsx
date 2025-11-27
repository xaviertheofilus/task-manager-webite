import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthSession } from '../types/user';
import { useRouter } from 'next/router';
import { STORAGE_KEYS } from '@/lib/constants';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  // Reset loading state when route changes
  useEffect(() => {
    const handleRouteChange = () => {
      if (isLoading) {
        setIsLoading(false);
      }
    };

    router.events?.on('routeChangeComplete', handleRouteChange);
    return () => {
      router.events?.off('routeChangeComplete', handleRouteChange);
    };
  }, [isLoading, router]);

  const checkAuth = () => {
    try {
      const sessionData = localStorage.getItem(STORAGE_KEYS.AUTH_SESSION);
      if (sessionData) {
        const session: AuthSession = JSON.parse(sessionData);
        
        // Check if session is expired
        if (new Date(session.expiresAt) > new Date()) {
          setUser(session.user);
        } else {
          localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success && data.user) {
        const session: AuthSession = {
          user: data.user,
          token: data.token,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        
        localStorage.setItem(STORAGE_KEYS.AUTH_SESSION, JSON.stringify(session));
        setUser(data.user);
        return true;
      }
      
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH_SESSION);
    setUser(null);
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
