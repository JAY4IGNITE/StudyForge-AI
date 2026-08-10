import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Problem, TestRunResult } from '../types';
import { PROBLEMS_DATA } from '../data/problemsData';
import { ProblemList } from './ProblemList';
import { ProblemDetail } from './ProblemDetail';
import { EditorPanel } from './EditorPanel';
import { TestResultsPanel } from './TestResultsPanel';
import {
  Code2,
  PanelLeftClose,
  PanelLeftOpen,
  ArrowLeft,
  Keyboard,
  Wifi,
  Timer,
  RotateCcw,
} from 'lucide-react';

/**
 * CodingPracticePage: Full-screen 3-pane LeetCode-style IDE layout.
 *
 * Layout:
 *  ┌──────────┬──────────────────────┬──────────────┐
 *  │ Problem  │   Monaco Editor      │  Test Output │
 *  │ List +   │   (Code + Toolbar)   │  (Results)   │
 *  │ Detail   │                      │              │
 *  └──────────┴──────────────────────┴──────────────┘
 */
export const CodingPracticePage: React.FC = () => {
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS_DATA[0]);
  const [showSidebar, setShowSidebar] = useState(true);
  const [testResults, setTestResults] = useState<TestRunResult[]>([]);
  const [isSubmission, setIsSubmission] = useState(false);
  const [sidebarView, setSidebarView] = useState<'list' | 'detail'>('list');

  // Session timer
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setElapsedSeconds(prev => prev + 1);
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [selectedProblem.id]); // Reset timer on problem change

  const resetTimer = useCallback(() => {
    setElapsedSeconds(0);
  }, []);

  const formatTime = (totalSec: number) => {
    const min = Math.floor(totalSec / 60);
    const sec = totalSec % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  // Resizable panes
  const [leftWidth, setLeftWidth] = useState(28); // percentage
  const [rightWidth, setRightWidth] = useState(32); // percentage
  const containerRef = useRef<HTMLDivElement>(null);
  const isDraggingLeft = useRef(false);
  const isDraggingRight = useRef(false);

  const handleSelectProblem = useCallback((problem: Problem) => {
    setSelectedProblem(problem);
    setSidebarView('detail');
    setTestResults([]);
    setIsSubmission(false);
    setElapsedSeconds(0);
  }, []);

  const handleTestResults = useCallback((results: TestRunResult[], submission: boolean) => {
    setTestResults(results);
    setIsSubmission(submission);
  }, []);

  // Drag handlers for resizable panes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;

      if (isDraggingLeft.current) {
        const clamped = Math.min(Math.max(pct, 15), 45);
        setLeftWidth(clamped);
      }
      if (isDraggingRight.current) {
        const rightPct = 100 - ((e.clientX - rect.left) / rect.width) * 100;
        const clamped = Math.min(Math.max(rightPct, 20), 50);
        setRightWidth(clamped);
      }
    };

    const handleMouseUp = () => {
      isDraggingLeft.current = false;
      isDraggingRight.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startDragLeft = () => {
    isDraggingLeft.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const startDragRight = () => {
    isDraggingRight.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const effectiveLeftWidth = showSidebar ? leftWidth : 0;
  const centerWidth = 100 - effectiveLeftWidth - rightWidth;

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">
      {/* Top Navigation Bar */}
      <header className="flex items-center justify-between px-4 py-2 border-b border-border bg-card/80 backdrop-blur-sm shrink-0 z-20">
        <div className="flex items-center gap-3">
          <a
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Dashboard
          </a>
          <div className="w-px h-4 bg-surface" />
          <div className="flex items-center gap-2">
            <Code2 className="w-4 h-4 text-primary" />
            <h1 className="text-sm font-bold text-foreground tracking-tight">
              Coding Practice
            </h1>
          </div>
          <div className="w-px h-4 bg-surface" />
          <span className="text-xs text-muted-foreground font-medium">
            {selectedProblem.title}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Session Timer */}
          <div className="flex items-center gap-1.5 bg-surface/80 border border-border/60 rounded-lg px-2.5 py-1">
            <Timer className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-mono font-bold text-foreground tabular-nums">
              {formatTime(elapsedSeconds)}
            </span>
            <button
              onClick={resetTimer}
              className="p-0.5 text-muted-foreground hover:text-gold transition-colors rounded"
              title="Reset timer"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-surface"
            title="Toggle sidebar"
          >
            {showSidebar ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </button>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <Wifi className="w-3 h-3 text-gold" />
            <span className="text-gold font-medium">In-Browser</span>
          </div>
        </div>
      </header>

      {/* Main 3-Pane Layout */}
      <div ref={containerRef} className="flex-1 flex min-h-0 relative">
        {/* Left Pane: Problem List / Detail */}
        {showSidebar && (
          <>
            <div
              className="h-full shrink-0 flex flex-col overflow-hidden"
              style={{ width: `${leftWidth}%` }}
            >
              {/* Sub-navigation for list ↔ detail */}
              <div className="flex items-center border-b border-border bg-card/60">
                <button
                  onClick={() => setSidebarView('list')}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider text-center transition-colors ${
                    sidebarView === 'list'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Problems
                </button>
                <button
                  onClick={() => setSidebarView('detail')}
                  className={`flex-1 py-2 text-[10px] font-bold uppercase tracking-wider text-center transition-colors ${
                    sidebarView === 'detail'
                      ? 'text-primary border-b-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Description
                </button>
              </div>

              <div className="flex-1 overflow-hidden">
                {sidebarView === 'list' ? (
                  <ProblemList
                    problems={PROBLEMS_DATA}
                    onSelectProblem={handleSelectProblem}
                    selectedProblemId={selectedProblem.id}
                  />
                ) : (
                  <ProblemDetail problem={selectedProblem} />
                )}
              </div>
            </div>

            {/* Left resize handle */}
            <div
              onMouseDown={startDragLeft}
              className="w-1 cursor-col-resize bg-surface hover:bg-primary/50 transition-colors shrink-0 z-10"
            />
          </>
        )}

        {/* Center Pane: Code Editor */}
        <div
          className="h-full min-w-0 overflow-hidden"
          style={{ width: `${centerWidth}%` }}
        >
          <EditorPanel
            key={selectedProblem.id}
            problem={selectedProblem}
            onTestResults={handleTestResults}
          />
        </div>

        {/* Right resize handle */}
        <div
          onMouseDown={startDragRight}
          className="w-1 cursor-col-resize bg-surface hover:bg-primary/50 transition-colors shrink-0 z-10"
        />

        {/* Right Pane: Test Results */}
        <div
          className="h-full shrink-0 overflow-hidden"
          style={{ width: `${rightWidth}%` }}
        >
          <TestResultsPanel results={testResults} isSubmission={isSubmission} />
        </div>
      </div>

      {/* Bottom Status Bar */}
      <footer className="flex items-center justify-between px-4 py-1 border-t border-border bg-card/60 text-[10px] text-muted-foreground shrink-0">
        <div className="flex items-center gap-3">
          <span>StudyForge AI</span>
          <span>|</span>
          <span>{PROBLEMS_DATA.length} problems loaded</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <Keyboard className="w-3 h-3" />
            Ctrl+Enter to Run
          </span>
          <span>|</span>
          <span>Ctrl+Shift+Enter to Submit</span>
        </div>
      </footer>
    </div>
  );
};
