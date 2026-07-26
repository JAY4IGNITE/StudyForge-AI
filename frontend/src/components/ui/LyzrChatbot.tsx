import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../../app/AuthProvider';
import { apiClient } from '../../lib/axios';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

const LYZR_AGENT_ID = '6a65a46f14f796988ca804f8';

export const LyzrChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.display_name || 'there'}! 👋 I am your **StudyForge AI Mentor** powered by NVIDIA NIM (Llama 3.1 70B).\n\nAsk me any question, request step-by-step problem solutions, or start a mock interview!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // Call backend FastAPI endpoint powered by NVIDIA NIM
      const res = await apiClient.post('/ai/chat', {
        message: userText,
        history: currentHistory,
      });

      const replyText = res.data.reply || "I am analyzing your request using NVIDIA NIM Llama 3.1.";

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: "I encountered a network issue communicating with the NVIDIA NIM AI service. Please verify your backend server status.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-full shadow-2xl shadow-indigo-500/40 border border-indigo-400/30 transition-all duration-300 transform hover:scale-105"
        >
          <div className="relative">
            <Bot className="w-6 h-6 text-white animate-pulse" />
            <Sparkles className="w-3.5 h-3.5 text-amber-300 absolute -top-1 -right-1" />
          </div>
          <span className="font-semibold text-sm tracking-wide">AI Mentor</span>
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
        </button>
      )}

      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="w-[380px] sm:w-[420px] h-[580px] bg-slate-900/95 border border-indigo-500/30 rounded-3xl shadow-2xl backdrop-blur-xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-indigo-900/80 via-slate-900 to-purple-900/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative p-2.5 bg-indigo-600/30 border border-indigo-500/40 rounded-2xl">
                <Bot className="w-6 h-6 text-indigo-400" />
                <Sparkles className="w-3 h-3 text-amber-300 absolute top-1 right-1" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                  StudyForge AI Mentor
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                    GPT-4.1
                  </span>
                </h3>
                <p className="text-xs text-slate-400">RAG Knowledge Enabled • Socratic Tutor</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-sm scrollbar-thin scrollbar-thumb-slate-800">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-purple-600 text-white'
                      : 'bg-indigo-600/30 border border-indigo-500/30 text-indigo-400'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                <div
                  className={`max-w-[80%] rounded-2xl p-3.5 ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-tr-none shadow-md shadow-indigo-600/20'
                      : 'bg-slate-800/80 text-slate-200 border border-slate-700/60 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  <p className="leading-relaxed">{msg.text}</p>
                  <span className="text-[10px] opacity-60 mt-1 block text-right">{msg.timestamp}</span>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-3 items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                </div>
                <div className="bg-slate-800/80 text-slate-400 border border-slate-700/60 rounded-2xl rounded-tl-none px-4 py-3 text-xs italic flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  Searching Knowledge Base & Formulating Tutor Response...
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or request a mock interview..."
              className="flex-1 bg-slate-800/80 text-slate-100 placeholder-slate-500 text-xs rounded-xl px-4 py-3 border border-slate-700/60 focus:outline-none focus:border-indigo-500/60 transition-colors"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl transition-all shadow-md shadow-indigo-600/30"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
