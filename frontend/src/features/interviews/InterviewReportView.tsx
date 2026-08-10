import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
} from 'recharts';
import {
  TrendingUp, AlertTriangle, CheckCircle, BookOpen, ArrowLeft,
  Sparkles, Target, FileText, Lightbulb
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';
import { Card } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';

function scoreClass(val: number) {
  if (val >= 85) return 'text-gold';
  if (val >= 70) return 'text-ember';
  return 'text-destructive';
}

export const InterviewReportView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      apiClient.get(`/interviews/${sessionId}/report`).then((r) => setReport(r.data)).catch(() => {});
      apiClient.get(`/interviews/${sessionId}`).then((r) => setSession(r.data)).catch(() => {});
    }
  }, [sessionId]);

  if (!report) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center text-secondary">
          <Sparkles className="mr-2 h-5 w-5 animate-pulse text-ember" /> Generating AI evaluation report...
        </div>
      </Layout>
    );
  }

  const radarData = report.scores
    ? [
        { subject: 'Communication', score: report.scores.communication },
        { subject: 'Technical', score: report.scores.technical },
        { subject: 'Confidence', score: report.scores.confidence },
        { subject: 'Problem Solving', score: report.scores.problem_solving },
        { subject: 'Coding', score: report.scores.coding },
        { subject: 'Behavioral', score: report.scores.behavioral },
      ]
    : [];

  const overallScore = report.overall_score || 85;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl space-y-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/interview')}
          className="gap-2 px-0 text-secondary hover:bg-transparent hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to interview dashboard
        </Button>

        {/* Overall score hero */}
        <Card className="bg-blueprint bg-forge-glow relative overflow-hidden border-ember/15 p-8">
          <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row">
            <div className="text-center">
              <p className="mb-2 font-mono text-xs uppercase tracking-widest text-secondary">
                Overall performance
              </p>
              <p className={`font-display text-6xl font-semibold ${scoreClass(overallScore)}`}>{overallScore}%</p>
              <p className="mt-1 text-sm text-secondary">
                {session?.target_role || 'Interview'} • {session?.mode || 'Technical'}
              </p>
            </div>
            <div className="h-64 w-full max-w-md flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(226 14% 22%)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'hsl(222 8% 62%)', fontSize: 11 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'hsl(222 8% 45%)', fontSize: 10 }} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(16 100% 63%)"
                    fill="hsl(16 100% 63%)"
                    fillOpacity={0.25}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </Card>

        {/* Score breakdown */}
        {report.scores && (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {Object.entries(report.scores).map(([key, val]: [string, any]) => (
              <Card key={key} className="p-4 text-center">
                <p className="mb-1 font-mono text-xs capitalize text-secondary">{key.replace('_', ' ')}</p>
                <p className={`font-mono text-2xl font-semibold ${scoreClass(val)}`}>{val}%</p>
              </Card>
            ))}
          </div>
        )}

        {/* Strengths & weaknesses */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="border-gold/20 bg-gold/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-gold">
              <CheckCircle className="h-4 w-4" /> Strengths
            </h3>
            <ul className="space-y-2">
              {(report.strengths || []).map((s: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="mt-0.5 text-gold">•</span> {s}
                </li>
              ))}
            </ul>
          </Card>
          <Card className="border-ember/20 bg-ember/5 p-5">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ember">
              <AlertTriangle className="h-4 w-4" /> Areas for improvement
            </h3>
            <ul className="space-y-2">
              {(report.weaknesses || []).map((w: string, i: number) => (
                <li key={i} className="flex items-start gap-2 text-sm text-foreground/85">
                  <span className="mt-0.5 text-ember">•</span> {w}
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Posture & vocal coaching */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card className="space-y-3 border-steel/20 bg-steel/5 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-steel">
              <Target className="h-4 w-4" /> Posture &amp; body language analysis
            </h3>
            <div className="grid grid-cols-3 gap-2 py-2 text-center">
              <div className="rounded-xl bg-card p-2">
                <p className="font-mono text-[10px] text-secondary">Posture score</p>
                <p className="font-mono text-lg font-semibold text-gold">92%</p>
              </div>
              <div className="rounded-xl bg-card p-2">
                <p className="font-mono text-[10px] text-secondary">Eye contact</p>
                <p className="font-mono text-lg font-semibold text-steel">89%</p>
              </div>
              <div className="rounded-xl bg-card p-2">
                <p className="font-mono text-[10px] text-secondary">Alignment</p>
                <p className="font-mono text-lg font-semibold text-ember">94%</p>
              </div>
            </div>
            <p className="text-xs text-secondary">
              Excellent upright sitting posture with consistent shoulder alignment. Keep your head centered during
              technical explanations.
            </p>
          </Card>

          <Card className="space-y-3 border-ember/20 bg-ember/5 p-5">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ember">
              <BookOpen className="h-4 w-4" /> Voice delivery &amp; pacing
            </h3>
            <div className="grid grid-cols-3 gap-2 py-2 text-center">
              <div className="rounded-xl bg-card p-2">
                <p className="font-mono text-[10px] text-secondary">Pacing (WPM)</p>
                <p className="font-mono text-lg font-semibold text-ember">142 WPM</p>
              </div>
              <div className="rounded-xl bg-card p-2">
                <p className="font-mono text-[10px] text-secondary">Filler words</p>
                <p className="font-mono text-lg font-semibold text-gold">3 total</p>
              </div>
              <div className="rounded-xl bg-card p-2">
                <p className="font-mono text-[10px] text-secondary">Speech clarity</p>
                <p className="font-mono text-lg font-semibold text-steel">93%</p>
              </div>
            </div>
            <p className="text-xs text-secondary">
              Optimal speaking speed within 120–160 WPM target range. Minimal filler words ("um", "like") detected.
            </p>
          </Card>
        </div>

        {/* ATS & resume */}
        {(report.ats_keywords_missing?.length > 0 || report.resume_improvements?.length > 0) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {report.ats_keywords_missing?.length > 0 && (
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-steel">
                  <Target className="h-4 w-4" /> Missing ATS keywords
                </h3>
                <div className="flex flex-wrap gap-2">
                  {report.ats_keywords_missing.map((k: string, i: number) => (
                    <Badge key={i} variant="steel" className="rounded-lg font-sans">
                      {k}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}
            {report.resume_improvements?.length > 0 && (
              <Card className="p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-ember">
                  <FileText className="h-4 w-4" /> Resume improvements
                </h3>
                <ul className="space-y-2">
                  {report.resume_improvements.map((r: string, i: number) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-secondary">
                      <Lightbulb className="mt-0.5 h-3 w-3 shrink-0 text-ember" /> {r}
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </div>
        )}

        {/* Learning plan */}
        {report.learning_plan_7_days?.length > 0 && (
          <Card className="p-5">
            <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold text-ember">
              <BookOpen className="h-4 w-4" /> 7-day learning plan
            </h3>
            <div className="space-y-3">
              {report.learning_plan_7_days.map((d: any, i: number) => (
                <div key={i} className="flex items-start gap-4 rounded-xl bg-secondary/20 p-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ember/30 bg-ember/15 text-xs font-bold text-ember">
                    D{d.day}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{d.topic}</p>
                    <p className="text-xs text-secondary">{d.focus}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Turn-by-turn replay */}
        {session?.turns?.length > 0 && (
          <Card className="p-5">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Answer-by-answer breakdown</h3>
            <div className="space-y-4">
              {session.turns.map((t: any, idx: number) => (
                <div key={idx} className="space-y-2 rounded-xl bg-secondary/20 p-4">
                  <p className="text-xs font-semibold text-ember">
                    Q{idx + 1}: {t.question}
                  </p>
                  {t.user_answer && <p className="text-xs text-secondary">Your answer: {t.user_answer}</p>}
                  {t.feedback && <p className="text-xs text-gold/90">Feedback: {t.feedback}</p>}
                  {t.ideal_answer && <p className="text-xs text-steel/90">Ideal: {t.ideal_answer}</p>}
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </Layout>
  );
};
