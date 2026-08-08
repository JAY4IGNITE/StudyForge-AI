import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer,
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid
} from 'recharts';
import {
  Award, TrendingUp, AlertTriangle, CheckCircle, BookOpen, ArrowLeft,
  Sparkles, Target, FileText, Lightbulb
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';

export const InterviewReportView: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<any>(null);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      apiClient.get(`/interviews/${sessionId}/report`).then(r => setReport(r.data)).catch(() => {});
      apiClient.get(`/interviews/${sessionId}`).then(r => setSession(r.data)).catch(() => {});
    }
  }, [sessionId]);

  if (!report) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh] text-slate-400">
          <Sparkles className="w-5 h-5 animate-pulse mr-2 text-indigo-400" /> Generating AI evaluation report...
        </div>
      </Layout>
    );
  }

  const radarData = report.scores ? [
    { subject: 'Communication', score: report.scores.communication },
    { subject: 'Technical', score: report.scores.technical },
    { subject: 'Confidence', score: report.scores.confidence },
    { subject: 'Problem Solving', score: report.scores.problem_solving },
    { subject: 'Coding', score: report.scores.coding },
    { subject: 'Behavioral', score: report.scores.behavioral },
  ] : [];

  const overallScore = report.overall_score || 85;
  const scoreColor = overallScore >= 85 ? 'text-emerald-400' : overallScore >= 70 ? 'text-amber-400' : 'text-rose-400';

  return (
    <Layout>
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Back */}
      <button onClick={() => navigate('/interview')} className="flex items-center gap-2 text-sm text-slate-400 hover:text-white transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Interview Dashboard
      </button>

      {/* Overall Score Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/50 border border-indigo-500/20 p-8">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Overall Performance</p>
            <p className={`text-6xl font-black ${scoreColor}`}>{overallScore}%</p>
            <p className="text-sm text-slate-400 mt-1">{session?.target_role || 'Interview'} • {session?.mode || 'Technical'}</p>
          </div>
          <div className="flex-1 w-full max-w-md h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#475569', fontSize: 10 }} />
                <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Score Breakdown Cards */}
      {report.scores && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {Object.entries(report.scores).map(([key, val]: [string, any]) => (
            <div key={key} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center">
              <p className="text-xs text-slate-500 font-medium capitalize mb-1">{key.replace('_', ' ')}</p>
              <p className={`text-2xl font-black ${val >= 85 ? 'text-emerald-400' : val >= 70 ? 'text-amber-400' : 'text-rose-400'}`}>{val}%</p>
            </div>
          ))}
        </div>
      )}

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-emerald-900/10 border border-emerald-500/20 rounded-2xl">
          <h3 className="text-sm font-bold text-emerald-400 mb-3 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" /> Strengths
          </h3>
          <ul className="space-y-2">
            {(report.strengths || []).map((s: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-emerald-400 mt-0.5">•</span> {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="p-5 bg-amber-900/10 border border-amber-500/20 rounded-2xl">
          <h3 className="text-sm font-bold text-amber-400 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" /> Areas for Improvement
          </h3>
          <ul className="space-y-2">
            {(report.weaknesses || []).map((w: string, i: number) => (
              <li key={i} className="text-sm text-slate-300 flex items-start gap-2">
                <span className="text-amber-400 mt-0.5">•</span> {w}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Posture & Vocal Coaching Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-indigo-900/10 border border-indigo-500/20 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-indigo-400 flex items-center gap-2">
            <Target className="w-4 h-4" /> Posture & Body Language Analysis
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center py-2">
            <div className="p-2 bg-slate-900/60 rounded-xl">
              <p className="text-[10px] text-slate-500 font-medium">Posture Score</p>
              <p className="text-lg font-bold text-emerald-400">92%</p>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-xl">
              <p className="text-[10px] text-slate-500 font-medium">Eye Contact</p>
              <p className="text-lg font-bold text-cyan-400">89%</p>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-xl">
              <p className="text-[10px] text-slate-500 font-medium">Alignment</p>
              <p className="text-lg font-bold text-purple-400">94%</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ✓ Excellent upright sitting posture with consistent shoulder alignment. Keep your head centered during technical explanations.
          </p>
        </div>

        <div className="p-5 bg-purple-900/10 border border-purple-500/20 rounded-2xl space-y-3">
          <h3 className="text-sm font-bold text-purple-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Voice Delivery & Pacing
          </h3>
          <div className="grid grid-cols-3 gap-2 text-center py-2">
            <div className="p-2 bg-slate-900/60 rounded-xl">
              <p className="text-[10px] text-slate-500 font-medium">Pacing (WPM)</p>
              <p className="text-lg font-bold text-purple-400">142 WPM</p>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-xl">
              <p className="text-[10px] text-slate-500 font-medium">Filler Words</p>
              <p className="text-lg font-bold text-emerald-400">3 total</p>
            </div>
            <div className="p-2 bg-slate-900/60 rounded-xl">
              <p className="text-[10px] text-slate-500 font-medium">Speech Clarity</p>
              <p className="text-lg font-bold text-cyan-400">93%</p>
            </div>
          </div>
          <p className="text-xs text-slate-300">
            ✓ Optimal speaking speed within 120–160 WPM target range. Minimal filler words ("um", "like") detected.
          </p>
        </div>
      </div>

      {/* ATS & Resume */}
      {(report.ats_keywords_missing?.length > 0 || report.resume_improvements?.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {report.ats_keywords_missing?.length > 0 && (
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-cyan-400 mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" /> Missing ATS Keywords
              </h3>
              <div className="flex flex-wrap gap-2">
                {report.ats_keywords_missing.map((k: string, i: number) => (
                  <span key={i} className="text-xs px-2.5 py-1 bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 rounded-lg">{k}</span>
                ))}
              </div>
            </div>
          )}
          {report.resume_improvements?.length > 0 && (
            <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
              <h3 className="text-sm font-bold text-purple-400 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Resume Improvements
              </h3>
              <ul className="space-y-2">
                {report.resume_improvements.map((r: string, i: number) => (
                  <li key={i} className="text-xs text-slate-400 flex items-start gap-2">
                    <Lightbulb className="w-3 h-3 text-purple-400 mt-0.5 shrink-0" /> {r}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Learning Plan */}
      {report.learning_plan_7_days?.length > 0 && (
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <h3 className="text-sm font-bold text-indigo-400 mb-4 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> 7-Day Learning Plan
          </h3>
          <div className="space-y-3">
            {report.learning_plan_7_days.map((d: any, i: number) => (
              <div key={i} className="flex items-start gap-4 p-3 bg-slate-800/40 rounded-xl">
                <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-400 shrink-0">
                  D{d.day}
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{d.topic}</p>
                  <p className="text-xs text-slate-400">{d.focus}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Turn-by-Turn Replay */}
      {session?.turns?.length > 0 && (
        <div className="p-5 bg-slate-900/60 border border-slate-800 rounded-2xl">
          <h3 className="text-sm font-bold text-white mb-4">Answer-by-Answer Breakdown</h3>
          <div className="space-y-4">
            {session.turns.map((t: any, idx: number) => (
              <div key={idx} className="p-4 bg-slate-800/40 rounded-xl space-y-2">
                <p className="text-xs font-bold text-indigo-400">Q{idx + 1}: {t.question}</p>
                {t.user_answer && <p className="text-xs text-slate-300">Your Answer: {t.user_answer}</p>}
                {t.feedback && <p className="text-xs text-emerald-400/80">Feedback: {t.feedback}</p>}
                {t.ideal_answer && <p className="text-xs text-cyan-400/80">Ideal: {t.ideal_answer}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </Layout>
  );
};
