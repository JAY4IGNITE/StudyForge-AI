import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { fadeVariants } from '../../lib/motion';

export const FadeIn = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={fadeVariants}
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
FadeIn.displayName = 'FadeIn';
