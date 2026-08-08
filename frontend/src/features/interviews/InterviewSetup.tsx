import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Code, Users, FileText, Briefcase, Mic, Upload, ArrowRight, Sparkles, AlertCircle
} from 'lucide-react';

const MODES = [
  { id: 'technical', label: 'Technical', icon: Code },
  { id: 'behavioral', label: 'Behavioral', icon: Users },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'hr', label: 'HR Round', icon: Mic },
  { id: 'resume', label: 'Resume-Based', icon: FileText },
  { id: 'job_description', label: 'Job Description', icon: Briefcase },
];

export const InterviewSetup: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState(searchParams.get('mode') || 'technical');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [targetCompany, setTargetCompany] = useState('');
  const [jdText, setJdText] = useState('');
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploadingResume, setUploadingResume] = useState(false);
  const [error, setError] = useState('');

  const handleResumeUpload = async () => {
    if (!resumeFile) return;
    setUploadingResume(true);
    try {
      const formData = new FormData();
      formData.append('file', resumeFile);
      const res = await apiClient.post('/interviews/parse-resume', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResumeId(res.data.resume_id);
    } catch {
      setError('Failed to parse resume. Please try a different file.');
    } finally {
      setUploadingResume(false);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/interviews/setup', {
        mode,
        target_role: targetRole,
        target_company: targetCompany || undefined,
        job_description_text: jdText || undefined,
        resume_id: resumeId || undefined,
      });
      const sessionId = res.data.session_id;
      if (mode === 'coding') {
        navigate(`/interview/coding/${sessionId}`);
      } else {
        navigate(`/interview/room/${sessionId}`);
      }
    } catch {
      setError('Failed to initialize interview session.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Setup Interview</h1>
        <p className="text-slate-400 text-sm">Configure your AI mock interview session</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Mode Selection */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-3">Interview Mode</label>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => {
            const Icon = m.icon;
            return (
              <button
                key={m.id}
                onClick={() => setMode(m.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  mode === m.id
                    ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Icon className="w-4 h-4 mb-1.5" />
                <p className="text-xs font-bold">{m.label}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Target Role */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Target Role</label>
        <input
          type="text"
          value={targetRole}
          onChange={(e) => setTargetRole(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500/50 text-sm"
          placeholder="e.g. Senior Backend Engineer"
        />
      </div>

      {/* Target Company */}
      <div>
        <label className="block text-sm font-semibold text-slate-300 mb-2">Target Company (optional)</label>
        <input
          type="text"
          value={targetCompany}
          onChange={(e) => setTargetCompany(e.target.value)}
          className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500/50 text-sm"
          placeholder="e.g. Google, Meta, Amazon"
        />
      </div>

      {/* Resume Upload (Resume Mode) */}
      {mode === 'resume' && (
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Upload Resume</label>
          <div className="p-4 bg-slate-900/60 border border-dashed border-slate-700 rounded-xl">
            <input
              type="file"
              accept=".pdf,.txt,.docx"
              onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
              className="text-sm text-slate-400"
            />
            {resumeFile && !resumeId && (
              <button
                onClick={handleResumeUpload}
                disabled={uploadingResume}
                className="mt-3 flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                {uploadingResume ? 'Parsing...' : 'Parse Resume with AI'}
              </button>
            )}
            {resumeId && (
              <p className="mt-2 text-xs text-emerald-400 font-semibold">✓ Resume parsed successfully</p>
            )}
          </div>
        </div>
      )}

      {/* Job Description (JD Mode) */}
      {mode === 'job_description' && (
        <div>
          <label className="block text-sm font-semibold text-slate-300 mb-2">Paste Job Description</label>
          <textarea
            rows={6}
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            className="w-full px-4 py-3 bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-indigo-500/50 text-sm resize-none"
            placeholder="Paste the full job description here..."
          />
        </div>
      )}

      {/* Start Button */}
      <button
        onClick={handleStartInterview}
        disabled={loading || (mode === 'resume' && !resumeId)}
        className="w-full flex items-center justify-center gap-3 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100"
      >
        <Sparkles className="w-5 h-5" />
        {loading ? 'Initializing AI Interviewer...' : 'Begin Interview Session'}
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
