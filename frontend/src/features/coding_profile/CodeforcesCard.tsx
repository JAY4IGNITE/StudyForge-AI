import React from 'react';
import { motion } from 'motion/react';
import { Target, TrendingUp, Trophy } from 'lucide-react';
import { springTransitions } from '../../lib/motion';

interface CodeforcesCardProps {
  stats: any;
}

export const CodeforcesCard: React.FC<CodeforcesCardProps> = ({ stats }) => {
  if (!stats) return null;

  // Simple rank color mapper
  const getRankColor = (rank: string) => {
    const r = rank?.toLowerCase() || '';
    if (r.includes('newbie')) return 'text-gray-400';
    if (r.includes('pupil')) return 'text-green-400';
    if (r.includes('specialist')) return 'text-cyan-400';
    if (r.includes('expert')) return 'text-blue-500';
    if (r.includes('candidate master')) return 'text-purple-500';
    if (r.includes('master')) return 'text-orange-400';
    return 'text-red-500'; // Grandmasters
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...springTransitions.bouncy, delay: 0.1 }}
      className="rounded-2xl border border-white/10 bg-black/40 p-6 backdrop-blur-xl"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10">
            <Target className="h-5 w-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-white">Codeforces</h3>
            <p className="text-xs text-secondary">@{stats.handle}</p>
          </div>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getRankColor(stats.rank)} capitalize`}>{stats.rank}</div>
          <div className="text-xs text-secondary">Current Rank</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-2">
        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium">Rating</span>
          </div>
          <div className="text-xl font-bold text-white">{stats.rating}</div>
        </div>
        <div className="rounded-xl border border-white/5 bg-white/5 p-4">
          <div className="flex items-center gap-2 text-secondary mb-1">
            <Trophy className="h-4 w-4" />
            <span className="text-xs font-medium">Max Rating</span>
          </div>
          <div className="text-xl font-bold text-white">{stats.maxRating}</div>
          <div className="text-[10px] text-secondary mt-1 capitalize truncate">{stats.maxRank}</div>
        </div>
      </div>
      
      <div className="mt-4 text-sm text-secondary flex items-center justify-between px-2">
        <span>Contests Participated:</span>
        <span className="font-bold text-white">{stats.contestCount}</span>
      </div>
    </motion.div>
  );
};
