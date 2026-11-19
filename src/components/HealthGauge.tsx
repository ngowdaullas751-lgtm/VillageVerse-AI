import React from 'react';

interface HealthGaugeProps {
  score: number;
  label: string;
  sublabel?: string;
  accent?: 'cyan' | 'emerald';
  size?: number;
}

export const HealthGauge: React.FC<HealthGaugeProps> = ({
  score,
  label,
  sublabel,
  accent = 'cyan',
  size = 188,
}) => {
  const clamped = Math.max(0, Math.min(100, score));
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // 240-degree sweep arc
  const arcLength = circumference * (240 / 360);
  const dashOffset = arcLength * (1 - clamped / 100);

  const strokeColor =
    accent === 'emerald'
      ? clamped >= 75
        ? '#10B981'
        : clamped >= 55
        ? '#06B6D4'
        : '#F59E0B'
      : clamped >= 80
      ? '#10B981'
      : clamped >= 65
      ? '#06B6D4'
      : '#F59E0B';

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none"
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
        role="img"
        aria-label={`${label}: ${clamped} out of 100`}
      >
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#152642"
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(150 ${size / 2} ${size / 2})`}
        />
        {/* Active progress arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${circumference}`}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          transform={`rotate(150 ${size / 2} ${size / 2})`}
          style={{
            transition: 'stroke-dashoffset 500ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <div className="flex items-baseline gap-0.5">
          <span className="font-mono text-4xl font-semibold tracking-tight text-[#F4F8FF] tabular-nums">
            {clamped}
          </span>
          <span className="font-mono text-sm text-[#7E96B8] tabular-nums">
            /100
          </span>
        </div>
        <span className="mt-1 text-xs font-medium text-[#C5D4E8]">{label}</span>
        {sublabel && (
          <span className="mt-0.5 text-[11px] text-[#34D399] font-mono tabular-nums">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
