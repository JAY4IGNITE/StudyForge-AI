import React from 'react';
import { motion } from 'motion/react';
import { JobData } from '../../types/jobs';
import { MapPin, Briefcase, Clock, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { springTransitions } from '../../lib/motion';

interface JobCardProps {
  job: JobData;
  index: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index }) => {
  const isRemote = job.job_is_remote;
  
  // Create a somewhat stable layout ID to animate between list and details if needed
  const layoutId = `job-${job.job_id}`;

  return (
    <motion.div
      layoutId={layoutId}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTransitions.bouncy, delay: index * 0.05 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl transition-all duration-300 hover:border-ember/50 hover:bg-black/60 hover:shadow-[0_0_30px_-5px_rgba(255,107,0,0.15)]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 overflow-hidden">
            {job.employer_logo ? (
              <img src={job.employer_logo} alt={job.employer_name} className="h-full w-full object-contain p-2" />
            ) : (
              <Building className="h-6 w-6 text-white/50" />
            )}
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white group-hover:text-ember transition-colors">
              {job.job_title}
            </h3>
            <p className="text-sm text-secondary font-medium">
              {job.employer_name || 'Unknown Company'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2 text-xs text-secondary">
        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 border border-white/5">
          <MapPin className="h-3.5 w-3.5" />
          {isRemote ? 'Remote' : (job.job_city ? `${job.job_city}, ${job.job_country}` : 'Location unknown')}
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 border border-white/5">
          <Briefcase className="h-3.5 w-3.5" />
          {job.job_employment_type || 'Full-time'}
        </div>
        {job.job_posted_at_datetime_utc && (
          <div className="flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1 border border-white/5">
            <Clock className="h-3.5 w-3.5" />
            {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {job.job_required_skills && job.job_required_skills.slice(0, 3).map((skill, i) => (
            <span key={i} className="rounded text-[10px] bg-ember/10 text-ember px-2 py-0.5 uppercase tracking-wider font-semibold border border-ember/20">
              {skill}
            </span>
          ))}
          {job.job_required_skills && job.job_required_skills.length > 3 && (
            <span className="rounded text-[10px] bg-white/5 text-secondary px-2 py-0.5 uppercase tracking-wider font-semibold">
              +{job.job_required_skills.length - 3}
            </span>
          )}
        </div>
        
        <Link 
          to={`/jobs/${job.job_id}`}
          className="flex items-center gap-2 text-sm font-semibold text-white transition-colors hover:text-ember"
        >
          View Job
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </motion.div>
  );
};
