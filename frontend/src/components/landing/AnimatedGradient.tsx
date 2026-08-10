import React from 'react';

/**
 * Procedural animated gradient — hero-only visual identity for "The Foundry".
 * Pure CSS (no JS raf loop). Blobs drift on independent transform keyframes.
 * Palette pulled from design tokens (ember/gold/steel) so it stays on-brand,
 * with a violet undertone for depth instead of the reference image's literal
 * magenta/coral/cream mix.
 */
export const AnimatedGradient: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {/* base graphite layer already comes from bg-background on parent */}
      <div className="absolute inset-0 [filter:blur(60px)] opacity-80">
        <span className="blob blob-ember" />
        <span className="blob blob-gold" />
        <span className="blob blob-steel" />
        <span className="blob blob-violet" />
      </div>

      {/* grain */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-overlay">
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
          top: 8%; left: 12%;
          width: 42vw; height: 42vw; max-width: 560px; max-height: 560px;
          background: radial-gradient(circle, hsl(var(--ember) / 0.55), transparent 70%);
          animation: drift-a 26s ease-in-out infinite;
        }
        .blob-gold {
          top: 4%; right: 8%;
          width: 30vw; height: 30vw; max-width: 420px; max-height: 420px;
          background: radial-gradient(circle, hsl(var(--gold) / 0.5), transparent 70%);
          animation: drift-b 22s ease-in-out infinite;
        }
        .blob-steel {
          bottom: 6%; left: 30%;
          width: 34vw; height: 34vw; max-width: 460px; max-height: 460px;
          background: radial-gradient(circle, hsl(var(--steel) / 0.4), transparent 70%);
          animation: drift-c 30s ease-in-out infinite;
        }
        .blob-violet {
          bottom: -4%; right: 18%;
          width: 26vw; height: 26vw; max-width: 380px; max-height: 380px;
          background: radial-gradient(circle, hsl(262 70% 58% / 0.35), transparent 70%);
          animation: drift-d 34s ease-in-out infinite;
        }
        @keyframes drift-a {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(4%, 6%) scale(1.08); }
        }
        @keyframes drift-b {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-6%, 4%) scale(0.94); }
        }
        @keyframes drift-c {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(3%, -5%) scale(1.05); }
        }
        @keyframes drift-d {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-3%, -4%) scale(1.1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob { animation: none !important; }
        }
      `}</style>
    </div>
  );
};
