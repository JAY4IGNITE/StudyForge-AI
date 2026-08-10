import React from 'react';
import { motion } from 'motion/react';
import { Target, Sparkles, Dumbbell, TrendingUp } from 'lucide-react';
import { fadeUpVariants, staggerContainerVariants } from '../../lib/motion';

const STEPS = [
  { icon: Target, label: 'Goal', desc: 'Tell StudyForge what role or skill you’re targeting.' },
  { icon: Sparkles, label: 'AI Personalization', desc: 'Get a learning path built around your gaps.' },
  { icon: Dumbbell, label: 'Practice', desc: 'Work through adaptive problems and mock interviews.' },
  { icon: TrendingUp, label: 'Improve', desc: 'Track real progress with honest, granular feedback.' },
];

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="border-t border-border bg-secondary/20 py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            How StudyForge works
          </h2>
        </div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-8 md:grid-cols-4"
        >
          {STEPS.map(({ icon: Icon, label, desc }, i) => (
            <motion.div key={label} variants={fadeUpVariants} className="relative">
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
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
