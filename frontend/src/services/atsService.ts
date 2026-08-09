import api from './api';

export interface Resume {
  id: string;
  original_filename: string;
  status: string;
  parse_status: string;
  parse_quality?: number;
  uploaded_at: string;
  parsed_at?: string;
  r2_key: string;
}

export interface AtsReport {
  id: string;
  resume_id: string;
  overall_score: number;
  keyword_score: number;
  semantic_score: number;
  formatting_score: number;
  completeness_score: number;
  impact_score: number;
  confidence: number;
  matched_keywords: string[];
  missing_keywords: string[];
  warnings: string[];
  recommendations: string[];
  created_at: string;
  job_description_text: string;
}

export const atsService = {
  getResumes: async () => {
    const response = await api.get('/resumes');
    return response.data;
  },
  
  uploadResume: async (file: File) => {
    // 1. Get presigned URL
    const urlResponse = await api.post('/resumes/upload-url', {
      original_filename: file.name,
      content_type: file.type || 'application/pdf',
      file_size: file.size
    });
    
    // 2. Upload to R2 directly
    await fetch(urlResponse.data.upload_url, {
      method: 'PUT',
      headers: {
        'Content-Type': file.type || 'application/pdf',
      },
      body: file
    });
    
    // 3. Process
    const processResponse = await api.post(`/resumes/${urlResponse.data.resume_id}/process`);
    return processResponse.data;
  },

  deleteResume: async (id: string) => {
    await api.delete(`/resumes/${id}`);
  },

  analyzeResume: async (resumeId: string, jobText: string) => {
    const response = await api.post('/ats/analyze', {
      resume_id: resumeId,
      job_text: jobText
    });
    return response.data;
  },

  getHistory: async () => {
    const response = await api.get('/ats/history');
    return response.data;
  },
  
  getReport: async (id: string) => {
    const response = await api.get(`/ats/${id}`);
    return response.data;
  }
};
