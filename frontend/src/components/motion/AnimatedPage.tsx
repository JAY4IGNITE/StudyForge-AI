import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { pageTransitionVariants } from '../../lib/motion';

export const AnimatedPage = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={pageTransitionVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
AnimatedPage.displayName = 'AnimatedPage';
