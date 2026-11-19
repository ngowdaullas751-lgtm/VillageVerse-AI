import React, { useMemo, useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Plus, Search, X } from 'lucide-react';
import {
  ComplaintCategory,
  ComplaintStatus,
  PriorityLevel,
  VillageComplaint,
  VillageProfile,
} from '../types/village';
import { PageHeader } from '../components/PageHeader';
import { ChartTooltip } from '../components/ChartTooltip';

interface ComplaintsPageProps {
  village: VillageProfile;
  complaints: VillageComplaint[];
  onUpdateStatus: (id: string, status: ComplaintStatus) => void;
  onAddComplaint: (
    payload: Omit<
      VillageComplaint,
      'id' | 'reportedAt' | 'status' | 'slaRemainingHours' | 'lat' | 'lng'
    >
  ) => void;
}

const CATEGORIES: ('All' | ComplaintCategory)[] = [
  'All',
  'Water Leakage',
  'Garbage',
  'Broken Roads',
  'Street Lights',
];

const STATUS_OPTIONS: ('All' | ComplaintStatus)[] = [
  'All',
  'Open',
  'In Progress',
  'Resolved',
];

const PRIORITY_TEXT: Record<PriorityLevel, string> = {
  Critical: 'text-rose-400 font-semibold',
  High: 'text-amber-400 font-medium',
  Medium: 'text-cyan-400',
  Low: 'text-[#8BA3C7]',
};

const STATUS_TEXT: Record<ComplaintStatus, string> = {
  Open: 'text-amber-400',
  'In Progress': 'text-cyan-400',
  Resolved: 'text-emerald-400',
};

