import React from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle2, Circle, ArrowRightCircle, Sparkles } from 'lucide-react';

const planItems = [
  { id: 1, topic: 'Arrays', time: '30 min', status: 'completed' },
  { id: 2, topic: 'OOP', time: '25 min', status: 'completed' },
  { id: 3, topic: 'Sliding Window', time: '45 min', status: 'current' },
  { id: 4, topic: 'SQL', time: '30 min', status: 'pending' },
  { id: 5, topic: 'Mock Interview', time: '20 min', status: 'pending' },
];

export const TodayPlan: React.FC = () => {
  return (
    <Card className="flex flex-col h-full border-border bg-card/40 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-medium tracking-tight text-foreground">Today's Plan</h3>
        <Button variant="ghost" size="sm" className="h-8 text-xs gap-1.5 text-ember hover:text-ember hover:bg-ember/10">
          <Sparkles className="h-3.5 w-3.5" />
          Re-plan
        </Button>
      </div>

      <div className="space-y-2 mb-8 flex-1">
        {planItems.map((item) => (
          <div 
            key={item.id} 
            className={`flex items-center justify-between p-2.5 rounded-md transition-colors ${
              item.status === 'current' ? 'bg-ember/10 border border-ember/20' : 'hover:bg-secondary/10'
            }`}
          >
            <div className="flex items-center gap-3">
              {item.status === 'completed' && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
              {item.status === 'current' && <ArrowRightCircle className="h-4 w-4 text-ember" />}
              {item.status === 'pending' && <Circle className="h-4 w-4 text-secondary/50" />}
              <span className={`text-sm font-medium ${
                item.status === 'completed' ? 'text-secondary line-through' :
                item.status === 'current' ? 'text-ember' : 'text-foreground'
              }`}>
                {item.topic}
              </span>
            </div>
            <span className="font-mono text-xs text-secondary">{item.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto">
        <div className="flex items-end justify-between mb-2">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">Progress</span>
          <span className="font-mono text-xs font-medium text-foreground">2h 10m / 3h <span className="text-secondary ml-1">(72%)</span></span>
        </div>
        <div className="h-2 w-full rounded-full bg-secondary/20 overflow-hidden mb-5">
          <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: '72%' }} />
        </div>
        <div className="flex gap-3">
          <Button className="flex-1 bg-foreground text-background hover:bg-foreground/90">Resume</Button>
          <Button variant="outline" className="flex-1 bg-background/50 border-border hover:bg-secondary">Skip</Button>
        </div>
      </div>
    </Card>
  );
};
