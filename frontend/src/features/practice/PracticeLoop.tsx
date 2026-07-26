import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { apiClient } from '../../lib/axios';
import { Play, CheckCircle2, Send, ArrowRight, Mic, MicOff, MessageSquare } from 'lucide-react';
import { FeedbackModal } from '../feedback/FeedbackModal';

export const PracticeLoop: React.FC = () => {
  const [topics, setTopics] = useState<any[]>([]);
  const [selectedTopic, setSelectedTopic] = useState<string>('');
  const [session, setSession] = useState<any>(null);
  const [question, setQuestion] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [attemptResult, setAttemptResult] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await apiClient.get('/topics');
        setTopics(res.data);
        if (res.data.length > 0) setSelectedTopic(res.data[0].id);
      } catch (err) {
        console.error('Failed to load topics', err);
      }
    };
    fetchTopics();

    // Initialize Web Speech API if supported
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

  const handleStartSession = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    try {
      const resSession = await apiClient.post('/practice/sessions', { topic_id: selectedTopic });
      setSession(resSession.data);
      
      const resQ = await apiClient.post(`/practice/sessions/${resSession.data.session_id}/questions`);
      setQuestion(resQ.data);
    } catch (err) {
      console.error('Failed to start practice session', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim() || !session || !question) return;
    if (isListening && recognition) {
      recognition.stop();
      setIsListening(false);
    }
    setLoading(true);
    try {
      const res = await apiClient.post(`/practice/sessions/${session.session_id}/attempts`, {
        question_id: question.question_id,
        answer_text: userAnswer,
        duration_seconds: 45,
      });
      setAttemptResult(res.data);
    } catch (err) {
      console.error('Failed to submit answer', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = async () => {
    setAttemptResult(null);
    setUserAnswer('');
    setLoading(true);
    try {
      const resQ = await apiClient.post(`/practice/sessions/${session.session_id}/questions`);
      setQuestion(resQ.data);
    } catch (err) {
      console.error('Failed to load next question', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100">Adaptive Practice Loop</h1>
            <p className="text-slate-400 mt-1">Receive dynamically calibrated questions adapted to your performance</p>
          </div>
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold border border-slate-700 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-indigo-400" /> Give Feedback
          </button>
        </div>

        {/* Step 1: Session Setup */}
        {!session && (
          <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
            <h2 className="text-xl font-bold text-slate-200">Select Practice Topic</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topics.map((t) => (
                <div
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                    selectedTopic === t.id
                      ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/40 border-slate-700/50 hover:bg-slate-800/80'
                  }`}
                >
                  <p className="font-bold text-slate-100">{t.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{t.description}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleStartSession}
              disabled={loading || !selectedTopic}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-current" />
              {loading ? 'Starting Session...' : 'Start Practice Session'}
            </button>
          </div>
        )}

        {/* Step 2: Practice Question & Submission */}
        {session && question && !attemptResult && (
          <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full text-xs font-semibold uppercase tracking-wider">
                Difficulty: {question.difficulty}
              </span>
              <span className="text-xs text-slate-500">Session ID: {session.session_id.slice(-6)}</span>
            </div>

            <div className="p-6 bg-slate-800/40 border border-slate-700/50 rounded-2xl">
              <h3 className="text-lg font-bold text-slate-100">{question.prompt}</h3>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-slate-300">Your Answer (Text or Voice)</label>
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
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or dictate your structured answer here..."
                className="w-full p-4 bg-slate-800/60 border border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-100 placeholder-slate-500"
              />
            </div>

            <button
              onClick={handleSubmitAnswer}
              disabled={loading || !userAnswer.trim()}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              {loading ? 'Evaluating Response...' : 'Submit Answer for Evaluation'}
            </button>
          </div>
        )}

        {/* Step 3: Structured AI Evaluation Results */}
        {attemptResult && (
          <div className="p-8 bg-slate-900/90 border border-slate-800 rounded-3xl space-y-6 animate-fadeIn">
            <div className="flex items-center justify-between border-b border-slate-800 pb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-100">Evaluation Complete</h3>
                  <p className="text-xs text-slate-400">Adaptive score & semantic breakdown</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-extrabold text-indigo-400">{attemptResult.score}/100</p>
                <p className="text-xs text-slate-400">Semantic score: {attemptResult.semantic_score}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                <h4 className="text-sm font-bold text-slate-200 mb-1">Explanation</h4>
                <p className="text-sm text-slate-300">{attemptResult.evaluation.explanation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <h4 className="text-sm font-bold text-emerald-400 mb-2">Strengths</h4>
                  <ul className="list-disc list-inside text-xs text-emerald-300 space-y-1">
                    {attemptResult.evaluation.strengths.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                  <h4 className="text-sm font-bold text-indigo-400 mb-2">Improvement Advice</h4>
                  <p className="text-xs text-indigo-300">{attemptResult.evaluation.improvement_advice}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNextQuestion}
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-xl shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <ArrowRight className="w-5 h-5" />
              {loading ? 'Generating Next Question...' : 'Continue to Next Adapted Question'}
            </button>
          </div>
        )}

        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      </div>
    </Layout>
  );
};
