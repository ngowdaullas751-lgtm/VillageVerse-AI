import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  meta?: string[];
  actions?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  meta,
  actions,
}) => {
  return (
    <div className="flex flex-col gap-4 pb-6 border-b border-[#192B47] lg:flex-row lg:items-end lg:justify-between">
      <div className="min-w-0">
        {meta && meta.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 text-xs text-[#7E96B8] mb-2">
            {meta.map((item, idx) => (
              <React.Fragment key={item}>
                {idx > 0 && <span aria-hidden="true">·</span>}
                <span>{item}</span>
              </React.Fragment>
            ))}
          </div>
        )}
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F1F5FB] text-balance">
          {title}
        </h1>
        <p className="mt-1.5 text-sm sm:text-[15px] text-[#94AAC9] max-w-3xl leading-relaxed">
          {subtitle}
        </p>
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
};
