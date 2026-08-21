import React from 'react';

/**
 * Procedural animated gradient — landing page visual identity reminiscent of Apple ID.
 * Pure CSS (no JS raf loop). Blobs drift on independent transform keyframes.
 * Palette pulled from design tokens (ember/gold/steel/violet) to stay perfectly
 * integrated with the updated premium palette.
 */
export const AnimatedGradient: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      <div className="absolute inset-0 opacity-40 gradient-bg" />

      {/* grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.03] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* fade to background at edges so content stays crisp */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

      <style>{`
        .gradient-bg {
          background: linear-gradient(
            -45deg, 
            hsl(var(--ember)), 
            hsl(var(--gold)), 
            hsl(var(--steel)), 
            hsl(262 85% 60%)
          );
          background-size: 400% 400%;
          animation: gradient-animation 15s ease infinite;
          filter: blur(80px);
        }

        @keyframes gradient-animation {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .gradient-bg { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
