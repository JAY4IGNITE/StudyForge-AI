import { apiClient } from '../lib/axios';

export interface ResourceItem {
  id: string;
  title: string;
  url: string;
  description: string;
  difficulty?: string;
  tags?: string[];
}

export const resourcesService = {
  async getResources(topicId?: string): Promise<ResourceItem[]> {
    const res = await apiClient.get('/resources', { params: { topic_id: topicId } });
    return res.data;
  },

  async searchResources(query: string): Promise<ResourceItem[]> {
    const res = await apiClient.post(`/resources/search?query=${encodeURIComponent(query)}`);
    return res.data;
  },
};
