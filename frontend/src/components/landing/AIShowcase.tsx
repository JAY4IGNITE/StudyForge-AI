import React from 'react';
import { Sparkles, Code2, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const AIShowcase: React.FC = () => {
  return (
    <section id="ai-coach" className="border-t border-border bg-background/20 backdrop-blur-md py-24">
      <div className="container grid items-center gap-14 md:grid-cols-2">
        <div>
          <Badge variant="steel" className="gap-1.5 py-1">
            <Sparkles className="h-3 w-3" />
            ADAPTS TO YOU
          </Badge>
          <h2 className="mt-5 text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
            The AI notices what you keep missing.
          </h2>
          <p className="mt-4 max-w-md text-secondary">
            StudyForge tracks patterns across your practice sessions and mock
            interviews, then adjusts your path automatically — no manual
            re-planning required.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card/45 backdrop-blur-md p-5 shadow-[0_20px_50px_-20px_hsl(var(--steel)/0.25)]">
          <div className="flex items-center gap-2 border-b border-border pb-3 text-sm font-medium">
            <MessageCircle className="h-4 w-4 text-steel" />
            AI Coach Session
          </div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="rounded-md bg-secondary/60 p-3 text-secondary">
              You've missed 3 dynamic programming problems this week.
            </div>
            <div className="rounded-md border border-ember/20 bg-ember/5 p-3">
              Recommending: knapsack variants, then interview replay of your
              last DP session.
            </div>
            <div className="flex items-center gap-2 rounded-md bg-secondary/40 p-3 font-mono text-xs text-secondary">
              <Code2 className="h-3.5 w-3.5 text-gold" />
              Next: Coin Change II — adaptive difficulty: medium
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
