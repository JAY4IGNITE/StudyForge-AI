import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import { Bot, Play, Send, CheckCircle, XCircle, Clock, Code, Sparkles, ArrowRight } from 'lucide-react';

const LANGUAGES = ['python', 'javascript', 'typescript', 'java', 'cpp', 'go', 'rust'];

const DEFAULT_CODE: Record<string, string> = {
  python: '# Write your solution here\ndef solution():\n    pass\n',
  javascript: '// Write your solution here\nfunction solution() {\n  \n}\n',
  typescript: '// Write your solution here\nfunction solution(): void {\n  \n}\n',
  java: '// Write your solution here\nclass Solution {\n    public void solve() {\n        \n    }\n}\n',
  cpp: '// Write your solution here\n#include <iostream>\nusing namespace std;\n\nint main() {\n    \n    return 0;\n}\n',
  go: '// Write your solution here\npackage main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello")\n}\n',
  rust: '// Write your solution here\nfn main() {\n    \n}\n',
};

export const CodingInterviewRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState(DEFAULT_CODE['python']);
  const [testResults, setTestResults] = useState<any>(null);
  const [aiReview, setAiReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [submittingTurn, setSubmittingTurn] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (sessionId) {
      apiClient.get(`/interviews/${sessionId}`).then(r => setSession(r.data));
    }
  }, [sessionId]);

  const currentQuestion = session?.turns?.[session.turns.length - 1]?.question || 'Loading problem statement...';

  const handleRunCode = async () => {
    setLoading(true);
    setTestResults(null);
    setAiReview('');
    try {
      const res = await apiClient.post(`/interviews/${sessionId}/evaluate-code`, {
        language,
        code,
        question_context: currentQuestion,
      });
      setTestResults(res.data.test_cases || []);
      setAiReview(res.data.ai_code_review || '');
    } catch {
      setAiReview('Error evaluating code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTurn = async () => {
    if (!userAnswer.trim()) return;
    setSubmittingTurn(true);
    try {
      const res = await apiClient.post(`/interviews/${sessionId}/turns`, {
        user_answer: userAnswer,
        audio_duration_seconds: 30,
        code_submission: code,
      });
      setSession(res.data.session);
      setUserAnswer('');
      if (res.data.is_completed) {
        setTimeout(() => navigate(`/interview/report/${sessionId}`), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingTurn(false);
    }
  };

  const handleTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      setCode(code.substring(0, start) + '    ' + code.substring(end));
      setTimeout(() => { ta.selectionStart = ta.selectionEnd = start + 4; }, 0);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0F19] text-slate-400">
        <Sparkles className="w-5 h-5 animate-pulse mr-2 text-indigo-400" /> Loading coding interview...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-slate-200 overflow-hidden">
      {/* Top Bar */}
      <div className="h-11 bg-[#111621] border-b border-[#1E2532] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <Code className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">Coding Interview</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">{session.target_role}</span>
        </div>
        <button
          onClick={() => navigate(`/interview/report/${sessionId}`)}
          className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
        >
          End Interview
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Problem Statement & Chat */}
        <div className="w-[40%] flex flex-col border-r border-[#1E2532]">
          <div className="p-5 border-b border-[#1E2532]">
            <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-400" /> Problem Statement
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">{currentQuestion}</p>
          </div>

          {/* Turn history & current input */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {session.turns?.map((t: any, idx: number) => (
              <div key={idx} className="space-y-2">
                {t.feedback && (
                  <div className="p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-400">AI Feedback</span>
                    <p className="text-xs text-slate-400 mt-1">{t.feedback}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-3 border-t border-[#1E2532] flex gap-2">
            <input
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSubmitTurn(); }}
              placeholder="Explain your approach..."
              className="flex-1 bg-slate-900/80 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500/50"
            />
            <button
              onClick={handleSubmitTurn}
              disabled={!userAnswer.trim() || submittingTurn}
              className="px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Code Editor & Results */}
        <div className="w-[60%] flex flex-col">
          {/* Language & Run */}
          <div className="flex items-center justify-between px-4 py-2 bg-[#111621] border-b border-[#1E2532] shrink-0">
            <div className="flex items-center gap-2">
              <select
                value={language}
                onChange={(e) => {
                  setLanguage(e.target.value);
                  setCode(DEFAULT_CODE[e.target.value] || '');
                }}
                className="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <button
              onClick={handleRunCode}
              disabled={loading}
              className="flex items-center gap-1.5 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5" />
              {loading ? 'Evaluating...' : 'Run & Review'}
            </button>
          </div>

          {/* Code Editor (textarea fallback for Monaco) */}
          <div className="flex-1 overflow-hidden relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={handleTab}
              spellCheck={false}
              className="absolute inset-0 w-full h-full bg-[#0D1117] text-emerald-300 font-mono text-sm p-4 resize-none outline-none border-none leading-6"
              style={{ tabSize: 4 }}
            />
            <div className="absolute top-2 right-2 text-[10px] text-slate-600 font-mono">
              {code.split('\n').length} lines
            </div>
          </div>

          {/* Test Results & AI Review */}
          {(testResults || aiReview) && (
            <div className="h-52 border-t border-[#1E2532] bg-[#111621] overflow-y-auto">
              {testResults && (
                <div className="p-4 space-y-2">
                  <h4 className="text-xs font-bold text-white mb-2">Test Results</h4>
                  {testResults.map((tc: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {tc.status === 'PASSED' ? (
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      )}
                      <span className={tc.status === 'PASSED' ? 'text-emerald-400' : 'text-rose-400'}>{tc.name}</span>
                      <span className="text-slate-600 ml-auto">{tc.duration_ms}ms</span>
                    </div>
                  ))}
                </div>
              )}
              {aiReview && (
                <div className="p-4 border-t border-[#1E2532]">
                  <h4 className="text-xs font-bold text-indigo-400 mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> AI Code Review
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{aiReview}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
