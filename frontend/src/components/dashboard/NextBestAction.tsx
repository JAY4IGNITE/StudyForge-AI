import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { ArrowRight, AlertCircle } from 'lucide-react';

export const NextBestAction: React.FC = () => {
  return (
    <Card className="flex flex-col h-full border-border bg-card/40 p-6 backdrop-blur-md relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <AlertCircle className="w-32 h-32 text-destructive" />
      </div>
      
      <div className="flex items-center gap-2 mb-4 relative z-10">
        <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
        <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary">Your Next Best Action</h3>
      </div>

      <div className="relative z-10 flex-1 flex flex-col">
        <h4 className="font-display text-2xl font-semibold text-foreground mb-1">Dynamic Programming</h4>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm text-secondary">Mastery:</span>
          <span className="font-mono font-medium text-destructive">43%</span>
        </div>

        <div className="space-y-1 mb-6">
          <p className="text-sm font-medium text-foreground">You are struggling with:</p>
          <ul className="text-sm text-secondary list-disc list-inside">
            <li>State definition</li>
            <li>Transition logic</li>
          </ul>
        </div>

        <div className="mt-auto space-y-4">
          <div className="rounded-lg bg-background/50 p-3 border border-border/50">
            <p className="text-[10px] font-medium text-secondary uppercase tracking-wider mb-1">Recommended Plan</p>
            <p className="text-sm font-medium text-foreground">3 Easy → 2 Medium → AI explanation</p>
          </div>
          <Button className="w-full gap-2 bg-foreground text-background hover:bg-foreground/90">
            Start Practice
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};
