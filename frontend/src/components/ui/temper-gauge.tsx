import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * TemperGauge — StudyForge's signature progress motif.
 *
 * A circular heat gauge: the arc fills like metal coming up to temperature,
 * ember at the low end, gold at full heat. Use it anywhere a generic progress
 * bar would otherwise appear — readiness score, mastery %, streak strength.
 */
export interface TemperGaugeProps {
  /** 0–100 */
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  className?: string;
  trackClassName?: string;
  /** Override the default "NN%" center readout with custom content (e.g. a timer). */
  children?: React.ReactNode;
}

export function TemperGauge({
  value,
  size = 128,
  strokeWidth = 10,
  label,
  sublabel,
  className,
  trackClassName,
  children,
}: TemperGaugeProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;
  const gaugeId = React.useId();

  return (
    <div
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <defs>
          <linearGradient id={gaugeId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--ember))" />
            <stop offset="100%" stopColor="hsl(var(--gold))" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={strokeWidth}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#${gaugeId})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="animate-temper"
          style={
            {
              '--gauge-offset-start': circumference,
              '--gauge-offset-end': offset,
            } as React.CSSProperties
          }
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children ?? (
          <>
            <span className="font-mono text-2xl font-semibold tabular-nums leading-none">
              {Math.round(clamped)}
              <span className="text-sm text-secondary">%</span>
            </span>
            {label && <span className="mt-1 text-[11px] font-medium text-secondary">{label}</span>}
          </>
        )}
      </div>
      {sublabel && (
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-secondary">
          {sublabel}
        </span>
      )}
    </div>
  );
}

/**
 * TemperBar — linear sibling of TemperGauge, for inline / list-row progress
 * (e.g. per-topic mastery in a table) where a full radial gauge is too heavy.
 */
export function TemperBar({
  value,
  className,
  showValue = true,
}: {
  value: number;
  className?: string;
  showValue?: boolean;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
        <div
          className="h-full rounded-full bg-ember-gradient transition-[width] duration-700 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      {showValue && (
        <span className="w-9 shrink-0 text-right font-mono text-xs tabular-nums text-secondary">
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
