import { Variants } from 'motion/react';
import { motionConstants } from './constants';
import { springTransitions, tweenTransitions } from './transitions';

export const fadeVariants: Variants = {
  hidden: { opacity: 0, filter: 'blur(8px)' },
  visible: { 
    opacity: 1,
    filter: 'blur(0px)',
    transition: tweenTransitions.normal 
  },
  exit: { 
    opacity: 0,
    filter: 'blur(4px)',
    transition: tweenTransitions.fast 
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: motionConstants.distances.md, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: tweenTransitions.medium
  },
  exit: { 
    opacity: 0, 
    y: -motionConstants.distances.sm,
    filter: 'blur(4px)',
    transition: tweenTransitions.fast
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -motionConstants.distances.md, filter: 'blur(8px)' },
  visible: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    transition: tweenTransitions.medium
  },
  exit: { 
    opacity: 0, 
    y: motionConstants.distances.sm,
    filter: 'blur(4px)',
    transition: tweenTransitions.fast
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: motionConstants.scales.sm, filter: 'blur(4px)' },
  visible: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    transition: springTransitions.gentle
  },
  exit: { 
    opacity: 0, 
    scale: motionConstants.scales.sm,
    filter: 'blur(2px)',
    transition: tweenTransitions.fast
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.02,
      staggerDirection: -1,
    },
  },
};

export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1, 
    transition: tweenTransitions.fast
  },
  exit: { 
    opacity: 0, 
    transition: tweenTransitions.instant
  },
};

export const cardInteractionVariants: Variants = {
  hover: { 
    y: -2, 
    scale: 1.005,
    transition: springTransitions.snappy 
  },
  tap: { 
    scale: 0.99,
    transition: springTransitions.snappy 
  },
};

export const buttonInteractionVariants: Variants = {
  hover: { 
    scale: 1.01,
    transition: tweenTransitions.fast 
  },
  tap: { 
    scale: 0.985,
    transition: tweenTransitions.instant 
  },
};
