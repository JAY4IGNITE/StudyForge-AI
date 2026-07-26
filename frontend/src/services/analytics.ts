import { apiClient } from '../lib/axios';

export const analyticsService = {
  async getOverview() {
    const res = await apiClient.get('/analytics/overview');
    return res.data;
  },

  async getTopicsAnalytics() {
    const res = await apiClient.get('/analytics/topics');
    return res.data;
  },

  async getRoadmap() {
    const res = await apiClient.get('/roadmap');
    return res.data;
  },

  async submitFeedback(data: { category: string; rating: number; comment: string }) {
    const res = await apiClient.post('/feedback', data);
    return res.data;
  },
};
