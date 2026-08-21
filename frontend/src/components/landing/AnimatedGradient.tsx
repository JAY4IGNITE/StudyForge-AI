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
      {/* base graphite layer already comes from bg-background on parent */}
      <div className="absolute inset-0 [filter:blur(120px)] opacity-85">
        <span className="blob blob-ember" />
        <span className="blob blob-gold" />
        <span className="blob blob-steel" />
        <span className="blob blob-violet" />
      </div>

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
        .blob {
          position: absolute;
          border-radius: 9999px;
          will-change: transform;
        }
        .blob-ember {
          top: -10%; left: -10%;
          width: 75vw; height: 75vw; max-width: 900px; max-height: 900px;
          background: radial-gradient(circle, hsl(var(--ember) / 0.6), transparent 70%);
          animation: drift-a 35s ease-in-out infinite;
        }
        .blob-gold {
          top: -5%; right: -10%;
          width: 65vw; height: 65vw; max-width: 800px; max-height: 800px;
          background: radial-gradient(circle, hsl(var(--gold) / 0.55), transparent 70%);
          animation: drift-b 28s ease-in-out infinite;
        }
        .blob-steel {
          bottom: -10%; left: 10%;
          width: 70vw; height: 70vw; max-width: 850px; max-height: 850px;
          background: radial-gradient(circle, hsl(var(--steel) / 0.5), transparent 70%);
          animation: drift-c 40s ease-in-out infinite;
        }
        .blob-violet {
          bottom: -15%; right: 5%;
          width: 60vw; height: 60vw; max-width: 750px; max-height: 750px;
          background: radial-gradient(circle, hsl(262 85% 60% / 0.45), transparent 70%);
          animation: drift-d 45s ease-in-out infinite;
        }
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(8%, 10%) scale(1.15) rotate(45deg); }
          66% { transform: translate(-4%, 12%) scale(0.95) rotate(-45deg); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-10%, 8%) scale(0.9) rotate(-30deg); }
          66% { transform: translate(-6%, -10%) scale(1.1) rotate(30deg); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(6%, -8%) scale(1.1) rotate(60deg); }
          66% { transform: translate(-8%, -4%) scale(0.9) rotate(-60deg); }
        }
        @keyframes drift-d {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          33% { transform: translate(-5%, -10%) scale(1.15) rotate(-45deg); }
          66% { transform: translate(8%, 5%) scale(0.95) rotate(45deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
