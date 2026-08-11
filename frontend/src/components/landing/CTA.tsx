import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const BENEFITS = ['Personalized roadmap', 'Adaptive practice', 'Interview feedback'];

export const CTA: React.FC = () => {
  return (
    <section className="relative overflow-hidden border-t border-border/70 py-24">
      <div className="pointer-events-none absolute inset-0 bg-forge-glow opacity-90" />
      <div className="container relative z-10 grid items-center gap-8 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="max-w-2xl text-balance font-display text-3xl font-semibold tracking-tight md:text-4xl">
          Start forging your next role.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-secondary">
          Free to start. Build a personalized path in under two minutes.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            {BENEFITS.map((benefit) => (
              <span key={benefit} className="inline-flex items-center gap-2 rounded-md border border-border/70 bg-background/50 px-3 py-2 text-sm text-secondary backdrop-blur-xl">
                <CheckCircle2 className="h-4 w-4 text-success" />
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row md:flex-col">
          <Button asChild size="lg" className="min-w-44">
            <Link to="/register">
              Start Learning <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-44 border-foreground/10 bg-background/50 backdrop-blur-xl">
            <Link to="/login">Log in</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
