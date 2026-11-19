import React from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Droplets, Leaf, Sun, Trees } from 'lucide-react';
import { VillageProfile } from '../types/village';
import { PageHeader } from '../components/PageHeader';
import { HealthGauge } from '../components/HealthGauge';
import { ChartTooltip } from '../components/ChartTooltip';

interface SustainabilityPageProps {
  village: VillageProfile;
}

export const SustainabilityPage: React.FC<SustainabilityPageProps> = ({
  village,
}) => {
  const s = village.sustainability;
  const netGap = s.netEmissionsTons - s.sequesteredTons;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Village Sustainability & Net-Zero Ledger"
        subtitle="Carbon balance score, vegetative canopy cover, community renewable generation, and groundwater recharge progress."
        meta={[
          village.name,
          `Carbon Score: ${s.carbonScore}/100`,
          `Renewable Mix: ${s.renewableSharePercent}%`,
          'Net-Zero Target: 2030',
        ]}
      />

      {/* Top Row: Carbon Score Gauge + 3 Primary Sustainability Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between items-center text-center">
          <div className="w-full text-left">
            <h2 className="font-display text-base font-semibold text-[#F4F8FF]">
              Carbon Sustainability Score
            </h2>
            <p className="text-xs text-[#8BA3C7] mt-0.5">
              Emissions intensity vs. local agroforestry sequestration
            </p>
          </div>

          <div className="my-4">
            <HealthGauge
              score={s.carbonScore}
              label="Carbon Score"
              sublabel={`${netGap} tCO2e net gap`}
              accent="emerald"
              size={198}
            />
          </div>

          <div className="w-full grid grid-cols-2 gap-3 pt-4 border-t border-[#172844]">
            <div>
              <div className="text-[11px] text-[#7E96B8]">Gross Emissions</div>
              <div className="font-mono text-base font-semibold text-amber-400 tabular-nums">
                {s.netEmissionsTons} t
              </div>
            </div>
            <div>
              <div className="text-[11px] text-[#7E96B8]">Carbon Captured</div>
              <div className="font-mono text-base font-semibold text-emerald-400 tabular-nums">
                {s.sequesteredTons} t
              </div>
            </div>
          </div>
        </div>

        {/* Core Sustainability KPI Grid */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8BA3C7]">
                Green Cover & Canopy
              </span>
              <Trees className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-semibold text-emerald-400 tabular-nums">
                {s.greenCoverPercent}%
              </div>
              <div className="mt-1 text-xs text-[#9BB0CE] font-mono tabular-nums">
                {s.greenCoverHectares} hectares of tree canopy & orchards
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#162742] overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${s.greenCoverPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8BA3C7]">
                Renewable Energy Share
              </span>
              <Sun className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-semibold text-cyan-400 tabular-nums">
                {s.renewableSharePercent}%
              </div>
              <div className="mt-1 text-xs text-[#9BB0CE] font-mono tabular-nums">
                {s.solarCapacityKw} kW community solar + biogas digesters
              </div>
            </div>
            <div className="h-1.5 w-full rounded-full bg-[#162742] overflow-hidden">
              <div
                className="h-full bg-cyan-400 rounded-full"
                style={{ width: `${s.renewableSharePercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8BA3C7]">
                Annual Rainwater Harvested
              </span>
              <Droplets className="w-4 h-4 text-sky-400" />
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-semibold text-[#F6F9FF] tabular-nums">
                {s.rainwaterHarvestedML} ML
              </div>
              <div className="mt-1 text-xs text-[#9BB0CE]">
                Captured via check-dams & rooftop recharge pits
              </div>
            </div>
            <div className="text-xs text-emerald-400 font-mono tabular-nums">
              +18.2% YoY aquifer recharge
            </div>
          </div>

          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#8BA3C7]">
                Soil Organic Health Index
              </span>
              <Leaf className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="my-3">
              <div className="font-mono text-3xl font-semibold text-[#F6F9FF] tabular-nums">
                {s.soilHealthIndex}
                <span className="text-sm text-[#7890B2]"> / 100</span>
              </div>
              <div className="mt-1 text-xs text-[#9BB0CE]">
                Tested across 142 composite ward farm samples
              </div>
            </div>
            <div className="text-xs text-cyan-400">
              Organic composting active in 5 of 6 wards
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row: Multi-Year Carbon Trajectory & Renewable Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
                6-Year Emissions vs. Carbon Sequestration (tCO2e)
              </h3>
              <p className="text-xs text-[#8BA3C7]">
                Tracking annual village decarbonization toward Net-Zero 2030
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#9BB0CE]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-amber-400 inline-block" />
                Emissions
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" />
                Captured
              </span>
            </div>
          </div>

          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={s.yearlyCarbonTrend}
                margin={{ top: 6, right: 12, left: -12, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="seqGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: '#8BA3C7', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: '#8BA3C7', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip unitSuffix=" tCO2e" />} />
                <Area
                  type="monotone"
                  dataKey="emissions"
                  name="Gross Emissions"
                  stroke="#F59E0B"
                  strokeWidth={2}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="sequestration"
                  name="Sequestration"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  fill="url(#seqGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Energy Source Mix */}
        <div className="lg:col-span-5 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
              Village Electricity Generation Mix
            </h3>
            <p className="text-xs text-[#8BA3C7] mt-0.5">
              Share of total local consumption by energy source
            </p>
          </div>

          <div className="h-[190px] w-full my-2">
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie
                  data={s.energyMix}
                  dataKey="share"
                  nameKey="source"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {s.energyMix.map((entry) => (
                    <Cell key={entry.source} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip unitSuffix="%" />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-3 border-t border-[#172844]">
            {s.energyMix.map((item) => (
              <div
                key={item.source}
                className="flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 text-[#C5D4E8]">
                  <span
                    className="w-2.5 h-2.5 rounded-xs shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.source}</span>
                </div>
                <span className="font-mono text-[#F4F8FF] tabular-nums">
                  {item.share}% ({item.capacityKw} kW)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Net-Zero 2030 Roadmap Milestones */}
      <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6">
        <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
          Net-Zero 2030 Panchayat Milestones
        </h3>
        <p className="text-xs text-[#8BA3C7] mt-0.5 mb-5">
          Tracked sustainability targets verified through quarterly environmental audits
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {s.milestones.map((m) => (
            <div
              key={m.title}
              className="p-4 rounded-lg bg-[#091324] border border-[#162742]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-[#F1F5FB]">
                    {m.title}
                  </div>
                  <div className="mt-1 text-xs text-[#8BA3C7]">{m.metric}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-sm font-semibold text-emerald-400 tabular-nums">
                    {m.progress}%
                  </div>
                  <div className="font-mono text-[11px] text-[#7890B2]">
                    Target {m.targetYear}
                  </div>
                </div>
              </div>
              <div className="mt-3 h-1.5 rounded-full bg-[#152540] overflow-hidden">
                <div
                  className="h-full bg-emerald-400 rounded-full"
                  style={{ width: `${m.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
