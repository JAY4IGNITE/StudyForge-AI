import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, ExternalLink, MoreVertical, Trash2, Loader2, MapPin, Building } from 'lucide-react';
import { Link } from 'react-router-dom';
import { jobsApi } from '../services/jobsApi';
import { JobApplication } from '../types/jobs';
import { AnimatedButton as Button } from '../components/motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '../components/ui/dropdown-menu';
import { springTransitions } from '../lib/motion';

export const SavedJobs: React.FC = () => {
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const STATUSES = ['Saved', 'Interested', 'Applied', 'Assessment', 'Interview', 'Offer', 'Rejected', 'Withdrawn'];

  useEffect(() => {
    fetchSavedJobs();
  }, []);

  const fetchSavedJobs = async () => {
    try {
      setLoading(true);
      const data = await jobsApi.getSavedJobs();
      setApplications(data);
    } catch (err: any) {
      setError('Failed to load saved jobs.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, newStatus: string) => {
    try {
      const updatedApp = await jobsApi.updateApplication(appId, { status: newStatus });
      setApplications(prev => prev.map(app => app.id === appId ? updatedApp : app));
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleRemove = async (jobId: string, appId: string) => {
    try {
      await jobsApi.unsaveJob(jobId);
      setApplications(prev => prev.filter(app => app.id !== appId));
    } catch (err) {
      console.error('Failed to remove job', err);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Applied': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Assessment': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'Interview': return 'bg-ember/10 text-ember border-ember/20';
      case 'Offer': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-white/5 text-secondary border-white/10';
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-ember" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <header className="space-y-4">
        <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
          Application Tracker
        </h1>
        <p className="text-lg text-secondary">
          Manage your saved jobs and track your applications.
        </p>
      </header>

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
          {error}
        </div>
      )}

      {applications.length === 0 && !error ? (
        <div className="rounded-2xl border border-white/10 bg-black/40 p-12 text-center backdrop-blur-xl">
          <Bookmark className="mx-auto h-12 w-12 text-secondary mb-4 opacity-50" />
          <h2 className="text-xl font-medium text-white mb-2">No saved jobs yet</h2>
          <p className="text-secondary max-w-sm mx-auto mb-6">
            When you find interesting opportunities in the Job Search, save them here to track your progress.
          </p>
          <Link to="/jobs">
            <Button>Explore Jobs</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          <AnimatePresence>
            {applications.map((app, index) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, margin: 0, overflow: 'hidden' }}
                transition={{ ...springTransitions.stiff, delay: index * 0.05 }}
                className="flex flex-col md:flex-row md:items-center justify-between gap-6 rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-colors hover:border-white/20 hover:bg-black/60"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5">
                    <Building className="h-6 w-6 text-white/50" />
                  </div>
                  <div>
                    <Link to={`/jobs/${app.job_id}`} className="font-display text-lg font-semibold text-white hover:text-ember transition-colors">
                      {app.job_title}
                    </Link>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1 text-sm text-secondary">
                      <span className="font-medium text-white/80">{app.company_name}</span>
                      {app.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" /> {app.location}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 md:ml-auto">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className={`flex items-center justify-center h-9 px-4 rounded-lg border text-sm font-medium transition-colors ${getStatusColor(app.status)}`}>
                        {app.status}
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-[#0a0a0a] border-white/10">
                      {STATUSES.map(status => (
                        <DropdownMenuItem 
                          key={status} 
                          onClick={() => handleUpdateStatus(app.id, status)}
                          className={app.status === status ? 'bg-white/5 text-white' : 'text-secondary hover:text-white focus:bg-white/5 focus:text-white'}
                        >
                          {status}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {app.application_url && (
                    <a 
                      href={app.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-secondary hover:bg-white/10 hover:text-white transition-colors"
                      title="Open application link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-transparent text-secondary hover:bg-white/5 hover:text-white transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-40 bg-[#0a0a0a] border-white/10">
                      <DropdownMenuItem onClick={() => handleRemove(app.job_id, app.id)} className="text-red-400 focus:bg-red-500/10 focus:text-red-400 cursor-pointer">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
