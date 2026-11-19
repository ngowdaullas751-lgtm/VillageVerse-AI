import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  Box,
  Check,
  Droplets,
  HeartPulse,
  RotateCcw,
  Route,
  Sun,
} from 'lucide-react';
import {
  PageId,
  SimulationParams,
  VillageProfile,
} from '../types/village';
import { computeSimulationResult } from '../data/villageData';
import { PageHeader } from '../components/PageHeader';
import { ChartTooltip } from '../components/ChartTooltip';

interface SimulationPageProps {
  village: VillageProfile;
  params: SimulationParams;
  onChangeParams: (next: SimulationParams) => void;
  onApplyToPlanner: (params: SimulationParams) => void;
  onNavigate: (page: PageId) => void;
}

const PRESETS: { label: string; desc: string; values: SimulationParams }[] = [
  {
    label: 'Balanced Growth',
    desc: '4 km roads, 2 tanks, 2 solar plants, 1 clinic',
    values: { roadsKm: 4, waterTanks: 2, solarPlants: 2, hospitals: 1 },
  },
  {
    label: 'Water & Drought Shield',
    desc: 'Focus on water storage & farm connectivity',
    values: { roadsKm: 3, waterTanks: 5, solarPlants: 1, hospitals: 0 },
  },
  {
    label: 'Net-Zero Clean Energy',
    desc: 'Maximum solar microgrid + rural clinic',
    values: { roadsKm: 2, waterTanks: 1, solarPlants: 5, hospitals: 1 },
  },
];

