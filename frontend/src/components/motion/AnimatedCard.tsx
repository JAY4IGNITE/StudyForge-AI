import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { cardInteractionVariants } from '../../lib/motion';
import { useAccessibleAnimation } from '../../lib/motion';

export const AnimatedCard = React.forwardRef<HTMLDivElement, HTMLMotionProps<'div'>>(
  ({ children, whileHover, whileTap, ...props }, ref) => {
    const accessibleHover = useAccessibleAnimation(whileHover || cardInteractionVariants.hover);
    const accessibleTap = useAccessibleAnimation(whileTap || cardInteractionVariants.tap);

    return (
      <motion.div
        ref={ref}
        whileHover={accessibleHover}
        whileTap={accessibleTap}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
AnimatedCard.displayName = 'AnimatedCard';
