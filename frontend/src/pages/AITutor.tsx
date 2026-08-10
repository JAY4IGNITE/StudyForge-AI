import React, { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Textarea } from '../components/ui/textarea';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { ScrollArea } from '../components/ui/scroll-area';
import { cn } from '../lib/utils';
import {
  SquarePen,
  Brain,
  Baby,
  Gavel,
  Paperclip,
  Send,
  Bot,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const conversationGroups = [
  {
    subject: 'Calculus 101',
    threads: ['Integration by Parts rules', 'Limits approaching infinity'],
  },
  {
    subject: 'Ancient Rome',
    threads: ['Fall of the Republic causes', 'Punic Wars timeline summary'],
  },
];

const personas = [
  { label: 'Standard Tutor', icon: Brain },
  { label: "Explain like I'm 16", icon: Baby },
  { label: 'Strict Assessor', icon: Gavel },
];

interface Message {
  role: 'tutor' | 'user';
  content: string;
}

export function AITutor() {
  const [inputText, setInputText] = useState('');
  const [activePersona, setActivePersona] = useState(1);
  const [activeThread, setActiveThread] = useState('Integration by Parts rules');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'tutor',
      content:
        'Welcome back to Calculus! We were looking at Integration by Parts. To refresh, the formula is:\n\n∫ u dv = uv - ∫ v du\n\nAre you ready to try a practice problem with x * cos(x), or would you like me to explain the "LIATE" rule first?',
    },
    {
      role: 'user',
      content:
        "Can you break down how to solve ∫ x * cos(x) dx step-by-step? I always get confused picking 'u' and 'dv'. Explain it simply.",
    },
    {
      role: 'tutor',
      content:
        'Absolutely! Think of Integration by Parts as a tactical trade. We want to trade a hard integral for an easier one.\n\nStep 1: The LIATE Rule\nTo pick u, we use LIATE to find what comes first in this list:\n- Logarithmic\n- Inverse Trig\n- Algebraic\n- Trigonometric\n- Exponential',
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', content: inputText }]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          content:
            'That is an interesting point! This is a mock response from StudyForge Tutor to keep your studies moving forward.',
        },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <Layout>
      <div className="-m-6 flex h-[calc(100vh-3rem)] overflow-hidden md:-m-10 md:h-[calc(100vh-5rem)]">
        {/* Conversation list */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-card/40 lg:flex">
          <div className="flex items-center justify-between border-b border-border p-4">
            <h2 className="text-sm font-medium text-foreground">Conversations</h2>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-ember hover:bg-ember/10 hover:text-ember">
              <SquarePen className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 p-3">
            <div className="space-y-6">
              {conversationGroups.map((group) => (
                <div key={group.subject}>
                  <h3 className="mb-2 px-2 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {group.subject}
                  </h3>
                  <div className="space-y-1">
                    {group.threads.map((thread) => (
                      <button
                        key={thread}
                        onClick={() => setActiveThread(thread)}
                        className={cn(
                          'w-full truncate rounded-md px-3 py-2 text-left text-sm transition-colors',
                          activeThread === thread
                            ? 'border border-ember/25 bg-ember/10 text-ember shadow-sm'
                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                        )}
                      >
                        {thread}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </aside>

        {/* Chat panel */}
        <section className="relative flex flex-1 flex-col bg-background">
          <div className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 overflow-x-auto py-1">
              <span className="mr-1 shrink-0 font-mono text-xs text-muted-foreground">Persona:</span>
              {personas.map((persona, i) => {
                const Icon = persona.icon;
                const isActive = activePersona === i;
                return (
                  <button
                    key={persona.label}
                    onClick={() => setActivePersona(i)}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs transition-colors',
                      isActive
                        ? 'border-ember/40 bg-ember/10 font-medium text-ember'
                        : 'border-border bg-secondary/40 text-foreground hover:border-ember/30'
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {persona.label}
                  </button>
                );
              })}
            </div>
            <Badge variant="gold" className="shrink-0 gap-1.5 rounded-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              GPT-4o Active
            </Badge>
          </div>

          <ScrollArea className="flex-1">
            <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 p-6 md:p-8">
              <div className="flex justify-center">
                <Badge variant="secondary" className="rounded-full font-sans text-[11px] font-normal">
                  Today, 10:42 AM
                </Badge>
              </div>

              <AnimatePresence initial={false}>
                {messages.map((msg, idx) =>
                  msg.role === 'tutor' ? (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex w-full items-start gap-4"
                    >
                      <Avatar className="mt-1 h-8 w-8 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-ember-gradient">
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex max-w-[85%] flex-col gap-2">
                        <span className="ml-1 text-xs font-medium text-muted-foreground">StudyForge Tutor</span>
                        <div className="whitespace-pre-wrap rounded-2xl rounded-tl-sm border border-border bg-card p-4 leading-relaxed text-foreground shadow-sm">
                          {msg.content}
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key={idx} 
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                      className="flex w-full items-start justify-end gap-4"
                    >
                      <div className="flex max-w-[85%] flex-col items-end gap-2">
                        <span className="mr-1 text-xs font-medium text-muted-foreground">You</span>
                        <div className="whitespace-pre-wrap rounded-2xl rounded-tr-sm bg-ember-gradient p-4 leading-relaxed text-ember-foreground shadow-[0_8px_20px_-10px_hsl(var(--ember)/0.5)]">
                          {msg.content}
                        </div>
                      </div>
                      <Avatar className="mt-1 h-8 w-8 shrink-0 shadow-sm">
                        <AvatarFallback className="bg-secondary text-foreground">U</AvatarFallback>
                      </Avatar>
                    </motion.div>
                  )
                )}

                {isTyping && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="flex w-full items-start gap-4"
                  >
                    <Avatar className="relative mt-1 h-8 w-8 shrink-0 shadow-sm">
                      <AvatarFallback className="bg-ember-gradient">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                      <div className="absolute inset-0 animate-spin rounded-full border-2 border-ember border-t-gold" />
                    </Avatar>
                    <div className="flex w-full max-w-[85%] flex-col gap-2">
                      <div className="ml-1 flex items-center gap-2">
                        <span className="text-xs font-medium text-muted-foreground">StudyForge Tutor</span>
                        <span className="flex items-center gap-1 font-mono text-[11px] text-muted-foreground">
                          <Sparkles className="h-3 w-3 text-gold" /> Generating
                        </span>
                      </div>
                      <div className="w-max rounded-2xl rounded-tl-sm border border-border bg-card p-4 shadow-sm">
                        <div className="flex h-6 items-center gap-1 px-1">
                          <motion.span 
                            animate={{ y: [0, -5, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.6, ease: "easeInOut" }} 
                            className="h-1.5 w-1.5 rounded-full bg-ember/60" 
                          />
                          <motion.span 
                            animate={{ y: [0, -5, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.1, ease: "easeInOut" }} 
                            className="h-1.5 w-1.5 rounded-full bg-ember/60" 
                          />
                          <motion.span 
                            animate={{ y: [0, -5, 0] }} 
                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2, ease: "easeInOut" }} 
                            className="h-1.5 w-1.5 rounded-full bg-ember/60" 
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <div className="z-20 border-t border-border bg-card/60 p-4 md:px-8 md:py-6">
            <div className="mx-auto max-w-4xl">
              <div className="flex items-end gap-2 rounded-xl border border-input bg-secondary/40 p-2 shadow-sm transition-all focus-within:border-ember/40 focus-within:ring-2 focus-within:ring-ember/15">
                <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-ember">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Message StudyForge Tutor (Type '/' for commands)..."
                  className="min-h-[48px] max-h-32 flex-1 resize-none border-none bg-transparent px-2 py-3 shadow-none focus-visible:ring-0"
                />
                <Button onClick={handleSend} size="icon" className="shrink-0 rounded-lg">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="mt-2 text-center text-xs text-muted-foreground">
                AI can make mistakes. Consider verifying important information.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
