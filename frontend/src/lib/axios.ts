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

let refreshInFlight: Promise<string | null> | null = null;

export async function refreshAccessToken(): Promise<string | null> {
  // De-dupe concurrent 401s so we don't fire multiple refresh requests.
  if (!refreshInFlight) {
    refreshInFlight = axios
      .post(`${API_BASE_URL}/auth/refresh`, {}, { withCredentials: true })
      .then((res) => {
        const { access_token } = res.data;
        setAccessToken(access_token);
        return access_token as string;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshInFlight = null;
      });
  }
  return refreshInFlight;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
