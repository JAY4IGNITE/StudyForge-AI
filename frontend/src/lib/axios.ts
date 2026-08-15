import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api/v1`
  : (import.meta.env.PROD ? '/api/v1' : 'http://localhost:8000/api/v1');

// The access token lives ONLY in memory (this module-level variable), never
// in localStorage/sessionStorage. It's short-lived (15 min) and lost on a
// hard page refresh by design -- AuthProvider silently re-fetches a fresh one
// on mount via the httpOnly refresh cookie (see /auth/refresh below).
// This means an XSS payload can't read a long-lived credential out of
// browser storage; at worst it can use the token while it's live in memory.
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

apiClient.interceptors.request.use((config) => {
  if (inMemoryAccessToken && config.headers) {
    config.headers.Authorization = `Bearer ${inMemoryAccessToken}`;
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
