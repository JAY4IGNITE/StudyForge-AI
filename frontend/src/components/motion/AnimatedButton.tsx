import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { useAccessibleAnimation } from '../../lib/motion';
import { motionConfig } from '../../lib/motion/motion-config';
import { Button, ButtonProps } from '../ui/button';

export type AnimatedButtonProps = ButtonProps & Omit<HTMLMotionProps<'button'>, 'ref' | 'type'>;

export const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ children, whileHover, whileTap, ...props }, ref) => {
    const accessibleHover = useAccessibleAnimation(whileHover || motionConfig.hoverButton.hover);
    const accessibleTap = useAccessibleAnimation(whileTap || motionConfig.hoverButton.tap);

    return (
      <motion.div
        whileHover={accessibleHover}
        whileTap={accessibleTap}
        style={{ display: 'inline-block' }}
      >
        <Button ref={ref} {...props}>
          {children}
        </Button>
      </motion.div>
    );
  }
);
AnimatedButton.displayName = 'AnimatedButton';
