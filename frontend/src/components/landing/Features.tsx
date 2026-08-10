import React from 'react';
import { motion } from 'motion/react';
import { BrainCircuit, FileSearch, MessagesSquare, Gauge, ListChecks, TrendingUp } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { fadeUpVariants, staggerContainerVariants } from '../../lib/motion';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Study Coach',
    desc: 'Personalized guidance that adapts to how you actually learn, not a fixed curriculum.',
  },
  {
    icon: Gauge,
    title: 'Adaptive Learning',
    desc: 'Difficulty and pacing adjust in real time based on your performance.',
  },
  {
    icon: MessagesSquare,
    title: 'Interview Preparation',
    desc: 'Live and coding mock interviews with structured, actionable feedback.',
  },
  {
    icon: FileSearch,
    title: 'Resume / ATS Analysis',
    desc: 'Get your resume scored and optimized against real ATS criteria.',
  },
  {
    icon: ListChecks,
    title: 'Practice Questions',
    desc: 'A deep problem bank that targets your actual weak spots.',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    desc: 'Track improvement across topics with clear, honest metrics.',
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="border-t border-border bg-background py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight md:text-4xl">
            Built for smarter learning
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every capability in StudyForge exists to close one gap: what you know
            versus what the interview actually asks.
          </p>
        </div>

        <motion.div 
          variants={staggerContainerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUpVariants}>
              <Card
                className="border-border bg-card/60 p-1 transition-colors hover:border-ember/40 hover:shadow-[0_0_0_1px_hsl(var(--ember)/0.3)] h-full"
              >
                <CardHeader>
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-md bg-ember/10 text-ember">
                    <Icon className="h-5 w-5" />
                  </div>
                  <CardTitle>{title}</CardTitle>
                  <CardDescription>{desc}</CardDescription>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
