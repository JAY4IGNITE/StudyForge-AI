import { apiClient } from '../lib/axios';

export interface UserProfile {
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

export const authService = {
  async register(data: { display_name: string; email: string; password: string }) {
    const res = await apiClient.post('/auth/register', data);
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await apiClient.post('/auth/login', data);
    return res.data;
  },

  async verifyEmail(email: string, otpCode: string) {
    const res = await apiClient.post('/auth/verify-email/confirm', { email, otp_code: otpCode });
    return res.data;
  },

  async forgotPassword(email: string) {
    const res = await apiClient.post('/auth/password/forgot', { email });
    return res.data;
  },

  async resetPassword(data: { email: string; otp_code: string; new_password: string }) {
    const res = await apiClient.post('/auth/password/reset', data);
    return res.data;
  },

  async getProfile(): Promise<UserProfile> {
    const res = await apiClient.get('/me');
    return res.data;
  },

  async updateProfile(data: Partial<UserProfile>) {
    const res = await apiClient.patch('/me', data);
    return res.data;
  },
};
