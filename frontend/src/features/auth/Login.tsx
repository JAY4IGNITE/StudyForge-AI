import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { useAuth } from '../../app/AuthProvider';
import { Sprout, Mail, Lock, ArrowRight, Github } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiClient.post('/auth/login', { email, password });
      await login(res.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.error?.message || 'Failed to login. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#0B0F19] font-sans">
      <div className="w-full max-w-md bg-[#151923] border border-[#1E2532] p-10 rounded-2xl shadow-2xl">
        
        {/* Header / Logo */}
        <div className="text-center mb-10 flex flex-col items-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sprout className="w-8 h-8 text-[#06b6d4]" />
            <h1 className="text-3xl font-extrabold text-white tracking-tight">StudyForge-AI</h1>
          </div>
          <p className="text-sm text-slate-400 max-w-[250px]">
            Access your AI-powered learning workspace.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#0F1219] border border-[#1E2532] rounded-xl focus:ring-1 focus:ring-[#706BFF] focus:border-[#706BFF] focus:outline-none text-slate-100 placeholder-slate-600 transition-colors"
                placeholder="scholar@institute.edu"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Password
              </label>
              <Link to="/forgot-password" className="text-[11px] font-bold text-[#06b6d4] hover:text-[#06b6d4]/80 transition-colors">
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-500" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#0F1219] border border-[#1E2532] rounded-xl focus:ring-1 focus:ring-[#706BFF] focus:border-[#706BFF] focus:outline-none text-slate-100 placeholder-slate-600 transition-colors tracking-[0.2em]"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-4 bg-[#706BFF] hover:bg-[#5E59F2] text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2 tracking-wide"
          >
            {loading ? 'AUTHENTICATING...' : 'CONTINUE TO WORKSPACE'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Divider */}
        <div className="mt-8 mb-6 relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#1E2532]"></div>
          </div>
          <div className="relative bg-[#151923] px-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Or Authenticate Via
          </div>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3">
          <button
            type="button"
            className="w-full py-3 px-4 bg-[#1A1F2B] hover:bg-[#202634] border border-[#232A3B] text-slate-300 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            {/* Minimal Google G SVG */}
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            className="w-full py-3 px-4 bg-[#1A1F2B] hover:bg-[#202634] border border-[#232A3B] text-slate-300 text-sm font-medium rounded-xl transition-colors flex items-center justify-center gap-3"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </button>
        </div>

        {/* Footer Link */}
        <p className="mt-8 text-center text-xs text-slate-400">
          New researcher?{' '}
          <Link to="/register" className="text-[#706BFF] hover:text-[#5E59F2] hover:underline transition-colors">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
};
