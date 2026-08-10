# Motion.dev Implementation Plan

## Current Frontend Architecture
* **Framework:** React 18, Vite, TypeScript
* **Styling:** Tailwind CSS, shadcn/ui (`tailwindcss-animate`)
* **Routing:** `react-router-dom`
* **State Management/Data Fetching:** `react-hook-form`, `@tanstack/react-query`

## Current Animation Implementation
* **GSAP:** Heavily used in the landing page (`Hero.tsx`, `Features.tsx`, `HowItWorks.tsx`) for scroll-triggered animations and timelines.
* **Framer Motion:** Already installed (`framer-motion@11.0.24`) and minimally used in `AtsDashboard.tsx` and `Layout.tsx`.
* **CSS Animations:** Custom `@keyframes` used in `AnimatedGradient.tsx`.
* **Tailwind Animations:** `tailwindcss-animate` handles basic shadcn/ui enters/exits.

## Pages Discovered
* `LandingPage.tsx`
* `Dashboard.tsx`
* `AtsDashboard.tsx`
* `AITutor.tsx`
* `PhotoSolve.tsx`
* `Flashcards.tsx`
* `Resources.tsx`
* `StudyRoadmap.tsx`

## Reusable Components Discovered
* `src/components/ui/*` (shadcn/ui components)
* `src/components/layout/Layout.tsx`
* `src/components/landing/*` (Hero, Features, HowItWorks)
* `src/components/dashboard/*`
* `src/components/auth/*`

## Animation Opportunities
* **Standardization:** Migrate GSAP landing page animations to Motion for a unified animation engine, reducing bundle size.
* **Page Transitions:** Centralize route transitions in a shared Layout or App component.
* **AI Features:** Add polished loading, processing, and streaming reveal animations for `AITutor` and `PhotoSolve`.
* **Dashboards:** Staggered entrances for cards in `Dashboard` and `AtsDashboard`.
* **Micro-interactions:** Enhance buttons, cards, and list items with subtle hover/tap feedback.
* **Complex UI:** Use `layoutId` for tabs and expanding cards.

## Potential Performance Risks
* **Bundle Size / Conflicting Libraries:** Running GSAP and Motion side-by-side. The plan includes migrating GSAP out.
* **Over-animation:** Wrapping too many DOM nodes in `motion.div`. We will use reusable wrapper components only where UX value is added.
* **Layout Thrashing:** Overusing layout animations on complex lists or text.
* **Video/Camera Streams:** Ensuring animation does not block main-thread rendering for any media elements.

## Proposed Implementation Order
1. **Phase 1-6 (Foundation):** Install `motion` package (upgrade from `framer-motion`), create `src/lib/motion/` design system, define tokens, and build base reusable motion components (`FadeIn`, `AnimatedCard`, etc.).
2. **Phase 7 (Routing):** Implement subtle page transitions using `AnimatePresence`.
3. **Phase 8 (Landing Page):** Migrate GSAP animations to Motion in `src/components/landing/*`.
4. **Phase 9-12 (Navigation & Dashboard):** Animate navbar, sidebar, and dashboard metrics with staggered cards.
5. **Phase 13-16 (AI & Core Features):** Add sophisticated states for AI generation (`AITutor`, `PhotoSolve`) and the ATS dashboard.
6. **Phase 17-30 (UI Elements):** Standardize forms, buttons, cards, modals, and lists using our motion components.
7. **Phase 31-39 (Polish & Optimization):** Enforce reduced motion, clean up unused animations/libraries (like GSAP), test performance, write `MOTION_GUIDELINES.md`, and perform final QA.
