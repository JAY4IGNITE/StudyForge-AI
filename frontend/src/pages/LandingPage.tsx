import React from 'react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { Hero } from '@/components/landing/Hero';
import { Features } from '@/components/landing/Features';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { AIShowcase } from '@/components/landing/AIShowcase';
import { CTA } from '@/components/landing/CTA';
import { LandingFooter } from '@/components/landing/LandingFooter';
import { AnimatedGradient } from '@/components/landing/AnimatedGradient';

export const LandingPage: React.FC = () => {
  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* Live moving Apple ID style gradient fixed in the background */}
      <AnimatedGradient className="fixed inset-0 z-0 h-full w-full" />

      {/* Main content layers positioned relatively above the fixed background */}
      <div className="relative z-10">
        <LandingNavbar />
        <main>
          <Hero />
          <Features />
          <HowItWorks />
          <AIShowcase />
          <CTA />
        </main>
        <LandingFooter />
      </div>
    </div>
  );
};

export default LandingPage;
