import { useMemo, useState } from 'react';
import {
  ComplaintStatus,
  DevelopmentProject,
  PageId,
  SimulationParams,
  VillageComplaint,
} from './types/village';
import { VILLAGES, computeSimulationResult } from './data/villageData';
import { Layout } from './components/Layout';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { PredictionsPage } from './pages/PredictionsPage';
import { SimulationPage } from './pages/SimulationPage';
import { PlannerPage } from './pages/PlannerPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { DisasterPage } from './pages/DisasterPage';
import { SustainabilityPage } from './pages/SustainabilityPage';
import { MapPage } from './pages/MapPage';
import { DigitalTwinPage } from './pages/DigitalTwinPage';
import { ChatbotPage } from './pages/ChatbotPage';

export default function App() {
  const [activePage, setActivePage] = useState<PageId>('landing');
  const [activeVillageId, setActiveVillageId] = useState<string>(VILLAGES[0].id);

  // Per-village mutable operational state (complaints & projects)
  const [complaintsByVillage, setComplaintsByVillage] = useState<
    Record<string, VillageComplaint[]>
  >(() =>
    Object.fromEntries(VILLAGES.map((v) => [v.id, v.complaints]))
  );

  const [projectsByVillage, setProjectsByVillage] = useState<
    Record<string, DevelopmentProject[]>
  >(() =>
    Object.fromEntries(VILLAGES.map((v) => [v.id, v.projects]))
  );

  const [simParams, setSimParams] = useState<SimulationParams>({
    roadsKm: 4,
    waterTanks: 2,
    solarPlants: 2,
    hospitals: 1,
  });

  const activeVillage = useMemo(
    () => VILLAGES.find((v) => v.id === activeVillageId) ?? VILLAGES[0],
    [activeVillageId]
  );

  const activeComplaints = complaintsByVillage[activeVillage.id] ?? [];
  const activeProjects = projectsByVillage[activeVillage.id] ?? [];

  const openComplaintsCount = useMemo(
    () => activeComplaints.filter((c) => c.status !== 'Resolved').length,
    [activeComplaints]
  );

  const handleNavigate = (page: PageId) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const handleUpdateComplaintStatus = (id: string, status: ComplaintStatus) => {
    setComplaintsByVillage((prev) => ({
      ...prev,
      [activeVillage.id]: (prev[activeVillage.id] ?? []).map((c) =>
        c.id === id
          ? {
              ...c,
              status,
              slaRemainingHours: status === 'Resolved' ? 0 : c.slaRemainingHours || 16,
            }
          : c
      ),
    }));
  };

  const handleAddComplaint = (
    payload: Omit<
      VillageComplaint,
      'id' | 'reportedAt' | 'status' | 'slaRemainingHours' | 'lat' | 'lng'
    >
  ) => {
    const newId = `CMP-${2042 + activeComplaints.length}`;
    // Slight deterministic offset around village center so it appears cleanly on the GIS map
    const offsetLat = ((activeComplaints.length % 5) - 2) * 0.0014;
    const offsetLng = (((activeComplaints.length + 1) % 5) - 2) * 0.0016;

    const newTicket: VillageComplaint = {
      ...payload,
      id: newId,
      reportedAt: 'Just now',
      status: 'Open',
      slaRemainingHours: payload.priority === 'Critical' ? 6 : 24,
      lat: Number((activeVillage.centerLat + offsetLat).toFixed(4)),
      lng: Number((activeVillage.centerLng + offsetLng).toFixed(4)),
    };

    setComplaintsByVillage((prev) => ({
      ...prev,
      [activeVillage.id]: [newTicket, ...(prev[activeVillage.id] ?? [])],
    }));
  };

  const handleToggleProjectApprove = (projectId: string) => {
    setProjectsByVillage((prev) => ({
      ...prev,
      [activeVillage.id]: (prev[activeVillage.id] ?? []).map((p) =>
        p.id === projectId
          ? {
              ...p,
              status:
                p.status === 'Approved' || p.status === 'In Progress'
                  ? 'Recommended'
                  : 'Approved',
            }
          : p
      ),
    }));
  };

  const handleApplySimulationToPlanner = (params: SimulationParams) => {
    const sim = computeSimulationResult(activeVillage, params);
    if (sim.totalCostLakhs <= 0) return;

    const summaryParts: string[] = [];
    if (params.roadsKm > 0) summaryParts.push(`${params.roadsKm}km Roads`);
    if (params.waterTanks > 0) summaryParts.push(`${params.waterTanks} Water Tanks`);
    if (params.solarPlants > 0) summaryParts.push(`${params.solarPlants} Solar Plants`);
    if (params.hospitals > 0) summaryParts.push(`${params.hospitals} Health Center`);

    const customProject: DevelopmentProject = {
      id: `sim-prj-${Date.now()}`,
      rank: 1,
      title: `Simulated Capex Package (${summaryParts.join(', ')})`,
      sector: params.waterTanks >= params.solarPlants ? 'water' : 'electricity',
      ward: 'Multi-Ward Priority',
      aiPriorityScore: Math.min(98, Math.round(82 + sim.scoreGain * 1.4)),
      estimatedCostLakhs: sim.totalCostLakhs,
      beneficiaries: sim.beneficiaries,
      timelineMonths: 9,
      impactScoreDelta: sim.scoreGain,
      status: 'Recommended',
      rationale: `Generated from What-If Simulation Lab: lifts overall health score to ${sim.projectedHealthScore}/100 with ${sim.roiYears}-year socioeconomic payback and ${sim.annualCo2SavedTons} tCO2e annual offset.`,
      milestones: [
        'Detailed DPR & ward site survey',
        'Panchayat Samiti funding approval',
        'Phased multi-sector civil & solar execution',
      ],
    };

    setProjectsByVillage((prev) => ({
      ...prev,
      [activeVillage.id]: [customProject, ...(prev[activeVillage.id] ?? [])],
    }));
  };

  if (activePage === 'landing') {
    return <LandingPage onNavigate={handleNavigate} />;
  }

  return (
    <Layout
      activePage={activePage}
      onNavigate={handleNavigate}
      villages={VILLAGES}
      activeVillage={activeVillage}
      onSelectVillage={setActiveVillageId}
      openComplaintsCount={openComplaintsCount}
    >
      {activePage === 'dashboard' && (
        <DashboardPage
          village={activeVillage}
          openComplaintsCount={openComplaintsCount}
          onNavigate={handleNavigate}
        />
      )}
      {activePage === 'predictions' && (
        <PredictionsPage
          village={activeVillage}
          onNavigate={handleNavigate}
        />
      )}
      {activePage === 'simulation' && (
        <SimulationPage
          village={activeVillage}
          params={simParams}
          onChangeParams={setSimParams}
          onApplyToPlanner={handleApplySimulationToPlanner}
          onNavigate={handleNavigate}
        />
      )}
      {activePage === 'planner' && (
        <PlannerPage
          village={activeVillage}
          projects={activeProjects}
          onToggleApprove={handleToggleProjectApprove}
        />
      )}
      {activePage === 'complaints' && (
        <ComplaintsPage
          village={activeVillage}
          complaints={activeComplaints}
          onUpdateStatus={handleUpdateComplaintStatus}
          onAddComplaint={handleAddComplaint}
        />
      )}
      {activePage === 'disasters' && (
        <DisasterPage
          village={activeVillage}
          onNavigate={handleNavigate}
        />
      )}
      {activePage === 'sustainability' && (
        <SustainabilityPage village={activeVillage} />
      )}
      {activePage === 'map' && (
        <MapPage village={activeVillage} complaints={activeComplaints} />
      )}
      {activePage === 'digital-twin' && (
        <DigitalTwinPage village={activeVillage} simParams={simParams} />
      )}
      {activePage === 'assistant' && (
        <ChatbotPage
          village={activeVillage}
          complaints={activeComplaints}
          simParams={simParams}
          onNavigate={handleNavigate}
        />
      )}
    </Layout>
  );
}
