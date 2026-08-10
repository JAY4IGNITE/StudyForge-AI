import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Target, Sparkles, Dumbbell, TrendingUp } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { icon: Target, label: 'Goal', desc: 'Tell StudyForge what role or skill you\u2019re targeting.' },
  { icon: Sparkles, label: 'AI Personalization', desc: 'Get a learning path built around your gaps.' },
  { icon: Dumbbell, label: 'Practice', desc: 'Work through adaptive problems and mock interviews.' },
  { icon: TrendingUp, label: 'Improve', desc: 'Track real progress with honest, granular feedback.' },
];

export const HowItWorks: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.step-item', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.12,
        ease: 'power2.out',
        scrollTrigger: { trigger: ref.current, start: 'top 80%' },
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  return (
    <section id="how-it-works" ref={ref} className="border-t border-border bg-secondary/20 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            How StudyForge works
          </h2>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-4">
          {STEPS.map(({ icon: Icon, label, desc }, i) => (
            <div key={label} className="step-item relative">
              <div className="flex h-12 w-12 items-center justify-center rounded-full border border-ember/30 bg-ember/10 font-mono text-sm text-ember">
                {String(i + 1).padStart(2, '0')}
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Icon className="h-4 w-4 text-ember" />
                <h3 className="font-display text-base font-medium">{label}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
              {i < STEPS.length - 1 && (
                <div className="absolute right-[-1rem] top-6 hidden h-px w-8 bg-border md:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
