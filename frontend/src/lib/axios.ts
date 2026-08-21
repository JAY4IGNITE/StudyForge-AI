import axios from 'axios';
import { supabase } from './supabase';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

// The access token lives in memory (this module-level variable) and falls back
// directly to Supabase's active session if not yet initialized.
let inMemoryAccessToken: string | null = null;

export function getAccessToken(): string | null {
  return inMemoryAccessToken;
}

export function setAccessToken(token: string | null): void {
  inMemoryAccessToken = token;
}

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Required so the httpOnly refresh_token cookie is sent on /auth/refresh
  // (and cleared on /auth/logout) requests.
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  let token = inMemoryAccessToken;
  if (!token) {
    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.access_token) {
        token = session.access_token;
        inMemoryAccessToken = token;
      }
    } catch {
      // ignore
    }
  }

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    // We let Supabase handle token refreshes via AuthProvider's onAuthStateChange.
    // If we get a 401 here, it means the token is truly invalid or expired
    // beyond repair, or the user is not authenticated.
    return Promise.reject(error);
  }
);