export const SimulationPage: React.FC<SimulationPageProps> = ({
  village,
  params,
  onChangeParams,
  onApplyToPlanner,
  onNavigate,
}) => {
  const [appliedFeedback, setAppliedFeedback] = useState(false);

  const result = computeSimulationResult(village, params);
  const budgetRatio = Math.round(
    (result.totalCostLakhs / village.annualBudgetLakhs) * 100
  );

  const handleApply = () => {
    onApplyToPlanner(params);
    setAppliedFeedback(true);
    window.setTimeout(() => setAppliedFeedback(false), 3000);
  };

  const controls: {
    key: keyof SimulationParams;
    label: string;
    unit: string;
    unitCost: string;
    min: number;
    max: number;
    step: number;
    icon: React.ComponentType<{ className?: string }>;
    detail: string;
  }[] = [
    {
      key: 'roadsKm',
      label: 'All-Weather Paved Roads',
      unit: 'km',
      unitCost: '₹18L / km',
      min: 0,
      max: 12,
      step: 1,
      icon: Route,
      detail: 'Connects outer farm wards & reduces post-harvest transit losses',
    },
    {
      key: 'waterTanks',
      label: 'Overhead Water Tanks (1.5L)',
      unit: 'tanks',
      unitCost: '₹42L / tank',
      min: 0,
      max: 6,
      step: 1,
      icon: Droplets,
      detail: 'Balances ward pressure & lowers summer water shortage risk',
    },
    {
      key: 'solarPlants',
      label: 'Community Solar Plants (100 kW)',
      unit: 'plants',
      unitCost: '₹55L / plant',
      min: 0,
      max: 5,
      step: 1,
      icon: Sun,
      detail: 'Shaves evening feeder peaks & cuts village CO2 emissions',
    },
    {
      key: 'hospitals',
      label: 'Primary Health Center / Clinics',
      unit: 'facilities',
      unitCost: '₹68L / unit',
      min: 0,
      max: 3,
      step: 1,
      icon: HeartPulse,
      detail: 'Adds 24/7 emergency stabilization, diagnostics & telemedicine',
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="What-If Infrastructure Simulation Lab"
        subtitle="Model capital investments in roads, overhead water tanks, solar microgrids, and healthcare facilities to forecast multi-sector impact."
        meta={[
          village.name,
          `Annual Capex Envelope: ₹${village.annualBudgetLakhs} Lakhs`,
          `Baseline Score: ${village.overallHealthScore}/100`,
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() =>
                onChangeParams({
                  roadsKm: 0,
                  waterTanks: 0,
                  solarPlants: 0,
                  hospitals: 0,
                })
              }
              className="px-3.5 py-2 text-xs font-medium text-[#C5D4E8] bg-[#0C172B] hover:bg-[#132442] border border-[#1E3354] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="px-3.5 py-2 text-xs font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <Box className="w-3.5 h-3.5" />
              <span>Preview in 3D Twin</span>
            </button>
          </div>
        }
      />

      {/* Preset Scenario Bar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs text-[#7E96B8] mr-1">Scenario Presets:</span>
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            onClick={() => onChangeParams(preset.values)}
            className="px-3.5 py-2 text-xs font-medium text-[#D6E2F3] bg-[#0C172B] hover:bg-[#122442] border border-[#1E3354] hover:border-cyan-500/40 rounded-lg transition-colors whitespace-nowrap"
            title={preset.desc}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Main Two-Column Simulation Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Interactive Infrastructure Sliders */}
        <div className="lg:col-span-5 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 space-y-6">
          <div>
            <h2 className="font-display text-base font-semibold text-[#F4F8FF]">
              Infrastructure Parameters
            </h2>
            <p className="text-xs text-[#8BA3C7] mt-0.5">
              Adjust proposed units to recalculate village health & economic ROI in real time
            </p>
          </div>

          <div className="space-y-6">
            {controls.map((ctrl) => {
              const Icon = ctrl.icon;
              const currentVal = params[ctrl.key];
              return (
                <div key={ctrl.key} className="pb-5 border-b border-[#162742] last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-cyan-400 shrink-0" />
                      <div>
                        <label
                          htmlFor={`sim-${ctrl.key}`}
                          className="text-sm font-medium text-[#F1F5FB] block"
                        >
                          {ctrl.label}
                        </label>
                        <span className="text-[11px] text-[#7E96B8]">
                          {ctrl.unitCost}
                        </span>
                      </div>
                    </div>
                    <div className="font-mono text-base font-semibold text-cyan-400 tabular-nums shrink-0">
                      {currentVal}{' '}
                      <span className="text-xs font-normal text-[#8BA3C7]">
                        {ctrl.unit}
                      </span>
                    </div>
                  </div>

                  <input
                    id={`sim-${ctrl.key}`}
                    type="range"
                    min={ctrl.min}
                    max={ctrl.max}
                    step={ctrl.step}
                    value={currentVal}
                    onChange={(e) =>
                      onChangeParams({
                        ...params,
                        [ctrl.key]: Number(e.target.value),
                      })
                    }
                    className="mt-3 w-full accent-cyan-400 cursor-pointer"
                  />

                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#7890B2]">
                    <span>{ctrl.detail}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Budget Utilization & Push to Planner */}
          <div className="pt-4 border-t border-[#172844] space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#9BB0CE]">Estimated Capital Budget</span>
                <span
                  className={`font-mono font-semibold tabular-nums ${
                    budgetRatio > 100 ? 'text-amber-400' : 'text-[#F4F8FF]'
                  }`}
                >
                  ₹{result.totalCostLakhs}L / ₹{village.annualBudgetLakhs}L ({budgetRatio}%)
                </span>
              </div>
              <div className="mt-2 h-2 rounded-full bg-[#152540] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    budgetRatio > 100 ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}
                  style={{ width: `${Math.min(100, budgetRatio)}%` }}
                />
              </div>
            </div>

            <button
              onClick={handleApply}
              disabled={result.totalCostLakhs === 0}
              className="w-full py-2.5 px-4 rounded-lg text-xs font-semibold transition-colors inline-flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed bg-emerald-500 hover:bg-emerald-400 text-[#041410]"
            >
              {appliedFeedback ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Scenario Added to Development Planner</span>
                </>
              ) : (
                <span>Add Simulated Package to Development Planner</span>
              )}
            </button>
          </div>
        </div>

        {/* Right: Projected Outcomes + Visual Charts */}
        <div className="lg:col-span-7 space-y-6">
          {/* Top Outcome Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-4">
              <div className="text-xs text-[#8BA3C7]">Projected Health</div>
              <div className="mt-1.5 font-mono text-2xl font-semibold text-cyan-400 tabular-nums">
                {result.projectedHealthScore}
                <span className="text-xs text-[#6E86AA]">/100</span>
              </div>
              <div className="mt-1 font-mono text-xs text-emerald-400 tabular-nums">
                +{result.scoreGain} pts gain
              </div>
            </div>

            <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-4">
              <div className="text-xs text-[#8BA3C7]">Residents Impacted</div>
              <div className="mt-1.5 font-mono text-2xl font-semibold text-[#F4F8FF] tabular-nums">
                {result.beneficiaries.toLocaleString()}
              </div>
              <div className="mt-1 text-xs text-[#7E96B8] font-mono tabular-nums">
                {Math.round((result.beneficiaries / village.population) * 100)}% of village
              </div>
            </div>

            <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-4">
              <div className="text-xs text-[#8BA3C7]">Annual CO2 Offset</div>
              <div className="mt-1.5 font-mono text-2xl font-semibold text-emerald-400 tabular-nums">
                {result.annualCo2SavedTons}t
              </div>
              <div className="mt-1 text-xs text-[#7E96B8]">tCO2e / year</div>
            </div>

            <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-4">
              <div className="text-xs text-[#8BA3C7]">Economic Payback</div>
              <div className="mt-1.5 font-mono text-2xl font-semibold text-[#F4F8FF] tabular-nums">
                {result.roiYears > 0 ? `${result.roiYears} yrs` : '—'}
              </div>
              <div className="mt-1 text-xs text-[#7E96B8]">
                Est. socioeconomic ROI
              </div>
            </div>
          </div>

          {/* Sector Comparison Radar + Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
              <h3 className="font-display text-sm font-semibold text-[#F4F8FF]">
                Sector Health Footprint (Current vs. Simulated)
              </h3>
              <div className="mt-2 h-[240px] w-full">
                <ResponsiveContainer width="100%" height={240}>
                  <RadarChart data={result.sectorImpacts}>
                    <PolarGrid stroke="#1B2E4B" />
                    <PolarAngleAxis
                      dataKey="sector"
                      tick={{ fill: '#9BB0CE', fontSize: 11 }}
                    />
                    <Radar
                      name="Current"
                      dataKey="current"
                      stroke="#64748B"
                      fill="#64748B"
                      fillOpacity={0.22}
                    />
                    <Radar
                      name="Simulated"
                      dataKey="projected"
                      stroke="#22D3EE"
                      fill="#06B6D4"
                      fillOpacity={0.32}
                    />
                    <Tooltip content={<ChartTooltip unitSuffix=" / 100" />} />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', color: '#9BB0CE' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
              <h3 className="font-display text-sm font-semibold text-[#F4F8FF]">
                5-Year Health Index Trajectory
              </h3>
              <div className="mt-2 h-[240px] w-full">
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart
                    data={result.fiveYearTrajectory}
                    margin={{ top: 12, right: 12, left: -18, bottom: 0 }}
                  >
                    <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="year"
                      tick={{ fill: '#8BA3C7', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      domain={[65, 100]}
                      tick={{ fill: '#8BA3C7', fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip content={<ChartTooltip unitSuffix=" / 100" />} />
                    <Line
                      type="monotone"
                      dataKey="baseline"
                      name="Status Quo"
                      stroke="#6E86AA"
                      strokeWidth={2}
                      strokeDasharray="4 4"
                      dot={false}
                    />
                    <Line
                      type="monotone"
                      dataKey="simulated"
                      name="With Investments"
                      stroke="#10B981"
                      strokeWidth={2.5}
                      dot={{ r: 3, fill: '#10B981' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sector-by-Sector Score Delta Bars */}
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
            <h3 className="font-display text-sm font-semibold text-[#F4F8FF] mb-3">
              Before vs. After Sector Score Breakdown
            </h3>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart
                  data={result.sectorImpacts}
                  margin={{ top: 4, right: 10, left: -18, bottom: 0 }}
                >
                  <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="sector"
                    tick={{ fill: '#8BA3C7', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    domain={[0, 100]}
                    tick={{ fill: '#8BA3C7', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip unitSuffix=" / 100" />} />
                  <Bar
                    dataKey="current"
                    name="Current Score"
                    fill="#334E75"
                    radius={[3, 3, 0, 0]}
                    barSize={18}
                  />
                  <Bar
                    dataKey="projected"
                    name="Projected Score"
                    fill="#06B6D4"
                    radius={[3, 3, 0, 0]}
                    barSize={18}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
