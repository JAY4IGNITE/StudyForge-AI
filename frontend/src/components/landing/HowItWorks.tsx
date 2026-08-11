import React from 'react';
import { motion } from 'motion/react';
import { Dumbbell, Sparkles, Target, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motionConfig } from '../../lib/motion/motion-config';

const STEPS = [
  {
    icon: Target,
    label: 'Set your target',
    desc: "Tell StudyForge what role, exam, or skill you're chasing.",
    detail: 'Role, timeline, current level',
  },
  {
    icon: Sparkles,
    label: 'Map the gaps',
    desc: 'Get a learning path built around your strongest and weakest signals.',
    detail: 'AI roadmap + topic priority',
  },
  {
    icon: Dumbbell,
    label: 'Train deliberately',
    desc: 'Work through adaptive questions, flashcards, and mock interviews.',
    detail: 'Practice loops + feedback',
  },
  {
    icon: TrendingUp,
    label: 'Sharpen weekly',
    desc: 'Track progress with honest metrics and the next best action.',
    detail: 'Score trends + next session',
  },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="border-t border-border/70 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="border-border/70 bg-background/60 px-3 py-1 text-foreground">
            Guided workflow
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight md:text-4xl">
            How StudyForge works
          </h2>
          <p className="mt-4 text-secondary">
            A clean loop from goal setting to targeted practice, with the AI
            keeping the plan current as you improve.
          </p>
        </div>

        <motion.div
          variants={motionConfig.staggerChildren}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="relative mt-14 grid gap-4 md:grid-cols-4"
        >
          <div className="absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block" />
          {STEPS.map(({ icon: Icon, label, desc, detail }, i) => (
            <motion.div
              key={label}
              variants={motionConfig.fadeUp}
              className="group relative rounded-lg border border-border/70 bg-card/60 p-5 backdrop-blur-xl"
            >
              <div className="relative z-10 flex items-center justify-between gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-md border border-ember/25 bg-ember/10 font-mono text-sm text-ember transition-transform duration-300 group-hover:scale-105">
                  {String(i + 1).padStart(2, '0')}
                </div>
                <Icon className="h-5 w-5 text-secondary transition-colors duration-300 group-hover:text-ember" />
              </div>
              <div className="mt-6">
                <div className="mb-3 inline-flex rounded-md border border-border/60 bg-background/50 px-2.5 py-1 text-xs font-medium text-secondary">
                  {detail}
                </div>
                <h3 className="font-display text-base font-semibold">{label}</h3>
                <p className="mt-2 text-sm leading-6 text-secondary">{desc}</p>
              </div>
              {i < STEPS.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="absolute -right-2 top-8 z-20 hidden h-px w-4 origin-left bg-ember md:block"
                />
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
