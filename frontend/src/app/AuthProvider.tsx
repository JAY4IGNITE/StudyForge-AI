import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient, setAccessToken } from '../lib/axios';
import { supabase } from '../lib/supabase';

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

  const fetchUser = async (accessToken?: string) => {
    setLoading(true);
    try {
      if (accessToken) setAccessToken(accessToken);
      const res = await apiClient.get('/me');
      setUser(res.data);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setToken(session.access_token);
        fetchUser(session.access_token);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        setToken(session.access_token);
        await fetchUser(session.access_token);
      } else {
        setToken(null);
        setUser(null);
        setAccessToken(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (tokens: { access_token: string }) => {
    setAccessToken(tokens.access_token);
    setToken(tokens.access_token);
    await fetchUser();
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // best-effort
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
