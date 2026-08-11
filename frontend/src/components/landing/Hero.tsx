import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, BookOpenCheck, Code2, GraduationCap, Sparkles, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedButton, Spotlight, RetroGrid, BorderBeam } from '../motion';
import { motionConfig } from '../../lib/motion/motion-config';

const PLAN_TAGS = ['React patterns', 'Daily DSA', 'Mock rounds', 'Resume ATS'];

const PLAN_STEPS = [
  { icon: Target, label: 'Diagnose gaps', detail: 'AI scans your latest practice' },
  { icon: Code2, label: 'Train daily', detail: 'Focused drills that adapt' },
  { icon: GraduationCap, label: 'Interview ready', detail: 'Mock rounds with feedback' },
];

const ROADMAP_PREVIEW = [
  { icon: Target, label: 'Skill map', detail: 'Gaps grouped by priority' },
  { icon: Code2, label: 'Practice path', detail: 'Daily drills and checkpoints' },
  { icon: GraduationCap, label: 'Mock loop', detail: 'Interview replay and feedback' },
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
            className="mt-10 max-w-2xl overflow-hidden rounded-lg border border-border/70 bg-background/60 p-4 shadow-[0_24px_70px_-42px_hsl(var(--ember)/0.65)] backdrop-blur-xl"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-ember/10 text-ember">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-secondary">AI plan builder</p>
                  <p className="mt-1 text-sm font-medium text-foreground">
                    Prep me for frontend interviews in 6 weeks
                  </p>
                </div>
              </div>
              <Badge variant="steel" className="border-steel/25 bg-steel/10 text-steel">
                Roadmap ready
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {PLAN_TAGS.map((tag) => (
                <span key={tag} className="rounded-md border border-border/60 bg-card/60 px-3 py-1.5 text-xs font-medium text-secondary">
                  {tag}
                </span>
              ))}
            </div>

            <div className="relative mt-5 grid gap-3 sm:grid-cols-3">
              <div className="absolute left-4 right-4 top-5 hidden h-px bg-gradient-to-r from-ember/50 via-gold/50 to-steel/50 sm:block" />
              {PLAN_STEPS.map(({ icon: Icon, label, detail }) => (
                <div key={label} className="relative rounded-md border border-border/60 bg-background/60 p-3">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-ember/20 bg-background text-ember">
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="text-sm font-medium text-foreground">{label}</div>
                  <div className="mt-1 text-xs leading-5 text-secondary">{detail}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <motion.div 
          variants={motionConfig.fadeUp}
          className="relative animate-floating"
        >
          <div className="absolute -inset-3 rounded-xl border border-ember/10 bg-background/20 blur-2xl" />
          <div className="relative overflow-hidden rounded-lg border border-border/80 bg-card/70 p-5 shadow-2xl backdrop-blur-2xl">
            <BorderBeam size={250} duration={12} delay={9} />
            <div className="absolute inset-x-8 top-8 h-28 rounded-full bg-gradient-to-r from-ember/25 via-gold/20 to-steel/25 blur-3xl" />

            <div className="relative z-10 flex items-start justify-between gap-4">
              <div className="max-w-xs">
                <Badge variant="ember" className="gap-1.5 border-ember/20 bg-ember/10 text-ember">
                  <Sparkles className="h-3 w-3" />
                  AI roadmap preview
                </Badge>
                <h3 className="mt-4 font-display text-2xl font-semibold tracking-tight">
                  Your learning path, generated visually.
                </h3>
                <p className="mt-2 text-sm leading-6 text-secondary">
                  Turn one goal into a clear route with practice, feedback, and
                  interview checkpoints.
                </p>
              </div>
              <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-md border border-steel/20 bg-steel/10 text-steel sm:flex">
                <BookOpenCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="relative z-10 mt-8 grid items-center gap-6 sm:grid-cols-[0.86fr_1.14fr]">
              <div className="mx-auto flex aspect-square w-44 items-center justify-center rounded-full p-1 shadow-[0_24px_70px_-34px_hsl(var(--ember)/0.75)]" style={{ background: 'conic-gradient(from 140deg, hsl(var(--ember)), hsl(var(--gold)), hsl(var(--steel)), hsl(var(--ember)))' }}>
                <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-border/70 bg-background/90 text-center backdrop-blur-xl">
                  <span className="text-xs font-semibold uppercase text-secondary">6-week path</span>
                  <span className="mt-2 font-display text-2xl font-semibold">Ready</span>
                  <span className="mt-1 max-w-24 text-xs leading-5 text-secondary">built from your goal</span>
                </div>
              </div>

              <div className="space-y-3">
                {ROADMAP_PREVIEW.map(({ icon: Icon, label, detail }) => (
                  <div key={label} className="rounded-lg border border-border/60 bg-background/60 p-3">
                    <div className="flex items-start gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ember/10 text-ember">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-foreground">{label}</div>
                        <div className="mt-0.5 text-xs leading-5 text-secondary">{detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 mt-5 rounded-lg border border-ember/25 bg-ember/10 p-4">
              <div className="flex items-center gap-1.5 text-xs font-medium text-ember">
                <Sparkles className="h-3 w-3" /> Next best move
              </div>
              <p className="mt-1 text-sm text-foreground/90">
                Start with a diagnostic sprint, then StudyForge reshapes the
                roadmap around your results.
              </p>
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
