import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const CTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-t border-border py-24">
      <div className="pointer-events-none absolute inset-0 bg-forge-glow" />
      <div className="container relative z-10 text-center">
        <h2 className="text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Start forging your next role.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Free to start. Build a personalized path in under two minutes.
        </p>
        <Button asChild size="lg" className="mt-8">
          <Link to="/register">
            Start Learning <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
