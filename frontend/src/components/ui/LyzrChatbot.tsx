import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, User, RefreshCw } from 'lucide-react';
import { useAuth } from '../../app/AuthProvider';
import { apiClient } from '../../lib/axios';
import { Button } from './button';
import { Input } from './input';
import { Badge } from './badge';
import { Avatar, AvatarFallback } from './avatar';
import { ScrollArea } from './scroll-area';
import { cn } from '../../lib/utils';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const LyzrChatbot: React.FC = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Hello ${user?.display_name || 'there'}! I am your StudyForge AI Mentor, powered by NVIDIA NIM (Llama 3.1 70B).\n\nAsk me any question, request step-by-step problem solutions, or start a mock interview!`,
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
      const res = await apiClient.post('/ai/chat', {
        message: userText,
        history: currentHistory,
      });

      const replyText = res.data.reply || 'I am analyzing your request using NVIDIA NIM Llama 3.1.';

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
          text: 'I encountered a network issue communicating with the NVIDIA NIM AI service. Please verify your backend server status.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-ember-gradient px-5 py-3.5 text-ember-foreground shadow-[0_10px_30px_-8px_hsl(var(--ember)/0.6)] transition-transform hover:scale-105"
        >
          <div className="relative">
            <Bot className="h-6 w-6 animate-pulse" />
            <Sparkles className="absolute -right-1 -top-1 h-3.5 w-3.5 text-[hsl(var(--ember-foreground))]" />
          </div>
          <span className="text-sm font-semibold tracking-wide">AI Mentor</span>
          <span className="absolute -right-1 -top-1 flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
          </span>
        </button>
      )}

      {isOpen && (
        <div className="flex h-[580px] w-[380px] flex-col overflow-hidden rounded-3xl border border-ember/25 bg-card/95 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-300 sm:w-[420px]">
          <div className="bg-forge-glow flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-3">
              <div className="relative rounded-2xl border border-ember/30 bg-ember/15 p-2.5">
                <Bot className="h-6 w-6 text-ember" />
                <Sparkles className="absolute right-1 top-1 h-3 w-3 text-gold" />
              </div>
              <div>
                <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
                  StudyForge AI Mentor
                  <Badge variant="gold" className="rounded-full font-sans text-[10px]">
                    GPT-4.1
                  </Badge>
                </h3>
                <p className="text-xs text-muted-foreground">RAG knowledge enabled • Socratic tutor</p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9 shrink-0">
              <X className="h-4 w-4" />
            </Button>
          </div>

          <ScrollArea className="flex-1">
            <div className="space-y-4 p-4 text-sm">
              {messages.map((msg) => (
                <div key={msg.id} className={cn('flex gap-3', msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback
                      className={msg.sender === 'user' ? 'bg-secondary text-foreground' : 'bg-ember-gradient'}
                    >
                      {msg.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      'max-w-[80%] whitespace-pre-wrap rounded-2xl p-3.5 leading-relaxed',
                      msg.sender === 'user'
                        ? 'rounded-tr-none bg-ember-gradient text-ember-foreground shadow-[0_8px_20px_-10px_hsl(var(--ember)/0.5)]'
                        : 'rounded-tl-none border border-border bg-secondary/30 text-foreground'
                    )}
                  >
                    <p>{msg.text}</p>
                    <span className="mt-1 block text-right text-[10px] opacity-60">{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-ember/15 text-ember">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex items-center gap-2 rounded-2xl rounded-tl-none border border-border bg-secondary/30 px-4 py-3 text-xs italic text-muted-foreground">
                    <Sparkles className="h-3.5 w-3.5 animate-pulse text-ember" />
                    Searching knowledge base &amp; formulating tutor response...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleSendMessage} className="flex items-center gap-2 border-t border-border bg-card p-3">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question or request a mock interview..."
              className="h-11 flex-1 text-xs"
            />
            <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className="h-11 w-11 shrink-0">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
