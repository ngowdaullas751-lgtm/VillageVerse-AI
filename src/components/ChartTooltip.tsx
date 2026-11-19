import React from 'react';

interface TooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  unit?: string;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
  unitSuffix?: string;
}

export const ChartTooltip: React.FC<ChartTooltipProps> = ({
  active,
  payload,
  label,
  unitSuffix = '',
}) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg bg-[#091324] border border-[#23395B] px-3.5 py-2.5 shadow-xl text-xs">
      {label && (
        <div className="font-medium text-[#D6E2F3] mb-1.5 pb-1 border-b border-[#192B47]">
          {label}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, idx) => (
          <div
            key={`${entry.name}-${idx}`}
            className="flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-2 text-[#9BB0CE]">
              <span
                className="w-2 h-2 rounded-xs shrink-0"
                style={{ backgroundColor: entry.color || '#06B6D4' }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-mono font-medium text-[#F1F5FB] tabular-nums">
              {entry.value}
              {entry.unit ?? unitSuffix}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
