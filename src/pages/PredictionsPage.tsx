import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  CloudRain,
  Droplets,
  Sprout,
  Sun,
  Zap,
} from 'lucide-react';
import {
  PageId,
  PredictionDomainKey,
  VillageProfile,
} from '../types/village';
import { PageHeader } from '../components/PageHeader';
import { ChartTooltip } from '../components/ChartTooltip';

interface PredictionsPageProps {
  village: VillageProfile;
  onNavigate: (page: PageId) => void;
}

const DOMAIN_ICONS: Record<
  PredictionDomainKey,
  React.ComponentType<{ className?: string }>
> = {
  water_shortage: Droplets,
  crop_yield: Sprout,
  flood_risk: CloudRain,
  drought: Sun,
  electricity_demand: Zap,
};

const RISK_COLOR: Record<string, string> = {
  Low: 'text-emerald-400',
  Moderate: 'text-cyan-400',
  Elevated: 'text-amber-400',
  High: 'text-rose-400',
};

export const PredictionsPage: React.FC<PredictionsPageProps> = ({
  village,
  onNavigate,
}) => {
  const [activeKey, setActiveKey] =
    useState<PredictionDomainKey>('water_shortage');
  const [horizon, setHorizon] = useState<'30d' | '90d' | '180d'>('90d');

  const domain =
    village.predictions.find((p) => p.key === activeKey) ??
    village.predictions[0];

  const series = domain.horizons[horizon];

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Predictive Risk & Resource Forecasting"
        subtitle="Multi-horizon forecasts for water shortage, crop yield, flood risk, drought severity, and peak electricity demand."
        meta={[
          village.name,
          '5 Active Forecasting Models',
          `Selected Horizon: ${horizon.toUpperCase()}`,
        ]}
        actions={
          <div className="flex items-center gap-1 p-1 bg-[#0C172B] border border-[#1B2E4B] rounded-lg">
            {(['30d', '90d', '180d'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setHorizon(h)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  horizon === h
                    ? 'bg-cyan-400 text-[#04101E] font-semibold'
                    : 'text-[#9BB0CE] hover:text-white'
                }`}
              >
                {h === '30d' ? '30 Days' : h === '90d' ? '90 Days' : '180 Days'}
              </button>
            ))}
          </div>
        }
      />

      {/* 5 Prediction Domain Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {village.predictions.map((item) => {
          const Icon = DOMAIN_ICONS[item.key];
          const isActive = item.key === activeKey;
          return (
            <button
              key={item.key}
              onClick={() => setActiveKey(item.key)}
              className={`text-left rounded-xl p-4 border transition-colors ${
                isActive
                  ? 'bg-[#10203B] border-cyan-400/60'
                  : 'bg-[#0C172B] border-[#1B2E4B] hover:bg-[#0F1E36]'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <Icon
                  className={`w-4 h-4 ${
                    isActive ? 'text-cyan-400' : 'text-[#7E96B8]'
                  }`}
                />
                <span
                  className={`text-xs font-medium ${RISK_COLOR[item.riskLevel]}`}
                >
                  {item.riskLevel} Risk
                </span>
              </div>
              <div className="mt-3 text-xs font-medium text-[#C5D4E8] truncate">
                {item.title}
              </div>
              <div className="mt-1 font-mono text-xl font-semibold text-[#F6F9FF] tabular-nums">
                {item.forecastValue}
              </div>
              <div className="mt-1 text-[11px] text-[#7890B2] font-mono tabular-nums">
                Now {item.currentValue} · {item.confidence}% conf.
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Forecast Chart & Recommended Action Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-5">
            <div>
              <div className="flex items-center gap-2 text-xs text-[#8BA3C7]">
                <span>{domain.unit}</span>
                <span aria-hidden="true">·</span>
                <span className={RISK_COLOR[domain.riskLevel]}>
                  {domain.riskLevel} Severity
                </span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums">
                  {domain.confidence}% Model Confidence
                </span>
              </div>
              <h2 className="mt-1 font-display text-lg font-semibold text-[#F4F8FF]">
                {domain.title} ({horizon === '30d' ? '30-Day' : horizon === '90d' ? '90-Day' : '180-Day'} Outlook)
              </h2>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#9BB0CE] shrink-0">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                AI Forecast
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-[#6E86AA] inline-block" />
                Historical Baseline
              </span>
            </div>
          </div>

          <div className="h-[290px] w-full">
            <ResponsiveContainer width="100%" height={290}>
              <AreaChart
                data={series}
                margin={{ top: 8, right: 12, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="predBand" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.28} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="period"
                  stroke="#6D85AA"
                  tick={{ fill: '#8BA3C7', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke="#6D85AA"
                  tick={{ fill: '#8BA3C7', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="upperBound"
                  name="Upper Confidence"
                  stroke="transparent"
                  fill="url(#predBand)"
                />
                <Area
                  type="monotone"
                  dataKey="predicted"
                  name="AI Forecast"
                  stroke="#22D3EE"
                  strokeWidth={2.5}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="baseline"
                  name="Baseline Norm"
                  stroke="#6E86AA"
                  strokeWidth={1.75}
                  strokeDasharray="5 5"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Summary, Drivers & Preventive Action */}
        <div className="lg:col-span-4 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between gap-6">
          <div>
            <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
              Diagnostic Summary
            </h3>
            <p className="mt-2 text-sm text-[#9EB2CF] leading-relaxed">
              {domain.summary}
            </p>

            <div className="mt-6">
              <div className="text-xs font-medium text-[#7C93B6] mb-3">
                Primary Predictive Drivers
              </div>
              <div className="space-y-3.5">
                {domain.drivers.map((drv) => (
                  <div key={drv.factor}>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-[#D6E2F3] font-medium">
                        {drv.factor}
                      </span>
                      <span className="font-mono text-cyan-400 tabular-nums">
                        {drv.weight}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 rounded-full bg-[#152540] overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full"
                        style={{ width: `${drv.weight}%` }}
                      />
                    </div>
                    <div className="mt-1 text-[11px] text-[#7E96B8]">
                      {drv.impact}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-5 border-t border-[#172844]">
            <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 mb-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Recommended Mitigation</span>
            </div>
            <p className="text-xs text-[#C5D4E8] leading-relaxed">
              {domain.recommendedAction}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => onNavigate('simulation')}
                className="px-3.5 py-2 text-xs font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap"
              >
                Simulate Mitigation
              </button>
              <button
                onClick={() => onNavigate('planner')}
                className="px-3.5 py-2 text-xs font-medium text-[#D6E2F3] bg-[#12233E] hover:bg-[#193054] rounded-lg transition-colors whitespace-nowrap"
              >
                Open Planner
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Ward Vulnerability Matrix */}
      <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#172844] flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
              Ward Exposure & Vulnerability Matrix — {domain.title}
            </h3>
            <p className="text-xs text-[#8BA3C7]">
              Sorted by projected risk severity across all six wards
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#172844] text-[11px] font-medium text-[#7C93B6]">
                <th className="py-3 px-6">Ward</th>
                <th className="py-3 px-4">Exposed Assets / Population</th>
                <th className="py-3 px-4">Severity Level</th>
                <th className="py-3 px-6 text-right">Risk Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14243D] text-sm">
              {domain.wardVulnerability.map((w) => (
                <tr key={w.ward} className="hover:bg-[#101F38] transition-colors">
                  <td className="py-3.5 px-6 font-medium text-[#E6EEF8] whitespace-nowrap">
                    {w.ward}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#A5B8D4]">
                    {w.exposure}
                  </td>
                  <td className="py-3.5 px-4 text-xs font-medium">
                    <span className={RISK_COLOR[w.status]}>{w.status}</span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <div className="inline-flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-[#162742] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            w.riskScore >= 65
                              ? 'bg-rose-400'
                              : w.riskScore >= 40
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ width: `${w.riskScore}%` }}
                        />
                      </div>
                      <span className="font-mono text-xs text-[#F1F5FB] w-9 text-right tabular-nums">
                        {w.riskScore}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
