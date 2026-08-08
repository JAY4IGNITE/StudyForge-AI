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
    <div className="min-h-screen flex flex-col md:flex-row bg-surface text-on-surface">
      {/* Sidebar */}
      <aside className="w-full md:w-64 md:fixed md:left-0 md:top-0 md:h-screen bg-gradient-to-b from-surface to-surface-container-low border-r border-outline-variant p-6 flex flex-col justify-between backdrop-blur-md z-50 overflow-y-auto">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-primary-container rounded-xl shadow-lg">
              <Flame className="w-6 h-6 text-on-primary-container" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
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
                      ? 'bg-primary-container/20 text-primary border border-primary/30 shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="space-y-4 pt-6 border-t border-outline-variant">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="w-full flex items-center gap-2 px-4 py-2.5 bg-surface-container-high hover:bg-surface-container-highest text-on-surface-variant rounded-xl text-xs font-semibold border border-outline-variant transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-primary" /> Share Platform Feedback
          </button>

          {user && (
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-sm font-semibold text-on-surface truncate">{user.display_name}</p>
                <p className="text-xs text-on-surface-variant truncate">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/20 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 md:ml-64 p-6 md:p-10 overflow-y-auto max-w-7xl mx-auto w-full">
        {children}
      </main>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      <LyzrChatbot />
    </div>
  );
};
