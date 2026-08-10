import React, { useState, useMemo } from 'react';
import { Problem, ProblemSubmission } from '../types';
import { Search, Code2, Tag, CheckCircle2, ChevronRight, Circle, MinusCircle } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Badge } from '../../../components/ui/badge';
import { cn } from '../../../lib/utils';

const SUBMISSIONS_KEY = 'studyforge_leetcode_submissions';

type SolvedStatus = 'solved' | 'attempted' | 'unsolved';

function getSolvedStatus(problemId: string, submissions: ProblemSubmission[]): SolvedStatus {
  const problemSubs = submissions.filter((s) => s.problemId === problemId);
  if (problemSubs.length === 0) return 'unsolved';
  if (problemSubs.some((s) => s.status === 'Accepted')) return 'solved';
  return 'attempted';
}

interface ProblemListProps {
  problems: Problem[];
  onSelectProblem: (problem: Problem) => void;
  selectedProblemId?: string;
}

const DIFFICULTY_CLASSES: Record<string, string> = {
  Easy: 'text-gold bg-gold/10 border-gold/25',
  Medium: 'text-ember bg-ember/10 border-ember/25',
  Hard: 'text-destructive bg-destructive/10 border-destructive/25',
};

export const ProblemList: React.FC<ProblemListProps> = ({ problems, onSelectProblem, selectedProblemId }) => {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Solved' | 'Attempted' | 'Unsolved'>('All');

  const submissions: ProblemSubmission[] = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
    } catch {
      return [];
    }
  }, [selectedProblemId]);

  const filtered = problems.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesDiff = difficultyFilter === 'All' || p.difficulty === difficultyFilter;

    if (!matchesSearch || !matchesDiff) return false;

    if (statusFilter === 'All') return true;
    const status = getSolvedStatus(p.id, submissions);
    if (statusFilter === 'Solved') return status === 'solved';
    if (statusFilter === 'Attempted') return status === 'attempted';
    if (statusFilter === 'Unsolved') return status === 'unsolved';
    return true;
  });

  const solvedCount = problems.filter((p) => getSolvedStatus(p.id, submissions) === 'solved').length;

  return (
    <div className="flex h-full flex-col border-r border-border bg-card/90">
      <div className="space-y-3 border-b border-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-ember" />
            <h2 className="text-base font-bold text-foreground">Problem Bank</h2>
          </div>
          <Badge variant="gold" className="rounded-md font-mono">
            {solvedCount}/{problems.length}
          </Badge>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-secondary" />
          <Input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search problems or tags..."
            className="h-10 pl-9 text-xs"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Easy', 'Medium', 'Hard'].map((diff) => (
            <button
              key={diff}
              onClick={() => setDifficultyFilter(diff)}
              className={cn(
                'rounded-lg px-3 py-1 text-xs font-semibold transition-colors',
                difficultyFilter === diff
                  ? 'bg-ember-gradient text-ember-foreground'
                  : 'bg-secondary text-secondary hover:text-foreground'
              )}
            >
              {diff}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {(['All', 'Solved', 'Attempted', 'Unsolved'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={cn(
                'rounded-md px-2.5 py-0.5 text-[10px] font-semibold transition-colors',
                statusFilter === st
                  ? 'bg-secondary text-foreground'
                  : 'text-secondary hover:text-foreground'
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 divide-y divide-border/60 overflow-y-auto">
        {filtered.map((p) => {
          const isSelected = p.id === selectedProblemId;
          const status = getSolvedStatus(p.id, submissions);
          return (
            <button
              key={p.id}
              onClick={() => onSelectProblem(p)}
              className={cn(
                'group flex w-full items-center gap-3 p-4 text-left transition-colors',
                isSelected ? 'border-l-2 border-ember bg-ember/10' : 'hover:bg-secondary/40'
              )}
            >
              <div className="shrink-0">
                {status === 'solved' ? (
                  <CheckCircle2 className="h-4 w-4 text-gold" />
                ) : status === 'attempted' ? (
                  <MinusCircle className="h-4 w-4 text-ember" />
                ) : (
                  <Circle className="h-4 w-4 text-secondary/40" />
                )}
              </div>
              <div className="min-w-0 flex-1 space-y-1.5">
                <h3
                  className={cn(
                    'truncate text-xs font-bold transition-colors',
                    isSelected ? 'text-ember' : 'text-foreground/85 group-hover:text-foreground'
                  )}
                >
                  {p.title}
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={cn('rounded border px-2 py-0.5 text-[10px] font-semibold', DIFFICULTY_CLASSES[p.difficulty])}>
                    {p.difficulty}
                  </span>
                  {p.tags.slice(0, 2).map((t) => (
                    <span key={t} className="flex items-center gap-0.5 text-[10px] text-secondary">
                      <Tag className="h-2.5 w-2.5" /> {t}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight
                className={cn(
                  'h-4 w-4 shrink-0 transition-colors',
                  isSelected ? 'text-ember' : 'text-secondary/50 group-hover:text-secondary'
                )}
              />
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="p-6 text-center text-xs text-secondary">No problems match your filters.</div>
        )}
      </div>
    </div>
  );
};
