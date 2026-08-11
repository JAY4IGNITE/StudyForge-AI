import { apiClient } from '../lib/axios';
import { JobSearchResponse, JobApplication, JobMatchScore } from '../types/jobs';

export const jobsApi = {
  searchJobs: async (params: {
    query: string;
    page?: number;
    num_pages?: number;
    employment_types?: string;
    remote_jobs_only?: boolean;
    date_posted?: string;
  }): Promise<JobSearchResponse> => {
    const { data } = await apiClient.get('/jobs/search', { params });
    return data;
  },

  getJobDetails: async (jobId: string): Promise<{ job: any; match: JobMatchScore | null }> => {
    const { data } = await apiClient.get(`/jobs/${jobId}`);
    return data;
  },

  getSavedJobs: async (): Promise<JobApplication[]> => {
    const { data } = await apiClient.get('/jobs/saved');
    return data;
  },

  saveJob: async (jobId: string, jobData: any): Promise<JobApplication> => {
    const { data } = await apiClient.post(`/jobs/${jobId}/save`, jobData);
    return data;
  },

  unsaveJob: async (jobId: string): Promise<void> => {
    await apiClient.delete(`/jobs/${jobId}/save`);
  },

  updateApplication: async (appId: string, updateData: { status?: string; notes?: string }): Promise<JobApplication> => {
    const { data } = await apiClient.patch(`/jobs/applications/${appId}`, updateData);
    return data;
  },

  analyzeJob: async (jobId: string): Promise<{ match_score: number; analysis: any }> => {
    const { data } = await apiClient.post(`/jobs/${jobId}/analyze`);
    return data;
  },

  generateRoadmap: async (jobId: string): Promise<any> => {
    const { data } = await apiClient.post(`/jobs/${jobId}/roadmap`);
    return data;
  }
};
