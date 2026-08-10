import { useReducedMotion, TargetAndTransition, VariantLabels } from 'motion/react';

type AnimationTarget = any;

export function useAccessibleAnimation(
  animation: AnimationTarget,
  fallback: AnimationTarget = undefined
): any {
  const shouldReduceMotion = useReducedMotion();
  
  if (!shouldReduceMotion) return animation;
  return fallback;
}

export function withReducedMotion(variants: Record<string, any>) {
  // Utility for defining reduced motion variants statically if needed
  return {
    ...variants,
    // Add logic to strip complex transforms if we were to process variants manually
    // For now, the standard approach is using the hook or custom variants per component
  };
}
