import React from 'react';
import { motion } from 'motion/react';
import { Github, Users, BookOpen, Activity } from 'lucide-react';
import { springTransitions } from '../../lib/motion';

interface GitHubCardProps {
  stats: any;
}

export const GitHubCard: React.FC<GitHubCardProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTransitions.bouncy, delay: 0.2 }}
      className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
            <Github className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-white">GitHub</h3>
            <p className="text-xs text-secondary">@{stats.username}</p>
          </div>
        </div>
        {stats.totalContributionsThisYear !== undefined && (
          <div className="text-right">
            <div className="text-2xl font-bold text-white">{stats.totalContributionsThisYear}</div>
            <div className="text-xs text-secondary">Contributions (1Y)</div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-4">
          <BookOpen className="h-5 w-5 text-secondary mb-2" />
          <div className="text-lg font-bold text-white">{stats.public_repos}</div>
          <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold">Repos</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-4">
          <Users className="h-5 w-5 text-secondary mb-2" />
          <div className="text-lg font-bold text-white">{stats.followers}</div>
          <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold">Followers</div>
        </div>
        <div className="flex flex-col items-center justify-center rounded-xl border border-white/5 bg-white/5 p-4">
          <Activity className="h-5 w-5 text-secondary mb-2" />
          <div className="text-lg font-bold text-white">{stats.following}</div>
          <div className="text-[10px] uppercase tracking-wider text-secondary font-semibold">Following</div>
        </div>
      </div>
      
      {stats.html_url && (
        <a 
          href={stats.html_url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="mt-4 flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-sm font-medium text-white transition-colors"
        >
          View Profile
        </a>
      )}
    </motion.div>
  );
};
