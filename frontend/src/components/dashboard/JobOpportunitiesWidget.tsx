import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight, Loader2, MapPin } from 'lucide-react';
import { jobsApi } from '../../services/jobsApi';
import { JobData } from '../../types/jobs';
import { AnimatedButton as Button } from '../motion';

export const JobOpportunitiesWidget: React.FC = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendedJobs = async () => {
      try {
        const response = await jobsApi.searchJobs({
          query: 'Software Engineer', // Default fallback query, ideally driven by user profile
          num_pages: 1
        });
        
        // Take top 3 for the dashboard
        setJobs(response.data ? response.data.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to fetch recommended jobs', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecommendedJobs();
  }, []);

  return (
    <div className="bg-card/40 border border-border rounded-xl p-6 backdrop-blur-md flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-medium tracking-tight text-foreground flex items-center gap-2">
          <Briefcase className="h-5 w-5 text-ember" />
          Recommended Jobs
        </h3>
        <Link to="/jobs" className="text-sm text-ember hover:text-ember/80 font-medium flex items-center gap-1 transition-colors">
          View all <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
      
      {loading ? (
        <div className="flex-1 flex items-center justify-center min-h-[150px]">
          <Loader2 className="h-6 w-6 animate-spin text-secondary" />
        </div>
      ) : jobs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center p-4 min-h-[150px]">
          <p className="text-sm text-secondary mb-4">No recommendations available right now.</p>
          <Link to="/jobs"><Button variant="outline" size="sm">Search Jobs</Button></Link>
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-3">
          {jobs.map((job) => (
            <Link 
              key={job.job_id} 
              to={`/jobs/${job.job_id}`}
              className="group block p-3 rounded-lg border border-border/50 bg-background/50 hover:border-ember/30 hover:bg-white/5 transition-all"
            >
              <div className="flex justify-between items-start mb-1">
                <h4 className="font-medium text-foreground text-sm group-hover:text-ember transition-colors line-clamp-1">
                  {job.job_title}
                </h4>
              </div>
              <div className="flex items-center gap-3 text-xs text-secondary">
                <span className="font-medium text-foreground/80">{job.employer_name}</span>
                {job.job_city && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin className="h-3 w-3" /> {job.job_city}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
