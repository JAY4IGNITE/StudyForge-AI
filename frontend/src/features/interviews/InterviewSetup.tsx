import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Code, Users, FileText, Briefcase, Mic, Upload, ArrowRight, Sparkles, AlertCircle, CheckCircle2
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { cn } from '../../lib/utils';

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
        headers: { 'Content-Type': 'multipart/form-data' },
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
    <Layout>
      <div className="mx-auto max-w-2xl space-y-8">
        <div>
          <h1 className="font-display text-2xl font-medium text-foreground">Setup interview</h1>
          <p className="text-sm text-secondary">Configure your AI mock interview session</p>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Mode selection */}
        <div>
          <Label className="mb-3 block text-sm font-semibold text-foreground">Interview mode</Label>
          <div className="grid grid-cols-3 gap-3">
            {MODES.map((m) => {
              const Icon = m.icon;
              const isActive = mode === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setMode(m.id)}
                  className={cn(
                    'rounded-xl border p-3 text-left transition-all',
                    isActive
                      ? 'border-ember/40 bg-ember/10 text-ember'
                      : 'border-border bg-card text-secondary hover:border-ember/20'
                  )}
                >
                  <Icon className="mb-1.5 h-4 w-4" />
                  <p className="text-xs font-semibold">{m.label}</p>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <Label htmlFor="role" className="mb-2 block text-sm font-semibold text-foreground">
            Target role
          </Label>
          <Input
            id="role"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            placeholder="e.g. Senior Backend Engineer"
            className="h-12"
          />
        </div>

        <div>
          <Label htmlFor="company" className="mb-2 block text-sm font-semibold text-foreground">
            Target company (optional)
          </Label>
          <Input
            id="company"
            value={targetCompany}
            onChange={(e) => setTargetCompany(e.target.value)}
            placeholder="e.g. Google, Meta, Amazon"
            className="h-12"
          />
        </div>

        {mode === 'resume' && (
          <div>
            <Label className="mb-2 block text-sm font-semibold text-foreground">Upload resume</Label>
            <div className="rounded-xl border border-dashed border-border bg-secondary/20 p-4">
              <input
                type="file"
                accept=".pdf,.txt,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="text-sm text-secondary file:mr-3 file:rounded-md file:border-0 file:bg-secondary file:px-3 file:py-1.5 file:text-foreground"
              />
              {resumeFile && !resumeId && (
                <Button
                  size="sm"
                  onClick={handleResumeUpload}
                  disabled={uploadingResume}
                  className="mt-3 gap-1.5"
                >
                  <Upload className="h-3.5 w-3.5" />
                  {uploadingResume ? 'Parsing...' : 'Parse resume with AI'}
                </Button>
              )}
              {resumeId && (
                <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-gold">
                  <CheckCircle2 className="h-3.5 w-3.5" /> Resume parsed successfully
                </p>
              )}
            </div>
          </div>
        )}

        {mode === 'job_description' && (
          <div>
            <Label className="mb-2 block text-sm font-semibold text-foreground">Paste job description</Label>
            <Textarea
              rows={6}
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Paste the full job description here..."
              className="resize-none"
            />
          </div>
        )}

        <Button
          onClick={handleStartInterview}
          disabled={loading || (mode === 'resume' && !resumeId)}
          className="h-14 w-full gap-3"
        >
          <Sparkles className="h-5 w-5" />
          {loading ? 'Initializing AI interviewer...' : 'Begin interview session'}
          <ArrowRight className="h-5 w-5" />
        </Button>
      </div>
    </Layout>
  );
};
