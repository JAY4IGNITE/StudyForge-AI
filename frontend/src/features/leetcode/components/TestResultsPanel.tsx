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
      <div className="flex flex-col items-center justify-center h-full bg-card/95 text-center p-8">
        <Terminal className="w-10 h-10 text-muted-foreground/40 mb-3" />
        <h3 className="text-sm font-bold text-muted-foreground mb-1">Console</h3>
        <p className="text-xs text-muted-foreground max-w-xs">
          Click <strong className="text-foreground/85">Run</strong> to test against sample cases, or{' '}
          <strong className="text-foreground/85">Submit</strong> to evaluate all test cases including hidden ones.
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
    ? 'text-gold'
    : hasErrors
      ? 'text-destructive'
      : 'text-primary';

  const statusBg = allPassed
    ? 'bg-gold/10 border-gold/25'
    : hasErrors
      ? 'bg-destructive/10 border-destructive/25'
      : 'bg-primary/10 border-primary/25';

  const statusLabel = allPassed
    ? 'Accepted'
    : hasErrors
      ? 'Runtime Error'
      : 'Wrong Answer';

  const StatusIcon = allPassed ? Trophy : hasErrors ? AlertTriangle : XCircle;

  return (
    <div className="flex flex-col h-full bg-card/95 text-foreground/90">
      {/* Header Banner */}
      <div className={`flex items-center gap-3 px-4 py-3 border-b border-border ${statusBg}`}>
        <StatusIcon className={`w-5 h-5 ${statusColor}`} />
        <div className="flex-1">
          <h3 className={`text-sm font-bold ${statusColor}`}>
            {isSubmission ? statusLabel : 'Test Results'}
          </h3>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {passedCount}/{totalCount} test cases passed
            {isSubmission && allPassed && ' — Congratulations!'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-medium">Runtime</p>
            <p className="text-xs font-mono font-bold text-foreground/85 flex items-center gap-1">
              <Zap className="w-3 h-3 text-primary" />
              {avgRuntime}ms
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-muted-foreground font-medium">Score</p>
            <p className={`text-xs font-mono font-bold ${statusColor}`}>
              {Math.round((passedCount / totalCount) * 100)}%
            </p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-surface">
        <div
          className={`h-full transition-all duration-700 ease-out ${
            allPassed ? 'bg-gold' : hasErrors ? 'bg-destructive' : 'bg-primary'
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
              className="border-b border-border/40"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : r.testCaseId)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                  isExpanded ? 'bg-surface/40' : 'hover:bg-surface/20'
                }`}
              >
                {r.passed ? (
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0" />
                ) : r.error ? (
                  <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-primary shrink-0" />
                )}
                <span className="text-xs font-semibold text-foreground/85 flex-1">
                  Case {idx + 1}
                  {!isSubmission && idx < 3 ? ' (Sample)' : isSubmission && idx >= (results.length - 1) ? ' (Hidden)' : ''}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono mr-2">
                  {r.runtimeMs}ms
                </span>
                {isExpanded ? (
                  <ChevronUp className="w-3.5 h-3.5 text-muted-foreground/60" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground/60" />
                )}
              </button>
              {isExpanded && (
                <div className="px-4 pb-4 space-y-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Input
                      </p>
                      <pre className="text-[11px] text-steel bg-background rounded-lg p-2.5 font-mono overflow-x-auto border border-border/50">
                        {r.input}
                      </pre>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                        Expected
                      </p>
                      <pre className="text-[11px] text-gold bg-background rounded-lg p-2.5 font-mono overflow-x-auto border border-border/50">
                        {r.expectedOutput}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">
                      Your Output
                    </p>
                    <pre
                      className={`text-[11px] bg-background rounded-lg p-2.5 font-mono overflow-x-auto border ${
                        r.passed
                          ? 'text-gold border-gold/25'
                          : 'text-destructive border-destructive/25'
                      }`}
                    >
                      {r.actualOutput}
                    </pre>
                  </div>
                  {r.error && (
                    <div className="bg-destructive/5 border border-destructive/25 rounded-lg p-2.5">
                      <p className="text-[10px] font-bold text-destructive uppercase tracking-wider mb-1 flex items-center gap-1">
                        <Flame className="w-3 h-3" /> Error
                      </p>
                      <pre className="text-[11px] text-destructive font-mono whitespace-pre-wrap">
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
