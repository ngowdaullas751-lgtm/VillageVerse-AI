import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  SlidersHorizontal,
  ListOrdered,
  ClipboardList,
  ShieldAlert,
  Leaf,
  Map as MapIcon,
  Box,
  MessageSquare,
  Menu,
  X,
  ArrowLeft,
  ChevronDown,
  Building2,
} from 'lucide-react';
import { PageId, VillageProfile } from '../types/village';

interface NavGroup {
  heading: string;
  items: {
    id: PageId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    heading: 'Intelligence',
    items: [
      { id: 'dashboard', label: 'Village Dashboard', icon: LayoutDashboard },
      { id: 'predictions', label: 'AI Predictions', icon: TrendingUp },
      { id: 'simulation', label: 'What-If Simulator', icon: SlidersHorizontal },
      { id: 'planner', label: 'Development Planner', icon: ListOrdered },
    ],
  },
  {
    heading: 'Spatial Twin',
    items: [
      { id: 'map', label: 'Interactive GIS Map', icon: MapIcon },
      { id: 'digital-twin', label: '3D Digital Twin', icon: Box },
    ],
  },
  {
    heading: 'Operations',
    items: [
      { id: 'complaints', label: 'Complaints', icon: ClipboardList },
      { id: 'disasters', label: 'Disaster Readiness', icon: ShieldAlert },
      { id: 'sustainability', label: 'Sustainability', icon: Leaf },
      { id: 'assistant', label: 'AI Village Assistant', icon: MessageSquare },
    ],
  },
];

const PAGE_LABELS: Record<PageId, string> = {
  landing: 'Overview',
  dashboard: 'Village Dashboard',
  predictions: 'AI Predictions',
  simulation: 'What-If Simulator',
  planner: 'AI Development Planner',
  complaints: 'Complaint Management',
  disasters: 'Disaster Management',
  sustainability: 'Sustainability Dashboard',
  map: 'Interactive GIS Map',
  'digital-twin': '3D Village Digital Twin',
  assistant: 'AI Village Assistant',
};

interface LayoutProps {
  activePage: PageId;
  onNavigate: (page: PageId) => void;
  villages: VillageProfile[];
  activeVillage: VillageProfile;
  onSelectVillage: (id: string) => void;
  openComplaintsCount: number;
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({
  activePage,
  onNavigate,
  villages,
  activeVillage,
  onSelectVillage,
  openComplaintsCount,
  children,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelectNav = (page: PageId) => {
    onNavigate(page);
    setMobileOpen(false);
  };

  const isFullBleedPage = activePage === 'digital-twin' || activePage === 'map';

  const SidebarContent = (
    <div className="flex flex-col h-full bg-[#091222] border-r border-[#172844]">
      {/* Brand mark */}
      <div className="flex items-center justify-between h-16 px-5 border-b border-[#172844] shrink-0">
        <button
          onClick={() => handleSelectNav('landing')}
          className="flex items-center gap-2.5 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-md"
        >
          <span className="w-7 h-7 rounded-md bg-gradient-to-br from-cyan-500 to-emerald-500 flex items-center justify-center text-[#04101E] font-display font-bold text-sm shrink-0">
            V
          </span>
          <span className="font-display font-bold text-[15px] tracking-tight text-[#F1F5FB] group-hover:text-cyan-300 transition-colors whitespace-nowrap">
            VillageVerse AI
          </span>
        </button>
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 text-[#8BA3C7] hover:text-white rounded-md"
          aria-label="Close navigation"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Active Village Selector */}
      <div className="px-4 py-4 border-b border-[#172844]">
        <label
          htmlFor="village-select"
          className="block text-[11px] font-medium text-[#7C93B6] mb-1.5"
        >
          Active Village Twin
        </label>
        <div className="relative">
          <Building2 className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            id="village-select"
            value={activeVillage.id}
            onChange={(e) => onSelectVillage(e.target.value)}
            className="w-full appearance-none bg-[#0F1D35] border border-[#203659] rounded-lg pl-9 pr-8 py-2 text-xs font-medium text-[#E6EEF8] focus:outline-none focus:border-cyan-400 transition-colors cursor-pointer"
          >
            {villages.map((v) => (
              <option key={v.id} value={v.id} className="bg-[#0C172B]">
                {v.name}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-[#7C93B6] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
        <div className="mt-2 flex items-center justify-between text-[11px] text-[#7C93B6] font-mono tabular-nums">
          <span>{activeVillage.district}</span>
          <span>Pop. {activeVillage.population.toLocaleString()}</span>
        </div>
      </div>

      {/* Navigation Groups */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6" aria-label="Main navigation">
        {NAV_GROUPS.map((group) => (
          <div key={group.heading}>
            <div className="px-2.5 mb-2 text-[11px] font-medium text-[#6B82A6]">
              {group.heading}
            </div>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = activePage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectNav(item.id)}
                    className={`w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-[#122645] text-[#F4F8FF] border border-cyan-500/35'
                        : 'text-[#9BB0CE] hover:text-[#F1F5FB] hover:bg-[#0F1D35] border border-transparent'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          isActive ? 'text-cyan-400' : 'text-[#6D85AA]'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.id === 'complaints' && openComplaintsCount > 0 && (
                      <span className="font-mono text-[11px] text-amber-400 tabular-nums">
                        {openComplaintsCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom return to Landing link */}
      <div className="p-3 border-t border-[#172844] shrink-0">
        <button
          onClick={() => handleSelectNav('landing')}
          className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-[#8BA3C7] hover:text-[#F1F5FB] hover:bg-[#0F1D35] rounded-lg transition-colors whitespace-nowrap"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview Page</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#060D1A] text-[#E6EEF8] flex">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden lg:block w-[260px] shrink-0 fixed inset-y-0 left-0 z-30">
        {SidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative w-[270px] max-w-[85vw] h-full z-10">
            {SidebarContent}
          </aside>
        </div>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-[260px]">
        {/* Top Workspace Bar */}
        <header className="sticky top-0 z-20 h-16 bg-[#060D1A]/95 border-b border-[#172844] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 -ml-1 text-[#9BB0CE] hover:text-white rounded-lg hover:bg-[#0F1D35]"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 text-sm min-w-0 truncate">
              <span className="text-[#7890B2] hidden sm:inline truncate">
                {activeVillage.name}
              </span>
              <span className="text-[#3C557A] hidden sm:inline">/</span>
              <span className="font-medium text-[#F1F5FB] truncate">
                {PAGE_LABELS[activePage]}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {activePage !== 'digital-twin' ? (
              <button
                onClick={() => onNavigate('digital-twin')}
                className="px-3.5 py-2 text-xs font-medium text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <Box className="w-3.5 h-3.5" />
                <span>Open 3D Twin</span>
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-3.5 py-2 text-xs font-medium text-[#E6EEF8] bg-[#12233E] hover:bg-[#1A3155] border border-[#243E66] rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-cyan-400" />
                <span>Health Dashboard</span>
              </button>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main
          className={
            isFullBleedPage
              ? 'flex-1 flex flex-col min-h-[calc(100vh-4rem)]'
              : 'flex-1 px-4 sm:px-6 lg:px-8 py-6 lg:py-8 max-w-[1440px] w-full mx-auto'
          }
        >
          {children}
        </main>
      </div>
    </div>
  );
};
