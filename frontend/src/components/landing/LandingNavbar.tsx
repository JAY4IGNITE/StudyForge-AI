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
          ? 'border-b border-border bg-background/70 backdrop-blur-[20px] shadow-sm'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="group flex items-center gap-2 font-display text-xl font-semibold tracking-tight">
          <Flame className="h-6 w-6 text-ember transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
          <span className="bg-gradient-to-r from-ember to-secondary bg-clip-text text-transparent transition-all duration-500 group-hover:from-secondary group-hover:to-ember">
            StudyForge
          </span>
        </Link>

        <div className="hidden items-center gap-8 text-sm font-medium text-secondary md:flex">
          <a href="#features" className="group relative transition-colors hover:text-foreground">
            Features
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-ember transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#how-it-works" className="group relative transition-colors hover:text-foreground">
            How it works
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-ember transition-all duration-300 group-hover:w-full"></span>
          </a>
          <a href="#ai-coach" className="group relative transition-colors hover:text-foreground">
            AI Coach
            <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-ember transition-all duration-300 group-hover:w-full"></span>
          </a>
        </div>

        <div className="flex items-center gap-4">
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
