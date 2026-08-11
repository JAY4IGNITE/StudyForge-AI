import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, BrainCircuit, FileSearch, Gauge, ListChecks, MessagesSquare, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motionConfig } from '../../lib/motion/motion-config';
import { Meteors } from '../motion';

const FEATURES = [
  {
    icon: BrainCircuit,
    title: 'AI Study Coach',
    desc: 'Personalized guidance that adapts to how you actually learn, not a fixed curriculum.',
    metric: 'Daily plan refresh',
    accent: 'text-ember bg-ember/10 border-ember/20',
    hasMeteors: true,
  },
  {
    icon: Gauge,
    title: 'Adaptive Learning',
    desc: 'Difficulty and pacing adjust in real time based on your performance.',
    metric: 'Dynamic difficulty',
    accent: 'text-steel bg-steel/10 border-steel/20',
    hasMeteors: false,
  },
  {
    icon: MessagesSquare,
    title: 'Interview Preparation',
    desc: 'Live and coding mock interviews with structured, actionable feedback.',
    metric: 'Live + coding rounds',
    accent: 'text-gold bg-gold/10 border-gold/20',
    hasMeteors: false,
  },
  {
    icon: FileSearch,
    title: 'Resume / ATS Analysis',
    desc: 'Get your resume scored and optimized against real ATS criteria.',
    metric: 'ATS-ready insights',
    accent: 'text-steel bg-steel/10 border-steel/20',
    hasMeteors: false,
  },
  {
    icon: ListChecks,
    title: 'Practice Questions',
    desc: 'A deep problem bank that targets your actual weak spots.',
    metric: 'Focused drills',
    accent: 'text-ember bg-ember/10 border-ember/20',
    hasMeteors: true,
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    desc: 'Track improvement across topics with clear, honest metrics.',
    metric: 'Topic-level trends',
    accent: 'text-success bg-success/10 border-success/20',
    hasMeteors: false,
  },
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="relative overflow-hidden border-t border-border/70 bg-background/30 py-24 backdrop-blur-md">
      <div className="container relative z-10">
        <div className="grid gap-6 md:grid-cols-[0.9fr_1.1fr] md:items-end">
          <div>
            <Badge variant="secondary" className="border-border/70 bg-background/60 px-3 py-1 text-foreground">
              Complete prep system
            </Badge>
            <h2 className="mt-4 max-w-xl bg-gradient-to-br from-foreground to-muted-foreground bg-clip-text font-display text-3xl font-semibold tracking-tight text-transparent md:text-4xl">
            Built for smarter learning
            </h2>
          </div>
          <p className="max-w-xl text-base leading-7 text-secondary md:justify-self-end">
            Every capability in StudyForge closes one gap: what you know versus
            what the interview actually asks.
          </p>
        </div>

        <motion.div 
          variants={motionConfig.staggerChildren}
          initial="hidden"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map(({ icon: Icon, title, desc, metric, accent, hasMeteors }) => (
            <motion.div key={title} variants={motionConfig.fadeUp}>
              <Card
                className="group relative h-full overflow-hidden rounded-lg border-border/70 bg-card/60 p-1 shadow-[0_18px_45px_-28px_hsl(var(--foreground)/0.4)] backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-ember/40 hover:shadow-[0_24px_60px_-32px_hsl(var(--ember)/0.45)]"
              >
                {hasMeteors && <Meteors number={15} />}
                <CardHeader className="relative z-10 p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-md border ${accent} transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105`}>
                    <Icon className="h-5 w-5" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-secondary opacity-0 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                  </div>
                  <div className="mt-7">
                    <div className="mb-3 inline-flex rounded-md border border-border/60 bg-background/50 px-2.5 py-1 text-xs font-medium text-secondary">
                      {metric}
                    </div>
                    <CardTitle className="text-lg transition-colors duration-500 group-hover:text-ember">{title}</CardTitle>
                    <CardDescription className="mt-2 leading-6 opacity-80 transition-opacity duration-500 group-hover:opacity-100">{desc}</CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
