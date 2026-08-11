import React from 'react';
import { ArrowUpRight, Sparkles, Target, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { useAuth } from '../../app/AuthProvider';

export const DashboardHeader: React.FC = () => {
  const { user } = useAuth();
  
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const name = user?.display_name?.split(' ')[0] || 'Scholar';

  return (
    <Card className="relative overflow-hidden border-border bg-card/60 p-6 md:p-8 backdrop-blur-md shadow-lg">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-ember/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-20 left-10 h-64 w-64 rounded-full bg-steel/10 blur-[80px]" />
      
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
        
        {/* Left Section: Greeting & Readiness */}
        <div className="flex-1 space-y-4">
          <h1 className="font-display text-3xl font-medium tracking-tight text-foreground">
            {greeting}, {name} 👋
          </h1>
          
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-secondary uppercase tracking-wider">Placement Readiness</span>
            <div className="flex items-center gap-2 rounded-full bg-ember/10 px-3 py-1 border border-ember/20">
              <Sparkles className="h-4 w-4 text-ember" />
              <span className="font-mono text-lg font-bold text-ember">72%</span>
              <span className="flex items-center text-xs font-semibold text-emerald-500">
                <ArrowUpRight className="h-3 w-3" /> 8%
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div className="rounded-lg bg-background/50 p-4 border border-border/50">
              <span className="text-xs text-secondary mb-1 block">You are strongest in:</span>
              <span className="text-sm font-medium text-foreground">OOP • DBMS • Java</span>
            </div>
            <div className="rounded-lg bg-background/50 p-4 border border-ember/30 bg-ember/5">
              <span className="text-xs text-secondary mb-1 block">Focus next:</span>
              <span className="text-sm font-medium text-ember">Dynamic Programming • Sliding Window</span>
            </div>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="flex flex-col gap-3 shrink-0 w-full md:w-64">
          <Button className="w-full gap-2 bg-ember text-ember-foreground hover:bg-ember/90 h-12 shadow-lg shadow-ember/20">
            Continue Preparation
            <ArrowRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="w-full gap-2 h-12 border-border bg-background/50 backdrop-blur-sm hover:bg-secondary">
            <Target className="h-4 w-4" />
            Take Today's Challenge
          </Button>
        </div>
        
      </div>
    </Card>
  );
};
