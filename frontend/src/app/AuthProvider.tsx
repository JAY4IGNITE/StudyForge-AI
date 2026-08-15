import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAccessToken, refreshAccessToken } from '../lib/axios';

interface User {
  id: string;
  email: string;
  display_name: string;
  role: string;
  email_verified: boolean;
  goals: string[];
  target_role?: string;
  preferences: {
    preferred_subjects?: string[];
    difficulty_preference?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  token: string | null;
  login: (tokens: { access_token: string }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchUser = async () => {
    try {
      const res = await apiClient.get('/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // On mount there's no access token in memory yet (it's never persisted
    // to storage). Silently exchange the httpOnly refresh cookie -- if the
    // user has a valid session -- for a fresh access token before deciding
    // whether they're logged in.
    (async () => {
      const freshToken = await refreshAccessToken();
      if (freshToken) {
        setToken(freshToken);
        await fetchUser();
      } else {
        setToken(null);
        setUser(null);
        setLoading(false);
      }
    })();
  }, []);

  const login = async (tokens: { access_token: string }) => {
    setAccessToken(tokens.access_token);
    setToken(tokens.access_token);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch {
      // best-effort; clear client state regardless
    }
    setAccessToken(null);
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, refreshUser: fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
