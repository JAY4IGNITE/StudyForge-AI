import React, { useEffect, useState } from 'react';
import { Layout } from '../../components/layout/Layout';
import { apiClient } from '../../lib/axios';
import { Play, CheckCircle2, Send, ArrowRight, Mic, MicOff, MessageSquare, TrendingUp } from 'lucide-react';
import { FeedbackModal } from '../feedback/FeedbackModal';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { cn } from '../../lib/utils';

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
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl font-medium tracking-tight text-foreground text-balance">
              Adaptive Practice Loop
            </h1>
            <p className="mt-1 text-muted-foreground">
              Receive dynamically calibrated questions adapted to your performance
            </p>
          </div>
          <Button variant="secondary" size="sm" onClick={() => setIsFeedbackOpen(true)} className="gap-2">
            <MessageSquare className="h-4 w-4 text-primary" /> Give feedback
          </Button>
        </div>

        {/* Step 1: Session Setup */}
        {!session && (
          <Card className="space-y-6 p-8">
            <h2 className="font-display text-xl font-medium text-foreground">Select practice topic</h2>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {topics.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTopic(t.id)}
                  className={cn(
                    'rounded-2xl border p-5 text-left transition-all',
                    selectedTopic === t.id
                      ? 'border-primary/40 bg-primary/10 shadow-[0_10px_28px_-16px_hsl(var(--ember)/0.5)]'
                      : 'border-border bg-surface/20 hover:bg-surface/40'
                  )}
                >
                  <p className="font-medium text-foreground">{t.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{t.description}</p>
                </button>
              ))}
            </div>

            <Button onClick={handleStartSession} disabled={loading || !selectedTopic} className="h-14 w-full gap-2">
              <Play className="h-5 w-5 fill-current" />
              {loading ? 'Starting session...' : 'Start practice session'}
            </Button>
          </Card>
        )}

        {/* Step 2: Practice Question & Submission */}
        {session && question && !attemptResult && (
          <Card className="space-y-6 p-8">
            <div className="flex items-center justify-between">
              <Badge variant="default" className="rounded-full font-sans uppercase tracking-wider">
                Difficulty: {question.difficulty}
              </Badge>
              <span className="font-mono text-xs text-muted-foreground">
                Session ID: {session.session_id.slice(-6)}
              </span>
            </div>

            <div className="rounded-2xl border border-border bg-surface/20 p-6">
              <h3 className="text-lg font-medium text-foreground">{question.prompt}</h3>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <Label className="text-sm font-medium text-foreground">Your answer (text or voice)</Label>
                {recognition && (
                  <button
                    type="button"
                    onClick={toggleListening}
                    className={cn(
                      'flex items-center gap-1.5 rounded-lg border px-3 py-1 text-xs font-semibold transition-all',
                      isListening
                        ? 'animate-pulse border-destructive/40 bg-destructive/15 text-destructive'
                        : 'border-primary/25 bg-primary/10 text-primary hover:bg-primary/15'
                    )}
                  >
                    {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                    {isListening ? 'Stop listening' : 'Voice dictate'}
                  </button>
                )}
              </div>
              <Textarea
                rows={5}
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type or dictate your structured answer here..."
                className="rounded-2xl p-4"
              />
            </div>

            <Button onClick={handleSubmitAnswer} disabled={loading || !userAnswer.trim()} className="h-14 w-full gap-2">
              <Send className="h-5 w-5" />
              {loading ? 'Evaluating response...' : 'Submit answer for evaluation'}
            </Button>
          </Card>
        )}

        {/* Step 3: Structured AI Evaluation Results */}
        {attemptResult && (
          <Card className="space-y-6 p-8">
            <div className="flex items-center justify-between border-b border-border pb-6">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-gold/15 p-3 text-gold">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display text-xl font-medium text-foreground">Evaluation complete</h3>
                  <p className="text-xs text-muted-foreground">Adaptive score &amp; semantic breakdown</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-mono text-3xl font-semibold text-primary">{attemptResult.score}/100</p>
                <p className="text-xs text-muted-foreground">Semantic score: {attemptResult.semantic_score}%</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="rounded-xl border border-border bg-surface/20 p-4">
                <h4 className="mb-1 text-sm font-semibold text-foreground">Explanation</h4>
                <p className="text-sm text-muted-foreground">{attemptResult.evaluation.explanation}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-gold/25 bg-gold/10 p-4">
                  <h4 className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-gold">
                    <TrendingUp className="h-3.5 w-3.5" /> Strengths
                  </h4>
                  <ul className="list-inside list-disc space-y-1 text-xs text-foreground/80">
                    {attemptResult.evaluation.strengths.map((s: string, idx: number) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-steel/25 bg-steel/10 p-4">
                  <h4 className="mb-2 text-sm font-semibold text-steel">Improvement advice</h4>
                  <p className="text-xs text-foreground/80">{attemptResult.evaluation.improvement_advice}</p>
                </div>
              </div>
            </div>

            <Button onClick={handleNextQuestion} disabled={loading} className="h-14 w-full gap-2">
              <ArrowRight className="h-5 w-5" />
              {loading ? 'Generating next question...' : 'Continue to next adapted question'}
            </Button>
          </Card>
        )}

        <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
      </div>
    </Layout>
  );
};
