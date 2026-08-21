import React from 'react';
import { Card } from '../ui/card';
import { AnimatedGradient } from '../landing/AnimatedGradient';

interface AuthShellProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ icon: Icon, title, subtitle, children }) => (
  <div className="relative flex min-h-screen items-center justify-center bg-background p-4 sm:p-6 overflow-hidden">
    <AnimatedGradient className="fixed inset-0 z-0 h-full w-full" />
    <Card className="relative z-10 w-full max-w-lg p-8 sm:p-10 shadow-2xl overflow-hidden border border-border/60 bg-card/85 backdrop-blur-xl hover:border-ember/40">
      <div className="mb-6 flex flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_20px_-6px_hsl(var(--ember)/0.6)]">
          <Icon className="h-6 w-6 text-ember-foreground" strokeWidth={2.25} />
        </div>
        <h1 className="font-display text-2xl font-medium tracking-tight text-foreground">{title}</h1>
        <p className="mt-2 max-w-[280px] text-sm text-secondary">{subtitle}</p>
      </div>
      {children}
    </Card>
  </div>
);
