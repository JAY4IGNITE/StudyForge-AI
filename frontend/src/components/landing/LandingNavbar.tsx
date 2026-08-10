import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { fadeDownVariants } from '../../lib/motion';
import { AnimatedButton } from '../motion';

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
          ? 'border-b border-border bg-background/85 backdrop-blur-md shadow-[0_1px_0_hsl(var(--border))]'
          : 'border-b border-transparent bg-transparent'
      )}
    >
      <nav className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold tracking-tight">
          <Flame className="h-5 w-5 text-ember" />
          StudyForge <span className="text-ember">AI</span>
        </Link>

        <div className="hidden items-center gap-8 text-sm text-muted-foreground md:flex">
          <a href="#features" className="transition-colors hover:text-foreground">Features</a>
          <a href="#how-it-works" className="transition-colors hover:text-foreground">How it works</a>
          <a href="#ai-coach" className="transition-colors hover:text-foreground">AI Coach</a>
        </div>

        <div className="flex items-center gap-2">
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
