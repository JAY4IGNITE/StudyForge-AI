import React, { useState, useMemo } from 'react';
import { Problem, ProblemSubmission } from '../types';
import { Search, Code2, Tag, CheckCircle2, ChevronRight, Circle, MinusCircle } from 'lucide-react';

const SUBMISSIONS_KEY = 'studyforge_leetcode_submissions';

type SolvedStatus = 'solved' | 'attempted' | 'unsolved';

function getSolvedStatus(problemId: string, submissions: ProblemSubmission[]): SolvedStatus {
  const problemSubs = submissions.filter(s => s.problemId === problemId);
  if (problemSubs.length === 0) return 'unsolved';
  if (problemSubs.some(s => s.status === 'Accepted')) return 'solved';
  return 'attempted';
}

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  selectedProblemId?: string;
}

export const ProblemList: React.FC<ProblemListProps> = ({
  problems,
  onSelectProblem,
  selectedProblemId
}) => {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Attempted' | 'Unsolved'>('All');

  const submissions: ProblemSubmission[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    } catch {
      return [];
    }
  }, [selectedProblemId]); // Re-read when selection changes (after potential submission)

  const filtered = problems.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                          p.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;

    if (!matchesSearch || !matchesDiff) return false;

    if (statusFilter === 'All') return true;
    const status = getSolvedStatus(p.id, submissions);
    if (statusFilter === 'Solved') return status === 'solved';
    if (statusFilter === 'Attempted') return status === 'attempted';
    if (statusFilter === 'Unsolved') return status === 'unsolved';
    return true;
  });

  const solvedCount = problems.filter(p => getSolvedStatus(p.id, submissions) === 'solved').length;

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border-r border-slate-800">
      {/* Search & Filter Header */}
      <div className="p-4 border-b border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-400" />
            <h2 className="font-bold text-white text-base">Problem Bank</h2>
          </div>
          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
            {solvedCount}/{problems.length}
          </span>
        </div>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems or tags..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                difficultyFilter === diff
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {diff}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Solved', 'Attempted', 'Unsolved'] as const).map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-0.5 rounded-md text-[10px] font-semibold transition-colors ${
                statusFilter === st
                  ? 'bg-slate-700 text-white'
                  : 'text-slate-500 hover:text-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* List Feed */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
        {filtered.map(p => {
          const isSelected = p.id === selectedProblemId;
          const diffColor = p.difficulty === 'Easy' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                            p.difficulty === 'Medium' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                            'text-rose-400 bg-rose-500/10 border-rose-500/20';
          const status = getSolvedStatus(p.id, submissions);
          return (
            <button
              key={p.id}
              onClick={() => onSelectProblem(p)}
              className={`w-full p-4 text-left transition-colors flex items-center gap-3 group ${
                isSelected ? 'bg-indigo-600/10 border-l-2 border-indigo-500' : 'hover:bg-slate-800/40'
              }`}
            >
              {/* Solved indicator */}
              <div className="shrink-0">
                {status === 'solved' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : status === 'attempted' ? (
                  <MinusCircle className="w-4 h-4 text-amber-400" />
                ) : (
                  <Circle className="w-4 h-4 text-slate-700" />
                )}
              </div>
              <div className="flex-1 space-y-1.5 min-w-0">
                <h3 className={`text-xs font-bold transition-colors truncate ${isSelected ? 'text-indigo-400' : 'text-slate-200 group-hover:text-white'}`}>
                  {p.title}
                </h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${diffColor}`}>
                    {p.difficulty}
                  </span>
                  {p.tags.slice(0, 2).map(t => (
                    <span key={t} className="text-[10px] text-slate-500 flex items-center gap-0.5">
                      <Tag className="w-2.5 h-2.5" /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className={`w-4 h-4 shrink-0 transition-colors ${isSelected ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-400'}`} />
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-slate-500">
            No problems match your filters.
          </div>
        )}
      </div>
    </div>
  );
};
