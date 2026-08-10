import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { motionConfig } from '../../lib/motion/motion-config';

export const AnimatedPage = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={motionConfig.pageTransitions}
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
