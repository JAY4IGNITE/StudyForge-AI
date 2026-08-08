import React, { useState, useEffect, useRef } from 'react';
import { apiClient } from '../../lib/axios';
import { Bot, User, Mic, MicOff, VideoOff, PhoneOff, CheckCircle2 } from 'lucide-react';
import { FeedbackModal } from '../feedback/FeedbackModal';

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
        status: 'active'
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
      <div className="min-h-screen bg-[#0B0F19] text-slate-200 flex items-center justify-center p-6">
        <div className="w-full max-w-md p-8 bg-[#151923] border border-[#1E2532] rounded-3xl space-y-6">
          <div className="flex flex-col items-center mb-8">
             <div className="w-20 h-20 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4">
                <Bot className="w-10 h-10 text-cyan-400" />
             </div>
             <h2 className="text-2xl font-bold text-white">Setup Mock Interview</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0F19] border border-[#1E2532] rounded-xl focus:ring-1 focus:ring-cyan-500 focus:outline-none text-slate-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">Interview Type</label>
              <select
                value={interviewType}
                onChange={(e) => setInterviewType(e.target.value)}
                className="w-full px-4 py-3 bg-[#0B0F19] border border-[#1E2532] rounded-xl focus:ring-1 focus:ring-cyan-500 focus:outline-none text-slate-100"
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
            className="w-full py-4 mt-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-xl transition-all disabled:opacity-50"
          >
            {loading ? 'Connecting to Interviewer...' : 'Start Session'}
          </button>
        </div>
      </div>
    );
  }

  const latestFeedback = interview.turns?.slice().reverse().find((t: any) => t.feedback)?.feedback;

  return (
    <div className="flex flex-col h-screen bg-[#0B0F19] text-slate-200 overflow-hidden font-sans">
      <div className="h-10 bg-[#0B0F19] border-b border-[#1E2532] flex items-center px-4 overflow-hidden shrink-0">
        <p className="text-xs text-cyan-400 whitespace-nowrap overflow-hidden text-ellipsis w-full font-mono">
          [AI Analysis] {latestFeedback || "System initialized. Preparing adaptive questioning logic..."}
        </p>
      </div>

      <div className="flex flex-1 overflow-hidden">
        
        <div className="w-1/2 flex flex-col border-r border-[#1E2532] bg-[#0B0F19] relative">
          <div className="absolute top-6 left-6 p-4 border border-[#1E2532] rounded-xl bg-[#0F1219]">
            <p className="text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-wider">Confidence</p>
            <div className="w-24 h-1 bg-slate-800 rounded-full overflow-hidden">
               <div className="h-full bg-cyan-400 w-3/4 rounded-full"></div>
            </div>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center">
             <div className="relative w-64 h-64 flex items-center justify-center">
                <div className={`absolute w-full h-full rounded-full border border-cyan-500/20 ${isListening ? 'animate-ping duration-1000' : ''}`}></div>
                <div className="absolute w-48 h-48 rounded-full border 2 border-cyan-500/30"></div>
                <div className="absolute w-32 h-32 rounded-full border-4 border-cyan-500/40"></div>
                <div className="w-16 h-16 rounded-full bg-cyan-400 shadow-[0_0_50px_20px_rgba(6,182,212,0.5)] z-10"></div>
             </div>
             
             <div className="mt-12 flex flex-col items-center">
                <h2 className="text-2xl font-bold text-white mb-2">Interviewer AI</h2>
                <div className="flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></div>
                   <span className="text-sm font-semibold tracking-widest text-cyan-400 uppercase">LISTENING</span>
                </div>
             </div>
          </div>

          <div className="h-24 bg-[#111621] border-t border-[#1E2532] flex items-center justify-center gap-8 shrink-0">
             <button className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-full bg-[#1E2532] group-hover:bg-[#2A3441] flex items-center justify-center transition-colors">
                   <VideoOff className="w-5 h-5 text-slate-400" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">Stop Video</span>
             </button>
             
             <button 
                onClick={toggleListening}
                className="flex flex-col items-center gap-2 group"
             >
                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors border-2 ${isListening ? 'bg-cyan-500/20 border-cyan-500' : 'bg-[#1E2532] border-transparent group-hover:bg-[#2A3441]'}`}>
                   {isListening ? <Mic className="w-6 h-6 text-cyan-400" /> : <MicOff className="w-6 h-6 text-slate-400" />}
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">{isListening ? 'Mute Mic' : 'Unmute Mic'}</span>
             </button>

             <button 
                onClick={() => setInterview({ ...interview, status: 'completed' })}
                className="flex flex-col items-center gap-2 group"
             >
                <div className="w-12 h-12 rounded-full bg-rose-500/10 group-hover:bg-rose-500/20 flex items-center justify-center transition-colors border border-rose-500/30">
                   <PhoneOff className="w-5 h-5 text-rose-500" />
                </div>
                <span className="text-[10px] text-slate-400 font-semibold">End Interview</span>
             </button>
          </div>
        </div>

        <div className="w-1/2 flex flex-col bg-[#111621] relative">
           <div className="flex items-center justify-between p-6 border-b border-[#1E2532] shrink-0">
              <h2 className="text-xl font-bold text-white">Live Transcript</h2>
              <div className="px-3 py-1 rounded-md bg-[#1E2532] text-xs font-mono text-slate-300">
                {formatTime(timer)}
              </div>
           </div>

           <div className="flex-1 overflow-y-auto p-6 space-y-6" ref={scrollRef}>
              {interview.turns?.map((t: any, idx: number) => (
                <div key={idx} className="space-y-6">
                   <div className="flex gap-4">
                      <div className="w-10 h-10 shrink-0 rounded-full bg-[#1E2532] flex items-center justify-center">
                         <Bot className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div className="flex-1 bg-[#1E2532] border border-[#2A3441] rounded-2xl rounded-tl-sm p-5">
                         <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-bold text-cyan-400">Interviewer AI</span>
                            <span className="text-[10px] text-slate-500">{(new Date()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                         </div>
                         <p className="text-sm text-slate-300 leading-relaxed">{t.question}</p>
                      </div>
                   </div>

                   {t.answer && (
                      <div className="flex gap-4 flex-row-reverse">
                         <div className="w-10 h-10 shrink-0 rounded-full bg-[#1E2532] flex items-center justify-center">
                            <User className="w-5 h-5 text-slate-400" />
                         </div>
                         <div className="flex-1 bg-[#0F1219] border border-[#1E2532] rounded-2xl rounded-tr-sm p-5">
                            <div className="flex items-center justify-end gap-2 mb-2">
                               <span className="text-[10px] text-slate-500">{(new Date()).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                               <span className="text-xs font-bold text-slate-300">You</span>
                            </div>
                            <p className="text-sm text-slate-300 leading-relaxed text-right">{t.answer}</p>
                         </div>
                      </div>
                   )}
                </div>
              ))}

              {interview.status !== 'completed' && (
                <div className="flex gap-4 flex-row-reverse mt-6">
                   <div className="w-10 h-10 shrink-0 rounded-full bg-[#1E2532] flex items-center justify-center">
                      <div className="relative">
                         <User className="w-5 h-5 text-slate-400" />
                         {isListening && <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full animate-pulse"></div>}
                      </div>
                   </div>
                   <div className="flex-1 border border-dashed border-[#2A3441] bg-[#0F1219]/50 rounded-2xl p-5 relative">
                      <div className="flex items-center justify-end gap-2 mb-2">
                         <span className="text-xs font-bold text-slate-400">Now • You</span>
                      </div>
                      
                      {isListening ? (
                         <p className="text-sm text-slate-300 leading-relaxed text-right">
                           {userAnswer || <span className="text-slate-500 animate-pulse">Listening...</span>}
                         </p>
                      ) : (
                         <div className="flex flex-col gap-3">
                           <textarea
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
                             className="w-full bg-transparent border-none focus:ring-0 text-sm text-slate-300 text-right resize-none placeholder-slate-600 outline-none"
                           />
                           <div className="flex justify-end">
                             <button 
                               onClick={handleSubmitTurn}
                               disabled={!userAnswer.trim() || loading}
                               className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-lg text-slate-300 disabled:opacity-50 transition-colors"
                             >
                               Send (Enter)
                             </button>
                           </div>
                         </div>
                      )}
                      
                   </div>
                </div>
              )}

              {interview.status === 'completed' && (
                <div className="p-6 mt-8 bg-cyan-950/20 border border-cyan-900/30 rounded-2xl text-center">
                   <CheckCircle2 className="w-8 h-8 text-cyan-500 mx-auto mb-3" />
                   <h3 className="text-lg font-bold text-cyan-400 mb-2">Interview Completed</h3>
                   <p className="text-sm text-slate-400 mb-4">
                     Great job! The AI has finished its evaluation. Check the feedback dashboard for a comprehensive review.
                   </p>
                   <button
                     onClick={() => setIsFeedbackOpen(true)}
                     className="px-6 py-2 bg-cyan-600 hover:bg-cyan-500 text-white text-sm font-bold rounded-lg transition-colors"
                   >
                     View Feedback
                   </button>
                </div>
              )}
           </div>
        </div>
      </div>

      <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} />
    </div>
  );
};
