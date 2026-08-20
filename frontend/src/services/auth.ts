import { apiClient } from '../lib/axios';
import { supabase } from '../lib/supabase';

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
    const { data: resData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: { full_name: data.display_name },
      },
    });
    if (error) throw error;
    return resData;
  },

  async login(data: { email: string; password: string }) {
    const { data: resData, error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) throw error;
    return resData;
  },

  async verifyEmail(email: string, otpCode: string) {
    let { data, error } = await supabase.auth.verifyOtp({
      email,
      token: otpCode,
      type: 'signup',
    });
    if (error) {
      const res = await supabase.auth.verifyOtp({
        email,
        token: otpCode,
        type: 'email',
      });
      if (res.error) throw res.error;
      return res.data;
    }
    return data;
  },

  async forgotPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return data;
  },

  async resetPassword(data: { email: string; otp_code: string; new_password: string }) {
    const { error: verifyError } = await supabase.auth.verifyOtp({
      email: data.email,
      token: data.otp_code,
      type: 'recovery',
    });
    if (verifyError) throw verifyError;
    const { data: resData, error: updateError } = await supabase.auth.updateUser({
      password: data.new_password,
    });
    if (updateError) throw updateError;
    return resData;
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
