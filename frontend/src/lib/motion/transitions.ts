import { Transition } from 'motion/react';
import { motionConstants } from './constants';

export const springTransitions: Record<string, Transition> = {
  bounce: {
    type: 'spring',
    stiffness: 400,
    damping: 25,
  },
  gentle: {
    type: 'spring',
    stiffness: 100,
    damping: 20,
  },
  snappy: {
    type: 'spring',
    stiffness: 400,
    damping: 30,
  },
  stiff: {
    type: 'spring',
    stiffness: 500,
    damping: 40,
  },
};

export const tweenTransitions: Record<string, Transition> = {
  instant: {
    duration: motionConstants.timing.instant,
    ease: 'easeOut',
  },
  fast: {
    duration: motionConstants.timing.fast,
    ease: 'easeOut',
  },
  normal: {
    duration: motionConstants.timing.normal,
    ease: 'easeInOut',
  },
  medium: {
    duration: motionConstants.timing.medium,
    ease: [0.25, 0.1, 0.25, 1],
  },
  slow: {
    duration: motionConstants.timing.slow,
    ease: [0.25, 0.1, 0.25, 1],
  },
};
