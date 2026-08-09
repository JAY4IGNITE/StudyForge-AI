import { useAuth as useAuthContext } from '../app/AuthProvider';

export function useAuth() {
  const context = useAuthContext();
  const token: string | null = localStorage.getItem('access_token');
  
  return {
    ...context,
    token,
  };
}
