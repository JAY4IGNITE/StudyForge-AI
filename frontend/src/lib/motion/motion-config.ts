import { Variants } from 'motion/react';

export const motionConfig = {
  fadeUp: { 
    initial: { opacity: 0, y: 20 }, 
    animate: { opacity: 1, y: 0 }, 
    transition: { duration: 0.4, ease: "easeOut" } 
  } as Variants,

  fadeIn: { 
    initial: { opacity: 0 }, 
    animate: { opacity: 1 }, 
    transition: { duration: 0.3 } 
  } as Variants,

  scaleIn: { 
    initial: { opacity: 0, scale: 0.95 }, 
    animate: { opacity: 1, scale: 1 }, 
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] } 
  } as Variants,

  staggerChildren: { 
    animate: { 
      transition: { staggerChildren: 0.08 } 
    } 
  } as Variants,

  slideRight: { 
    initial: { opacity: 0, x: -20 }, 
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.3, ease: "easeOut" }
  } as Variants,

  pageTransitions: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: "easeIn" } }
  } as Variants,

  hoverCard: {
    rest: { scale: 1, boxShadow: "0 4px 24px rgba(0,0,0,0.4)" },
    hover: { scale: 1.02, boxShadow: "0 8px 32px rgba(108,99,255,0.4)", transition: { duration: 0.2 } }
  },

  hoverButton: {
    rest: { scale: 1 },
    hover: { scale: 1.04, transition: { duration: 0.2 } },
    tap: { scale: 0.97, transition: { duration: 0.1 } }
  },
  
  hoverIcon: {
    rest: { rotate: 0, scale: 1 },
    hover: { rotate: 8, scale: 1.15, transition: { type: "spring", stiffness: 300 } }
  }
};
