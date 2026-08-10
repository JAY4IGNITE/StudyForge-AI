import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../lib/axios';
import { Bot, User, Mic, MicOff, VideoOff, PhoneOff, CheckCircle2 } from 'lucide-react';
import { FeedbackModal } from '../feedback/FeedbackModal';
import { Card } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { cn } from '../../lib/utils';

export const MockInterview: React.FC = () => {
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [interviewType, setInterviewType] = useState('behavioral');
  const [interview, setInterview] = useState<any>(null);
  const [currentTurn, setCurrentTurn] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<any>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);
  const [timer, setTimer] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (interview && interview.status === 'active') {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [interview]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `00:${m}:${s}`;
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [interview?.turns, userAnswer]);

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
          setUserAnswer(transcript);
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
      setUserAnswer('');
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
      const interviewData = res.data.interview || {
        id: res.data.interview_id,
        interview_id: res.data.interview_id,
        target_role: targetRole,
        interview_type: interviewType,
        turns: [res.data.turn],
        status: 'active',
      };
      setInterview(interviewData);
      setCurrentTurn(res.data.turn);
      setTimer(0);
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

  if (!interview) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 text-foreground">
        <Card className="w-full max-w-md space-y-6 p-8">
          <div className="mb-8 flex flex-col items-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-steel/10">
              <Bot className="h-10 w-10 text-steel" />
            </div>
            <h2 className="font-display text-2xl font-medium text-foreground">Setup mock interview</h2>
            <p className="mt-1 text-xs text-secondary">Legacy quick-start flow</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">Target role</Label>
              <Input value={targetRole} onChange={(e) => setTargetRole(e.target.value)} className="h-12" />
            </div>
            <div>
              <Label className="mb-1.5 block text-sm font-medium text-foreground">Interview type</Label>
              <Select value={interviewType} onValueChange={setInterviewType}>
                <SelectTrigger className="h-12">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="technical">Technical &amp; system architecture</SelectItem>
                  <SelectItem value="behavioral">Behavioral &amp; STAR method</SelectItem>
                  <SelectItem value="situational">Situational problem solving</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button onClick={handleStartInterview} disabled={loading} variant="steel" className="mt-4 h-14 w-full">
            {loading ? 'Connecting to interviewer...' : 'Start session'}
          </Button>
        </Card>
      </div>
    );
  }

  const latestFeedback = interview.turns?.slice().reverse().find((t: any) => t.feedback)?.feedback;

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background font-sans text-foreground">
      <div className="flex h-10 shrink-0 items-center overflow-hidden border-b border-border bg-background px-4">
        <p className="w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-xs text-steel">
          [AI Analysis] {latestFeedback || 'System initialized. Preparing adaptive questioning logic...'}
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="relative flex w-1/2 flex-col border-r border-border bg-background">
          <div className="absolute left-6 top-6 rounded-xl border border-border bg-card p-4">
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-secondary">Confidence</p>
            <div className="h-1 w-24 overflow-hidden rounded-full bg-secondary">
              <div className="h-full w-3/4 rounded-full bg-steel" />
            </div>
          </div>

          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="relative flex h-64 w-64 items-center justify-center">
              <div className={cn('absolute h-full w-full rounded-full border border-steel/20', isListening && 'animate-ping duration-1000')} />
              <div className="absolute h-48 w-48 rounded-full border-2 border-steel/30" />
              <div className="absolute h-32 w-32 rounded-full border-4 border-steel/40" />
              <div className="z-10 h-16 w-16 rounded-full bg-steel shadow-[0_0_50px_20px_hsl(228_100%_72%/0.35)]" />
            </div>

            <div className="mt-12 flex flex-col items-center">
              <h2 className="mb-2 font-display text-2xl font-medium text-foreground">Interviewer AI</h2>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 animate-pulse rounded-full bg-steel" />
                <span className="text-sm font-semibold uppercase tracking-widest text-steel">Listening</span>
              </div>
            </div>
          </div>

          <div className="flex h-24 shrink-0 items-center justify-center gap-8 border-t border-border bg-card">
            <button className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary transition-colors hover:bg-secondary/70">
                <VideoOff className="h-5 w-5 text-secondary" />
              </div>
              <span className="text-[10px] font-semibold text-secondary">Stop video</span>
            </button>

            <button onClick={toggleListening} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors',
                  isListening ? 'border-steel bg-steel/20' : 'border-transparent bg-secondary hover:bg-secondary/70'
                )}
              >
                {isListening ? <Mic className="h-6 w-6 text-steel" /> : <MicOff className="h-6 w-6 text-secondary" />}
              </div>
              <span className="text-[10px] font-semibold text-secondary">
                {isListening ? 'Mute mic' : 'Unmute mic'}
              </span>
            </button>

            <button onClick={() => setInterview({ ...interview, status: 'completed' })} className="flex flex-col items-center gap-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-destructive/30 bg-destructive/10 transition-colors hover:bg-destructive/20">
                <PhoneOff className="h-5 w-5 text-destructive" />
              </div>
              <span className="text-[10px] font-semibold text-secondary">End interview</span>
            </button>
          </div>
        </div>

        <div className="relative flex w-1/2 flex-col bg-card">
          <div className="flex shrink-0 items-center justify-between border-b border-border p-6">
            <h2 className="font-display text-xl font-medium text-foreground">Live transcript</h2>
            <div className="rounded-md bg-secondary px-3 py-1 font-mono text-xs text-secondary">
              {formatTime(timer)}
            </div>
          </div>

          <div className="flex-1 space-y-6 overflow-y-auto p-6" ref={scrollRef}>
            {interview.turns?.map((t: any, idx: number) => (
              <div key={idx} className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                    <Bot className="h-5 w-5 text-steel" />
                  </div>
                  <div className="flex-1 rounded-2xl rounded-tl-sm border border-border bg-secondary/40 p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xs font-bold text-steel">Interviewer AI</span>
                      <span className="text-[10px] text-secondary">
                        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed text-foreground/85">{t.question}</p>
                  </div>
                </div>

                {t.answer && (
                  <div className="flex flex-row-reverse gap-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                      <User className="h-5 w-5 text-secondary" />
                    </div>
                    <div className="flex-1 rounded-2xl rounded-tr-sm border border-border bg-background p-5">
                      <div className="mb-2 flex items-center justify-end gap-2">
                        <span className="text-[10px] text-secondary">
                          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="text-xs font-bold text-foreground">You</span>
                      </div>
                      <p className="text-right text-sm leading-relaxed text-foreground/85">{t.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {interview.status !== 'completed' && (
              <div className="mt-6 flex flex-row-reverse gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary">
                  <div className="relative">
                    <User className="h-5 w-5 text-secondary" />
                    {isListening && (
                      <div className="absolute -right-1 -top-1 h-2 w-2 animate-pulse rounded-full bg-destructive" />
                    )}
                  </div>
                </div>
                <div className="relative flex-1 rounded-2xl border border-dashed border-border bg-background/50 p-5">
                  <div className="mb-2 flex items-center justify-end gap-2">
                    <span className="text-xs font-bold text-secondary">Now • You</span>
                  </div>

                  {isListening ? (
                    <p className="text-right text-sm leading-relaxed text-foreground/85">
                      {userAnswer || <span className="animate-pulse text-secondary">Listening...</span>}
                    </p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      <Textarea
                        rows={2}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmitTurn();
                          }
                        }}
                        placeholder="Type your response or enable mic..."
                        className="resize-none border-none bg-transparent p-0 text-right shadow-none focus-visible:ring-0"
                      />
                      <div className="flex justify-end">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={handleSubmitTurn}
                          disabled={!userAnswer.trim() || loading}
                          className="text-xs"
                        >
                          Send (Enter)
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {interview.status === 'completed' && (
              <div className="mt-8 rounded-2xl border border-steel/25 bg-steel/10 p-6 text-center">
                <CheckCircle2 className="mx-auto mb-3 h-8 w-8 text-steel" />
                <h3 className="mb-2 font-display text-lg font-medium text-steel">Interview completed</h3>
                <p className="mb-4 text-sm text-secondary">
                  Great job! The AI has finished its evaluation. Check the feedback dashboard for a comprehensive
                  review.
                </p>
                <Button variant="steel" size="sm" onClick={() => setIsFeedbackOpen(true)}>
                  View feedback
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};
