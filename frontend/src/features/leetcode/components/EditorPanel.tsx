import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import { Problem, TestRunResult } from '../types';
import { ExecutorSandbox } from '../engine/ExecutorSandbox';
import { useCodePersistence } from '../hooks/useCodePersistence';
import {
  Play,
  Send,
  RotateCcw,
  Settings2,
  ChevronDown,
  Loader2,
  Maximize2,
  Minimize2,
  Sun,
  Moon,
  Type,
} from 'lucide-react';

interface EditorPanelProps {
  problem: Problem;
  onTestResults: (results: TestRunResult[], isSubmission: boolean) => void;
}

type Language = 'javascript' | 'typescript';

const LANGUAGE_CONFIG: Record<Language, { label: string; monacoId: string }> = {
  javascript: { label: 'JavaScript', monacoId: 'javascript' },
  typescript: { label: 'TypeScript', monacoId: 'typescript' },
};

export const EditorPanel: React.FC<EditorPanelProps> = ({ problem, onTestResults }) => {
  const [language, setLanguage] = useState<Language>('javascript');
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [showSettings, setShowSettings] = useState(false);
  const [editorTheme, setEditorTheme] = useState<'vs-dark' | 'light'>('vs-dark');

  const { code, setCode, saveSubmission } = useCodePersistence(
    `${problem.id}_${language}`,
    problem.codeTemplates[language],
  );

  const editorRef = useRef<any>(null);
  const runTestsRef = useRef<() => void>(() => {});
  const submitCodeRef = useRef<() => void>(() => {});

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    editor.focus();

    // Ctrl+Enter → Run sample tests
    editor.addAction({
      id: 'studyforge-run-tests',
      label: 'Run Tests',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
      run: () => runTestsRef.current(),
    });

    // Ctrl+Shift+Enter → Submit all tests
    editor.addAction({
      id: 'studyforge-submit-code',
      label: 'Submit Code',
      keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.Enter],
      run: () => submitCodeRef.current(),
    });
  };

  const resetCode = useCallback(() => {
    setCode(problem.codeTemplates[language]);
  }, [problem, language, setCode]);

  const runTests = useCallback(async () => {
    setIsRunning(true);
    try {
      const results: TestRunResult[] = [];
      for (const tc of problem.sampleCases) {
        const result = await ExecutorSandbox.runTest(code, tc, language);
        results.push(result);
      }
      onTestResults(results, false);
    } finally {
      setIsRunning(false);
    }
  }, [code, language, problem, onTestResults]);

  const submitCode = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const allCases = [...problem.sampleCases, ...problem.hiddenCases];
      const results: TestRunResult[] = [];
      for (const tc of allCases) {
        const result = await ExecutorSandbox.runTest(code, tc, language);
        results.push(result);
      }

      const passedCount = results.filter((r) => r.passed).length;
      const status =
        results.every((r) => r.passed)
          ? 'Accepted'
          : results.some((r) => r.error)
            ? 'Runtime Error'
            : 'Wrong Answer';

      saveSubmission({
        problemId: problem.id,
        code,
        language,
        status: status as 'Accepted' | 'Wrong Answer' | 'Runtime Error',
        passedCount,
        totalCount: allCases.length,
        submittedAt: new Date().toISOString(),
      });

      onTestResults(results, true);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, language, problem, onTestResults, saveSubmission]);

  // Keep shortcut refs in sync with latest closures
  useEffect(() => { runTestsRef.current = runTests; }, [runTests]);
  useEffect(() => { submitCodeRef.current = submitCode; }, [submitCode]);

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
  };

  return (
    <div className="flex flex-col h-full bg-background border-l border-r border-border">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border bg-card/80">
        {/* Language Selector */}
        <div className="relative">
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-foreground/85 bg-secondary hover:bg-secondary/70 rounded-lg transition-colors border border-border/60"
          >
            <span className="w-2 h-2 rounded-full bg-gold" />
            {LANGUAGE_CONFIG[language].label}
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </button>
          {showLangMenu && (
            <div className="absolute top-full left-0 mt-1 bg-secondary border border-border rounded-xl shadow-2xl shadow-black/50 overflow-hidden z-50 min-w-[160px]">
              {(Object.keys(LANGUAGE_CONFIG) as Language[]).map((lang) => (
                <button
                  key={lang}
                  onClick={() => switchLanguage(lang)}
                  className={`w-full text-left px-4 py-2 text-xs font-medium transition-colors ${
                    language === lang
                      ? 'bg-ember/20 text-ember'
                      : 'text-foreground/85 hover:bg-secondary/70'
                  }`}
                >
                  {LANGUAGE_CONFIG[lang].label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-1.5">
          {/* Settings */}
          <div className="relative">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-secondary"
              title="Editor Settings"
            >
              <Settings2 className="w-3.5 h-3.5" />
            </button>
            {showSettings && (
              <div className="absolute top-full right-0 mt-1 bg-secondary border border-border rounded-xl shadow-2xl shadow-black/50 p-4 z-50 min-w-[200px] space-y-3">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Font Size
                  </label>
                  <div className="flex items-center gap-2">
                    <Type className="w-3 h-3 text-muted-foreground" />
                    <input
                      type="range"
                      min={10}
                      max={22}
                      value={fontSize}
                      onChange={(e) => setFontSize(Number(e.target.value))}
                      className="flex-1 accent-ember"
                    />
                    <span className="text-xs text-muted-foreground font-mono w-6 text-right">
                      {fontSize}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
                    Theme
                  </label>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditorTheme('vs-dark')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                        editorTheme === 'vs-dark'
                          ? 'bg-ember-gradient text-ember-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Moon className="w-3 h-3" /> Dark
                    </button>
                    <button
                      onClick={() => setEditorTheme('light')}
                      className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold rounded-md transition-colors ${
                        editorTheme === 'light'
                          ? 'bg-ember-gradient text-ember-foreground'
                          : 'bg-secondary text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <Sun className="w-3 h-3" /> Light
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reset */}
          <button
            onClick={resetCode}
            className="p-1.5 text-muted-foreground hover:text-gold transition-colors rounded-md hover:bg-secondary"
            title="Reset to template"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={LANGUAGE_CONFIG[language].monacoId}
          theme={editorTheme}
          value={code}
          onChange={(val) => setCode(val ?? '')}
          onMount={handleEditorMount}
          options={{
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
            fontLigatures: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            padding: { top: 16, bottom: 16 },
            lineNumbers: 'on',
            renderLineHighlight: 'gutter',
            bracketPairColorization: { enabled: true },
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
            suggestOnTriggerCharacters: true,
            quickSuggestions: true,
            scrollbar: {
              verticalScrollbarSize: 6,
              horizontalScrollbarSize: 6,
            },
            overviewRulerBorder: false,
            hideCursorInOverviewRuler: true,
            contextmenu: true,
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
          }}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-card/80">
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono">
          <span>{language.toUpperCase()}</span>
          <span>|</span>
          <span>UTF-8</span>
          <span>|</span>
          <span>Tab: {2}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={runTests}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-foreground/85 bg-secondary hover:bg-secondary/70 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-border/60"
          >
            {isRunning ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5" />
            )}
            Run
          </button>
          <button
            onClick={submitCode}
            disabled={isRunning || isSubmitting}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-bold text-ember-foreground bg-ember-gradient hover:brightness-110 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-ember/20"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};
