import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpenCheck, CheckCircle2, Code2, GraduationCap, Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedButton, Spotlight, RetroGrid, BorderBeam } from '../motion';
import { motionConfig } from '../../lib/motion/motion-config';

const STATS = [
  { value: '10k+', label: 'interview prep sessions' },
  { value: '4.8x', label: 'faster weak-spot discovery' },
  { value: '24/7', label: 'adaptive AI coaching' },
];

const FOCUS_ITEMS = [
  { icon: Target, label: 'React Hooks', detail: 'Dependency arrays and effects', progress: 78 },
  { icon: Code2, label: 'DP Patterns', detail: 'Knapsack review queue', progress: 54 },
  { icon: GraduationCap, label: 'Mock Interview', detail: 'System design warmup', progress: 86 },
];

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-28 pb-20 md:pt-36 md:pb-28">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 text-black dark:text-white" />
      <RetroGrid />

      <motion.div 
        className="container relative z-10 grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]"
        variants={motionConfig.staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <div className="max-w-3xl">
          <motion.div variants={motionConfig.fadeUp}>
            <Badge variant="secondary" className="gap-1.5 border-ember/20 bg-background/60 px-3 py-1.5 text-foreground shadow-sm backdrop-blur-xl">
              <Sparkles className="h-3 w-3" />
              AI-powered learning platform
            </Badge>
          </motion.div>

          <h1 className="mt-6 flex flex-wrap gap-x-3 gap-y-1 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            {"Your personal".split(" ").map((word, i) => (
              <motion.span key={i} variants={motionConfig.fadeUp}>{word}</motion.span>
            ))}
            <motion.span variants={motionConfig.fadeUp} className="bg-gradient-to-r from-ember via-gold to-steel bg-clip-text text-transparent">
              AI study coach.
            </motion.span>
          </h1>

          <motion.p 
            variants={motionConfig.fadeUp}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 max-w-2xl text-balance text-lg leading-8 text-secondary"
          >
            StudyForge turns your goals into personalized learning paths, practice
            sessions, mock interviews, and actionable AI feedback.
          </motion.p>

          <motion.div variants={motionConfig.fadeUp} className="mt-9 flex flex-wrap items-center gap-3">
            <AnimatedButton asChild size="lg" className="rounded-lg px-7">
              <Link to="/register">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
            </AnimatedButton>
            <AnimatedButton asChild size="lg" variant="outline" className="border-foreground/10 bg-background/60 backdrop-blur-xl hover:border-ember/50">
              <a href="#features">Explore Features</a>
            </AnimatedButton>
          </motion.div>

          <motion.div
            variants={motionConfig.fadeUp}
            className="mt-10 grid max-w-2xl gap-3 sm:grid-cols-3"
          >
            {STATS.map((stat) => (
              <div key={stat.label} className="rounded-lg border border-border/70 bg-background/50 px-4 py-3 backdrop-blur-xl">
                <div className="font-display text-xl font-semibold text-foreground">{stat.value}</div>
                <div className="mt-1 text-xs leading-5 text-secondary">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div 
          variants={motionConfig.fadeUp}
          className="relative animate-floating"
        >
          <div className="absolute -inset-3 rounded-xl border border-ember/10 bg-background/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-lg border border-border/80 bg-card/70 p-4 shadow-2xl backdrop-blur-2xl sm:p-5">
            <BorderBeam size={250} duration={12} delay={9} />
            <div className="flex items-center justify-between gap-4 border-b border-border/70 pb-4">
              <div>
                <span className="font-display text-sm font-semibold">Today's Focus</span>
                <p className="mt-1 text-xs text-secondary">Built from your latest practice signals</p>
              </div>
              <Badge variant="steel" className="border-steel/30 bg-steel/10 text-steel">Live</Badge>
            </div>

            <div className="mt-5 space-y-3">
              {FOCUS_ITEMS.map(({ icon: Icon, label, detail, progress }) => (
                <div key={label} className="rounded-lg border border-border/60 bg-background/50 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ember/10 text-ember">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium text-foreground">{label}</div>
                        <div className="mt-0.5 text-xs leading-5 text-secondary">{detail}</div>
                      </div>
                    </div>
                    <span className="font-mono text-xs text-primary">{progress}%</span>
                  </div>
                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-secondary/50">
                    <div className="h-full rounded-full bg-ember-gradient" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 rounded-lg border border-ember/25 bg-ember/10 p-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-ember">
                <Sparkles className="h-3 w-3" /> AI Recommendation
              </div>
              <p className="mt-1 text-sm text-foreground/90">
                Review effect cleanup, then run a 12-minute adaptive drill.
              </p>
            </div>

            <div className="mt-4 grid gap-3 border-t border-border/70 pt-4 text-xs sm:grid-cols-2">
              <div className="flex items-center gap-2 text-secondary">
                <CheckCircle2 className="h-4 w-4 text-success" />
                6 weak spots closed
              </div>
              <div className="flex items-center gap-2 text-secondary sm:justify-end">
                <BookOpenCheck className="h-4 w-4 text-gold" />
                <span className="font-mono text-success">+14%</span> weekly progress
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container relative z-10 mt-20 border-t border-border/70 pt-8 md:mt-24 md:pt-10"
      >
        <p className="text-center text-xs font-semibold uppercase text-secondary">Learners prepare for roles at</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-secondary/70 transition-colors">
          <div className="font-display text-lg font-semibold">Google</div>
          <div className="font-display text-lg font-semibold">Meta</div>
          <div className="font-display text-lg font-semibold">Amazon</div>
          <div className="font-display text-lg font-semibold">Apple</div>
          <div className="font-display text-lg font-semibold">Netflix</div>
        </div>
      </motion.div>
    </section>
  );
};
