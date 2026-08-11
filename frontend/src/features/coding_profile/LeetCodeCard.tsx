import React from 'react';
import { motion } from 'motion/react';
import { Code, Trophy, Star } from 'lucide-react';
import { springTransitions } from '../../lib/motion';

interface LeetCodeCardProps {
  stats: any;
}

export const LeetCodeCard: React.FC<LeetCodeCardProps> = ({ stats }) => {
  if (!stats) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springTransitions.bouncy}
      className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
            <Code className="h-5 w-5 text-amber-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">LeetCode</h3>
            <p className="text-xs text-secondary">@{stats.username}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-white">{stats.solved?.all || 0}</div>
          <div className="text-xs text-secondary">Total Solved</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-xl bg-green-500/5 border border-green-500/10">
          <div className="text-lg font-bold text-green-400">{stats.solved?.easy || 0}</div>
          <div className="text-[10px] uppercase tracking-wider text-green-500/70 font-semibold">Easy</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-yellow-500/5 border border-yellow-500/10">
          <div className="text-lg font-bold text-yellow-400">{stats.solved?.medium || 0}</div>
          <div className="text-[10px] uppercase tracking-wider text-yellow-500/70 font-semibold">Medium</div>
        </div>
        <div className="text-center p-3 rounded-xl bg-red-500/5 border border-red-500/10">
          <div className="text-lg font-bold text-red-400">{stats.solved?.hard || 0}</div>
          <div className="text-[10px] uppercase tracking-wider text-red-500/70 font-semibold">Hard</div>
        </div>
      </div>

      <div className="flex gap-4">
        {stats.contest?.rating && (
          <div className="flex items-center gap-2">
            <Trophy className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-secondary">Rating: <strong className="text-white">{Math.round(stats.contest.rating)}</strong></span>
          </div>
        )}
        {stats.ranking && (
          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 text-blue-400" />
            <span className="text-sm text-secondary">Rank: <strong className="text-white">{stats.ranking.toLocaleString()}</strong></span>
          </div>
        )}
      </div>
    </motion.div>
  );
};
