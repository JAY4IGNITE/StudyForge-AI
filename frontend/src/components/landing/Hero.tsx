import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AnimatedGradient } from './AnimatedGradient';
import { fadeUpVariants, staggerContainerVariants } from '../../lib/motion';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32">
      <AnimatedGradient />

      <motion.div 
        className="container relative z-10 grid items-center gap-14 md:grid-cols-2"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.div variants={fadeUpVariants}>
            <Badge variant="ember" className="gap-1.5 py-1">
              <Sparkles className="h-3 w-3" />
              AI-POWERED LEARNING PLATFORM
            </Badge>
          </motion.div>

          <motion.h1 
            variants={fadeUpVariants}
            className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl"
          >
            Your personal <span className="text-ember">AI study coach.</span>
          </motion.h1>

          <motion.p 
            variants={fadeUpVariants}
            className="mt-6 max-w-md text-balance text-lg text-muted-foreground"
          >
            StudyForge turns your goals into personalized learning paths, practice
            sessions, mock interviews, and actionable AI feedback.
          </motion.p>

          <motion.div variants={fadeUpVariants} className="mt-9 flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link to="/register">
                Start Learning <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <a href="#features">Explore Features</a>
            </Button>
          </motion.div>
        </div>

        <motion.div 
          variants={fadeUpVariants}
          className="relative"
        >
          <div className="rounded-lg border border-border bg-card/80 p-5 shadow-[0_0_0_1px_hsl(var(--border)),0_30px_60px_-20px_hsl(var(--ember)/0.25)] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-display text-sm font-semibold">Today's Focus</span>
              <Badge variant="steel">Live</Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">React Hooks</span>
                <span className="font-mono text-ember">78%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div className="h-full w-[78%] rounded-full bg-gradient-to-r from-ember to-gold" />
              </div>
            </div>

            <div className="mt-5 rounded-md border border-ember/20 bg-ember/5 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-ember">
                <Sparkles className="h-3 w-3" /> AI Recommendation
              </div>
              <p className="mt-1 text-sm text-foreground/90">
                Review useEffect dependency arrays before your next session.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
              <span className="text-muted-foreground">Weekly progress</span>
              <span className="font-mono text-gold">+14%</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
