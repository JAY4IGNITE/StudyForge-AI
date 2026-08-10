import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { staggerContainerVariants } from '../../lib/motion';

export const StaggerContainer = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={staggerContainerVariants}
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
StaggerContainer.displayName = 'StaggerContainer';
