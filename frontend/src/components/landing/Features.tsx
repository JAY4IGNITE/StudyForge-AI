import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, FileSearch, MessagesSquare, Gauge, ListChecks, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motionConfig } from '../../lib/motion/motion-config';
import { Meteors } from '../motion';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Study Coach',
    desc: 'Personalized guidance that adapts to how you actually learn, not a fixed curriculum.',
    hasMeteors: true,
  },
  {
    icon: Gauge,
    title: 'Adaptive Learning',
    desc: 'Difficulty and pacing adjust in real time based on your performance.',
    hasMeteors: false,
  },
  {
    icon: MessagesSquare,
    title: 'Interview Preparation',
    desc: 'Live and coding mock interviews with structured, actionable feedback.',
    hasMeteors: false,
  },
  {
    icon: FileSearch,
    title: 'Resume / ATS Analysis',
    desc: 'Get your resume scored and optimized against real ATS criteria.',
    hasMeteors: false,
  },
  {
    icon: ListChecks,
    title: 'Practice Questions',
    desc: 'A deep problem bank that targets your actual weak spots.',
    hasMeteors: true,
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    desc: 'Track improvement across topics with clear, honest metrics.',
    hasMeteors: false,
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="border-t border-border bg-background py-24 relative overflow-hidden">
      <div className="container relative z-10">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text text-transparent">
            Built for smarter learning
          </h2>
          <p className="mt-4 text-secondary">
            Every capability in StudyForge exists to close one gap: what you know
            versus what the interview actually asks.
          </p>
        </div>

        <motion.div 
          variants={motionConfig.staggerChildren}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, desc, hasMeteors }) => (
            <motion.div key={title} variants={motionConfig.fadeUp}>
              <Card
                className="group h-full border-border bg-card/40 p-1 relative overflow-hidden transition-all duration-300 hover:shadow-[0_0_24px_rgba(108,99,255,0.15)] hover:border-primary/50 backdrop-blur-md"
              >
                {hasMeteors && <Meteors number={15} />}
                <CardHeader className="relative z-10">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-gradient-to-br from-primary/20 to-secondary/20 text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110 group-hover:shadow-glow-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle className="transition-colors duration-500 group-hover:text-primary">{title}</CardTitle>
                  <CardDescription className="transition-opacity duration-500 opacity-70 group-hover:opacity-100">{desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
