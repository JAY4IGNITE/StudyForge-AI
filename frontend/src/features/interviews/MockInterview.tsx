import React, { useState, useEffect } from 'react';
import { Layout } from '../../components/layout/Layout';
import { apiClient } from '../../lib/axios';
import { Award, Send, CheckCircle2, User, Bot, Mic, MicOff, MessageSquare } from 'lucide-react';
import { FeedbackModal } from '../feedback/FeedbackModal';

export const MockInterview: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('technical');
  const [interview, setInterview] = useState<any>(null);
  const [currentTurn, setCurrentTurn] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (event: any) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setUserAnswer((prev) => (prev ? prev + ' ' + transcript : transcript));
        }
      };
      rec.onend = () => setIsListening(false);
      setRecognition(rec);
    }
  }, []);

  const toggleListening = () => {
    if (!recognition) return;
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await apiClient.post('/interviews', {
        target_role: targetRole,
        interview_type: interviewType,
      });
      // Handle both full object response and turn data
      const interviewData = res.data.interview || {
        id: res.data.interview_id,
        interview_id: res.data.interview_id,
        target_role: targetRole,
        interview_type: interviewType,
        turns: [res.data.turn],
        status: 'active'
      };
      setInterview(interviewData);
      setCurrentTurn(res.data.turn);
    } catch (err) {
      console.error('Failed to start interview', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTurn = async () => {
    if (!userAnswer.trim() || !interview) return;
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
    setLoading(true);
    try {
      const interviewId = interview.interview_id || interview.id || interview._id;
      const res = await apiClient.post(`/interviews/${interviewId}/turns`, {
        user_answer: userAnswer,
      });
      setInterview(res.data.interview);
      setCurrentTurn(res.data.next_turn);
      setUserAnswer('');
    } catch (err) {
      console.error('Failed to submit turn', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">AI Mock Interview</h1>
            <p className="text-slate-400 mt-1">Multi-turn interviewer practice with real-time feedback</p>
          </div>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Give Feedback
          </button>
        </div>

        {!interview && (
          <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Configure Interview Setup</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Target Role</label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1.5">Interview Type</label>
                <select
                  value={interviewType}
                  onChange={(e) => setInterviewType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-100"
                >
                  <option value="technical">Technical & System Architecture</option>
                  <option value="behavioral">Behavioral & STAR Method</option>
                  <option value="situational">Situational Problem Solving</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Award className="w-5 h-5" />
              {loading ? 'Initializing Interviewer...' : 'Start Mock Interview'}
            </button>
          </div>
        )}

        {interview && (
          <div className="space-y-6">
            {/* Conversation History */}
            <div className="space-y-4">
              {interview.turns?.map((t: any, idx: number) => (
                <div key={idx} className="space-y-3">
                  {/* Interviewer Prompt */}
                  <div className="flex gap-4 p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
                    <div className="p-2.5 bg-indigo-600/20 text-indigo-400 rounded-xl h-fit">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-indigo-400 uppercase tracking-wider mb-1">
                        Interviewer • Turn {t.turn}
                      </p>
                      <p className="text-slate-200 text-sm">{t.question}</p>
                    </div>
                  </div>

                  {/* User Response if submitted */}
                  {t.answer && (
                    <div className="flex gap-4 p-5 bg-indigo-950/40 border border-indigo-900/50 rounded-2xl ml-6">
                      <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-xl h-fit">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">
                          You
                        </p>
                        <p className="text-slate-200 text-sm">{t.answer}</p>
                      </div>
                    </div>
                  )}

                  {/* Feedback on response */}
                  {t.feedback && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl ml-6 text-xs text-emerald-300">
                      <span className="font-bold">Turn Feedback: </span>{t.feedback}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Answer Input if interview is ongoing */}
            {interview.status !== 'completed' && (
              <div className="p-6 bg-slate-900 border border-slate-800 rounded-3xl space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Your Response
                  </label>
                  {recognition && (
                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${
                        isListening
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                          : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/20'
                      }`}
                    >
                      {isListening ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                      {isListening ? 'Stop Listening' : 'Voice Dictate'}
                    </button>
                  )}
                </div>
                <textarea
                  rows={4}
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Type or dictate your response to the interviewer..."
                  className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-100 placeholder-slate-500"
                />
                <button
                  onClick={handleSubmitTurn}
                  disabled={loading || !userAnswer.trim()}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                  {loading ? 'Submitting Turn...' : 'Submit Interview Turn'}
                </button>
              </div>
            )}

            {/* Final Evaluation summary */}
            {interview.status === 'completed' && (
              <div className="p-8 bg-emerald-950/40 border border-emerald-900/60 rounded-3xl space-y-4">
                <div className="flex items-center gap-3 text-emerald-400">
                  <CheckCircle2 className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Interview Completed!</h3>
                </div>
                <p className="text-slate-300 text-sm">
                  {interview.final_evaluation?.overall_summary || 'Great effort completing this mock interview!'}
                </p>
              </div>
            )}
          </div>
        )}

        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      </div>
    </Layout>
  );
};
