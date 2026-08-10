import React from 'react';
import { Flame } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-muted-foreground md:flex-row">
        <div className="flex items-center gap-2 font-display font-medium text-foreground">
          <Flame className="h-4 w-4 text-ember" />
          StudyForge AI
        </div>
        <p>&copy; {new Date().getFullYear()} StudyForge AI. All rights reserved.</p>
      </div>
    </footer>
  );
};
