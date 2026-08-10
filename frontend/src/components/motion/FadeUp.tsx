import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { fadeUpVariants } from '../../lib/motion';

export const FadeUp = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={fadeUpVariants}
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
FadeUp.displayName = 'FadeUp';
