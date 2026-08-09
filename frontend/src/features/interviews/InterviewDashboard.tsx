import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Bot, Mic, Code, FileText, Briefcase, Users, Clock, TrendingUp,
  ChevronRight, Star, BarChart3, Video, Sparkles
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const INTERVIEW_MODES = [
  { id: 'technical', label: 'Technical Interview', icon: Code, accent: 'ember' as const, desc: 'System design, algorithms & data structures' },
  { id: 'behavioral', label: 'Behavioral / HR', icon: Users, accent: 'steel' as const, desc: 'STAR method, leadership, conflict resolution' },
  { id: 'coding', label: 'Coding Interview', icon: Code, accent: 'gold' as const, desc: 'Live coding with Monaco Editor & AI review' },
  { id: 'resume', label: 'Resume-Based', icon: FileText, accent: 'ember' as const, desc: 'AI extracts skills & generates tailored questions' },
  { id: 'job_description', label: 'Job Description', icon: Briefcase, accent: 'steel' as const, desc: 'Paste JD to get role-specific mock questions' },
  { id: 'hr', label: 'HR Round', icon: Mic, accent: 'gold' as const, desc: 'Tell me about yourself, salary, availability' },
];

const accentClasses = {
  ember: 'bg-ember/15 text-ember',
  steel: 'bg-steel/15 text-steel',
  gold: 'bg-gold/15 text-gold',
};

export const InterviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/interviews/history').then((r) => setHistory(r.data.history || [])).catch(() => {});
    apiClient.get('/interviews/analytics/dashboard').then((r) => setAnalytics(r.data)).catch(() => {});
  }, []);

  return (
    <Layout>
      <div className="space-y-8">
        {/* Hero */}
        <Card className="bg-blueprint bg-forge-glow relative overflow-hidden border-ember/15 p-8 md:p-10">
          <div className="relative z-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-3 flex items-center gap-3">
                <div className="rounded-2xl border border-ember/30 bg-ember/15 p-2.5">
                  <Video className="h-6 w-6 text-ember" />
                </div>
                <Badge variant="gold" className="rounded-full font-sans">
                  NVIDIA NIM Powered
                </Badge>
              </div>
              <h1 className="font-display text-3xl font-medium text-foreground text-balance">
                AI Video Interview Studio
              </h1>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Practice with an AI interviewer powered by Llama 3.1 70B. Get real-time feedback on communication,
                technical depth, confidence, and body language.
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/interview/setup')} className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start new interview
            </Button>
          </div>
        </Card>

        {/* Modes grid */}
        <div>
          <h2 className="mb-4 font-display text-lg font-medium text-foreground">Choose interview mode</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INTERVIEW_MODES.map((mode) => {
              const Icon = mode.icon;
              return (
                <button
                  key={mode.id}
                  onClick={() => navigate(`/interview/setup?mode=${mode.id}`)}
                  className="group relative rounded-2xl border border-border bg-card p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-ember/30 hover:shadow-[0_14px_32px_-18px_hsl(var(--ember)/0.35)]"
                >
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl transition-transform group-hover:scale-110 ${accentClasses[mode.accent]}`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mb-1 text-sm font-semibold text-foreground">{mode.label}</h3>
                  <p className="text-xs leading-relaxed text-muted-foreground">{mode.desc}</p>
                  <ChevronRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground transition-colors group-hover:text-ember" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Stats */}
        {analytics && (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {[
              { label: 'Overall score', value: `${analytics.overall_average}%`, icon: Star, color: 'text-gold' },
              { label: 'Sessions', value: history.length, icon: Video, color: 'text-ember' },
              { label: 'Confidence', value: `${analytics.radar_scores?.confidence || 88}%`, icon: TrendingUp, color: 'text-gold' },
              { label: 'Communication', value: `${analytics.radar_scores?.communication || 85}%`, icon: BarChart3, color: 'text-steel' },
            ].map((stat, i) => (
              <Card key={i} className="flex items-center gap-3 p-4">
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                <div>
                  <p className="font-mono text-xs text-muted-foreground">{stat.label}</p>
                  <p className="font-mono text-lg font-semibold text-foreground">{stat.value}</p>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Recent sessions */}
        {history.length > 0 && (
          <div>
            <h2 className="mb-4 font-display text-lg font-medium text-foreground">Recent sessions</h2>
            <div className="space-y-3">
              {history.slice(0, 5).map((s: any, idx: number) => (
                <button
                  key={s._id || idx}
                  onClick={() => navigate(`/interview/report/${s._id || s.id}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-border bg-card p-4 transition-colors hover:border-ember/30"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                      <Bot className="h-5 w-5 text-ember" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-foreground">{s.target_role || 'Interview'}</p>
                      <p className="text-xs text-muted-foreground">
                        {s.mode} • {s.turns?.length || 0} turns • {s.status}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={s.status === 'completed' ? 'gold' : 'secondary'}
                      className="rounded-full font-sans"
                    >
                      {s.status}
                    </Badge>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
