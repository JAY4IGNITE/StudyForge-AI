import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, MapPin, Loader2, AlertCircle } from 'lucide-react';
import { jobsApi } from '../services/jobsApi';
import { JobData } from '../types/jobs';
import { JobCard } from '../features/jobs/JobCard';
import { AnimatedButton as Button } from '../components/motion';
import { Input } from '../components/ui/input';

export const JobSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Default fetch on mount
  useEffect(() => {
    handleSearch('Software Engineer');
  }, []);

  const handleSearch = async (defaultQuery?: string) => {
    const searchQuery = defaultQuery || query;
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    
    // Sometimes location needs to be appended to query for JSearch
    const fullQuery = location ? `${searchQuery} in ${location}` : searchQuery;

    try {
      const response = await jobsApi.searchJobs({
        query: fullQuery,
        remote_jobs_only: remoteOnly,
        num_pages: 1
      });
      
      setJobs(response.data || []);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to search jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-12">
      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Job Search
        </h1>
        <p className="text-lg text-secondary">
          Find your next opportunity.
        </p>
      </header>

      {/* Search Controls */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
        <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Job title, skill or keyword..."
              className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-secondary focus-visible:ring-ember/50"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-secondary" />
            <Input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, state, or country..."
              className="pl-10 h-12 bg-white/5 border-white/10 text-white placeholder:text-secondary focus-visible:ring-ember/50"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <Button 
            onClick={() => handleSearch()}
            disabled={loading || !query.trim()}
            className="h-12 px-8 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.4)] transition-all hover:shadow-[0_0_25px_-5px_hsl(var(--primary)/0.6)]"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Search Jobs'}
          </Button>
        </div>
        
        <div className="mt-4 flex flex-wrap gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-secondary hover:text-white transition-colors">
            <input 
              type="checkbox" 
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded border-white/20 bg-white/5 text-ember focus:ring-ember/50 focus:ring-offset-black h-4 w-4"
            />
            Remote jobs only
          </label>
        </div>
      </div>

      {/* Results Section */}
      <div>
        {error && (
          <div className="mb-8 rounded-xl border border-red-500/20 bg-red-500/10 p-4 flex gap-3 text-red-200">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl border border-white/5 bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {jobs.map((job, idx) => (
                <JobCard key={job.job_id} job={job} index={idx} />
              ))}
            </AnimatePresence>
            
            {hasSearched && jobs.length === 0 && !error && (
              <div className="col-span-2 py-20 text-center">
                <Search className="mx-auto h-12 w-12 text-secondary mb-4 opacity-50" />
                <h3 className="text-xl font-medium text-white mb-2">No jobs found</h3>
                <p className="text-secondary max-w-sm mx-auto">
                  We couldn't find any jobs matching your criteria. Try adjusting your keywords or location.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
