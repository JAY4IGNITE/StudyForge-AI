import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../app/AuthProvider';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Target, BookOpen, AlertTriangle, ArrowRight, Code2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [overview, setOverview] = useState<any>(null);
  const [topicAnalytics, setTopicAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [resOverview, resTopics] = await Promise.all([
          apiClient.get('/analytics/overview'),
          apiClient.get('/analytics/topics'),
        ]);
        setOverview(resOverview.data);
        setTopicAnalytics(resTopics.data);
      } catch (err) {
        console.error('Error loading dashboard analytics', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="animate-pulse space-y-6">
          <div className="h-28 bg-slate-800/50 rounded-2xl"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
            <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
            <div className="h-32 bg-slate-800/50 rounded-2xl"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="p-8 bg-gradient-to-r from-indigo-900/60 to-purple-900/60 border border-indigo-500/20 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">
              Welcome back, {user?.display_name}! 👋
            </h1>
            <p className="text-indigo-200 mt-2">
              Target Role: <span className="font-semibold text-white">{user?.target_role || 'Software Engineer'}</span> | Target Mastery Goal: <span className="font-semibold text-white">85%+</span>
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/practice"
              className="px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-indigo-600/40 flex items-center gap-2"
            >
              Start Practice Session
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/coding-practice"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-600/40 flex items-center gap-2"
            >
              <Code2 className="w-5 h-5" />
              Coding Practice
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Average Accuracy</p>
                <p className="text-2xl font-bold text-slate-100">{overview?.average_score || 0}%</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Questions Completed</p>
                <p className="text-2xl font-bold text-slate-100">{overview?.total_questions_answered || 0}</p>
              </div>
            </div>
          </div>

          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">Completed Sessions</p>
                <p className="text-2xl font-bold text-slate-100">{overview?.completed_sessions || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md">
            <h2 className="text-lg font-bold text-slate-100 mb-6">Recent Accuracy & Semantic Score Trend</h2>
            <div className="h-72 w-full">
              {overview?.recent_performance?.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={overview.recent_performance}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="date" stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" />
                    <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155' }} />
                    <Area type="monotone" dataKey="score" stroke="#6366f1" fillOpacity={1} fill="url(#scoreColor)" name="Evaluation Score" />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-500">
                  No practice history recorded yet. Complete your first practice session to see performance graphs!
                </div>
              )}
            </div>
          </div>

          {/* Weak Topics Widget */}
          <div className="p-6 bg-slate-900/80 border border-slate-800 rounded-2xl backdrop-blur-md flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <h2 className="text-lg font-bold text-slate-100">Focus & Weak Topics</h2>
              </div>
              <div className="space-y-4">
                {topicAnalytics?.weak_topics?.length > 0 ? (
                  topicAnalytics.weak_topics.map((t: any) => (
                    <div key={t.topic_id} className="p-4 bg-slate-800/40 border border-slate-700/50 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-slate-200">{t.topic_name}</p>
                        <p className="text-xs text-amber-400/90 mt-0.5">Mastery: {t.mastery_score}%</p>
                      </div>
                      <span className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full font-medium">
                        {t.recommended_difficulty}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-slate-400">Great job! No critical weak topics detected yet.</p>
                )}
              </div>
            </div>
            <Link
              to="/resources"
              className="mt-6 w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-center font-medium rounded-xl transition-colors block"
            >
              Browse Topic Resources
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};
