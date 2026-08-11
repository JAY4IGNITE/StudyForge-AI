import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ShinyButtonProps extends HTMLMotionProps<"button"> {
  className?: string;
  children: React.ReactNode;
}

export const ShinyButton = React.forwardRef<HTMLButtonElement, ShinyButtonProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "relative rounded-lg px-6 py-2 font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow-[0_0_20px_2px_rgba(108,99,255,0.3)]",
          "bg-[linear-gradient(110deg,var(--tw-gradient-stops))] from-primary via-primary/70 to-primary bg-[length:200%_100%] animate-shimmer text-primary-foreground border border-transparent",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </motion.button>
    );
  }
);
ShinyButton.displayName = "ShinyButton";
