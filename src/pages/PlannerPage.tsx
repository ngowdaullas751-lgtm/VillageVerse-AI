import React, { useMemo, useState } from 'react';
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import {
  DevelopmentProject,
  SectorKey,
  VillageProfile,
} from '../types/village';
import { PageHeader } from '../components/PageHeader';
import { ChartTooltip } from '../components/ChartTooltip';

interface PlannerPageProps {
  village: VillageProfile;
  projects: DevelopmentProject[];
  onToggleApprove: (projectId: string) => void;
}

const SECTOR_OPTIONS: { value: 'all' | SectorKey; label: string }[] = [
  { value: 'all', label: 'All Sectors' },
  { value: 'water', label: 'Water' },
  { value: 'roads', label: 'Roads' },
  { value: 'healthcare', label: 'Healthcare' },
  { value: 'electricity', label: 'Electricity' },
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'education', label: 'Education' },
];

const STATUS_STYLE: Record<DevelopmentProject['status'], string> = {
  Recommended: 'text-cyan-400',
  Approved: 'text-emerald-400',
  'In Progress': 'text-sky-400',
  'Under Review': 'text-amber-400',
};

export const PlannerPage: React.FC<PlannerPageProps> = ({
  village,
  projects,
  onToggleApprove,
}) => {
  const [sectorFilter, setSectorFilter] = useState<'all' | SectorKey>('all');
  const [maxBudgetLakhs, setMaxBudgetLakhs] = useState<number>(120);
  const [expandedId, setExpandedId] = useState<string | null>(
    projects[0]?.id ?? null
  );

  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => (sectorFilter === 'all' ? true : p.sector === sectorFilter))
      .filter((p) => p.estimatedCostLakhs <= maxBudgetLakhs)
      .sort((a, b) => b.aiPriorityScore - a.aiPriorityScore);
  }, [projects, sectorFilter, maxBudgetLakhs]);

  const approvedProjects = projects.filter(
    (p) => p.status === 'Approved' || p.status === 'In Progress'
  );
  const committedBudget = approvedProjects.reduce(
    (sum, p) => sum + p.estimatedCostLakhs,
    0
  );
  const projectedGain = approvedProjects.reduce(
    (sum, p) => sum + p.impactScoreDelta,
    0
  );

  const chartData = filteredProjects.slice(0, 7).map((p) => ({
    name: p.title.split(' ').slice(0, 3).join(' '),
    cost: p.estimatedCostLakhs,
    priority: p.aiPriorityScore,
  }));

  return (
    <div className="space-y-8">
      <PageHeader
        title="AI Village Development Planner"
        subtitle="Algorithmically ranked capital projects balancing beneficiary reach, urgency, cost efficiency, and composite health score uplift."
        meta={[
          village.name,
          `${projects.length} Ranked Projects`,
          `Committed ₹${committedBudget}L / ₹${village.annualBudgetLakhs}L`,
        ]}
      />

      {/* Portfolio KPI Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
          <div className="text-xs text-[#8BA3C7]">Approved / Active Projects</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-[#F6F9FF] tabular-nums">
            {approvedProjects.length}{' '}
            <span className="text-sm text-[#7890B2]">/ {projects.length}</span>
          </div>
          <div className="mt-1 text-xs text-emerald-400">
            Active FY capital queue
          </div>
        </div>

        <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
          <div className="text-xs text-[#8BA3C7]">Committed Capital</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-cyan-400 tabular-nums">
            ₹{committedBudget}L
          </div>
          <div className="mt-1 text-xs text-[#7E96B8] font-mono tabular-nums">
            {Math.round((committedBudget / village.annualBudgetLakhs) * 100)}% of
            annual budget
          </div>
        </div>

        <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
          <div className="text-xs text-[#8BA3C7]">Projected Health Uplift</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-emerald-400 tabular-nums">
            +{projectedGain.toFixed(1)} pts
          </div>
          <div className="mt-1 text-xs text-[#7E96B8]">
            Upon approved portfolio completion
          </div>
        </div>

        <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
          <div className="text-xs text-[#8BA3C7]">Top-Ranked Initiative</div>
          <div className="mt-1.5 font-mono text-2xl font-semibold text-[#F6F9FF] tabular-nums">
            {projects[0]?.aiPriorityScore ?? 95}
            <span className="text-xs text-[#7890B2]"> / 100</span>
          </div>
          <div className="mt-1 text-xs text-[#9BB0CE] truncate">
            {projects[0]?.title}
          </div>
        </div>
      </div>

      {/* Filters & Cost vs Priority Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5 flex flex-col justify-between gap-5">
          <div>
            <h2 className="font-display text-sm font-semibold text-[#F4F8FF]">
              Filter Capital Queue
            </h2>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SECTOR_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSectorFilter(opt.value)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    sectorFilter === opt.value
                      ? 'bg-cyan-400 text-[#04101E] font-semibold'
                      : 'bg-[#11203A] text-[#9BB0CE] hover:text-white'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#172844]">
            <div className="flex items-center justify-between text-xs mb-2">
              <label htmlFor="budget-cap" className="text-[#9BB0CE]">
                Max Single-Project Cost
              </label>
              <span className="font-mono font-semibold text-cyan-400 tabular-nums">
                ₹{maxBudgetLakhs} Lakhs
              </span>
            </div>
            <input
              id="budget-cap"
              type="range"
              min={20}
              max={150}
              step={5}
              value={maxBudgetLakhs}
              onChange={(e) => setMaxBudgetLakhs(Number(e.target.value))}
              className="w-full accent-cyan-400 cursor-pointer"
            />
            <div className="mt-1.5 flex justify-between text-[11px] text-[#738BB0] font-mono">
              <span>₹20L</span>
              <span>₹150L</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-[#F4F8FF]">
                AI Priority Index vs. Estimated Cost (₹ Lakhs)
              </h2>
              <p className="text-xs text-[#8BA3C7]">
                Compare project capital requirement against algorithmic urgency score
              </p>
            </div>
          </div>
          <div className="h-[220px] w-full">
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart
                data={chartData}
                margin={{ top: 8, right: 12, left: -14, bottom: 0 }}
              >
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="left"
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  domain={[60, 100]}
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  yAxisId="left"
                  dataKey="cost"
                  name="Est. Cost (₹L)"
                  fill="#1E3A63"
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="priority"
                  name="AI Priority Score"
                  stroke="#22D3EE"
                  strokeWidth={2.5}
                  dot={{ r: 3.5, fill: '#22D3EE' }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Ranked Project Ledger */}
      <div className="space-y-3">
        {filteredProjects.length === 0 ? (
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-10 text-center">
            <p className="text-sm text-[#9BB0CE]">
              No projects match the current sector and budget ceiling.
            </p>
            <button
              onClick={() => {
                setSectorFilter('all');
                setMaxBudgetLakhs(150);
              }}
              className="mt-3 px-4 py-2 text-xs font-medium text-[#04101E] bg-cyan-400 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredProjects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            const isApproved =
              project.status === 'Approved' || project.status === 'In Progress';

            return (
              <div
                key={project.id}
                className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden"
              >
                <div className="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 min-w-0">
                    <div className="font-mono text-lg font-semibold text-cyan-400 tabular-nums shrink-0 w-7">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
                        {project.title}
                      </h3>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-[#8BA3C7]">
                        <span className="capitalize">{project.sector}</span>
                        <span aria-hidden="true">·</span>
                        <span>{project.ward}</span>
                        <span aria-hidden="true">·</span>
                        <span className={STATUS_STYLE[project.status]}>
                          {project.status}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="font-mono tabular-nums">
                          {project.timelineMonths} mo timeline
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-5 lg:gap-6 shrink-0">
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] text-[#7890B2]">AI Priority</div>
                      <div className="font-mono text-base font-semibold text-[#F4F8FF] tabular-nums">
                        {project.aiPriorityScore}/100
                      </div>
                    </div>
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] text-[#7890B2]">Budget</div>
                      <div className="font-mono text-base font-semibold text-[#E6EEF8] tabular-nums">
                        ₹{project.estimatedCostLakhs}L
                      </div>
                    </div>
                    <div className="text-left lg:text-right">
                      <div className="text-[11px] text-[#7890B2]">Health Uplift</div>
                      <div className="font-mono text-base font-semibold text-emerald-400 tabular-nums">
                        +{project.impactScoreDelta}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleApprove(project.id)}
                        className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap ${
                          isApproved
                            ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/25'
                            : 'bg-cyan-400 hover:bg-cyan-300 text-[#04101E] font-semibold'
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3.5 h-3.5" />}
                        <span>{isApproved ? 'Approved' : 'Approve Plan'}</span>
                      </button>
                      <button
                        onClick={() =>
                          setExpandedId(isExpanded ? null : project.id)
                        }
                        className="p-2 text-[#8BA3C7] hover:text-white rounded-lg bg-[#101F38] border border-[#1E3354]"
                        aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-5 pb-5 pt-4 border-t border-[#162742] bg-[#091324] grid grid-cols-1 lg:grid-cols-12 gap-6">
                    <div className="lg:col-span-7">
                      <div className="text-xs font-medium text-[#7C93B6]">
                        AI Justification & Impact Summary
                      </div>
                      <p className="mt-1.5 text-sm text-[#C5D4E8] leading-relaxed">
                        {project.rationale}
                      </p>
                      <div className="mt-3 text-xs text-[#8BA3C7] font-mono tabular-nums">
                        Direct Beneficiaries: {project.beneficiaries.toLocaleString()} citizens
                      </div>
                    </div>
                    <div className="lg:col-span-5">
                      <div className="text-xs font-medium text-[#7C93B6] mb-2">
                        Execution Milestones
                      </div>
                      <ol className="space-y-1.5 text-xs text-[#C5D4E8]">
                        {project.milestones.map((m, idx) => (
                          <li key={m} className="flex items-start gap-2">
                            <span className="font-mono text-cyan-400 tabular-nums">
                              {idx + 1}.
                            </span>
                            <span>{m}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
