import React from 'react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="border-t border-border py-10">
      <div className="container flex flex-col items-center justify-between gap-4 text-sm text-secondary md:flex-row">
        <div className="flex items-center gap-2 font-display font-medium text-foreground">
          <img src="/branding/studyforge-logo.svg" alt="StudyForge Logo" className="h-5 w-auto object-contain" />
          StudyForge AI
        </div>
        <p>&copy; {new Date().getFullYear()} StudyForge AI. All rights reserved.</p>
      </div>
    </footer>
  );
};
