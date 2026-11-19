import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  AlertTriangle,
  BellRing,
  Check,
  CheckSquare,
  Square,
} from 'lucide-react';
import {
  PageId,
  ResponseProtocol,
  VillageProfile,
} from '../types/village';
import { PageHeader } from '../components/PageHeader';
import { ChartTooltip } from '../components/ChartTooltip';

interface DisasterPageProps {
  village: VillageProfile;
  onNavigate: (page: PageId) => void;
}

const SEVERITY_TEXT: Record<string, string> = {
  High: 'text-rose-400 font-semibold',
  Elevated: 'text-amber-400 font-semibold',
  Moderate: 'text-cyan-400 font-medium',
  Low: 'text-emerald-400',
};

export const DisasterPage: React.FC<DisasterPageProps> = ({
  village,
  onNavigate,
}) => {
  const [protocols, setProtocols] = useState<ResponseProtocol[]>(
    village.protocols
  );
  const [alertBroadcasted, setAlertBroadcasted] = useState<string | null>(null);

  const toggleProtocol = (id: string) => {
    setProtocols((prev) =>
      prev.map((p) => (p.id === id ? { ...p, completed: !p.completed } : p))
    );
  };

  const completedCount = protocols.filter((p) => p.completed).length;
  const readinessPct = Math.round((completedCount / Math.max(1, protocols.length)) * 100);

  const wardEvacData = village.wards.map((w, idx) => ({
    ward: `Ward ${idx + 1}`,
    readiness: Math.min(98, w.healthScore + (idx === 4 ? -6 : 8)),
    shelterCap: Math.round(w.population * 0.65),
  }));

  const handleBroadcast = () => {
    setAlertBroadcasted(
      `Bilingual SMS & Panchayat siren advisory queued for Ward 5 (Riverbend) and Ward 2 (East Canal) — 110 households.`
    );
    window.setTimeout(() => setAlertBroadcasted(null), 5000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Disaster Management & Emergency Readiness"
        subtitle="Early-warning hazard surveillance, emergency resource staging, ward shelter capacity, and response checklists."
        meta={[
          village.name,
          `${village.hazards.length} Monitored Hazards`,
          `Protocol Readiness: ${readinessPct}%`,
        ]}
        actions={
          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onNavigate('map')}
              className="px-3.5 py-2 text-xs font-medium text-[#E6EEF8] bg-[#0C172B] hover:bg-[#132442] border border-[#1E3354] rounded-lg transition-colors whitespace-nowrap"
            >
              View Flood Zones
            </button>
            <button
              onClick={handleBroadcast}
              className="px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
            >
              <BellRing className="w-3.5 h-3.5" />
              <span>Dispatch Early Warning</span>
            </button>
          </div>
        }
      />

      {alertBroadcasted && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/40 px-5 py-3.5 flex items-center gap-3 text-sm text-emerald-200">
          <Check className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{alertBroadcasted}</span>
        </div>
      )}

      {/* Active Hazard Watch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {village.hazards.map((h) => (
          <div
            key={h.id}
            className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5 flex flex-col justify-between gap-4"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#8BA3C7]">
                    <AlertTriangle
                      className={`w-3.5 h-3.5 ${
                        h.severity === 'High'
                          ? 'text-rose-400'
                          : h.severity === 'Elevated'
                          ? 'text-amber-400'
                          : 'text-cyan-400'
                      }`}
                    />
                    <span className={SEVERITY_TEXT[h.severity]}>
                      {h.severity} Severity
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>Lead Time: {h.leadTime}</span>
                  </div>
                  <h2 className="mt-1.5 font-display text-lg font-semibold text-[#F4F8FF]">
                    {h.type}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-mono text-2xl font-semibold text-[#F6F9FF] tabular-nums">
                    {h.probability}%
                  </div>
                  <div className="text-[11px] text-[#7890B2]">Probability</div>
                </div>
              </div>

              <p className="mt-3 text-sm text-[#A5B8D4] leading-relaxed">
                {h.guidance}
              </p>
            </div>

            <div className="pt-3.5 border-t border-[#162742] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8BA3C7]">
              <span>Affected: {h.affectedWards.join(', ')}</span>
              <span className="font-mono text-[#C5D4E8]">{h.estimatedExposure}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Ward Readiness Chart & Response Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6">
          <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
            Ward Evacuation & Shelter Readiness Index
          </h3>
          <p className="text-xs text-[#8BA3C7] mt-0.5 mb-5">
            Composite score of alert reach, paved exit access, and shelter distance
          </p>
          <div className="h-[245px] w-full">
            <ResponsiveContainer width="100%" height={245}>
              <BarChart
                data={wardEvacData}
                margin={{ top: 6, right: 10, left: -18, bottom: 0 }}
              >
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="ward"
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
                <Tooltip content={<ChartTooltip unitSuffix="%" />} />
                <Bar
                  dataKey="readiness"
                  name="Readiness Score"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={26}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Interactive Response Protocol Checklist */}
        <div className="lg:col-span-6 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-6 flex flex-col">
          <div className="flex items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
                Standard Operating Protocols
              </h3>
              <p className="text-xs text-[#8BA3C7] mt-0.5">
                Click any checklist task to update live Panchayat readiness
              </p>
            </div>
            <span className="font-mono text-sm font-semibold text-cyan-400 tabular-nums">
              {completedCount}/{protocols.length} Done
            </span>
          </div>

          <div className="space-y-2.5 flex-1">
            {protocols.map((p) => (
              <button
                key={p.id}
                onClick={() => toggleProtocol(p.id)}
                className="w-full text-left p-3 rounded-lg bg-[#091324] hover:bg-[#101F38] border border-[#162742] transition-colors flex items-start gap-3"
              >
                {p.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-4 h-4 text-[#6D85AA] shrink-0 mt-0.5" />
                )}
                <div className="min-w-0">
                  <div
                    className={`text-sm ${
                      p.completed
                        ? 'text-[#7E96B8] line-through'
                        : 'text-[#E6EEF8] font-medium'
                    }`}
                  >
                    {p.task}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px] text-[#7890B2]">
                    <span>{p.phase}</span>
                    <span aria-hidden="true">·</span>
                    <span>Owner: {p.owner}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Emergency Resource Inventory */}
      <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden">
        <div className="px-6 py-4 border-b border-[#172844]">
          <h3 className="font-display text-base font-semibold text-[#F4F8FF]">
            Emergency Asset & Resource Inventory
          </h3>
          <p className="text-xs text-[#8BA3C7]">
            Verified village shelters, medical ambulances, water tankers, and solar backup generators
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#172844] text-[11px] font-medium text-[#7C93B6]">
                <th className="py-3 px-6">Asset</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Staging Location</th>
                <th className="py-3 px-4 text-right">Available</th>
                <th className="py-3 px-6 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#14243D] text-sm">
              {village.emergencyAssets.map((asset) => (
                <tr key={asset.id} className="hover:bg-[#101F38] transition-colors">
                  <td className="py-3.5 px-6 font-medium text-[#E6EEF8]">
                    {asset.name}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#9BB0CE]">
                    {asset.category}
                  </td>
                  <td className="py-3.5 px-4 text-xs text-[#9BB0CE]">
                    {asset.location}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono text-xs text-[#F4F8FF] tabular-nums">
                    {asset.available} / {asset.total}
                  </td>
                  <td className="py-3.5 px-6 text-right text-xs font-medium">
                    <span
                      className={
                        asset.readiness === 'Ready'
                          ? 'text-emerald-400'
                          : asset.readiness === 'Deployed'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }
                    >
                      {asset.readiness}
                    </span>
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
