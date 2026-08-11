import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { jobsApi } from '../services/jobsApi';
import { JobData, JobMatchScore, JobApplication } from '../types/jobs';
import { ArrowLeft, ExternalLink, Bookmark, CheckCircle2, AlertTriangle, Loader2, Sparkles, MapPin, Building, Briefcase, Clock, CalendarDays, FileText } from 'lucide-react';
import { AnimatedButton as Button } from '../components/motion';

export const JobDetails: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  
  const [job, setJob] = useState<JobData | null>(null);
  const [match, setMatch] = useState<JobMatchScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [application, setApplication] = useState<JobApplication | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [analyzing, setAnalyzing] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await jobsApi.getJobDetails(jobId);
        if (res.job && res.job.data && res.job.data.length > 0) {
          setJob(res.job.data[0]);
          setMatch(res.match);
        } else {
          setError("Job not found.");
        }
        
        // Also check if it's saved
        const savedJobs = await jobsApi.getSavedJobs();
        const saved = savedJobs.find(j => j.job_id === jobId);
        if (saved) setApplication(saved);
        
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to load job details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [jobId]);

  const handleSave = async () => {
    if (!job) return;
    setSaveLoading(true);
    try {
      if (application) {
        await jobsApi.unsaveJob(job.job_id);
        setApplication(null);
      } else {
        const newApp = await jobsApi.saveJob(job.job_id, {
          job_id: job.job_id,
          company_name: job.employer_name || "Unknown",
          job_title: job.job_title,
          location: job.job_city ? `${job.job_city}, ${job.job_country}` : undefined,
          application_url: job.job_apply_link
        });
        setApplication(newApp);
      }
    } catch (error) {
      console.error("Failed to save job:", error);
    } finally {
      setSaveLoading(false);
    }
  };
  
  const handleAnalyze = async () => {
    if (!jobId) return;
    setAnalyzing(true);
    try {
      const res = await jobsApi.analyzeJob(jobId);
      setAiAnalysis(res.analysis);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    // Navigates to a specific roadmap generator flow (placeholder for integration)
    navigate('/roadmap', { state: { fromJob: jobId, jobTitle: job?.job_title } });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-ember" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-xl font-medium text-white mb-2">Error Loading Job</h2>
        <p className="text-secondary mb-6">{error}</p>
        <Button onClick={() => navigate('/jobs')}>Back to Search</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 pb-20">
      <button 
        onClick={() => navigate('/jobs')}
        className="flex items-center gap-2 text-sm text-secondary hover:text-white transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Jobs
      </button>

      {/* Header Section */}
      <div className="rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
        <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
          <div className="flex gap-6">
             <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
                {job.employer_logo ? (
                  <img src={job.employer_logo} alt={job.employer_name} className="h-full w-full object-contain p-2" />
                ) : (
                  <Building className="h-10 w-10 text-white/50" />
                )}
              </div>
              <div>
                <h1 className="font-display text-3xl font-bold text-white mb-2">{job.job_title}</h1>
                <p className="text-xl text-secondary mb-4">{job.employer_name || 'Unknown Company'}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-secondary">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-4 w-4" />
                    {job.job_is_remote ? 'Remote' : (job.job_city ? `${job.job_city}, ${job.job_country}` : 'Location unknown')}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="h-4 w-4" />
                    {job.job_employment_type || 'Full-time'}
                  </div>
                  {job.job_posted_at_datetime_utc && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      Posted {new Date(job.job_posted_at_datetime_utc).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full md:w-auto">
            {job.job_apply_link ? (
              <a 
                href={job.job_apply_link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 h-12 px-8 rounded-xl bg-ember hover:bg-ember/90 text-white font-semibold transition-all shadow-[0_0_20px_-5px_rgba(255,107,0,0.5)]"
                onClick={() => {
                  if (application && application.status === 'Saved') {
                    jobsApi.updateApplication(application.id, { status: 'Applied' })
                      .then(setApplication);
                  }
                }}
              >
                Apply Now
                <ExternalLink className="h-4 w-4" />
              </a>
            ) : (
              <Button disabled variant="secondary" className="h-12 w-full">Application link unavailable</Button>
            )}
            
            <Button 
              variant="outline" 
              className={`h-12 w-full gap-2 ${application ? 'text-ember border-ember/50 bg-ember/10' : ''}`}
              onClick={handleSave}
              disabled={saveLoading}
            >
              {saveLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bookmark className={`h-4 w-4 ${application ? 'fill-current' : ''}`} />}
              {application ? 'Saved' : 'Save Job'}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_350px]">
        {/* Main Content */}
        <div className="space-y-8">
          
          {/* AI Analysis Section */}
          <div className="rounded-2xl border border-ember/20 bg-gradient-to-b from-ember/10 to-transparent p-1">
             <div className="rounded-xl bg-black/60 p-6 backdrop-blur-xl h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ember/20 text-ember">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h2 className="text-xl font-bold text-white">AI Job Analysis</h2>
                </div>
                
                {aiAnalysis ? (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div>
                      <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-2">What They Want</h3>
                      <p className="text-white leading-relaxed">{aiAnalysis.what_they_want}</p>
                    </div>
                    
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div>
                         <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Likely Interview Topics</h3>
                         <ul className="space-y-2">
                           {aiAnalysis.likely_interview_topics?.map((topic: string, i: number) => (
                             <li key={i} className="flex items-start gap-2 text-white">
                               <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ember shrink-0" />
                               <span className="text-sm">{topic}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                      
                      <div>
                         <h3 className="text-sm font-semibold text-secondary uppercase tracking-wider mb-3">Preparation Recommendations</h3>
                         <ul className="space-y-2">
                           {aiAnalysis.preparation_recommendations?.map((rec: string, i: number) => (
                             <li key={i} className="flex items-start gap-2 text-white">
                               <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-ember shrink-0" />
                               <span className="text-sm">{rec}</span>
                             </li>
                           ))}
                         </ul>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <p className="text-secondary mb-4">Let StudyForge AI break down this role, identify key interview topics, and recommend preparation steps.</p>
                    <Button onClick={handleAnalyze} disabled={analyzing} className="gap-2">
                      {analyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                      Analyze with AI
                    </Button>
                  </div>
                )}
             </div>
          </div>
          
          <div className="rounded-2xl border border-white/10 bg-black/40 p-8 backdrop-blur-xl">
             <h2 className="text-xl font-bold text-white mb-6">Job Description</h2>
             <div className="prose prose-invert max-w-none text-secondary">
               {job.job_description ? (
                 <div className="whitespace-pre-wrap leading-relaxed">
                    {/* Basic formatting for JSearch descriptions which are often plain text */}
                    {job.job_description}
                 </div>
               ) : (
                 <p className="italic">No description provided.</p>
               )}
             </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Match Score */}
          {match && (
            <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
              <h3 className="font-medium text-white mb-6">StudyForge Match</h3>
              
              <div className="flex items-end gap-3 mb-6">
                <span className="text-5xl font-display font-bold text-ember">
                  {match.overall_match_percentage}%
                </span>
              </div>
              
              <p className="text-sm text-secondary mb-6">{match.analysis_reasoning}</p>
              
              {match.matched_skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-green-400 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Why You Match
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {match.matched_skills.map((s, i) => (
                      <span key={i} className="rounded bg-green-500/10 text-green-400 border border-green-500/20 px-2 py-1 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {match.missing_skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-3.5 w-3.5" /> Skill Gaps
                  </h4>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {match.missing_skills.map((s, i) => (
                      <span key={i} className="rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 text-xs">
                        {s}
                      </span>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full gap-2 text-sm h-10" onClick={handleGenerateRoadmap}>
                    <CalendarDays className="h-4 w-4" />
                    Build Custom Roadmap
                  </Button>
                </div>
              )}
            </div>
          )}
          
          {/* Resume Integration Widget */}
          <div className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded bg-white/5">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <h3 className="font-medium text-white">Your Resume</h3>
            </div>
            
            <p className="text-sm text-secondary mb-4">
              Optimize your resume specifically for this job description to increase your ATS score.
            </p>
            
            <Button variant="outline" className="w-full text-sm h-10" onClick={() => navigate('/ats')}>
              Optimize Resume for this Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
