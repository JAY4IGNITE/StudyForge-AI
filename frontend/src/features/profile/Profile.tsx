import React, { useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { useAuth } from '../../app/AuthProvider';
import { apiClient } from '../../lib/axios';
import { User, Target, Save, CheckCircle2 } from 'lucide-react';

export const Profile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || 'Software Engineer');
  const [difficultyPref, setDifficultyPref] = useState(user?.preferences?.difficulty_preference || 'medium');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      await apiClient.patch('/me', {
        display_name: displayName,
        target_role: targetRole,
        difficulty_preference: difficultyPref,
      });
      await refreshUser();
      setMessage('Profile updated successfully!');
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100">User Profile & Goals</h1>
          <p className="text-slate-400 mt-1">Manage target roles, goals, and practice preferences</p>
        </div>

        {message && (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            {message}
          </div>
        )}

        <form onSubmit={handleSave} className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Email Address</label>
            <input
              type="text"
              disabled
              value={user?.email || ''}
              className="w-full px-4 py-3 bg-slate-800/30 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Display Name</label>
            <input
              type="text"
              required
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Role</label>
            <input
              type="text"
              required
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100"
              placeholder="e.g., Senior Full-Stack Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">Preferred Starting Difficulty</label>
            <select
              value={difficultyPref}
              onChange={(e) => setDifficultyPref(e.target.value)}
              className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 text-slate-100"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </Layout>
  );
};
