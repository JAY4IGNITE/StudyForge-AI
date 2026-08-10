# StudyForge AI Motion Guidelines

Welcome to the Motion Guidelines for StudyForge AI! This document outlines our philosophy, architecture, and best practices for creating a modern, performant, and accessible animation system using `motion/react`.

## Philosophy
Our animations should feel:
- **Intelligent & Modern:** Animations are purposeful, reflecting the state of the application.
- **Premium & Professional:** Avoid chaotic or overly bouncy animations. Easing should be smooth.
- **Fast & Responsive:** Animations should never block the user.
- **Accessible:** Respect `prefers-reduced-motion` at all levels.

## Core Motion System
All animations must be built using `motion/react`. **Do NOT use `framer-motion` directly.**

The design system is located in `src/lib/motion/`.
- `animations.ts`: Contains predefined spring transitions, easing curves, and variant configurations (e.g., `fadeUpVariants`, `springTransitions`).
- `hooks.ts`: Contains custom hooks like `useAccessibleAnimation` to automatically adapt animations for reduced motion.

## Reusable Components
Use our pre-built motion components from `src/components/motion/` whenever possible:

1. **AnimatedPage (`AnimatedPage.tsx`)**
   Wrap route components in `AnimatedPage` for smooth enter/exit transitions. Requires an `AnimatePresence` wrapper in the router.
   ```tsx
   <AnimatedPage>
     <Dashboard />
   </AnimatedPage>
   ```

2. **AnimatedButton (`AnimatedButton.tsx`)**
   A drop-in replacement for the standard shadcn `Button` that adds elegant hover (`scale: 1.02`) and tap (`scale: 0.98`) interactions.

3. **StaggerContainer & FadeUp (`FadeIn.tsx`)**
   Use these to orchestrate staggered lists and grids.
   ```tsx
   <StaggerContainer>
     {items.map(item => (
       <FadeUp key={item.id}>
         <ItemCard data={item} />
       </FadeUp>
     ))}
   </StaggerContainer>
   ```

4. **AnimatedCard (`AnimatedCard.tsx`)**
   Use for interactive dashboard widgets or profile cards to enable hover lifts and layout animations.

## Accessibility (Reduced Motion)
Always ensure animations gracefully degrade when the user requests reduced motion. Our design system handles this globally via the `useAccessibleAnimation` hook or using standard motion features.

If building custom `motion.div` components:
- Prefer opacity fades over large positional shifts when reduced motion is enabled.
- Avoid infinite looping animations (like pulse or spin) if they are purely decorative.

## Layout Animations
When using `layoutId` or `layout` properties for shared element transitions:
- Ensure elements have identical `layoutId` across different components.
- Use the predefined `springTransitions.layout` from `animations.ts` for consistent timing.

## What Not To Do
- **No fake delays:** Do not artificially delay UI states (like AI responses) just to show an animation.
- **No game-like bounces:** Avoid overly springy effects unless it's a specific gamified element (e.g., earning a badge).
- **No large uncoordinated enters:** Stagger large lists; don't animate 20 items in at exactly the same time.

## Migration
If you encounter legacy GSAP code, please refactor it to `motion/react` using the patterns defined above.
