import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Bot, Mic, Code, FileText, Briefcase, Users, Clock, TrendingUp,
  ChevronRight, Star, BarChart3, Video, Sparkles
} from 'lucide-react';
import { Layout } from '../../components/layout/Layout';

const INTERVIEW_MODES = [
  { id: 'technical', label: 'Technical Interview', icon: Code, color: 'from-indigo-600 to-blue-600', desc: 'System design, algorithms & data structures' },
  { id: 'behavioral', label: 'Behavioral / HR', icon: Users, color: 'from-purple-600 to-pink-600', desc: 'STAR method, leadership, conflict resolution' },
  { id: 'coding', label: 'Coding Interview', icon: Code, color: 'from-emerald-600 to-cyan-600', desc: 'Live coding with Monaco Editor & AI review' },
  { id: 'resume', label: 'Resume-Based', icon: FileText, color: 'from-amber-600 to-orange-600', desc: 'AI extracts skills & generates tailored questions' },
  { id: 'job_description', label: 'Job Description', icon: Briefcase, color: 'from-rose-600 to-red-600', desc: 'Paste JD to get role-specific mock questions' },
  { id: 'hr', label: 'HR Round', icon: Mic, color: 'from-teal-600 to-green-600', desc: 'Tell me about yourself, salary, availability' },
];

export const InterviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    apiClient.get('/interviews/history').then(r => setHistory(r.data.history || [])).catch(() => {});
    apiClient.get('/interviews/analytics/dashboard').then(r => setAnalytics(r.data)).catch(() => {});
  }, []);

  return (
    <Layout>
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900/50 via-slate-900 to-purple-900/50 border border-indigo-500/20 p-8 md:p-10">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl">
                <Video className="w-6 h-6 text-indigo-400" />
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                NVIDIA NIM Powered
              </span>
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">AI Video Interview Studio</h1>
            <p className="text-slate-400 max-w-lg">
              Practice with an AI interviewer powered by Llama 3.1 70B. Get real-time feedback on communication, technical depth, confidence, and body language.
            </p>
          </div>
          <button
            onClick={() => navigate('/interview/setup')}
            className="flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/30 transition-all transform hover:scale-105"
          >
            <Sparkles className="w-5 h-5" />
            Start New Interview
          </button>
        </div>
      </div>

      {/* Interview Modes Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4">Choose Interview Mode</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {INTERVIEW_MODES.map((mode) => {
            const Icon = mode.icon;
            return (
              <button
                key={mode.id}
                onClick={() => navigate(`/interview/setup?mode=${mode.id}`)}
                className="group relative p-5 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 rounded-2xl text-left transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${mode.color} flex items-center justify-center mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-white text-sm mb-1">{mode.label}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{mode.desc}</p>
                <ChevronRight className="absolute top-5 right-5 w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
              </button>
            );
          })}
        </div>
      </div>

      {/* Stats Row */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Overall Score', value: `${analytics.overall_average}%`, icon: Star, color: 'text-amber-400' },
            { label: 'Sessions', value: history.length, icon: Video, color: 'text-indigo-400' },
            { label: 'Confidence', value: `${analytics.radar_scores?.confidence || 88}%`, icon: TrendingUp, color: 'text-emerald-400' },
            { label: 'Communication', value: `${analytics.radar_scores?.communication || 85}%`, icon: BarChart3, color: 'text-cyan-400' },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl flex items-center gap-3">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <div>
                <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                <p className="text-lg font-bold text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recent History */}
      {history.length > 0 && (
        <div>
          <h2 className="text-lg font-bold text-white mb-4">Recent Sessions</h2>
          <div className="space-y-3">
            {history.slice(0, 5).map((s: any, idx: number) => (
              <button
                key={s._id || idx}
                onClick={() => navigate(`/interview/report/${s._id || s.id}`)}
                className="w-full p-4 bg-slate-900/60 border border-slate-800 hover:border-indigo-500/30 rounded-2xl flex items-center justify-between transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center">
                    <Bot className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold text-white">{s.target_role || 'Interview'}</p>
                    <p className="text-xs text-slate-500">{s.mode} • {s.turns?.length || 0} turns • {s.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${s.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                    {s.status}
                  </span>
                  <Clock className="w-4 h-4 text-slate-600" />
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
