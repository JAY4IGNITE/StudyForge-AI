import React, { useState } from 'react';
import { TestRunResult } from '../types';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Timer,
  Terminal,
  ChevronDown,
  ChevronUp,
  Trophy,
  Zap,
  Flame,
} from 'lucide-react';

interface TestResultsPanelProps {
  results: TestRunResult[];
  isSubmission: boolean;
}

export const TestResultsPanel: React.FC<TestResultsPanelProps> = ({ results, isSubmission }) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    results.find((r) => !r.passed)?.testCaseId ?? results[0]?.testCaseId ?? null,
  );

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-slate-900/95 text-center p-8">
        <Terminal className="w-10 h-10 text-slate-700 mb-3" />
        <h3 className="text-sm font-bold text-slate-400 mb-1">Console</h3>
        <p className="text-xs text-slate-500 max-w-xs">
          Click <strong className="text-slate-300">Run</strong> to test against sample cases, or{' '}
          <strong className="text-slate-300">Submit</strong> to evaluate all test cases including hidden ones.
        </p>
      </div>
    );
  }

  const passedCount = results.filter((r) => r.passed).length;
  const totalCount = results.length;
  const allPassed = passedCount === totalCount;
  const avgRuntime = Math.round(results.reduce((a, r) => a + r.runtimeMs, 0) / totalCount);
  const hasErrors = results.some((r) => r.error);

  const statusColor = allPassed
    ? 'text-emerald-400'
    : hasErrors
      ? 'text-rose-400'
      : 'text-amber-400';

  const statusBg = allPassed
    ? 'bg-emerald-500/10 border-emerald-500/20'
    : hasErrors
      ? 'bg-rose-500/10 border-rose-500/20'
      : 'bg-amber-500/10 border-amber-500/20';

  const statusLabel = allPassed
    ? 'Accepted'
    : hasErrors
      ? 'Runtime Error'
      : 'Wrong Answer';

  const StatusIcon = allPassed ? Trophy : hasErrors ? AlertTriangle : XCircle;

  return (
    <div className="flex flex-col h-full bg-slate-900/95 text-slate-200">
      {/* Header Banner */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-slate-800 ${statusBg}`}>
        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${statusColor}`}>
            {isSubmission ? statusLabel : 'Test Results'}
          </h3>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {passedCount}/{totalCount} test cases passed
            {isSubmission && allPassed && ' — Congratulations!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-medium">Runtime</p>
            <p className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1">
              <Zap className="w-3 h-3 text-amber-400" />
              {avgRuntime}ms
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-500 font-medium">Score</p>
            <p className={`text-xs font-mono font-bold ${statusColor}`}>
              {Math.round((passedCount / totalCount) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-slate-800">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            allPassed ? 'bg-emerald-500' : hasErrors ? 'bg-rose-500' : 'bg-amber-500'
          }`}
          style={{ width: `${(passedCount / totalCount) * 100}%` }}
        />
      </div>

      {/* Results List */}
      <div className="flex-1 overflow-y-auto">
        {results.map((r, idx) => {
          const isExpanded = expandedId === r.testCaseId;
          return (
            <div
              key={r.testCaseId}
              className="border-b border-slate-800/40"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : r.testCaseId)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isExpanded ? 'bg-slate-800/40' : 'hover:bg-slate-800/20'
                }`}
              >
                {r.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : r.error ? (
                  <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-amber-400 shrink-0" />
                )}
                <span className="text-xs font-semibold text-slate-300 flex-1">
                  Case {idx + 1}
                  {!isSubmission && idx < 3 ? ' (Sample)' : isSubmission && idx >= (results.length - 1) ? ' (Hidden)' : ''}
                </span>
                <span className="text-[10px] text-slate-500 font-mono mr-2">
                  {r.runtimeMs}ms
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-slate-600" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-600" />
                )}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Input
                      </p>
                      <pre className="text-[11px] text-cyan-300 bg-slate-950 rounded-lg p-2.5 font-mono overflow-x-auto border border-slate-800/50">
                        {r.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Expected
                      </p>
                      <pre className="text-[11px] text-emerald-300 bg-slate-950 rounded-lg p-2.5 font-mono overflow-x-auto border border-slate-800/50">
                        {r.expectedOutput}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Your Output
                    </p>
                    <pre
                      className={`text-[11px] bg-slate-950 rounded-lg p-2.5 font-mono overflow-x-auto border ${
                        r.passed
                          ? 'text-emerald-300 border-emerald-500/20'
                          : 'text-rose-300 border-rose-500/20'
                      }`}
                    >
                      {r.actualOutput}
                    </pre>
                  </div>
                  {r.error && (
                    <div className="bg-rose-500/5 border border-rose-500/20 rounded-lg p-2.5">
                      <p className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Error
                      </p>
                      <pre className="text-[11px] text-rose-300 font-mono whitespace-pre-wrap">
                        {r.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
