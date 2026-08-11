import React from 'react';
import { Card } from '../ui/card';

const skills = [
  { name: 'DSA', score: 68 },
  { name: 'CS Fundamentals', score: 78 },
  { name: 'Aptitude', score: 61 },
  { name: 'Projects', score: 83 },
  { name: 'Resume', score: 76 },
  { name: 'Interview', score: 65 },
];

export const ReadinessScore: React.FC = () => {
  const overall = 72;
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overall / 100) * circumference;

  return (
    <Card className="flex flex-col h-full border-border bg-card/40 p-6 backdrop-blur-md">
      <h3 className="font-display text-lg font-medium tracking-tight text-foreground mb-6">Placement Readiness</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
        {/* Radial Chart */}
        <div className="relative flex items-center justify-center shrink-0">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle
              className="text-secondary/20"
              strokeWidth="12"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
            />
            <circle
              className="text-ember transition-all duration-1000 ease-out"
              strokeWidth="12"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r={radius}
              cx="80"
              cy="80"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="font-mono text-3xl font-bold text-foreground">{overall}%</span>
            <span className="text-[10px] uppercase tracking-wider text-secondary">Overall</span>
          </div>
        </div>

        {/* Skill Breakdown */}
        <div className="w-full space-y-3">
          {skills.map((skill) => (
            <div key={skill.name} className="flex items-center gap-3">
              <span className="text-sm font-medium text-foreground w-32 truncate">{skill.name}</span>
              <div className="flex-1 h-2 rounded-full bg-secondary/20 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-steel transition-all duration-1000 ease-out"
                  style={{ width: `${skill.score}%` }}
                />
              </div>
              <span className="font-mono text-xs font-semibold text-secondary w-8 text-right">{skill.score}%</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