export const ComplaintsPage: React.FC<ComplaintsPageProps> = ({
  village,
  complaints,
  onUpdateStatus,
  onAddComplaint,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<'All' | ComplaintCategory>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | ComplaintStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Modal Form state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('Water Leakage');
  const [ward, setWard] = useState(village.wards[0]?.name ?? 'Ward 1');
  const [location, setLocation] = useState('');
  const [reportedBy, setReportedBy] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [description, setDescription] = useState('');

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;
      if (statusFilter !== 'All' && c.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.ward.toLowerCase().includes(q) ||
          c.location.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [complaints, categoryFilter, statusFilter, searchQuery]);

  const counts = {
    open: complaints.filter((c) => c.status === 'Open').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  const categoryChartData = (
    ['Water Leakage', 'Garbage', 'Broken Roads', 'Street Lights'] as ComplaintCategory[]
  ).map((cat) => ({
    category: cat,
    active: complaints.filter((c) => c.category === cat && c.status !== 'Resolved').length,
    resolved: complaints.filter((c) => c.category === cat && c.status === 'Resolved').length,
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim()) return;
    const teamMap: Record<ComplaintCategory, string> = {
      'Water Leakage': 'Jal Jeevan Rapid Crew A',
      Garbage: 'Swachh Gram Sanitation Van',
      'Broken Roads': 'Rural Works Division',
      'Street Lights': 'Panchayat Electrical Unit',
    };
    onAddComplaint({
      title: title.trim(),
      category,
      ward,
      location: location.trim(),
      reportedBy: reportedBy.trim() || 'Citizen Portal',
      priority,
      assignedTeam: teamMap[category],
      description:
        description.trim() || 'Citizen report logged through VillageVerse Portal.',
    });
    setTitle('');
    setLocation('');
    setReportedBy('');
    setDescription('');
    setModalOpen(false);
  };

  const nextStatus = (status: ComplaintStatus): ComplaintStatus => {
    if (status === 'Open') return 'In Progress';
    if (status === 'In Progress') return 'Resolved';
    return 'Open';
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Citizen Complaint & Grievance Management"
        subtitle="Track, triage, and resolve ward reports covering water leakage, garbage collection, broken roads, and street lights."
        meta={[
          village.name,
          `${counts.open + counts.inProgress} Active Tickets`,
          `${counts.resolved} Resolved`,
        ]}
        actions={
          <button
            onClick={() => setModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Log Complaint</span>
          </button>
        }
      />

      {/* Top Metrics & Category Resolution Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
            <div className="text-xs text-[#8BA3C7]">Open Tickets</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-amber-400 tabular-nums">
              {counts.open}
            </div>
            <div className="mt-1 text-xs text-[#7E96B8]">Awaiting dispatch</div>
          </div>
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
            <div className="text-xs text-[#8BA3C7]">Crew Dispatched</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-cyan-400 tabular-nums">
              {counts.inProgress}
            </div>
            <div className="mt-1 text-xs text-[#7E96B8]">Field work active</div>
          </div>
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
            <div className="text-xs text-[#8BA3C7]">Resolved Cases</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-emerald-400 tabular-nums">
              {counts.resolved}
            </div>
            <div className="mt-1 text-xs text-[#7E96B8]">Verified closed</div>
          </div>
          <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
            <div className="text-xs text-[#8BA3C7]">Avg. SLA Compliance</div>
            <div className="mt-2 font-mono text-3xl font-semibold text-[#F6F9FF] tabular-nums">
              91.6%
            </div>
            <div className="mt-1 text-xs text-emerald-400">18.4h median fix</div>
          </div>
        </div>

        <div className="lg:col-span-7 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="font-display text-sm font-semibold text-[#F4F8FF]">
                Complaints by Civic Category
              </h2>
              <p className="text-xs text-[#8BA3C7]">
                Active vs. resolved grievances across core infrastructure categories
              </p>
            </div>
          </div>
          <div className="h-[195px] w-full">
            <ResponsiveContainer width="100%" height={195}>
              <BarChart
                data={categoryChartData}
                margin={{ top: 8, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid stroke="#162742" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="category"
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fill: '#8BA3C7', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Bar
                  dataKey="active"
                  name="Active Issues"
                  fill="#F59E0B"
                  radius={[4, 4, 0, 0]}
                  barSize={22}
                />
                <Bar
                  dataKey="resolved"
                  name="Resolved"
                  fill="#10B981"
                  radius={[4, 4, 0, 0]}
                  barSize={22}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                categoryFilter === cat
                  ? 'bg-cyan-400 text-[#04101E] font-semibold'
                  : 'bg-[#0C172B] border border-[#1B2E4B] text-[#9BB0CE] hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-1 bg-[#0C172B] border border-[#1B2E4B] rounded-lg">
            {STATUS_OPTIONS.map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#172C4E] text-[#F4F8FF]'
                    : 'text-[#8BA3C7] hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-[#7890B2] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ticket, ward..."
              className="bg-[#0C172B] border border-[#1B2E4B] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#E6EEF8] placeholder-[#6E86AA] focus:outline-none focus:border-cyan-400 w-52"
            />
          </div>
        </div>
      </div>

      {/* Complaint Ticket List */}
      <div className="rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-[#9BB0CE]">
              No citizen complaints match the selected filters.
            </p>
            <button
              onClick={() => {
                setCategoryFilter('All');
                setStatusFilter('All');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 text-xs font-medium text-cyan-400 hover:text-cyan-300"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="divide-y divide-[#152540]">
            {filtered.map((item) => (
              <div
                key={item.id}
                className="p-5 hover:bg-[#0F1E37] transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs text-[#7E96B8]">
                    <span className="font-mono text-[#C5D4E8] tabular-nums">
                      {item.id}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.ward}</span>
                    <span aria-hidden="true">·</span>
                    <span className={PRIORITY_TEXT[item.priority]}>
                      {item.priority} Priority
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{item.reportedAt}</span>
                  </div>

                  <h3 className="font-display text-[15px] font-semibold text-[#F4F8FF]">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[#9BB0CE] leading-relaxed max-w-3xl">
                    {item.description}
                  </p>
                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-[#7890B2]">
                    <span>Location: {item.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>Reporter: {item.reportedBy}</span>
                    <span aria-hidden="true">·</span>
                    <span>Assigned: {item.assignedTeam}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="text-left lg:text-right">
                    <div className={`text-xs font-semibold ${STATUS_TEXT[item.status]}`}>
                      {item.status}
                    </div>
                    <div className="font-mono text-[11px] text-[#7E96B8] tabular-nums">
                      {item.status === 'Resolved'
                        ? 'SLA Met'
                        : `${item.slaRemainingHours}h SLA left`}
                    </div>
                  </div>
                  <button
                    onClick={() => onUpdateStatus(item.id, nextStatus(item.status))}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[#122442] hover:bg-[#19325A] border border-[#243F68] text-[#E6EEF8] transition-colors whitespace-nowrap"
                  >
                    {item.status === 'Open'
                      ? 'Dispatch Crew'
                      : item.status === 'In Progress'
                      ? 'Mark Resolved'
                      : 'Reopen'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log New Complaint Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75">
          <div className="w-full max-w-lg rounded-xl bg-[#0C172B] border border-[#22395E] p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-[#172844]">
              <h2 className="font-display text-lg font-semibold text-[#F4F8FF]">
                Log New Citizen Complaint
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 text-[#8BA3C7] hover:text-white rounded-md"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                  Issue Summary *
                </label>
                <input
                  required
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Broken pipeline valve near school lane"
                  className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value as ComplaintCategory)
                    }
                    className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Water Leakage">Water Leakage</option>
                    <option value="Garbage">Garbage</option>
                    <option value="Broken Roads">Broken Roads</option>
                    <option value="Street Lights">Street Lights</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                    Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) =>
                      setPriority(e.target.value as PriorityLevel)
                    }
                    className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                    Ward
                  </label>
                  <select
                    value={ward}
                    onChange={(e) => setWard(e.target.value)}
                    className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                  >
                    {village.wards.map((w) => (
                      <option key={w.id} value={w.name}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                    Specific Landmark *
                  </label>
                  <input
                    required
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g., Near Dairy Collection Center"
                    className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                  Reporter Name
                </label>
                <input
                  type="text"
                  value={reportedBy}
                  onChange={(e) => setReportedBy(e.target.value)}
                  placeholder="Optional citizen or ward officer name"
                  className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[#A5B8D4] mb-1.5">
                  Details
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe severity, impacted households, or safety concern..."
                  className="w-full bg-[#071020] border border-[#1E3354] rounded-lg px-3 py-2 text-sm text-[#F1F5FB] focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-[#9BB0CE] hover:text-white rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors"
                >
                  Submit Complaint
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
