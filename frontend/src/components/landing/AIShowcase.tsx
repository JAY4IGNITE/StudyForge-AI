import React from 'react';
import { CheckCircle2, Code2, MessageCircle, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const SIGNALS = [
  { label: 'Concept recall', value: '92%', tone: 'text-success' },
  { label: 'Implementation speed', value: '+18%', tone: 'text-steel' },
  { label: 'Interview clarity', value: 'Good', tone: 'text-gold' },
];

const TOPICS = [
  { label: 'Recursion', value: 82 },
  { label: 'Memoization', value: 68 },
  { label: 'State design', value: 57 },
];

export const AIShowcase: React.FC = () => {
  return (
    <section id="ai-coach" className="border-t border-border/70 bg-background/30 py-24 backdrop-blur-md">
      <div className="container grid items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div className="max-w-xl">
          <Badge variant="steel" className="gap-1.5 border-steel/25 bg-steel/10 px-3 py-1 text-steel">
            <Sparkles className="h-3 w-3" />
            Adapts to you
          </Badge>
          <h2 className="mt-5 text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
            The AI notices what you keep missing.
          </h2>
          <p className="mt-4 leading-7 text-secondary">
            StudyForge tracks patterns across your practice sessions and mock
            interviews, then adjusts your path automatically without manual
            re-planning.
          </p>

          <div className="mt-8 space-y-3">
            {SIGNALS.map((signal) => (
              <div key={signal.label} className="flex items-center justify-between rounded-lg border border-border/70 bg-card/50 px-4 py-3 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-4 w-4 text-success" />
                  <span className="text-sm text-secondary">{signal.label}</span>
                </div>
                <span className={`font-mono text-sm ${signal.tone}`}>{signal.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-border/75 bg-card/70 p-4 shadow-[0_28px_70px_-34px_hsl(var(--steel)/0.5)] backdrop-blur-xl sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <MessageCircle className="h-4 w-4 text-steel" />
              AI Coach Session
            </div>
            <div className="flex items-center gap-2 rounded-md border border-border/70 bg-background/50 px-2.5 py-1 text-xs text-secondary">
              <TrendingUp className="h-3.5 w-3.5 text-success" />
              Updated 2 min ago
            </div>
          </div>

          <div className="mt-5 grid gap-3 text-sm">
            <div className="max-w-[88%] rounded-lg bg-secondary/60 p-3 text-secondary">
              You've missed 3 dynamic programming problems this week.
            </div>
            <div className="ml-auto max-w-[92%] rounded-lg border border-ember/20 bg-ember/10 p-3 text-foreground">
              Recommending: knapsack variants, then interview replay of your
              last DP session.
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-background/50 p-3 font-mono text-xs text-secondary">
              <Code2 className="h-3.5 w-3.5 text-gold" />
              Next: Coin Change II | adaptive difficulty: medium
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-border/70 bg-background/50 p-4">
            <div className="flex items-center justify-between gap-4 text-xs">
              <span className="font-medium text-secondary">Topic strength</span>
              <span className="font-mono text-steel">72/100</span>
            </div>
            <div className="mt-4 space-y-3">
              {TOPICS.map((topic) => (
                <div key={topic.label}>
                  <div className="flex justify-between text-xs text-secondary">
                    <span>{topic.label}</span>
                    <span>{topic.value}%</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-secondary/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-steel via-ember to-gold"
                      style={{ width: `${topic.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
