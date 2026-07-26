import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiClient } from '../../lib/axios';
import {
  Bot, User, Mic, MicOff, Video, VideoOff, PhoneOff, Maximize,
  Eye, Brain, Activity, Send, Sparkles, Clock, Wifi, Circle,
  Volume2, ShieldCheck, HelpCircle, Layers, CheckCircle2, MessageSquare
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
  const [activeTab, setActiveTab] = useState<'transcript' | 'telemetry' | 'star'>('transcript');

  const [visionMetrics, setVisionMetrics] = useState({
    eye_contact_percentage: 87,
    head_pose_stability: 92,
    posture_score: 94,
    shoulder_alignment_score: 95,
    attention_score: 90,
  });

  const [audioLevels, setAudioLevels] = useState<number[]>([10, 25, 40, 20, 15, 30, 45, 20, 10]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  // Web Audio API soundwave analyzer
  useEffect(() => {
    let audioCtx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let animId: number;

    if (isMicOn) {
      navigator.mediaDevices?.getUserMedia({ audio: true }).then((stream) => {
        audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        analyser = audioCtx.createAnalyser();
        analyser.fftSize = 32;
        const source = audioCtx.createMediaStreamSource(stream);
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);
        const updateAudio = () => {
          analyser?.getByteFrequencyData(dataArray);
          const sliced = Array.from(dataArray.slice(0, 9)).map(v => Math.max(12, Math.min(100, (v / 255) * 100)));
          setAudioLevels(sliced);
          animId = requestAnimationFrame(updateAudio);
        };
        updateAudio();
      }).catch(() => {});
    }

    return () => {
      if (animId) cancelAnimationFrame(animId);
      if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
    };
  }, [isMicOn]);

  // Telemetry HUD Canvas overlay
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas || !isCameraOn) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const renderOverlay = () => {
      if (!canvas.parentElement) return;
      canvas.width = canvas.parentElement.clientWidth || 640;
      canvas.height = canvas.parentElement.clientHeight || 480;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);

      // Target head alignment bounding box
      const boxW = w * 0.45;
      const boxH = h * 0.6;
      const boxX = (w - boxW) / 2;
      const boxY = (h - boxH) / 2 - 15;

      ctx.strokeStyle = visionMetrics.posture_score > 80 ? 'rgba(16, 185, 129, 0.5)' : 'rgba(245, 158, 11, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(boxX, boxY, boxW, boxH);
      ctx.setLineDash([]);

      // Corner target brackets
      const bracketLen = 20;
      ctx.strokeStyle = 'rgba(99, 102, 241, 0.9)';
      ctx.lineWidth = 3;

      // Top-Left
      ctx.beginPath(); ctx.moveTo(boxX, boxY + bracketLen); ctx.lineTo(boxX, boxY); ctx.lineTo(boxX + bracketLen, boxY); ctx.stroke();
      // Top-Right
      ctx.beginPath(); ctx.moveTo(boxX + boxW - bracketLen, boxY); ctx.lineTo(boxX + boxW, boxY); ctx.lineTo(boxX + boxW, boxY + bracketLen); ctx.stroke();
      // Bottom-Left
      ctx.beginPath(); ctx.moveTo(boxX, boxY + boxH - bracketLen); ctx.lineTo(boxX, boxY + boxH); ctx.lineTo(boxX + bracketLen, boxY + boxH); ctx.stroke();
      // Bottom-Right
      ctx.beginPath(); ctx.moveTo(boxX + boxW - bracketLen, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH); ctx.lineTo(boxX + boxW, boxY + boxH - bracketLen); ctx.stroke();

      // Eye level tracker line
      const eyeY = boxY + boxH * 0.35;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(boxX + 15, eyeY);
      ctx.lineTo(boxX + boxW - 15, eyeY);
      ctx.stroke();

      ctx.fillStyle = 'rgba(56, 189, 248, 0.9)';
      ctx.font = '10px monospace';
      ctx.fillText('GAZE LEVEL TARGET', boxX + 20, eyeY - 6);

      // Shoulder alignment line
      const shoulderY = boxY + boxH * 0.82;
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.beginPath();
      ctx.moveTo(boxX - 30, shoulderY);
      ctx.lineTo(boxX + boxW + 30, shoulderY);
      ctx.stroke();

      animId = requestAnimationFrame(renderOverlay);
    };

    renderOverlay();
    return () => cancelAnimationFrame(animId);
  }, [isCameraOn, visionMetrics.posture_score]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [session?.turns, userAnswer, activeTab]);

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

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
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
    <div className="flex flex-col h-screen bg-[#0B0F19] text-slate-200 overflow-hidden select-none">
      {/* Top Header Bar */}
      <div className="h-12 bg-[#111621] border-b border-[#1E2532] flex items-center justify-between px-4 shrink-0 z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/30">
            <Circle className="w-2 h-2 fill-rose-500 text-rose-500 animate-pulse" />
            <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider">LIVE TELEMETRY</span>
          </div>
          <span className="text-xs font-mono text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">{formatTime(timer)}</span>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] text-emerald-400 font-bold">Stable Stream</span>
          </div>
          <span className="text-xs text-slate-400 border-l border-slate-700 pl-3">
            <span className="text-indigo-400 font-medium uppercase">{session.mode}</span> • {session.target_role}
          </span>
          <button
            onClick={toggleFullscreen}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
            title="Toggle Fullscreen"
          >
            <Maximize className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Video & Computer Vision HUD */}
        <div className="w-1/2 flex flex-col border-r border-[#1E2532] bg-[#0B0F19] relative">
          {/* Vision Metrics Top Floating HUD */}
          <div className="absolute top-4 left-4 z-20 space-y-2 max-w-[260px]">
            {[
              { label: 'Posture Score', value: visionMetrics.posture_score, icon: Activity, color: 'text-indigo-400' },
              { label: 'Eye Contact', value: visionMetrics.eye_contact_percentage, icon: Eye, color: 'text-cyan-400' },
              { label: 'Alignment', value: visionMetrics.shoulder_alignment_score, icon: ShieldCheck, color: 'text-emerald-400' },
              { label: 'Attention Focus', value: visionMetrics.attention_score, icon: Brain, color: 'text-purple-400' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-1.5 bg-black/75 backdrop-blur-md border border-slate-800/80 rounded-xl shadow-lg">
                <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                <span className="text-[10px] text-slate-300 font-medium w-24 truncate">{m.label}</span>
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden shrink-0">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${m.value > 80 ? 'bg-emerald-500' : m.value > 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${m.value}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white w-7 text-right">{Math.round(m.value)}%</span>
              </div>
            ))}
          </div>

          {/* Real-Time Mic Audio Waveform Bar (Floating Right Side) */}
          {isMicOn && (
            <div className="absolute top-4 right-4 z-20 flex items-center gap-1 p-2.5 bg-indigo-950/80 backdrop-blur-md border border-indigo-500/40 rounded-xl shadow-xl">
              <Volume2 className="w-4 h-4 text-indigo-400 animate-pulse mr-1" />
              {audioLevels.map((lvl, i) => (
                <div
                  key={i}
                  className="w-1 bg-indigo-400 rounded-full transition-all duration-75"
                  style={{ height: `${Math.max(4, (lvl / 100) * 24)}px` }}
                />
              ))}
            </div>
          )}

          {/* Main Video Screen with Canvas Overlay */}
          <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
            {isCameraOn ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover z-0 scale-x-[-1]"
                />
                <canvas
                  ref={canvasRef}
                  className="absolute inset-0 w-full h-full pointer-events-none z-10 scale-x-[-1]"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center text-slate-500 space-y-3 z-10">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-full">
                  <VideoOff className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-xs font-medium text-slate-400">Webcam video stream disabled</p>
              </div>
            )}

            {/* AI Interviewer Badge */}
            <div className="absolute bottom-6 left-6 z-20 flex items-center gap-3 p-3 bg-slate-900/90 backdrop-blur-xl border border-indigo-500/40 rounded-2xl shadow-2xl">
              <div className="relative">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center ${isMicOn ? 'ring-2 ring-indigo-400 animate-pulse' : ''}`}>
                  <Bot className="w-5 h-5 text-white" />
                </div>
                {isMicOn && <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full border-2 border-slate-900 animate-ping" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                  AI Interview Evaluator
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] text-indigo-300 font-medium">
                  {isMicOn ? 'Listening to candidate voice...' : session.status === 'completed' ? 'Evaluation Finished' : 'Evaluating response / Ready'}
                </p>
              </div>
            </div>
          </div>

          {/* Media & Session Action Controls */}
          <div className="h-20 bg-[#111621] border-t border-[#1E2532] flex items-center justify-center gap-6 shrink-0 z-20">
            <button onClick={() => setIsCameraOn(!isCameraOn)} className="flex flex-col items-center gap-1 group">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${isCameraOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-500/20 border border-rose-500/40 text-rose-400'}`}>
                {isCameraOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </div>
              <span className="text-[9px] text-slate-400 font-medium">{isCameraOn ? 'Camera On' : 'Camera Off'}</span>
            </button>

            <button onClick={toggleMic} className="flex flex-col items-center gap-1 group">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all border ${isMicOn ? 'bg-indigo-600/30 border-indigo-500 text-indigo-400 shadow-lg shadow-indigo-500/20' : 'bg-slate-800 border-transparent hover:bg-slate-700 text-slate-300'}`}>
                {isMicOn ? <Mic className="w-6 h-6 animate-pulse" /> : <MicOff className="w-6 h-6" />}
              </div>
              <span className="text-[9px] text-slate-400 font-semibold">{isMicOn ? 'Stop Mic' : 'Start Mic'}</span>
            </button>

            <button onClick={handleEndInterview} className="flex flex-col items-center gap-1 group">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 transition-colors">
                <PhoneOff className="w-5 h-5" />
              </div>
              <span className="text-[9px] text-slate-400 font-medium">End Interview</span>
            </button>
          </div>
        </div>

        {/* Right: Multi-Tab Interactive Sidebar */}
        <div className="w-1/2 flex flex-col bg-[#111621]">
          {/* Tab Navigation Header */}
          <div className="flex items-center justify-between px-5 pt-3 border-b border-[#1E2532] bg-[#111621] shrink-0">
            <div className="flex items-center gap-1">
              {[
                { id: 'transcript', label: 'Transcript', icon: MessageSquare },
                { id: 'telemetry', label: 'Telemetry', icon: Activity },
                { id: 'star', label: 'STAR Framework', icon: Layers },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors border-b-2 ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pb-2">
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timer)}
            </div>
          </div>

          {/* Tab Content Body */}
          <div className="flex-1 overflow-y-auto p-5" ref={scrollRef}>
            {/* Tab 1: Live Transcript */}
            {activeTab === 'transcript' && (
              <div className="space-y-5">
                {session.turns?.map((t: any, idx: number) => (
                  <div key={idx} className="space-y-4">
                    {/* AI Question */}
                    <div className="flex gap-3">
                      <div className="w-8 h-8 shrink-0 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
                        <Bot className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div className="flex-1 bg-slate-800/60 border border-slate-700/50 rounded-2xl rounded-tl-sm p-4">
                        <span className="text-[10px] font-bold text-indigo-400 mb-1 block uppercase tracking-wider">AI Interviewer</span>
                        <p className="text-sm text-slate-200 leading-relaxed">{t.question}</p>
                      </div>
                    </div>

                    {/* User Answer */}
                    {t.user_answer && (
                      <div className="flex gap-3 flex-row-reverse">
                        <div className="w-8 h-8 shrink-0 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
                          <User className="w-4 h-4 text-purple-400" />
                        </div>
                        <div className="flex-1 bg-[#0F1219] border border-[#1E2532] rounded-2xl rounded-tr-sm p-4">
                          <span className="text-[10px] font-bold text-slate-400 mb-1 block text-right uppercase tracking-wider">You</span>
                          <p className="text-sm text-slate-300 leading-relaxed text-right">{t.user_answer}</p>
                        </div>
                      </div>
                    )}

                    {/* Feedback */}
                    {t.feedback && (
                      <div className="ml-11 p-3 bg-emerald-950/30 border border-emerald-500/30 rounded-xl">
                        <span className="text-[10px] font-bold text-emerald-400 block mb-1 uppercase tracking-wider">Turn Feedback</span>
                        <p className="text-xs text-slate-300 leading-relaxed">{t.feedback}</p>
                      </div>
                    )}
                  </div>
                ))}

                {/* Active Answer Input */}
                {session.status !== 'completed' && (
                  <div className="flex gap-3 flex-row-reverse pt-2">
                    <div className="w-8 h-8 shrink-0 rounded-full bg-purple-600/20 border border-purple-500/30 flex items-center justify-center relative">
                      <User className="w-4 h-4 text-purple-400" />
                      {isMicOn && <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-rose-500 rounded-full animate-pulse" />}
                    </div>
                    <div className="flex-1 border border-dashed border-slate-700 bg-[#0F1219]/60 rounded-2xl p-4">
                      {isMicOn ? (
                        <p className="text-sm text-slate-300 text-right min-h-[48px]">
                          {userAnswer || <span className="text-slate-500 animate-pulse">Listening... speak your response...</span>}
                        </p>
                      ) : (
                        <div className="space-y-3">
                          <textarea
                            rows={3}
                            value={userAnswer}
                            onChange={(e) => setUserAnswer(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmitTurn(); } }}
                            placeholder="Type your response or enable microphone..."
                            className="w-full bg-transparent border-none text-sm text-slate-200 resize-none placeholder-slate-600 outline-none"
                          />
                          <div className="flex justify-end">
                            <button
                              onClick={handleSubmitTurn}
                              disabled={!userAnswer.trim() || loading}
                              className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl disabled:opacity-50 transition-colors shadow-md shadow-indigo-600/20"
                            >
                              <Send className="w-3.5 h-3.5" />
                              {loading ? 'Evaluating Response...' : 'Submit Response'}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Tab 2: Telemetry Breakdown */}
            {activeTab === 'telemetry' && (
              <div className="space-y-6">
                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-4 h-4 text-indigo-400" /> Real-Time Telemetry Metrics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block mb-1 font-medium">Posture Score</span>
                      <span className="text-xl font-bold text-indigo-400">{Math.round(visionMetrics.posture_score)}%</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block mb-1 font-medium">Eye Contact</span>
                      <span className="text-xl font-bold text-cyan-400">{Math.round(visionMetrics.eye_contact_percentage)}%</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block mb-1 font-medium">Head Pose Stability</span>
                      <span className="text-xl font-bold text-emerald-400">{Math.round(visionMetrics.head_pose_stability)}%</span>
                    </div>
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                      <span className="text-[10px] text-slate-500 block mb-1 font-medium">Attention Level</span>
                      <span className="text-xl font-bold text-purple-400">{Math.round(visionMetrics.attention_score)}%</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Mic className="w-4 h-4 text-emerald-400" /> Speech & Pacing Delivery
                  </h3>
                  <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Estimated Speed</span>
                    <span className="font-mono font-bold text-white">~135 WPM (Optimal)</span>
                  </div>
                  <div className="flex items-center justify-between text-xs p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-slate-400">Filler Word Counter</span>
                    <span className="font-mono font-bold text-emerald-400">0 detected in current turn</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: STAR Framework Guide */}
            {activeTab === 'star' && (
              <div className="space-y-4">
                <div className="p-4 bg-indigo-950/40 border border-indigo-500/30 rounded-2xl">
                  <h3 className="text-xs font-bold text-indigo-300 uppercase tracking-wider mb-2 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-indigo-400" /> STAR Method Structuring
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Use the STAR framework to structure behavioral and technical experience answers clearly.
                  </p>
                </div>

                {[
                  { title: 'S - Situation', desc: 'Set the context. Describe the specific event or challenge you faced.', color: 'border-blue-500/40 bg-blue-950/20' },
                  { title: 'T - Task', desc: 'Explain your responsibility in that situation. What goal were you trying to achieve?', color: 'border-purple-500/40 bg-purple-950/20' },
                  { title: 'A - Action', desc: 'Describe the specific steps YOU took to address the challenge.', color: 'border-emerald-500/40 bg-emerald-950/20' },
                  { title: 'R - Result', desc: 'Share the outcomes, metrics, lessons, or achievements resulting from your actions.', color: 'border-amber-500/40 bg-amber-950/20' },
                ].map((item, idx) => (
                  <div key={idx} className={`p-4 border rounded-xl ${item.color}`}>
                    <h4 className="text-xs font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
