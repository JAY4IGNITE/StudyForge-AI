import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { fadeDownVariants } from '../../lib/motion';
import { AnimatedButton } from '../motion';
import { ThemeToggle } from '../ui/ThemeToggle';

export const LandingNavbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      variants={fadeDownVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-border/70 bg-background/75 shadow-sm backdrop-blur-[20px]'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <span className="flex h-9 w-9 items-center justify-center rounded-md border border-ember/20 bg-ember/10">
            <Flame className="h-5 w-5 text-ember transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          </span>
          <span className="bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent transition-all duration-500 group-hover:from-gold group-hover:to-ember">
            StudyForge
          </span>
        </Link>

        <div className="hidden items-center gap-1 rounded-pill border border-border/70 bg-background/50 p-1 text-sm font-medium text-secondary backdrop-blur-xl md:flex">
          <a href="#features" className="rounded-md px-3 py-1.5 transition-colors hover:bg-secondary/70 hover:text-foreground">
            Features
          </a>
          <a href="#how-it-works" className="rounded-md px-3 py-1.5 transition-colors hover:bg-secondary/70 hover:text-foreground">
            How it works
          </a>
          <a href="#ai-coach" className="rounded-md px-3 py-1.5 transition-colors hover:bg-secondary/70 hover:text-foreground">
            AI Coach
          </a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <AnimatedButton asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
            <Link to="/login">Log in</Link>
          </AnimatedButton>
          <AnimatedButton asChild size="sm">
            <Link to="/register">Get Started</Link>
          </AnimatedButton>
        </div>
      </nav>
    </motion.header>
  );
};
