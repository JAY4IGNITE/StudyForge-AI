export interface JobRequiredExperience {
  required_experience_in_months?: number;
  experience_mentioned?: boolean;
  experience_preferred?: boolean;
}

export interface JobData {
  job_id: string;
  employer_name?: string;
  employer_logo?: string;
  employer_website?: string;
  job_publisher?: string;
  job_employment_type?: string;
  job_title: string;
  job_apply_link?: string;
  job_description?: string;
  job_is_remote?: boolean;
  job_city?: string;
  job_state?: string;
  job_country?: string;
  job_posted_at_datetime_utc?: string;
  job_min_salary?: number;
  job_max_salary?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_required_skills?: string[];
  job_required_experience?: JobRequiredExperience;
}

export interface JobSearchResponse {
  status: string;
  request_id: string;
  parameters: any;
  data: JobData[];
}

export interface JobMatchScore {
  overall_match_percentage: number;
  matched_skills: string[];
  missing_skills: string[];
  analysis_reasoning: string;
}

export interface JobApplication {
  id: string;
  user_id: string;
  job_id: string;
  company_name: string;
  job_title: string;
  location?: string;
  application_url?: string;
  status: 'Saved' | 'Interested' | 'Applied' | 'Assessment' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn';
  notes?: string;
  saved_at: string;
  applied_at?: string;
  created_at: string;
  updated_at: string;
}
