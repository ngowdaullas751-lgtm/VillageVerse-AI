export type PageId =
  | 'landing'
  | 'dashboard'
  | 'predictions'
  | 'simulation'
  | 'planner'
  | 'complaints'
  | 'disasters'
  | 'sustainability'
  | 'map'
  | 'digital-twin'
  | 'assistant';

export type SectorKey =
  | 'water'
  | 'agriculture'
  | 'roads'
  | 'electricity'
  | 'healthcare'
  | 'education';

export interface SectorHealth {
  key: SectorKey;
  label: string;
  score: number;
  delta: number;
  status: 'Optimal' | 'Stable' | 'Watch' | 'Critical';
  primaryMetricLabel: string;
  primaryMetricValue: string;
  secondaryMetricLabel: string;
  secondaryMetricValue: string;
  summary: string;
  wardScores: { ward: string; score: number }[];
}

export interface MonthlyHealthPoint {
  month: string;
  overall: number;
  water: number;
  agriculture: number;
  electricity: number;
  roads: number;
  healthcare: number;
  education: number;
}

export interface WardOverview {
  id: string;
  name: string;
  households: number;
  population: number;
  healthScore: number;
  waterCoverage: number;
  solarAdoption: number;
  openComplaints: number;
}

export type PredictionDomainKey =
  | 'water_shortage'
  | 'crop_yield'
  | 'flood_risk'
  | 'drought'
  | 'electricity_demand';

export interface PredictionSeriesPoint {
  period: string;
  baseline: number;
  predicted: number;
  lowerBound: number;
  upperBound: number;
}

export interface PredictionDomain {
  key: PredictionDomainKey;
  title: string;
  unit: string;
  currentValue: string;
  forecastValue: string;
  riskLevel: 'Low' | 'Moderate' | 'Elevated' | 'High';
  confidence: number;
  trendDirection: 'up' | 'down' | 'stable';
  summary: string;
  recommendedAction: string;
  drivers: { factor: string; weight: number; impact: string }[];
  wardVulnerability: {
    ward: string;
    riskScore: number;
    exposure: string;
    status: 'Low' | 'Moderate' | 'High';
  }[];
  horizons: {
    '30d': PredictionSeriesPoint[];
    '90d': PredictionSeriesPoint[];
    '180d': PredictionSeriesPoint[];
  };
}

export interface SimulationParams {
  roadsKm: number; // 0 to 12 km
  waterTanks: number; // 0 to 6 tanks
  solarPlants: number; // 0 to 5 microgrids (100kW each)
  hospitals: number; // 0 to 3 health centers / clinics
}

export interface SimulationResult {
  totalCostLakhs: number;
  projectedHealthScore: number;
  scoreGain: number;
  beneficiaries: number;
  annualCo2SavedTons: number;
  roiYears: number;
  sectorImpacts: {
    sector: string;
    key: SectorKey;
    current: number;
    projected: number;
    gain: number;
  }[];
  fiveYearTrajectory: {
    year: string;
    baseline: number;
    simulated: number;
  }[];
}

export interface DevelopmentProject {
  id: string;
  rank: number;
  title: string;
  sector: SectorKey;
  ward: string;
  aiPriorityScore: number;
  estimatedCostLakhs: number;
  beneficiaries: number;
  timelineMonths: number;
  impactScoreDelta: number;
  status: 'Recommended' | 'Approved' | 'In Progress' | 'Under Review';
  rationale: string;
  milestones: string[];
}

export type ComplaintCategory =
  | 'Water Leakage'
  | 'Garbage'
  | 'Broken Roads'
  | 'Street Lights';

export type ComplaintStatus = 'Open' | 'In Progress' | 'Resolved';
export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export interface VillageComplaint {
  id: string;
  title: string;
  category: ComplaintCategory;
  ward: string;
  location: string;
  reportedBy: string;
  reportedAt: string;
  priority: PriorityLevel;
  status: ComplaintStatus;
  slaRemainingHours: number;
  assignedTeam: string;
  description: string;
  lat: number;
  lng: number;
}

export interface DisasterHazard {
  id: string;
  type: 'Flood' | 'Drought & Heatwave' | 'Severe Storm' | 'Crop Pest Outbreak';
  severity: 'High' | 'Elevated' | 'Moderate' | 'Low';
  probability: number;
  leadTime: string;
  affectedWards: string[];
  estimatedExposure: string;
  guidance: string;
}

export interface EmergencyAsset {
  id: string;
  name: string;
  category: 'Shelter' | 'Medical' | 'Water' | 'Power';
  available: number;
  total: number;
  location: string;
  readiness: 'Ready' | 'Deployed' | 'Maintenance';
}

export interface ResponseProtocol {
  id: string;
  phase: 'Preparedness' | 'Early Warning' | 'Active Response' | 'Recovery';
  task: string;
  owner: string;
  completed: boolean;
}

export interface SustainabilityData {
  carbonScore: number;
  netEmissionsTons: number;
  sequesteredTons: number;
  greenCoverPercent: number;
  greenCoverHectares: number;
  renewableSharePercent: number;
  solarCapacityKw: number;
  rainwaterHarvestedML: number;
  soilHealthIndex: number;
  yearlyCarbonTrend: {
    year: string;
    emissions: number;
    sequestration: number;
    net: number;
  }[];
  energyMix: {
    source: string;
    share: number;
    capacityKw: number;
    color: string;
  }[];
  milestones: {
    title: string;
    targetYear: string;
    progress: number;
    metric: string;
  }[];
}

export type MapLayerType =
  | 'water'
  | 'roads'
  | 'solar'
  | 'healthcare'
  | 'complaints'
  | 'flood_zones';

export interface MapAsset {
  id: string;
  name: string;
  layer: Exclude<MapLayerType, 'flood_zones'>;
  ward: string;
  lat: number;
  lng: number;
  status: 'Optimal' | 'Active' | 'Attention' | 'Critical';
  metricLabel: string;
  metricValue: string;
  details: string;
}

export interface FloodZonePolygon {
  id: string;
  name: string;
  risk: 'High' | 'Moderate';
  affectedHouseholds: number;
  coordinates: [number, number][];
}

export interface VillageProfile {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  households: number;
  areaHectares: number;
  centerLat: number;
  centerLng: number;
  overallHealthScore: number;
  overallDelta: number;
  annualBudgetLakhs: number;
  sectors: SectorHealth[];
  monthlyHistory: MonthlyHealthPoint[];
  wards: WardOverview[];
  predictions: PredictionDomain[];
  projects: DevelopmentProject[];
  complaints: VillageComplaint[];
  hazards: DisasterHazard[];
  emergencyAssets: EmergencyAsset[];
  protocols: ResponseProtocol[];
  sustainability: SustainabilityData;
  mapAssets: MapAsset[];
  floodZones: FloodZonePolygon[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  metrics?: { label: string; value: string; note?: string }[];
  suggestedActions?: { label: string; page: PageId }[];
}
