import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AnimatedButton, Spotlight, RetroGrid, ShinyButton, BorderBeam } from '../motion';
import { motionConfig } from '../../lib/motion/motion-config';

export const Hero: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col items-center">
      <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 text-black dark:text-white" />
      <RetroGrid />
      
      <motion.div 
        className="container relative z-10 grid items-center gap-14 md:grid-cols-2"
        variants={motionConfig.staggerChildren}
        initial="hidden"
        animate="visible"
      >
        <div>
          <motion.div variants={motionConfig.fadeUp}>
            <Badge variant="secondary" className="gap-1.5 py-1 backdrop-blur-md bg-secondary/20 border-secondary/30">
              <Sparkles className="h-3 w-3" />
              AI-POWERED LEARNING PLATFORM
            </Badge>
          </motion.div>

          <h1 className="mt-6 text-balance font-display text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl flex flex-wrap gap-x-3 gap-y-1">
            {"Your personal".split(" ").map((word, i) => (
              <motion.span key={i} variants={motionConfig.fadeUp}>{word}</motion.span>
            ))}
            <motion.span variants={motionConfig.fadeUp} className="bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent">
              AI study coach.
            </motion.span>
          </h1>

          <motion.p 
            variants={motionConfig.fadeUp}
            transition={{ delay: 0.3, duration: 0.4 }}
            className="mt-6 max-w-md text-balance text-lg text-secondary"
          >
            StudyForge turns your goals into personalized learning paths, practice
            sessions, mock interviews, and actionable AI feedback.
          </motion.p>

          <motion.div variants={motionConfig.fadeUp} className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <ShinyButton>
                Start Learning <ArrowRight className="h-4 w-4" />
              </ShinyButton>
            </Link>
            <AnimatedButton asChild size="lg" variant="outline" className="backdrop-blur-md bg-background/30">
              <a href="#features">Explore Features</a>
            </AnimatedButton>
          </motion.div>
        </div>

        <motion.div 
          variants={motionConfig.fadeUp}
          className="relative animate-floating"
        >
          <div className="relative rounded-2xl border border-border bg-card/40 p-5 shadow-2xl backdrop-blur-xl">
            <BorderBeam size={250} duration={12} delay={9} />
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="font-display text-sm font-semibold">Today's Focus</span>
              <Badge variant="steel" className="bg-primary/20 text-primary border-primary/30">Live</Badge>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-secondary">React Hooks</span>
                <span className="font-mono text-primary">78%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary/30">
                <div className="h-full w-[78%] rounded-full bg-primary-gradient" />
              </div>
            </div>

            <div className="mt-5 rounded-md border border-primary/20 bg-primary/10 p-3">
              <div className="flex items-center gap-1.5 text-xs font-medium text-primary">
                <Sparkles className="h-3 w-3" /> AI Recommendation
              </div>
              <p className="mt-1 text-sm text-foreground/90">
                Review useEffect dependency arrays before your next session.
              </p>
            </div>

            <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
              <span className="text-secondary">Weekly progress</span>
              <span className="font-mono text-success">+14%</span>
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Trust Bar */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="container relative z-10 mt-24 border-t border-border pt-10"
      >
        <p className="text-center text-sm font-medium text-secondary">POWERING OVER 10,000+ INTERVIEW PREPS</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-12 opacity-50 grayscale transition-all hover:grayscale-0">
          <div className="font-display text-xl font-bold">Google</div>
          <div className="font-display text-xl font-bold">Meta</div>
          <div className="font-display text-xl font-bold">Amazon</div>
          <div className="font-display text-xl font-bold">Apple</div>
          <div className="font-display text-xl font-bold">Netflix</div>
        </div>
      </motion.div>
    </section>
  );
};
