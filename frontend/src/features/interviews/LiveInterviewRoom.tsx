import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Bot, User, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize,
  Eye, Brain, Activity, Send, Sparkles, Clock, Wifi, Circle
} from 'lucide-react';

export const LiveInterviewRoom: React.FC = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [currentTurn, setCurrentTurn] = useState<any>(null);
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [timer, setTimer] = useState(0);
  const [recognition, setRecognition] = useState<any>(null);
  const [visionMetrics, setVisionMetrics] = useState({
    eye_contact_percentage: 87,
    head_pose_stability: 92,
    posture_score: 94,
    shoulder_alignment_score: 95,
    attention_score: 90,
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Timer
  useEffect(() => {
    if (session && session.status === 'active') {
      const interval = setInterval(() => setTimer(p => p + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [session?.status]);

  const formatTime = (s: number) => {
    const mm = Math.floor(s / 60).toString().padStart(2, '0');
    const ss = (s % 60).toString().padStart(2, '0');
    return `${mm}:${ss}`;
  };

  // Load session
  useEffect(() => {
    if (sessionId) {
      apiClient.get(`/interviews/${sessionId}`).then(r => {
        setSession(r.data);
        const turns = r.data.turns || [];
        if (turns.length > 0) setCurrentTurn(turns[turns.length - 1]);
      });
    }
  }, [sessionId]);

  // Init webcam
  useEffect(() => {
    if (isCameraOn && videoRef.current) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
        .then(stream => { if (videoRef.current) videoRef.current.srcObject = stream; })
        .catch(() => setIsCameraOn(false));
    }
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraOn]);

  // Speech recognition
  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SR) {
      const rec = new SR();
      rec.continuous = true;
      rec.interimResults = true;
      rec.onresult = (e: any) => {
        let t = '';
        for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript;
        if (t) setUserAnswer(t);
      };
      rec.onend = () => setIsMicOn(false);
      setRecognition(rec);
    }
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [session?.turns, userAnswer]);

  // Simulated vision & posture metrics update
  useEffect(() => {
    const iv = setInterval(() => {
      setVisionMetrics({
        eye_contact_percentage: Math.min(100, Math.max(60, 85 + Math.random() * 10 - 5)),
        head_pose_stability: Math.min(100, Math.max(70, 90 + Math.random() * 8 - 4)),
        posture_score: Math.min(100, Math.max(75, 92 + Math.random() * 6 - 3)),
        shoulder_alignment_score: Math.min(100, Math.max(80, 94 + Math.random() * 4 - 2)),
        attention_score: Math.min(100, Math.max(65, 88 + Math.random() * 8 - 4)),
      });
    }, 3000);
    return () => clearInterval(iv);
  }, []);

  const toggleMic = () => {
    if (!recognition) return;
    if (isMicOn) { recognition.stop(); setIsMicOn(false); }
    else { setUserAnswer(''); recognition.start(); setIsMicOn(true); }
  };

  const handleSubmitTurn = async () => {
    if (!userAnswer.trim() || !sessionId) return;
    if (isMicOn && recognition) { recognition.stop(); setIsMicOn(false); }
    setLoading(true);
    try {
      const res = await apiClient.post(`/interviews/${sessionId}/turns`, {
        user_answer: userAnswer,
        audio_duration_seconds: timer > 0 ? Math.min(timer, 120) : 15,
        vision_metrics: visionMetrics,
      });
      setSession(res.data.session);
      setCurrentTurn(res.data.current_turn);
      setUserAnswer('');
      if (res.data.is_completed) {
        setTimeout(() => navigate(`/interview/report/${sessionId}`), 1500);
      }
    } catch (err) {
      console.error('Turn submission failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEndInterview = () => {
    navigate(`/interview/report/${sessionId}`);
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0B0F19]">
        <div className="flex items-center gap-3 text-slate-400">
          <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" />
          Loading interview session...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-slate-200 overflow-hidden">
      {/* Top Bar */}
      <div className="h-12 bg-[#111621] border-b border-[#1E2532] flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <Circle className="w-2 h-2 fill-rose-500 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-bold text-rose-400 uppercase">REC</span>
          </div>
          <span className="text-xs font-mono text-slate-400">{formatTime(timer)}</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold">Strong</span>
          </div>
          <span className="text-xs text-slate-500">{session.mode} • {session.target_role}</span>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Video & Vision HUD */}
        <div className="w-1/2 flex flex-col border-r border-[#1E2532] bg-[#0B0F19] relative">
          {/* Vision & Posture Metrics HUD */}
          <div className="absolute top-4 left-4 z-20 space-y-2">
            {[
              { label: 'Posture', value: visionMetrics.posture_score, icon: Activity, color: 'text-indigo-400' },
              { label: 'Eye Contact', value: visionMetrics.eye_contact_percentage, icon: Eye, color: 'text-cyan-400' },
              { label: 'Posture Alignment', value: visionMetrics.shoulder_alignment_score, icon: Activity, color: 'text-emerald-400' },
              { label: 'Attention', value: visionMetrics.attention_score, icon: Brain, color: 'text-purple-400' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm border border-slate-800 rounded-lg">
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-[10px] text-slate-400 font-medium w-16">{m.label}</span>
                <div className="w-16 h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${m.value > 80 ? 'bg-emerald-500' : m.value > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${m.value}%` }} />
                </div>
                <span className="text-[10px] font-bold text-white w-8 text-right">{Math.round(m.value)}%</span>
              </div>
            ))}
          </div>

          {/* Webcam / AI Interviewer */}
          <div className="flex-1 flex flex-col items-center justify-center relative">
            {isCameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-30" />
            ) : null}
            <div className="relative z-10 flex flex-col items-center">
              <div className="relative w-48 h-48 flex items-center justify-center">
                <div className={`absolute w-full h-full rounded-full border border-indigo-500/20 ${isMicOn ? 'animate-ping' : ''}`} />
                <div className="absolute w-36 h-36 rounded-full border-2 border-indigo-500/30" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_60px_20px_rgba(99,102,241,0.4)] flex items-center justify-center">
                  <Bot className="w-10 h-10 text-white" />
                </div>
              </div>
              <h2 className="text-xl font-bold text-white mt-6 mb-1">AI Interviewer</h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span className="text-xs font-bold tracking-widest text-indigo-400 uppercase">
                  {isMicOn ? 'Listening...' : session.status === 'completed' ? 'COMPLETED' : 'Ready'}
                </span>
              </div>
            </div>
          </div>

          {/* Media Controls */}
          <div className="h-20 bg-[#111621] border-t border-[#1E2532] flex items-center justify-center gap-6 shrink-0">
            <button onClick={() => setIsCameraOn(!isCameraOn)} className="flex flex-col items-center gap-1.5 group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isCameraOn ? 'bg-slate-800 hover:bg-slate-700' : 'bg-rose-500/20 border border-rose-500/40'}`}>
                {isCameraOn ? <Video className="w-5 h-5 text-white" /> : <VideoOff className="w-5 h-5 text-rose-400" />}
              </div>
              <span className="text-[9px] text-slate-500 font-semibold">{isCameraOn ? 'Camera' : 'Camera Off'}</span>
            </button>

            <button onClick={toggleMic} className="flex flex-col items-center gap-1.5 group">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all border-2 ${isMicOn ? 'bg-indigo-500/20 border-indigo-500' : 'bg-slate-800 border-transparent hover:bg-slate-700'}`}>
                {isMicOn ? <Mic className="w-6 h-6 text-indigo-400" /> : <MicOff className="w-6 h-6 text-slate-400" />}
              </div>
              <span className="text-[9px] text-slate-500 font-semibold">{isMicOn ? 'Mute' : 'Unmute'}</span>
            </button>

            <button onClick={handleEndInterview} className="flex flex-col items-center gap-1.5 group">
              <div className="w-12 h-12 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center transition-colors">
                <PhoneOff className="w-5 h-5 text-rose-500" />
              </div>
              <span className="text-[9px] text-slate-500 font-semibold">End</span>
            </button>
          </div>
        </div>

        {/* Right: Live Transcript */}
        <div className="w-1/2 flex flex-col bg-[#111621]">
          <div className="flex items-center justify-between p-5 border-b border-[#1E2532] shrink-0">
            <h2 className="text-base font-bold text-white">Live Transcript</h2>
            <div className="flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              <span className="text-xs font-mono text-slate-400">{formatTime(timer)}</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5" ref={scrollRef}>
            {session.turns?.map((t: any, idx: number) => (
              <div key={idx} className="space-y-4">
                {/* AI Question */}
                <div className="flex gap-3">
                  <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4">
                    <span className="text-[10px] font-bold text-indigo-400 mb-1 block">AI Interviewer</span>
                    <p className="text-sm text-slate-300 leading-relaxed">{t.question}</p>
                  </div>
                </div>

                {/* User Answer */}
                {t.user_answer && (
                  <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                      <User className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="flex-1 bg-[#0F1219] border border-[#1E2532] rounded-2xl rounded-tr-sm p-4">
                      <span className="text-[10px] font-bold text-slate-400 mb-1 block text-right">You</span>
                      <p className="text-sm text-slate-300 leading-relaxed text-right">{t.user_answer}</p>
                    </div>
                  </div>
                )}

                {/* Turn Feedback */}
                {t.feedback && (
                  <div className="ml-11 p-3 bg-emerald-900/20 border border-emerald-500/20 rounded-xl">
                    <span className="text-[10px] font-bold text-emerald-400 block mb-1">AI Feedback</span>
                    <p className="text-xs text-slate-400 leading-relaxed">{t.feedback}</p>
                  </div>
                )}
              </div>
            ))}

            {/* Active Input */}
            {session.status !== 'completed' && (
              <div className="flex gap-3 flex-row-reverse">
                <div className="w-8 h-8 shrink-0 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center relative">
                  <User className="w-4 h-4 text-purple-400" />
                  {isMicOn && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />}
                </div>
                <div className="flex-1 border border-dashed border-slate-700 bg-[#0F1219]/50 rounded-2xl p-4">
                  {isMicOn ? (
                    <p className="text-sm text-slate-300 text-right">{userAnswer || <span className="text-slate-500 animate-pulse">Listening...</span>}</p>
                  ) : (
                    <div className="space-y-3">
                      <textarea
                        rows={2}
                        value={userAnswer}
                        onChange={(e) => setUserAnswer(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitTurn(); } }}
                        placeholder="Type or use microphone..."
                        className="w-full bg-transparent border-none text-sm text-slate-300 text-right resize-none placeholder-slate-600 outline-none"
                      />
                      <div className="flex justify-end">
                        <button
                          onClick={handleSubmitTurn}
                          disabled={!userAnswer.trim() || loading}
                          className="flex items-center gap-1.5 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg disabled:opacity-50 transition-colors"
                        >
                          <Send className="w-3.5 h-3.5" />
                          {loading ? 'Evaluating...' : 'Submit'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {session.status === 'completed' && (
              <div className="p-6 mt-4 bg-indigo-900/20 border border-indigo-500/30 rounded-2xl text-center">
                <Sparkles className="w-8 h-8 text-indigo-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Interview Complete!</h3>
                <p className="text-sm text-slate-400 mb-4">Your comprehensive AI evaluation report is ready.</p>
                <button
                  onClick={() => navigate(`/interview/report/${sessionId}`)}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  View Full Report
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
