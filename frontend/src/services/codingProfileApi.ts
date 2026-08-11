import { apiClient } from '../lib/axios';
import { CodingProfile } from '../types/coding_profile';

export const codingProfileApi = {
  getMe: async (): Promise<CodingProfile> => {
    const { data } = await apiClient.get('/coding-profile/me');
    return data;
  },

  getPublicProfile: async (slug: string): Promise<CodingProfile> => {
    const { data } = await apiClient.get(`/coding-profile/${slug}`);
    return data;
  },

  createProfile: async (payload: { display_name: string; bio?: string; profile_slug: string }): Promise<CodingProfile> => {
    const { data } = await apiClient.post('/coding-profile/create', payload);
    return data;
  },

  updateProfile: async (payload: any): Promise<CodingProfile> => {
    const { data } = await apiClient.put('/coding-profile/update', payload);
    return data;
  },

  syncStats: async (): Promise<CodingProfile> => {
    const { data } = await apiClient.post('/coding-profile/sync');
    return data;
  },

  connectPlatform: async (platform: string, username: string): Promise<CodingProfile> => {
    const { data } = await apiClient.post('/coding-profile/connect', { platform, username });
    return data;
  },

  disconnectPlatform: async (platform: string): Promise<CodingProfile> => {
    const { data } = await apiClient.delete(`/coding-profile/disconnect/${platform}`);
    return data;
  }
};
