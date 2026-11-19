import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  ArrowUpRight,
  BookOpen,
  Droplets,
  HeartPulse,
  Route,
  Sprout,
  Zap,
} from 'lucide-react';
import { PageId, SectorKey, VillageProfile } from '../types/village';
import { PageHeader } from '../components/PageHeader';
import { HealthGauge } from '../components/HealthGauge';
import { ChartTooltip } from '../components/ChartTooltip';

interface DashboardPageProps {
  village: VillageProfile;
  openComplaintsCount: number;
  onNavigate: (page: PageId) => void;
}

const SECTOR_ICONS: Record<SectorKey, React.ComponentType<{ className?: string }>> = {
  water: Droplets,
  agriculture: Sprout,
  roads: Route,
  electricity: Zap,
  healthcare: HeartPulse,
  education: BookOpen,
};

const STATUS_TEXT_COLOR: Record<string, string> = {
  Optimal: 'text-emerald-400',
  Stable: 'text-cyan-400',
  Watch: 'text-amber-400',
  Critical: 'text-rose-400',
};

export const DashboardPage: React.FC<DashboardPageProps> = ({
  village,
  openComplaintsCount,
  onNavigate,
}) => {
  const [selectedSectorKey, setSelectedSectorKey] = useState<SectorKey>('water');

  const selectedSector =
    village.sectors.find((s) => s.key === selectedSectorKey) ?? village.sectors[0];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Village Health Intelligence Dashboard"
        subtitle={`Composite infrastructure, civic service, and resource readiness score across all six wards of ${village.name}.`}
        meta={[
          `${village.district}, ${village.state}`,
          `${village.population.toLocaleString()} residents`,
          `${village.households.toLocaleString()} households`,
          `FY Budget ₹${village.annualBudgetLakhs}L`,
        ]}
        actions={
          <button
            onClick={() => onNavigate('simulation')}
            className="px-4 py-2 text-xs font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
          >
            Run What-If Simulation
          </button>
        }
      />

      {/* Top Row: Overall Village Health Score Gauge + 12-Month Trend Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col justify-between">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4F8FF]">
                Village Health Score
              </h2>
              <p className="text-xs text-[#8BA3C7] mt-0.5">
                Weighted index across 6 core sectors
              </p>
            </div>
            <span className="font-mono text-xs text-emerald-400 tabular-nums">
              +{village.overallDelta} YoY
            </span>
          </div>

          <div className="my-4 flex justify-center">
            <HealthGauge
              score={village.overallHealthScore}
              label="Composite Index"
              sublabel="Tier-A Smart Gram"
              accent="cyan"
              size={204}
            />
          </div>

          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#172844] text-center">
            <div>
              <div className="font-mono text-base font-semibold text-[#F4F8FF] tabular-nums">
                {village.wards.length}
              </div>
              <div className="text-[11px] text-[#7E96B8]">Wards</div>
            </div>
            <div>
              <div className="font-mono text-base font-semibold text-emerald-400 tabular-nums">
                {village.sustainability.renewableSharePercent}%
              </div>
              <div className="text-[11px] text-[#7E96B8]">Renewable</div>
            </div>
            <div>
              <div className="font-mono text-base font-semibold text-amber-400 tabular-nums">
                {openComplaintsCount}
              </div>
              <div className="text-[11px] text-[#7E96B8]">Open Issues</div>
            </div>
          </div>
        </div>

        {/* 12-Month Health Score Trajectory */}
        <div className="lg:col-span-8 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-5">
            <div>
              <h2 className="font-display text-base font-semibold text-[#F4F8FF]">
                12-Month Health Score Trajectory
              </h2>
              <p className="text-xs text-[#8BA3C7] mt-0.5">
                Overall village score compared against water and electricity sector progress
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-[#9BB0CE]">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-cyan-400 inline-block" />
                Overall
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-emerald-400 inline-block" />
                Electricity
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-0.5 bg-sky-400 inline-block" />
                Water
              </span>
            </div>
          </div>

          <div className="flex-1 min-h-[250px] w-full">
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart
                data={village.monthlyHistory}
                margin={{ top: 8, right: 12, left: -16, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="overallGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.32} />
                    <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="month"
                  stroke="#6D85AA"
                  tick={{ fill: '#8BA3C7', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[55, 95]}
                  stroke="#6D85AA"
                  tick={{ fill: '#8BA3C7', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip unitSuffix=" / 100" />} />
                <Area
                  type="monotone"
                  dataKey="overall"
                  name="Overall Score"
                  stroke="#06B6D4"
                  strokeWidth={2.5}
                  fill="url(#overallGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="electricity"
                  name="Electricity"
                  stroke="#10B981"
                  strokeWidth={1.75}
                  fill="none"
                />
                <Area
                  type="monotone"
                  dataKey="water"
                  name="Water"
                  stroke="#38BDF8"
                  strokeWidth={1.75}
                  strokeDasharray="4 4"
                  fill="none"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6 Village Health Score Cards: Water, Agriculture, Roads, Electricity, Healthcare, Education */}
      <section>
        <div className="flex items-end justify-between gap-4 mb-4">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#F4F8FF]">
              Sector Health Scorecards
            </h2>
            <p className="text-xs text-[#8BA3C7] mt-0.5">
              Select any sector to inspect its six-ward breakdown below
            </p>
          </div>
          <button
            onClick={() => onNavigate('predictions')}
            className="text-xs font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 whitespace-nowrap"
          >
            <span>View Risk Forecasts</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {village.sectors.map((sector) => {
            const Icon = SECTOR_ICONS[sector.key];
            const isSelected = sector.key === selectedSectorKey;
            const barColor =
              sector.score >= 80
                ? 'bg-emerald-400'
                : sector.score >= 70
                ? 'bg-cyan-400'
                : 'bg-amber-400';

            return (
              <button
                key={sector.key}
                onClick={() => setSelectedSectorKey(sector.key)}
                className={`text-left rounded-xl p-5 border transition-colors ${
                  isSelected
                    ? 'bg-[#10203B] border-cyan-400/60'
                    : 'bg-[#0C172B] border-[#1B2E4B] hover:bg-[#0F1E36] hover:border-[#29446D]'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isSelected ? 'text-cyan-400' : 'text-[#7E96B8]'
                      }`}
                    />
                    <h3 className="font-display text-[15px] font-semibold text-[#F4F8FF] truncate">
                      {sector.label}
                    </h3>
                  </div>
                  <div className="flex items-baseline gap-1 shrink-0">
                    <span className="font-mono text-2xl font-semibold text-[#F6F9FF] tabular-nums">
                      {sector.score}
                    </span>
                    <span className="font-mono text-xs text-[#6E86AA] tabular-nums">
                      /100
                    </span>
                  </div>
                </div>

                {/* Clean metadata line — zero static pills */}
                <div className="mt-2 flex items-center gap-2 text-xs text-[#8BA3C7]">
                  <span className={`font-medium ${STATUS_TEXT_COLOR[sector.status]}`}>
                    {sector.status}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono text-emerald-400 tabular-nums">
                    +{sector.delta} pts
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3.5 h-1.5 w-full rounded-full bg-[#162742] overflow-hidden">
                  <div
                    className={`h-full rounded-full ${barColor}`}
                    style={{ width: `${sector.score}%` }}
                  />
                </div>

                {/* Key quantitative readings */}
                <div className="mt-4 pt-3.5 border-t border-[#172844] grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[11px] text-[#7890B2]">
                      {sector.primaryMetricLabel}
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-medium text-[#E6EEF8] tabular-nums">
                      {sector.primaryMetricValue}
                    </div>
                  </div>
                  <div>
                    <div className="text-[11px] text-[#7890B2]">
                      {sector.secondaryMetricLabel}
                    </div>
                    <div className="mt-0.5 font-mono text-sm font-medium text-[#E6EEF8] tabular-nums">
                      {sector.secondaryMetricValue}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Bottom Split: Selected Sector Ward Chart + Ward Performance Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6">
          <div className="flex items-start justify-between gap-2 mb-2">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
                {selectedSector.label} by Ward
              </h3>
              <p className="text-xs text-[#8BA3C7] mt-1 leading-relaxed">
                {selectedSector.summary}
              </p>
            </div>
          </div>

          <div className="mt-5 h-[220px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart
                data={selectedSector.wardScores}
                margin={{ top: 6, right: 8, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="ward"
                  stroke="#6D85AA"
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#6D85AA"
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip unitSuffix=" / 100" />} />
                <Bar
                  dataKey="score"
                  name={selectedSector.label}
                  fill="#06B6D4"
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ward Directory & Live Health Table */}
        <div className="lg:col-span-7 rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-[#172844] flex items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
                Ward-Level Summary
              </h3>
              <p className="text-xs text-[#8BA3C7]">
                Population, composite health score, tap water coverage, and open grievances
              </p>
            </div>
            <button
              onClick={() => onNavigate('map')}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 whitespace-nowrap"
            >
              Inspect on Map
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#172844] text-[11px] font-medium text-[#7C93B6]">
                  <th className="py-3 px-6">Ward</th>
                  <th className="py-3 px-4 text-right">Population</th>
                  <th className="py-3 px-4 text-right">Health</th>
                  <th className="py-3 px-4 text-right">Tap Water</th>
                  <th className="py-3 px-4 text-right">Solar</th>
                  <th className="py-3 px-6 text-right">Issues</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#14243D] text-sm">
                {village.wards.map((w) => (
                  <tr
                    key={w.id}
                    className="hover:bg-[#101F38] transition-colors"
                  >
                    <td className="py-3 px-6 font-medium text-[#E6EEF8] whitespace-nowrap">
                      {w.name}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#A5B8D4] tabular-nums">
                      {w.population.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs font-semibold tabular-nums">
                      <span
                        className={
                          w.healthScore >= 80
                            ? 'text-emerald-400'
                            : w.healthScore >= 72
                            ? 'text-cyan-400'
                            : 'text-amber-400'
                        }
                      >
                        {w.healthScore}/100
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#C5D4E8] tabular-nums">
                      {w.waterCoverage}%
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-xs text-[#C5D4E8] tabular-nums">
                      {w.solarAdoption}%
                    </td>
                    <td className="py-3 px-6 text-right font-mono text-xs tabular-nums">
                      <span
                        className={
                          w.openComplaints >= 4
                            ? 'text-rose-400 font-semibold'
                            : w.openComplaints >= 2
                            ? 'text-amber-400'
                            : 'text-[#8BA3C7]'
                        }
                      >
                        {w.openComplaints}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
