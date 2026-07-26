import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/AuthProvider';
import { BookOpen, Award, Compass, BarChart2, User as UserIcon, LogOut, Flame, Map, MessageSquare, Code2 } from 'lucide-react';
import { FeedbackModal } from '../../features/feedback/FeedbackModal';
import { LyzrChatbot } from '../ui/LyzrChatbot';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: BarChart2 },
    { label: 'Practice Loop', path: '/practice', icon: BookOpen },
    { label: 'Mock Interview', path: '/interview', icon: Award },
    { label: 'Coding Practice', path: '/coding-practice', icon: Code2 },
    { label: 'Learning Roadmap', path: '/roadmap', icon: Map },
    { label: 'Resource Library', path: '/resources', icon: Compass },
    { label: 'Profile', path: '/profile', icon: UserIcon },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900/80 border-r border-slate-800 p-6 flex flex-col justify-between backdrop-blur-md">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
              <Flame className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              StudyForge AI
            </span>
          </div>

          <nav className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-slate-800">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-slate-800/60 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700/60 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Share Platform Feedback
          </button>

          {user && (
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-sm font-semibold text-slate-200 truncate">{user.display_name}</p>
                <p className="text-xs text-slate-500 truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <LyzrChatbot />
    </div>
  );
};
