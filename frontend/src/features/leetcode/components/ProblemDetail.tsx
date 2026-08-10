import React, { useState, useMemo } from 'react';
import { Problem, ProblemSubmission } from '../types';
import {
  FileText,
  Lightbulb,
  History,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Clock,
  HardDrive,
  CheckCircle2,
  XCircle,
  Code2,
} from 'lucide-react';

interface ProblemDetailProps {
  problem: Problem;
}

type Tab = 'description' | 'solutions' | 'submissions';

const SUBMISSIONS_KEY = 'studyforge_leetcode_submissions';

function formatTimeAgo(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffSec = Math.floor((now - then) / 1000);
  if (diffSec < 60) return 'just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem }) => {
  const [activeTab, setActiveTab] = useState<Tab>('description');
  const [expandedCase, setExpandedCase] = useState<string | null>(
    problem.sampleCases[0]?.id ?? null,
  );

  const submissions = useMemo(() => {
    try {
      const all: ProblemSubmission[] = JSON.parse(localStorage.getItem(SUBMISSIONS_KEY) || '[]');
      return all.filter((s) => s.problemId === problem.id);
    } catch {
      return [];
    }
  }, [problem.id, activeTab]);

  const diffBadge =
    problem.difficulty === 'Easy'
      ? 'bg-gold/15 text-gold border-gold/25'
      : problem.difficulty === 'Medium'
        ? 'bg-ember/15 text-ember border-ember/25'
        : 'bg-destructive/15 text-destructive border-destructive/25';

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'description', label: 'Description', icon: <FileText className="w-3.5 h-3.5" /> },
    { key: 'solutions', label: 'Solutions', icon: <Lightbulb className="w-3.5 h-3.5" /> },
    { key: 'submissions', label: 'Submissions', icon: <History className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="flex flex-col h-full bg-card/95 text-foreground/90">
      {/* Tab Bar */}
      <div className="flex items-center border-b border-border bg-card/80 px-2 pt-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === tab.key
                ? 'bg-secondary/80 text-foreground border border-border border-b-transparent -mb-px'
                : 'text-secondary hover:text-foreground'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
        <div className="flex-1" />
        <div className="flex items-center gap-1 pb-1">
          <button className="p-1.5 text-secondary hover:text-ember transition-colors rounded-md hover:bg-secondary" title="Bookmark">
            <Bookmark className="w-3.5 h-3.5" />
          </button>
          <button className="p-1.5 text-secondary hover:text-ember transition-colors rounded-md hover:bg-secondary" title="Share">
            <Share2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'description' && (
          <div className="p-5 space-y-6">
            {/* Title & Metadata */}
            <div className="space-y-3">
              <h1 className="text-lg font-bold text-foreground leading-tight tracking-tight">
                {problem.title}
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-md border font-bold uppercase tracking-wider ${diffBadge}`}>
                  {problem.difficulty}
                </span>
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-md bg-secondary text-secondary border border-border/50 font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-4 text-[10px] text-secondary font-medium">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {problem.timeLimitMs}ms
                </span>
                <span className="flex items-center gap-1">
                  <HardDrive className="w-3 h-3" />
                  {problem.memoryLimitMb}MB
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="prose-sm text-foreground/85 leading-relaxed text-[13px] whitespace-pre-wrap">
              {problem.description}
            </div>

            {/* Input / Output Spec */}
            <div className="grid grid-cols-1 gap-3">
              <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1.5">
                <h4 className="text-[10px] font-bold text-ember uppercase tracking-wider">
                  Input
                </h4>
                <p className="text-xs text-foreground/85 font-mono">{problem.inputSpecification}</p>
              </div>
              <div className="bg-background/60 border border-border/60 rounded-xl p-4 space-y-1.5">
                <h4 className="text-[10px] font-bold text-gold uppercase tracking-wider">
                  Output
                </h4>
                <p className="text-xs text-foreground/85 font-mono">{problem.outputSpecification}</p>
              </div>
            </div>

            {/* Constraints */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-ember" />
                Constraints
              </h3>
              <ul className="space-y-1">
                {problem.constraints.map((c, i) => (
                  <li key={i} className="text-xs text-secondary pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-secondary/50">
                    <code className="text-[11px] text-foreground/85 font-mono bg-secondary/50 px-1 py-0.5 rounded">
                      {c}
                    </code>
                  </li>
                ))}
              </ul>
            </div>

            {/* Sample Test Cases */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-foreground">Sample Test Cases</h3>
              {problem.sampleCases.map((tc, idx) => {
                const isExpanded = expandedCase === tc.id;
                return (
                  <div
                    key={tc.id}
                    className="border border-border/60 rounded-xl overflow-hidden bg-background/40"
                  >
                    <button
                      onClick={() => setExpandedCase(isExpanded ? null : tc.id)}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-secondary/30 transition-colors"
                    >
                      <span className="text-xs font-semibold text-foreground/85">
                        Example {idx + 1}
                      </span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-secondary" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-secondary" />
                      )}
                    </button>
                    {isExpanded && (
                      <div className="px-4 pb-4 space-y-2 border-t border-border/40">
                        <div className="pt-3">
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                            Input
                          </p>
                          <pre className="text-xs text-steel bg-background rounded-lg p-2.5 font-mono overflow-x-auto">
                            {tc.input}
                          </pre>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                            Output
                          </p>
                          <pre className="text-xs text-gold bg-background rounded-lg p-2.5 font-mono overflow-x-auto">
                            {tc.expectedOutput}
                          </pre>
                        </div>
                        {tc.explanation && (
                          <div>
                            <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1">
                              Explanation
                            </p>
                            <p className="text-xs text-secondary italic">{tc.explanation}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'solutions' && (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <Lightbulb className="w-10 h-10 text-secondary/40 mb-3" />
            <h3 className="text-sm font-bold text-secondary mb-1">
              Solutions Locked
            </h3>
            <p className="text-xs text-secondary max-w-xs">
              Submit an accepted solution to unlock community solutions and editorial explanations.
            </p>
          </div>
        )}

        {activeTab === 'submissions' && (
          submissions.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <History className="w-10 h-10 text-secondary/40 mb-3" />
              <h3 className="text-sm font-bold text-secondary mb-1">
                No Submissions Yet
              </h3>
              <p className="text-xs text-secondary max-w-xs">
                Write your solution in the editor and click Submit to see your results here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border/50">
              {submissions.map((sub, idx) => {
                const statusColor =
                  sub.status === 'Accepted'
                    ? 'text-gold'
                    : sub.status === 'Runtime Error'
                      ? 'text-destructive'
                      : 'text-ember';
                const StatusIcon = sub.status === 'Accepted' ? CheckCircle2 : XCircle;
                const timeAgo = formatTimeAgo(sub.submittedAt);
                return (
                  <div key={idx} className="flex items-center gap-3 px-5 py-3 hover:bg-secondary/20 transition-colors">
                    <StatusIcon className={`w-4 h-4 shrink-0 ${statusColor}`} />
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs font-bold ${statusColor}`}>{sub.status}</p>
                      <p className="text-[10px] text-secondary mt-0.5">
                        {sub.passedCount}/{sub.totalCount} passed · {timeAgo}
                      </p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-secondary text-secondary border border-border/50 font-mono flex items-center gap-1">
                      <Code2 className="w-2.5 h-2.5" />
                      {sub.language}
                    </span>
                  </div>
                );
              })}
            </div>
          )
        )}
      </div>
    </div>
  );
};
