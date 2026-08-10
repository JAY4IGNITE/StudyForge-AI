import React from 'react';
import { Card } from '../ui/card';

interface AuthShellProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export const AuthShell: React.FC<AuthShellProps> = ({ icon: Icon, title, subtitle, children }) => (
  <div className="bg-blueprint bg-forge-glow relative flex min-h-screen items-center justify-center bg-background p-6">
    <Card className="w-full max-w-md p-8 shadow-2xl">
      <div className="mb-8 text-center">
        <div className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-ember-gradient shadow-[0_0_0_1px_hsl(var(--ember)/0.4),0_8px_20px_-6px_hsl(var(--ember)/0.6)]">
          <Icon className="h-6 w-6 text-ember-foreground" strokeWidth={2.25} />
        </div>
        <h1 className="font-display text-2xl font-medium text-foreground">{title}</h1>
        <p className="mt-1 text-sm text-secondary">{subtitle}</p>
      </div>
      {children}
    </Card>
  </div>
);
