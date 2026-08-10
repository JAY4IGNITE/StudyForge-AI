import { Variants } from 'motion/react';
import { motionConstants } from './constants';
import { springTransitions, tweenTransitions } from './transitions';

export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: tweenTransitions.normal 
  },
  exit: { 
    opacity: 0,
    transition: tweenTransitions.fast 
  },
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: motionConstants.distances.md },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: tweenTransitions.medium
  },
  exit: { 
    opacity: 0, 
    y: -motionConstants.distances.sm,
    transition: tweenTransitions.fast
  },
};

export const fadeDownVariants: Variants = {
  hidden: { opacity: 0, y: -motionConstants.distances.md },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: tweenTransitions.medium
  },
  exit: { 
    opacity: 0, 
    y: motionConstants.distances.sm,
    transition: tweenTransitions.fast
  },
};

export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: motionConstants.scales.sm },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springTransitions.gentle
  },
  exit: { 
    opacity: 0, 
    scale: motionConstants.scales.sm,
    transition: tweenTransitions.fast
  },
};

export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};

export const pageTransitionVariants: Variants = {
  hidden: { opacity: 0, y: motionConstants.distances.sm },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: tweenTransitions.medium
  },
  exit: { 
    opacity: 0, 
    y: -motionConstants.distances.sm,
    transition: tweenTransitions.fast
  },
};

export const cardInteractionVariants: Variants = {
  hover: { 
    y: -4, 
    scale: 1.01,
    transition: springTransitions.snappy 
  },
  tap: { 
    scale: 0.98,
    transition: springTransitions.snappy 
  },
};

export const buttonInteractionVariants: Variants = {
  hover: { 
    scale: 1.02,
    transition: tweenTransitions.fast 
  },
  tap: { 
    scale: 0.97,
    transition: tweenTransitions.instant 
  },
};
