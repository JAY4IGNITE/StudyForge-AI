import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { apiClient } from '../../lib/axios';
import { MapPin, Clock, Compass, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Roadmap: React.FC = () => {
  const [roadmap, setRoadmap] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const res = await apiClient.get('/roadmap');
        setRoadmap(res.data);
      } catch (err) {
        console.error('Failed to load personalized roadmap', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmap();
  }, []);

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">Personalized Learning Roadmap</h1>
            <p className="text-slate-400 mt-1">
              AI-curated step-by-step path optimized for <span className="text-indigo-400 font-semibold">{roadmap?.target_role || 'Software Engineering'}</span>
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" /> Adaptive Curriculum
          </div>
        </div>

        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-28 bg-slate-900/60 rounded-2xl"></div>
            <div className="h-28 bg-slate-900/60 rounded-2xl"></div>
            <div className="h-28 bg-slate-900/60 rounded-2xl"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {roadmap?.steps?.map((step: any, idx: number) => (
              <div
                key={idx}
                className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-lg hover:border-indigo-500/40 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 font-extrabold text-lg border border-indigo-500/30 shrink-0">
                    #{step.step_number}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-100">{step.topic_name}</h3>
                    <p className="text-sm text-slate-400 mt-1">{step.reason}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-400" /> Est: {step.estimated_hours} Hours
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-purple-400" /> Goal Milestone
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to="/practice"
                  className="w-full md:w-auto px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/30 flex items-center justify-center gap-2 shrink-0"
                >
                  Practice Topic <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
