import {
  SimulationParams,
  SimulationResult,
  VillageProfile,
  SectorKey,
} from '../types/village';

export const VILLAGE_IMAGES = {
  hero: '/src/assets/images/hero_smart_village_1795093597725.jpg',
  solar: '/src/assets/images/village_solar_microgrid_1795093610180.jpg',
  water: '/src/assets/images/village_water_tower_1795093608892.jpg',
} as const;

export const VILLAGES: VillageProfile[] = [
  {
    id: 'sundarpur',
    name: 'Sundarpur Gram Panchayat',
    district: 'Tumakuru District',
    state: 'Karnataka',
    population: 4820,
    households: 1142,
    areaHectares: 642,
    centerLat: 13.3409,
    centerLng: 77.1012,
    overallHealthScore: 76,
    overallDelta: 4.8,
    annualBudgetLakhs: 485,
    sectors: [
      {
        key: 'water',
        label: 'Water Infrastructure',
        score: 71,
        delta: 3.4,
        status: 'Watch',
        primaryMetricLabel: 'Tap Coverage',
        primaryMetricValue: '86.4%',
        secondaryMetricLabel: 'Reservoir Level',
        secondaryMetricValue: '64% cap.',
        summary:
          'Overhead tank capacity meets 86% of households; Ward 4 tail-end pressure drops during afternoon peaks.',
        wardScores: [
          { ward: 'Ward 1', score: 84 },
          { ward: 'Ward 2', score: 79 },
          { ward: 'Ward 3', score: 74 },
          { ward: 'Ward 4', score: 56 },
          { ward: 'Ward 5', score: 68 },
          { ward: 'Ward 6', score: 65 },
        ],
      },
      {
        key: 'agriculture',
        label: 'Agriculture & Soil',
        score: 82,
        delta: 6.2,
        status: 'Optimal',
        primaryMetricLabel: 'Irrigated Area',
        primaryMetricValue: '418 ha',
        secondaryMetricLabel: 'Yield Index',
        secondaryMetricValue: '+11.4% YoY',
        summary:
          'Drip irrigation adoption across eastern plots improved ragi and vegetable output while reducing borewell draw.',
        wardScores: [
          { ward: 'Ward 1', score: 85 },
          { ward: 'Ward 2', score: 88 },
          { ward: 'Ward 3', score: 81 },
          { ward: 'Ward 4', score: 74 },
          { ward: 'Ward 5', score: 84 },
          { ward: 'Ward 6', score: 80 },
        ],
      },
      {
        key: 'roads',
        label: 'Roads & Mobility',
        score: 68,
        delta: 2.1,
        status: 'Watch',
        primaryMetricLabel: 'All-Weather Paved',
        primaryMetricValue: '14.8 / 21.2 km',
        secondaryMetricLabel: 'LED Streetlights',
        secondaryMetricValue: '91% active',
        summary:
          'Main arterial corridor is paved; 6.4 km of northern farm-to-market links experience monsoon rutting.',
        wardScores: [
          { ward: 'Ward 1', score: 82 },
          { ward: 'Ward 2', score: 76 },
          { ward: 'Ward 3', score: 69 },
          { ward: 'Ward 4', score: 58 },
          { ward: 'Ward 5', score: 61 },
          { ward: 'Ward 6', score: 62 },
        ],
      },
      {
        key: 'electricity',
        label: 'Electricity & Microgrid',
        score: 85,
        delta: 7.5,
        status: 'Optimal',
        primaryMetricLabel: 'Grid Uptime',
        primaryMetricValue: '22.8 hrs/day',
        secondaryMetricLabel: 'Solar Share',
        secondaryMetricValue: '44% local',
        summary:
          'Community 250 kW solar microgrid stabilizes daytime agricultural feeders and cuts transformer outage events.',
        wardScores: [
          { ward: 'Ward 1', score: 91 },
          { ward: 'Ward 2', score: 88 },
          { ward: 'Ward 3', score: 86 },
          { ward: 'Ward 4', score: 79 },
          { ward: 'Ward 5', score: 84 },
          { ward: 'Ward 6', score: 82 },
        ],
      },
      {
        key: 'healthcare',
        label: 'Healthcare Access',
        score: 69,
        delta: 3.9,
        status: 'Watch',
        primaryMetricLabel: 'Avg. Clinic Distance',
        primaryMetricValue: '2.1 km',
        secondaryMetricLabel: 'Tele-Consults',
        secondaryMetricValue: '184 / mo',
        summary:
          'Primary Health Sub-Center handles routine maternal care; emergency stabilization and diagnostics need expansion.',
        wardScores: [
          { ward: 'Ward 1', score: 78 },
          { ward: 'Ward 2', score: 75 },
          { ward: 'Ward 3', score: 72 },
          { ward: 'Ward 4', score: 62 },
          { ward: 'Ward 5', score: 64 },
          { ward: 'Ward 6', score: 63 },
        ],
      },
      {
        key: 'education',
        label: 'Education & Digital',
        score: 81,
        delta: 5.1,
        status: 'Optimal',
        primaryMetricLabel: 'Attendance Rate',
        primaryMetricValue: '94.2%',
        secondaryMetricLabel: 'Smart Classrooms',
        secondaryMetricValue: '6 / 8 rooms',
        summary:
          'High school digital literacy lab and fiber uplink boosted secondary completion across all six wards.',
        wardScores: [
          { ward: 'Ward 1', score: 86 },
          { ward: 'Ward 2', score: 84 },
          { ward: 'Ward 3', score: 82 },
          { ward: 'Ward 4', score: 77 },
          { ward: 'Ward 5', score: 79 },
          { ward: 'Ward 6', score: 78 },
        ],
      },
    ],
    monthlyHistory: [
      { month: 'Dec', overall: 69, water: 65, agriculture: 75, electricity: 76, roads: 64, healthcare: 63, education: 74 },
      { month: 'Jan', overall: 70, water: 66, agriculture: 76, electricity: 77, roads: 64, healthcare: 64, education: 75 },
      { month: 'Feb', overall: 70, water: 66, agriculture: 77, electricity: 78, roads: 65, healthcare: 64, education: 76 },
      { month: 'Mar', overall: 71, water: 67, agriculture: 77, electricity: 79, roads: 65, healthcare: 65, education: 76 },
      { month: 'Apr', overall: 71, water: 65, agriculture: 78, electricity: 80, roads: 66, healthcare: 65, education: 77 },
      { month: 'May', overall: 72, water: 66, agriculture: 78, electricity: 81, roads: 66, healthcare: 66, education: 77 },
      { month: 'Jun', overall: 73, water: 68, agriculture: 79, electricity: 82, roads: 66, healthcare: 67, education: 78 },
      { month: 'Jul', overall: 74, water: 69, agriculture: 80, electricity: 83, roads: 67, healthcare: 67, education: 79 },
      { month: 'Aug', overall: 74, water: 70, agriculture: 80, electricity: 83, roads: 67, healthcare: 68, education: 79 },
      { month: 'Sep', overall: 75, water: 70, agriculture: 81, electricity: 84, roads: 67, healthcare: 68, education: 80 },
      { month: 'Oct', overall: 75, water: 71, agriculture: 82, electricity: 84, roads: 68, healthcare: 69, education: 80 },
      { month: 'Nov', overall: 76, water: 71, agriculture: 82, electricity: 85, roads: 68, healthcare: 69, education: 81 },
    ],
    wards: [
      { id: 'w1', name: 'Ward 1 · Central Core', households: 235, population: 980, healthScore: 84, waterCoverage: 95, solarAdoption: 58, openComplaints: 2 },
      { id: 'w2', name: 'Ward 2 · East Canal', households: 210, population: 875, healthScore: 81, waterCoverage: 92, solarAdoption: 51, openComplaints: 1 },
      { id: 'w3', name: 'Ward 3 · Market Road', households: 198, population: 830, healthScore: 77, waterCoverage: 88, solarAdoption: 46, openComplaints: 3 },
      { id: 'w4', name: 'Ward 4 · North Ridge', households: 184, population: 790, healthScore: 67, waterCoverage: 71, solarAdoption: 29, openComplaints: 5 },
      { id: 'w5', name: 'Ward 5 · Riverbend', households: 162, population: 695, healthScore: 72, waterCoverage: 82, solarAdoption: 38, openComplaints: 2 },
      { id: 'w6', name: 'Ward 6 · West Orchards', households: 153, population: 650, healthScore: 73, waterCoverage: 84, solarAdoption: 41, openComplaints: 2 },
    ],
    predictions: [
      {
        key: 'water_shortage',
        title: 'Water Shortage Forecast',
        unit: '% Deficit Risk',
        currentValue: '18.4%',
        forecastValue: '31.2%',
        riskLevel: 'Elevated',
        confidence: 91,
        trendDirection: 'up',
        summary:
          'Groundwater table in northern borewells is projected to recede 1.8 meters ahead of pre-monsoon demand unless storage capacity increases.',
        recommendedAction:
          'Commission a 1.5 Lakh-liter overhead water tank in Ward 4 and schedule pressurized valve balancing.',
        drivers: [
          { factor: 'Borewell Piezometer Decline', weight: 42, impact: '+11.4% deficit risk' },
          { factor: 'Peak Summer Household Draw', weight: 31, impact: '+7.8% demand surge' },
          { factor: 'Pipeline Distribution Leakage', weight: 18, impact: '14% non-revenue water loss' },
          { factor: 'Check-Dam Recharge Deficit', weight: 9, impact: '-4.2 ML storage carryover' },
        ],
        wardVulnerability: [
          { ward: 'Ward 4 · North Ridge', riskScore: 78, exposure: '184 households', status: 'High' },
          { ward: 'Ward 6 · West Orchards', riskScore: 54, exposure: '153 households', status: 'Moderate' },
          { ward: 'Ward 5 · Riverbend', riskScore: 46, exposure: '162 households', status: 'Moderate' },
          { ward: 'Ward 3 · Market Road', riskScore: 34, exposure: '198 households', status: 'Low' },
          { ward: 'Ward 2 · East Canal', riskScore: 24, exposure: '210 households', status: 'Low' },
          { ward: 'Ward 1 · Central Core', riskScore: 21, exposure: '235 households', status: 'Low' },
        ],
        horizons: {
          '30d': [
            { period: 'Week 1', baseline: 17, predicted: 19, lowerBound: 16, upperBound: 22 },
            { period: 'Week 2', baseline: 18, predicted: 21, lowerBound: 18, upperBound: 24 },
            { period: 'Week 3', baseline: 19, predicted: 24, lowerBound: 20, upperBound: 28 },
            { period: 'Week 4', baseline: 20, predicted: 27, lowerBound: 23, upperBound: 31 },
          ],
          '90d': [
            { period: 'Month 1', baseline: 19, predicted: 23, lowerBound: 20, upperBound: 27 },
            { period: 'Month 2', baseline: 22, predicted: 28, lowerBound: 24, upperBound: 33 },
            { period: 'Month 3', baseline: 24, predicted: 31, lowerBound: 26, upperBound: 37 },
          ],
          '180d': [
            { period: 'M1', baseline: 19, predicted: 23, lowerBound: 20, upperBound: 26 },
            { period: 'M2', baseline: 22, predicted: 28, lowerBound: 24, upperBound: 32 },
            { period: 'M3', baseline: 24, predicted: 31, lowerBound: 27, upperBound: 36 },
            { period: 'M4', baseline: 26, predicted: 35, lowerBound: 29, upperBound: 41 },
            { period: 'M5', baseline: 21, predicted: 26, lowerBound: 21, upperBound: 32 },
            { period: 'M6', baseline: 16, predicted: 18, lowerBound: 14, upperBound: 23 },
          ],
        },
      },
      {
        key: 'crop_yield',
        title: 'Crop Yield Projection',
        unit: 'Tonnes / Ha',
        currentValue: '4.12 t/ha',
        forecastValue: '4.68 t/ha',
        riskLevel: 'Low',
        confidence: 89,
        trendDirection: 'up',
        summary:
          'Satellite NDVI vigor and soil moisture telemetry indicate a strong rabi harvest across ragi, maize, and horticultural plots.',
        recommendedAction:
          'Expand automated drip scheduling to 45 rain-fed plots in Ward 6 and reserve cold-storage crates ahead of harvest.',
        drivers: [
          { factor: 'Canopy NDVI Vegetative Index', weight: 38, impact: '+0.34 t/ha uplift' },
          { factor: 'Soil Nitrogen & Organic Carbon', weight: 29, impact: '+0.19 t/ha uplift' },
          { factor: 'Micro-Irrigation Uniformity', weight: 22, impact: '+0.14 t/ha uplift' },
          { factor: 'Diurnal Heat Stress Variance', weight: 11, impact: '-0.11 t/ha drag' },
        ],
        wardVulnerability: [
          { ward: 'Ward 4 · North Ridge', riskScore: 52, exposure: '72 ha rain-fed', status: 'Moderate' },
          { ward: 'Ward 6 · West Orchards', riskScore: 39, exposure: '96 ha orchards', status: 'Moderate' },
          { ward: 'Ward 5 · Riverbend', riskScore: 28, exposure: '88 ha paddy/veg', status: 'Low' },
          { ward: 'Ward 3 · Market Road', riskScore: 25, exposure: '54 ha mixed', status: 'Low' },
          { ward: 'Ward 2 · East Canal', riskScore: 18, exposure: '112 ha irrigated', status: 'Low' },
          { ward: 'Ward 1 · Central Core', riskScore: 16, exposure: '36 ha nursery', status: 'Low' },
        ],
        horizons: {
          '30d': [
            { period: 'Week 1', baseline: 4.05, predicted: 4.18, lowerBound: 4.02, upperBound: 4.35 },
            { period: 'Week 2', baseline: 4.10, predicted: 4.29, lowerBound: 4.12, upperBound: 4.46 },
            { period: 'Week 3', baseline: 4.12, predicted: 4.41, lowerBound: 4.21, upperBound: 4.59 },
            { period: 'Week 4', baseline: 4.15, predicted: 4.52, lowerBound: 4.31, upperBound: 4.71 },
          ],
          '90d': [
            { period: 'Month 1', baseline: 4.12, predicted: 4.34, lowerBound: 4.15, upperBound: 4.52 },
            { period: 'Month 2', baseline: 4.18, predicted: 4.51, lowerBound: 4.30, upperBound: 4.72 },
            { period: 'Month 3', baseline: 4.22, predicted: 4.68, lowerBound: 4.44, upperBound: 4.91 },
          ],
          '180d': [
            { period: 'M1', baseline: 4.12, predicted: 4.34, lowerBound: 4.15, upperBound: 4.52 },
            { period: 'M2', baseline: 4.18, predicted: 4.51, lowerBound: 4.30, upperBound: 4.72 },
            { period: 'M3', baseline: 4.22, predicted: 4.68, lowerBound: 4.44, upperBound: 4.91 },
            { period: 'M4', baseline: 4.10, predicted: 4.58, lowerBound: 4.32, upperBound: 4.82 },
            { period: 'M5', baseline: 4.05, predicted: 4.49, lowerBound: 4.22, upperBound: 4.74 },
            { period: 'M6', baseline: 4.15, predicted: 4.72, lowerBound: 4.45, upperBound: 4.98 },
          ],
        },
      },
      {
        key: 'flood_risk',
        title: 'Flood Risk Modeling',
        unit: 'Risk Index / 100',
        currentValue: '34 / 100',
        forecastValue: '62 / 100',
        riskLevel: 'High',
        confidence: 87,
        trendDirection: 'up',
        summary:
          'Riverbend Ward 5 low-lying culvert shows 38% silt obstruction; heavy cyclonic rainfall would trigger localized bank overflow.',
        recommendedAction:
          'Desilt East Canal storm drains (2.4 km) and pre-position flood barriers along Riverbend causeway.',
        drivers: [
          { factor: 'Upstream Catchment Runoff', weight: 40, impact: '+24 index surge on >80mm rain' },
          { factor: 'Culvert & Drain Siltation', weight: 32, impact: '38% discharge bottleneck' },
          { factor: 'Soil Saturation Index', weight: 17, impact: 'Low absorption in Ward 5' },
          { factor: 'River Gauge Elevation', weight: 11, impact: '1.1m below warning crest' },
        ],
        wardVulnerability: [
          { ward: 'Ward 5 · Riverbend', riskScore: 81, exposure: '68 low-lying homes', status: 'High' },
          { ward: 'Ward 2 · East Canal', riskScore: 63, exposure: '42 canal-side plots', status: 'High' },
          { ward: 'Ward 3 · Market Road', riskScore: 41, exposure: 'Main storm culvert', status: 'Moderate' },
          { ward: 'Ward 1 · Central Core', riskScore: 24, exposure: 'Elevated plateau', status: 'Low' },
          { ward: 'Ward 6 · West Orchards', riskScore: 19, exposure: 'Terraced drainage', status: 'Low' },
          { ward: 'Ward 4 · North Ridge', riskScore: 12, exposure: 'High ridge terrain', status: 'Low' },
        ],
        horizons: {
          '30d': [
            { period: 'Week 1', baseline: 30, predicted: 34, lowerBound: 29, upperBound: 39 },
            { period: 'Week 2', baseline: 32, predicted: 41, lowerBound: 34, upperBound: 48 },
            { period: 'Week 3', baseline: 35, predicted: 52, lowerBound: 43, upperBound: 61 },
            { period: 'Week 4', baseline: 34, predicted: 48, lowerBound: 39, upperBound: 57 },
          ],
          '90d': [
            { period: 'Month 1', baseline: 33, predicted: 44, lowerBound: 37, upperBound: 52 },
            { period: 'Month 2', baseline: 38, predicted: 58, lowerBound: 49, upperBound: 68 },
            { period: 'Month 3', baseline: 40, predicted: 62, lowerBound: 51, upperBound: 73 },
          ],
          '180d': [
            { period: 'M1', baseline: 33, predicted: 44, lowerBound: 37, upperBound: 52 },
            { period: 'M2', baseline: 38, predicted: 58, lowerBound: 49, upperBound: 68 },
            { period: 'M3', baseline: 40, predicted: 62, lowerBound: 51, upperBound: 73 },
            { period: 'M4', baseline: 35, predicted: 49, lowerBound: 40, upperBound: 59 },
            { period: 'M5', baseline: 26, predicted: 31, lowerBound: 24, upperBound: 38 },
            { period: 'M6', baseline: 20, predicted: 24, lowerBound: 18, upperBound: 30 },
          ],
        },
      },
      {
        key: 'drought',
        title: 'Drought Severity Index',
        unit: 'SPI-Dryness %',
        currentValue: '24%',
        forecastValue: '39%',
        riskLevel: 'Moderate',
        confidence: 85,
        trendDirection: 'up',
        summary:
          'Evapotranspiration rates are trending 1.4°C above decadal median; upland plots require mulching and recharge pits.',
        recommendedAction:
          'Activate 14 farm percolation ponds and trigger drought-tolerant millet advisory for North Ridge farmers.',
        drivers: [
          { factor: 'Surface Temperature Anomaly', weight: 39, impact: '+1.4°C above 10-yr norm' },
          { factor: 'Sub-Surface Moisture Deficit', weight: 33, impact: '-12% root-zone reserve' },
          { factor: 'Dry Spell Duration Forecast', weight: 19, impact: '18 consecutive dry days' },
          { factor: 'Reservoir Evaporation Rate', weight: 9, impact: '4.6 mm/day loss' },
        ],
        wardVulnerability: [
          { ward: 'Ward 4 · North Ridge', riskScore: 66, exposure: '72 ha upland farms', status: 'High' },
          { ward: 'Ward 6 · West Orchards', riskScore: 48, exposure: '96 ha orchards', status: 'Moderate' },
          { ward: 'Ward 3 · Market Road', riskScore: 37, exposure: '54 ha mixed', status: 'Moderate' },
          { ward: 'Ward 1 · Central Core', riskScore: 29, exposure: 'Urbanized core', status: 'Low' },
          { ward: 'Ward 2 · East Canal', riskScore: 22, exposure: 'Canal-fed plots', status: 'Low' },
          { ward: 'Ward 5 · Riverbend', riskScore: 18, exposure: 'Riparian moisture', status: 'Low' },
        ],
        horizons: {
          '30d': [
            { period: 'Week 1', baseline: 22, predicted: 25, lowerBound: 21, upperBound: 29 },
            { period: 'Week 2', baseline: 23, predicted: 28, lowerBound: 24, upperBound: 32 },
            { period: 'Week 3', baseline: 25, predicted: 31, lowerBound: 26, upperBound: 36 },
            { period: 'Week 4', baseline: 26, predicted: 34, lowerBound: 29, upperBound: 39 },
          ],
          '90d': [
            { period: 'Month 1', baseline: 24, predicted: 29, lowerBound: 25, upperBound: 34 },
            { period: 'Month 2', baseline: 27, predicted: 35, lowerBound: 30, upperBound: 41 },
            { period: 'Month 3', baseline: 29, predicted: 39, lowerBound: 33, upperBound: 46 },
          ],
          '180d': [
            { period: 'M1', baseline: 24, predicted: 29, lowerBound: 25, upperBound: 34 },
            { period: 'M2', baseline: 27, predicted: 35, lowerBound: 30, upperBound: 41 },
            { period: 'M3', baseline: 29, predicted: 39, lowerBound: 33, upperBound: 46 },
            { period: 'M4', baseline: 31, predicted: 43, lowerBound: 36, upperBound: 50 },
            { period: 'M5', baseline: 26, predicted: 33, lowerBound: 27, upperBound: 39 },
            { period: 'M6', baseline: 19, predicted: 22, lowerBound: 17, upperBound: 27 },
          ],
        },
      },
      {
        key: 'electricity_demand',
        title: 'Electricity Demand Load',
        unit: 'kW Peak Load',
        currentValue: '412 kW',
        forecastValue: '538 kW',
        riskLevel: 'Elevated',
        confidence: 94,
        trendDirection: 'up',
        summary:
          'Irrigation pump loads and evening residential cooling will push evening peak to 538 kW, reaching 92% of feeder transformer rating.',
        recommendedAction:
          'Add 150 kW solar-plus-BESS capacity and shift agricultural pump timers to midday solar surplus windows.',
        drivers: [
          { factor: 'Agricultural Borewell Pumping', weight: 44, impact: '+68 kW daytime surge' },
          { factor: 'Evening Cooling & Appliances', weight: 28, impact: '+36 kW peak ramp (6–9 PM)' },
          { factor: 'Cold Storage & Dairy Chilling', weight: 18, impact: '+16 kW steady baseload' },
          { factor: 'E-Rickshaw & EV Charging', weight: 10, impact: '+6 kW night growth' },
        ],
        wardVulnerability: [
          { ward: 'Ward 3 · Market Road', riskScore: 69, exposure: 'Feeder T-2 at 91% load', status: 'High' },
          { ward: 'Ward 4 · North Ridge', riskScore: 58, exposure: 'Voltage sag -7.2%', status: 'Moderate' },
          { ward: 'Ward 2 · East Canal', riskScore: 49, exposure: '28 pump sets', status: 'Moderate' },
          { ward: 'Ward 1 · Central Core', riskScore: 36, exposure: 'Solar microgrid buffered', status: 'Low' },
          { ward: 'Ward 5 · Riverbend', riskScore: 31, exposure: 'Balanced feeder', status: 'Low' },
          { ward: 'Ward 6 · West Orchards', riskScore: 28, exposure: 'Low density load', status: 'Low' },
        ],
        horizons: {
          '30d': [
            { period: 'Week 1', baseline: 405, predicted: 420, lowerBound: 402, upperBound: 438 },
            { period: 'Week 2', baseline: 412, predicted: 438, lowerBound: 418, upperBound: 458 },
            { period: 'Week 3', baseline: 418, predicted: 454, lowerBound: 433, upperBound: 476 },
            { period: 'Week 4', baseline: 425, predicted: 471, lowerBound: 448, upperBound: 495 },
          ],
          '90d': [
            { period: 'Month 1', baseline: 418, predicted: 449, lowerBound: 428, upperBound: 472 },
            { period: 'Month 2', baseline: 435, predicted: 496, lowerBound: 472, upperBound: 521 },
            { period: 'Month 3', baseline: 450, predicted: 538, lowerBound: 511, upperBound: 564 },
          ],
          '180d': [
            { period: 'M1', baseline: 418, predicted: 449, lowerBound: 428, upperBound: 472 },
            { period: 'M2', baseline: 435, predicted: 496, lowerBound: 472, upperBound: 521 },
            { period: 'M3', baseline: 450, predicted: 538, lowerBound: 511, upperBound: 564 },
            { period: 'M4', baseline: 462, predicted: 554, lowerBound: 526, upperBound: 584 },
            { period: 'M5', baseline: 440, predicted: 512, lowerBound: 486, upperBound: 539 },
            { period: 'M6', baseline: 426, predicted: 484, lowerBound: 458, upperBound: 510 },
          ],
        },
      },
    ],
    projects: [
      {
        id: 'prj-01',
        rank: 1,
        title: 'Ward 4 Elevated 1.5L Overhead Water Tank & Smart Valves',
        sector: 'water',
        ward: 'Ward 4 · North Ridge',
        aiPriorityScore: 95,
        estimatedCostLakhs: 48,
        beneficiaries: 1420,
        timelineMonths: 6,
        impactScoreDelta: 4.2,
        status: 'Recommended',
        rationale:
          'Directly eliminates afternoon water pressure drops in North Ridge and reduces summer shortage risk by 58%.',
        milestones: ['Geotechnical soil survey', 'RCC tower foundation & staging', 'SCADA pressure sensors & commissioning'],
      },
      {
        id: 'prj-02',
        rank: 2,
        title: 'Riverbend Storm Drain Desilting & Smart Flood Culverts',
        sector: 'roads',
        ward: 'Ward 5 · Riverbend',
        aiPriorityScore: 91,
        estimatedCostLakhs: 34,
        beneficiaries: 1180,
        timelineMonths: 4,
        impactScoreDelta: 3.1,
        status: 'Approved',
        rationale:
          'Prevents recurring monsoon waterlogging across 68 households and preserves East Canal market road access.',
        milestones: ['2.4 km silt excavation', 'Precast box culvert reinforcement', 'Ultrasonic water-level sensor install'],
      },
      {
        id: 'prj-03',
        rank: 3,
        title: 'Primary Health Center 24/7 Diagnostics & Tele-ICU Wing',
        sector: 'healthcare',
        ward: 'Ward 1 · Central Core',
        aiPriorityScore: 88,
        estimatedCostLakhs: 64,
        beneficiaries: 4820,
        timelineMonths: 8,
        impactScoreDelta: 4.5,
        status: 'Recommended',
        rationale:
          'Cuts emergency district hospital referral delays by 45 minutes and adds automated pathology and maternal care beds.',
        milestones: ['Modular 6-bed wing civil works', 'Solar cold-chain vaccine storage', 'District specialist telemedicine uplink'],
      },
      {
        id: 'prj-04',
        rank: 4,
        title: '150 kW Solar Microgrid Expansion + 200 kWh Battery Storage',
        sector: 'electricity',
        ward: 'Ward 3 · Market Road',
        aiPriorityScore: 86,
        estimatedCostLakhs: 72,
        beneficiaries: 2640,
        timelineMonths: 5,
        impactScoreDelta: 3.6,
        status: 'In Progress',
        rationale:
          'Absorbs projected 538 kW evening peak load, preventing Feeder T-2 overloads and lifting renewable share to 62%.',
        milestones: ['Array mounting steel fabrication', 'LiFePO4 BESS container integration', 'Smart feeder net-metering sync'],
      },
      {
        id: 'prj-05',
        rank: 5,
        title: 'North Farm-to-Market All-Weather Paved Road (4.8 km)',
        sector: 'roads',
        ward: 'Ward 4 & Ward 6',
        aiPriorityScore: 82,
        estimatedCostLakhs: 86,
        beneficiaries: 2150,
        timelineMonths: 7,
        impactScoreDelta: 3.4,
        status: 'Recommended',
        rationale:
          'Reduces perishable vegetable spoilage by 22% during wet months and connects 180 farms to the mandi hub.',
        milestones: ['Sub-base grading & drainage shoulders', 'Bituminous macadam paving', 'Solar LED junction lighting'],
      },
      {
        id: 'prj-06',
        rank: 6,
        title: 'Precision Soil-Sensor Drip Irrigation Collective (60 Plots)',
        sector: 'agriculture',
        ward: 'Ward 6 · West Orchards',
        aiPriorityScore: 79,
        estimatedCostLakhs: 29,
        beneficiaries: 680,
        timelineMonths: 4,
        impactScoreDelta: 2.3,
        status: 'Under Review',
        rationale:
          'Cuts agricultural groundwater extraction by 34% while lifting horticulture farm incomes by an estimated 18%.',
        milestones: ['Plot hydraulic layout design', 'Lateral drip lines & fertigation tanks', 'LoRaWAN soil moisture node deployment'],
      },
      {
        id: 'prj-07',
        rank: 7,
        title: 'Government High School STEM & Agri-Tech Skill Lab',
        sector: 'education',
        ward: 'Ward 1 · Central Core',
        aiPriorityScore: 75,
        estimatedCostLakhs: 22,
        beneficiaries: 540,
        timelineMonths: 3,
        impactScoreDelta: 1.9,
        status: 'Approved',
        rationale:
          'Completes 100% smart classroom coverage and trains rural youth in solar maintenance and precision agriculture.',
        milestones: ['24 workstations & interactive display', 'Solar rooftop lab kit', 'Curriculum onboarding with block faculty'],
      },
    ],
    complaints: [
      {
        id: 'CMP-2041',
        title: 'Main HDPE distribution pipe burst near Ward 4 junction',
        category: 'Water Leakage',
        ward: 'Ward 4 · North Ridge',
        location: 'Crossroad near Anganwadi Center',
        reportedBy: 'Ramesh Gowda',
        reportedAt: '2 hours ago',
        priority: 'Critical',
        status: 'In Progress',
        slaRemainingHours: 4,
        assignedTeam: 'Jal Jeevan Rapid Crew A',
        description: 'Continuous high-pressure leak losing an estimated 1,400 liters/hour and lowering pressure across 38 homes.',
        lat: 13.3442,
        lng: 77.0994,
      },
      {
        id: 'CMP-2040',
        title: 'Six consecutive LED street lights non-functional on Market Road',
        category: 'Street Lights',
        ward: 'Ward 3 · Market Road',
        location: 'Mandi Gate to Bus Shelter stretch',
        reportedBy: 'Lakshmi Devi',
        reportedAt: '5 hours ago',
        priority: 'High',
        status: 'Open',
        slaRemainingHours: 14,
        assignedTeam: 'Panchayat Electrical Unit',
        description: 'Automatic dusk timer relay tripped after yesterday evening storm; dark stretch affects evening commuters.',
        lat: 13.3401,
        lng: 77.1035,
      },
      {
        id: 'CMP-2039',
        title: 'Deep potholes and washed-out shoulder on North Farm Link',
        category: 'Broken Roads',
        ward: 'Ward 6 · West Orchards',
        location: 'Kilometer 1.6 near Orchard Culvert',
        reportedBy: 'Suresh Naik',
        reportedAt: '1 day ago',
        priority: 'High',
        status: 'In Progress',
        slaRemainingHours: 22,
        assignedTeam: 'Rural Works Division',
        description: 'Tractor trailers struggling to pass flooded 18-meter rutted section carrying morning produce.',
        lat: 13.3388,
        lng: 77.0958,
      },
      {
        id: 'CMP-2038',
        title: 'Overflowing compost bin behind weekly vegetable market',
        category: 'Garbage',
        ward: 'Ward 3 · Market Road',
        location: 'East Market Shed #2',
        reportedBy: 'Kavitha Rao',
        reportedAt: '1 day ago',
        priority: 'Medium',
        status: 'Open',
        slaRemainingHours: 18,
        assignedTeam: 'Swachh Gram Sanitation Van',
        description: 'Organic market waste missed morning collection route; needs immediate transfer to biogas digester.',
        lat: 13.3414,
        lng: 77.1049,
      },
      {
        id: 'CMP-2037',
        title: 'Slow valve seepage at East Canal public standpost',
        category: 'Water Leakage',
        ward: 'Ward 2 · East Canal',
        location: 'Temple Lane Standpost #4',
        reportedBy: 'Manjunath S.',
        reportedAt: '2 days ago',
        priority: 'Medium',
        status: 'Resolved',
        slaRemainingHours: 0,
        assignedTeam: 'Jal Jeevan Rapid Crew B',
        description: 'Replaced worn brass gate valve washer and installed metered shut-off handle.',
        lat: 13.3425,
        lng: 77.1062,
      },
      {
        id: 'CMP-2036',
        title: 'Flickering solar street pole outside Primary Health Center',
        category: 'Street Lights',
        ward: 'Ward 1 · Central Core',
        location: 'PHC Main Entrance Gate',
        reportedBy: 'Dr. Ananya Sharma',
        reportedAt: '3 days ago',
        priority: 'High',
        status: 'Resolved',
        slaRemainingHours: 0,
        assignedTeam: 'Solar Maintenance Squad',
        description: 'Replaced degraded LiFePO4 pole battery pack and cleaned PV glass panel.',
        lat: 13.3411,
        lng: 77.1008,
      },
      {
        id: 'CMP-2035',
        title: 'Uncollected plastic recyclables near Riverbend bridge',
        category: 'Garbage',
        ward: 'Ward 5 · Riverbend',
        location: 'South Causeway Approach',
        reportedBy: 'Prakash M.',
        reportedAt: '4 days ago',
        priority: 'Low',
        status: 'Open',
        slaRemainingHours: 36,
        assignedTeam: 'Swachh Gram Sanitation Van',
        description: 'Dry waste collection cage is at 95% capacity ahead of weekend sorting schedule.',
        lat: 13.3369,
        lng: 77.1027,
      },
    ],
    hazards: [
      {
        id: 'haz-1',
        type: 'Flood',
        severity: 'High',
        probability: 68,
        leadTime: '36–48 Hours',
        affectedWards: ['Ward 5 · Riverbend', 'Ward 2 · East Canal'],
        estimatedExposure: '68 households · 94 ha farmland',
        guidance: 'Activate river gauge sirens at +2.4m, clear culvert screens, and stage School Hall Shelter #1.',
      },
      {
        id: 'haz-2',
        type: 'Drought & Heatwave',
        severity: 'Elevated',
        probability: 54,
        leadTime: '14–21 Days',
        affectedWards: ['Ward 4 · North Ridge', 'Ward 6 · West Orchards'],
        estimatedExposure: '184 households · 72 ha rain-fed plots',
        guidance: 'Schedule water tanker rotation and issue afternoon outdoor labor heat advisories via Gram SMS.',
      },
      {
        id: 'haz-3',
        type: 'Severe Storm',
        severity: 'Moderate',
        probability: 38,
        leadTime: '72 Hours',
        affectedWards: ['Ward 3 · Market Road', 'Ward 1 · Central Core'],
        estimatedExposure: 'Overhead feeder lines · Market sheds',
        guidance: 'Inspect feeder guy-wires, verify solar inverter islanding mode, and test emergency VHF radios.',
      },
      {
        id: 'haz-4',
        type: 'Crop Pest Outbreak',
        severity: 'Low',
        probability: 21,
        leadTime: '10 Days',
        affectedWards: ['Ward 2 · East Canal'],
        estimatedExposure: '32 ha maize & vegetable plots',
        guidance: 'Deploy pheromone traps and schedule drone-assisted bio-pesticide spot inspection.',
      },
    ],
    emergencyAssets: [
      { id: 'ea-1', name: 'Community Cyclone & Flood Shelters', category: 'Shelter', available: 3, total: 3, location: 'High School, Panchayat Hall, Community Center', readiness: 'Ready' },
      { id: 'ea-2', name: 'Emergency Mobile Water Tankers (10 kL)', category: 'Water', available: 2, total: 3, location: 'Pump House Yard (1 deployed to Ward 4)', readiness: 'Deployed' },
      { id: 'ea-3', name: 'Basic Life Support Ambulances', category: 'Medical', available: 2, total: 2, location: 'Primary Health Sub-Center Bay', readiness: 'Ready' },
      { id: 'ea-4', name: 'Mobile Solar-Hybrid Backup Generators', category: 'Power', available: 4, total: 4, location: 'Microgrid Substation Depot', readiness: 'Ready' },
      { id: 'ea-5', name: 'Inflatable Rescue Boats & Life Vests', category: 'Shelter', available: 2, total: 2, location: 'Ward 5 Riverbend Watchpost', readiness: 'Ready' },
      { id: 'ea-6', name: 'Emergency Medical & ORS Trauma Kits', category: 'Medical', available: 18, total: 20, location: 'PHC Cold Chain Room', readiness: 'Ready' },
    ],
    protocols: [
      { id: 'pr-1', phase: 'Preparedness', task: 'Verify ultrasonic water level telemetry on Riverbend Bridge', owner: 'Hydrology Lead', completed: true },
      { id: 'pr-2', phase: 'Early Warning', task: 'Test bilingual SMS & Panchayat loudspeaker broadcast relay', owner: 'Gram Secretary', completed: true },
      { id: 'pr-3', phase: 'Early Warning', task: 'Clear debris screens on East Canal Storm Culverts #1–#4', owner: 'Public Works Crew', completed: false },
      { id: 'pr-4', phase: 'Active Response', task: 'Stage 72-hour dry rations & potable water at High School Shelter', owner: 'Civil Supplies Team', completed: false },
      { id: 'pr-5', phase: 'Active Response', task: 'Verify 100% charge on PHC solar-battery medical backup', owner: 'Microgrid Operator', completed: true },
      { id: 'pr-6', phase: 'Recovery', task: 'Pre-authorize rapid crop damage drone assessment flight plan', owner: 'Agri Extension Officer', completed: false },
    ],
    sustainability: {
      carbonScore: 84,
      netEmissionsTons: 612,
      sequesteredTons: 498,
      greenCoverPercent: 41.8,
      greenCoverHectares: 268.4,
      renewableSharePercent: 56.4,
      solarCapacityKw: 250,
      rainwaterHarvestedML: 42.6,
      soilHealthIndex: 79,
      yearlyCarbonTrend: [
        { year: '2021', emissions: 920, sequestration: 310, net: 610 },
        { year: '2022', emissions: 860, sequestration: 345, net: 515 },
        { year: '2023', emissions: 790, sequestration: 392, net: 398 },
        { year: '2024', emissions: 715, sequestration: 438, net: 277 },
        { year: '2025', emissions: 658, sequestration: 468, net: 190 },
        { year: '2026', emissions: 612, sequestration: 498, net: 114 },
      ],
      energyMix: [
        { source: 'Community Solar Microgrid', share: 44, capacityKw: 250, color: '#06B6D4' },
        { source: 'Biogas & Agri-Waste', share: 12.4, capacityKw: 70, color: '#10B981' },
        { source: 'State Grid (Hydro/Thermal)', share: 38.6, capacityKw: 220, color: '#3B82F6' },
        { source: 'Diesel Backup Pumps', share: 5, capacityKw: 28, color: '#F59E0B' },
      ],
      milestones: [
        { title: '100% Solar-Powered Irrigation Feeders', targetYear: '2028', progress: 68, metric: '82 / 120 pumps converted' },
        { title: 'Zero Untreated Greywater Discharge', targetYear: '2027', progress: 74, metric: '4 / 6 wards reed-bed treated' },
        { title: '50% Village Canopy & Agroforestry Cover', targetYear: '2029', progress: 83, metric: '41.8% current canopy' },
        { title: 'Net-Zero Panchayat Operations', targetYear: '2030', progress: 81, metric: '114 tCO2e net gap remaining' },
      ],
    },
    mapAssets: [
      { id: 'ma-1', name: 'Central Overhead Water Tower (2.0L)', layer: 'water', ward: 'Ward 1', lat: 13.3418, lng: 77.1016, status: 'Optimal', metricLabel: 'Tank Level', metricValue: '76% · 152 kL', details: 'Primary gravity-fed overhead reservoir serving Wards 1, 2, and 3.' },
      { id: 'ma-2', name: 'North Ridge Booster Sump', layer: 'water', ward: 'Ward 4', lat: 13.3451, lng: 77.0991, status: 'Attention', metricLabel: 'Line Pressure', metricValue: '1.4 bar (Low)', details: 'Candidate site for new 1.5 Lakh-liter overhead tank expansion.' },
      { id: 'ma-3', name: 'East Canal Smart Check-Dam', layer: 'water', ward: 'Ward 2', lat: 13.3422, lng: 77.1074, status: 'Optimal', metricLabel: 'Recharge Rate', metricValue: '18.4 ML/season', details: 'Automated weir gate with ultrasonic level telemetry.' },
      { id: 'ma-4', name: '250 kW Community Solar Microgrid', layer: 'solar', ward: 'Ward 1', lat: 13.3396, lng: 77.0985, status: 'Optimal', metricLabel: 'Live Output', metricValue: '218 kW · 94% eff', details: 'Grid-tied solar array supplying daytime irrigation and school loads.' },
      { id: 'ma-5', name: 'Market Road Substation Feeder T-2', layer: 'solar', ward: 'Ward 3', lat: 13.3404, lng: 77.1041, status: 'Attention', metricLabel: 'Peak Load', metricValue: '91% rated', details: 'Scheduled for 150 kW solar + BESS peak shaving expansion.' },
      { id: 'ma-6', name: 'Primary Health Sub-Center', layer: 'healthcare', ward: 'Ward 1', lat: 13.3411, lng: 77.1004, status: 'Active', metricLabel: 'Daily OPD', metricValue: '64 patients', details: 'Telemedicine enabled, 2 BLS ambulances stationed on-site.' },
      { id: 'ma-7', name: 'Sundarpur Govt. Model High School', layer: 'healthcare', ward: 'Ward 1', lat: 13.3429, lng: 77.1025, status: 'Optimal', metricLabel: 'Enrollment', metricValue: '540 students', details: '6 smart classrooms + designated Cyclone/Flood Shelter #1.' },
      { id: 'ma-8', name: 'Main Arterial Smart LED Corridor', layer: 'roads', ward: 'Ward 1–3', lat: 13.3408, lng: 77.1021, status: 'Optimal', metricLabel: 'Road Index', metricValue: '88 / 100', details: '6.2 km resurfaced asphalt with automated dusk-to-dawn LED poles.' },
      { id: 'ma-9', name: 'North Farm-to-Market Unpaved Link', layer: 'roads', ward: 'Ward 6', lat: 13.3385, lng: 77.0961, status: 'Attention', metricLabel: 'Surface IRI', metricValue: 'Poor (Monsoon)', details: 'Prioritized for 4.8 km all-weather macadam upgrade.' },
      { id: 'ma-10', name: 'Active Water Pipe Burst (CMP-2041)', layer: 'complaints', ward: 'Ward 4', lat: 13.3442, lng: 77.0994, status: 'Critical', metricLabel: 'SLA Remaining', metricValue: '4 hrs left', details: 'Rapid Crew A on site repairing 110mm HDPE distribution main.' },
      { id: 'ma-11', name: 'Streetlight Outage Stretch (CMP-2040)', layer: 'complaints', ward: 'Ward 3', lat: 13.3401, lng: 77.1035, status: 'Attention', metricLabel: 'Poles Out', metricValue: '6 LED units', details: 'Dusk relay trip logged by Lakshmi Devi; awaiting relay swap.' },
    ],
    floodZones: [
      {
        id: 'fz-1',
        name: 'Riverbend Low-Lying Floodplain (High Risk)',
        risk: 'High',
        affectedHouseholds: 68,
        coordinates: [
          [13.3356, 77.1008],
          [13.3378, 77.1016],
          [13.3382, 77.1056],
          [13.3358, 77.1048],
        ],
      },
      {
        id: 'fz-2',
        name: 'East Canal Overflow Buffer (Moderate Risk)',
        risk: 'Moderate',
        affectedHouseholds: 42,
        coordinates: [
          [13.3408, 77.1061],
          [13.3436, 77.1066],
          [13.3434, 77.1088],
          [13.3404, 77.1082],
        ],
      },
    ],
  },
  {
    id: 'kaveripuram',
    name: 'Kaveripuram Model Gram',
    district: 'Mandya District',
    state: 'Karnataka',
    population: 6140,
    households: 1490,
    areaHectares: 815,
    centerLat: 12.5218,
    centerLng: 76.8951,
    overallHealthScore: 81,
    overallDelta: 6.1,
    annualBudgetLakhs: 620,
    sectors: [
      {
        key: 'water',
        label: 'Water Infrastructure',
        score: 84,
        delta: 5.2,
        status: 'Optimal',
        primaryMetricLabel: 'Tap Coverage',
        primaryMetricValue: '94.1%',
        secondaryMetricLabel: 'Reservoir Level',
        secondaryMetricValue: '79% cap.',
        summary: 'Canal-fed filtration plant and dual overhead tanks sustain continuous metered supply across 94% of homes.',
        wardScores: [
          { ward: 'Ward 1', score: 89 },
          { ward: 'Ward 2', score: 87 },
          { ward: 'Ward 3', score: 83 },
          { ward: 'Ward 4', score: 78 },
          { ward: 'Ward 5', score: 85 },
          { ward: 'Ward 6', score: 82 },
        ],
      },
      {
        key: 'agriculture',
        label: 'Agriculture & Soil',
        score: 88,
        delta: 7.4,
        status: 'Optimal',
        primaryMetricLabel: 'Irrigated Area',
        primaryMetricValue: '584 ha',
        secondaryMetricLabel: 'Yield Index',
        secondaryMetricValue: '+14.8% YoY',
        summary: 'Sugarcane and paddy collectives operate automated moisture-guided sluice gates with strong soil carbon.',
        wardScores: [
          { ward: 'Ward 1', score: 90 },
          { ward: 'Ward 2', score: 92 },
          { ward: 'Ward 3', score: 86 },
          { ward: 'Ward 4', score: 84 },
          { ward: 'Ward 5', score: 89 },
          { ward: 'Ward 6', score: 87 },
        ],
      },
      {
        key: 'roads',
        label: 'Roads & Mobility',
        score: 76,
        delta: 3.8,
        status: 'Stable',
        primaryMetricLabel: 'All-Weather Paved',
        primaryMetricValue: '21.4 / 26.0 km',
        secondaryMetricLabel: 'LED Streetlights',
        secondaryMetricValue: '95% active',
        summary: 'Highway feeder link upgraded last quarter; secondary dairy routes need drainage curbs.',
        wardScores: [
          { ward: 'Ward 1', score: 84 },
          { ward: 'Ward 2', score: 79 },
          { ward: 'Ward 3', score: 77 },
          { ward: 'Ward 4', score: 68 },
          { ward: 'Ward 5', score: 74 },
          { ward: 'Ward 6', score: 74 },
        ],
      },
      {
        key: 'electricity',
        label: 'Electricity & Microgrid',
        score: 82,
        delta: 5.9,
        status: 'Optimal',
        primaryMetricLabel: 'Grid Uptime',
        primaryMetricValue: '23.1 hrs/day',
        secondaryMetricLabel: 'Solar Share',
        secondaryMetricValue: '39% local',
        summary: 'Dual solar feeders support dairy chillers and grain mills with minimal voltage fluctuation.',
        wardScores: [
          { ward: 'Ward 1', score: 87 },
          { ward: 'Ward 2', score: 84 },
          { ward: 'Ward 3', score: 82 },
          { ward: 'Ward 4', score: 77 },
          { ward: 'Ward 5', score: 81 },
          { ward: 'Ward 6', score: 81 },
        ],
      },
      {
        key: 'healthcare',
        label: 'Healthcare Access',
        score: 74,
        delta: 4.5,
        status: 'Stable',
        primaryMetricLabel: 'Avg. Clinic Distance',
        primaryMetricValue: '1.6 km',
        secondaryMetricLabel: 'Tele-Consults',
        secondaryMetricValue: '242 / mo',
        summary: 'Upgraded PHC offers 12-hour lab testing; maternity ward bed expansion planned for Q3.',
        wardScores: [
          { ward: 'Ward 1', score: 82 },
          { ward: 'Ward 2', score: 78 },
          { ward: 'Ward 3', score: 75 },
          { ward: 'Ward 4', score: 68 },
          { ward: 'Ward 5', score: 71 },
          { ward: 'Ward 6', score: 70 },
        ],
      },
      {
        key: 'education',
        label: 'Education & Digital',
        score: 83,
        delta: 5.6,
        status: 'Optimal',
        primaryMetricLabel: 'Attendance Rate',
        primaryMetricValue: '96.1%',
        secondaryMetricLabel: 'Smart Classrooms',
        secondaryMetricValue: '9 / 10 rooms',
        summary: 'Public fiber library and evening vocational classes drive top block-level exam scores.',
        wardScores: [
          { ward: 'Ward 1', score: 88 },
          { ward: 'Ward 2', score: 85 },
          { ward: 'Ward 3', score: 83 },
          { ward: 'Ward 4', score: 79 },
          { ward: 'Ward 5', score: 82 },
          { ward: 'Ward 6', score: 81 },
        ],
      },
    ],
    monthlyHistory: [
      { month: 'Dec', overall: 74, water: 77, agriculture: 80, electricity: 75, roads: 70, healthcare: 68, education: 76 },
      { month: 'Jan', overall: 75, water: 78, agriculture: 81, electricity: 76, roads: 71, healthcare: 69, education: 77 },
      { month: 'Feb', overall: 76, water: 79, agriculture: 82, electricity: 77, roads: 72, healthcare: 70, education: 78 },
      { month: 'Mar', overall: 77, water: 80, agriculture: 83, electricity: 78, roads: 72, healthcare: 70, education: 79 },
      { month: 'Apr', overall: 77, water: 80, agriculture: 84, electricity: 78, roads: 73, healthcare: 71, education: 79 },
      { month: 'May', overall: 78, water: 81, agriculture: 84, electricity: 79, roads: 73, healthcare: 71, education: 80 },
      { month: 'Jun', overall: 78, water: 81, agriculture: 85, electricity: 79, roads: 74, healthcare: 72, education: 80 },
      { month: 'Jul', overall: 79, water: 82, agriculture: 86, electricity: 80, roads: 74, healthcare: 72, education: 81 },
      { month: 'Aug', overall: 79, water: 82, agriculture: 86, electricity: 80, roads: 75, healthcare: 73, education: 81 },
      { month: 'Sep', overall: 80, water: 83, agriculture: 87, electricity: 81, roads: 75, healthcare: 73, education: 82 },
      { month: 'Oct', overall: 80, water: 83, agriculture: 87, electricity: 81, roads: 75, healthcare: 74, education: 82 },
      { month: 'Nov', overall: 81, water: 84, agriculture: 88, electricity: 82, roads: 76, healthcare: 74, education: 83 },
    ],
    wards: [
      { id: 'kw1', name: 'Ward 1 · Town Center', households: 310, population: 1280, healthScore: 87, waterCoverage: 98, solarAdoption: 52, openComplaints: 1 },
      { id: 'kw2', name: 'Ward 2 · Canal Bank', households: 275, population: 1120, healthScore: 84, waterCoverage: 96, solarAdoption: 44, openComplaints: 2 },
      { id: 'kw3', name: 'Ward 3 · Dairy Circle', households: 255, population: 1045, healthScore: 81, waterCoverage: 94, solarAdoption: 41, openComplaints: 2 },
      { id: 'kw4', name: 'Ward 4 · South Fields', households: 230, population: 950, healthScore: 76, waterCoverage: 88, solarAdoption: 31, openComplaints: 3 },
      { id: 'kw5', name: 'Ward 5 · Mill Colony', households: 215, population: 895, healthScore: 79, waterCoverage: 93, solarAdoption: 36, openComplaints: 1 },
      { id: 'kw6', name: 'Ward 6 · Green Belt', households: 205, population: 850, healthScore: 80, waterCoverage: 95, solarAdoption: 38, openComplaints: 1 },
    ],
    predictions: [], // Hydrated below from Sundarpur base with adjusted values
    projects: [],
    complaints: [],
    hazards: [],
    emergencyAssets: [],
    protocols: [],
    sustainability: {
      carbonScore: 88,
      netEmissionsTons: 540,
      sequesteredTons: 472,
      greenCoverPercent: 46.2,
      greenCoverHectares: 376.5,
      renewableSharePercent: 61.2,
      solarCapacityKw: 340,
      rainwaterHarvestedML: 58.4,
      soilHealthIndex: 86,
      yearlyCarbonTrend: [
        { year: '2021', emissions: 880, sequestration: 340, net: 540 },
        { year: '2022', emissions: 810, sequestration: 372, net: 438 },
        { year: '2023', emissions: 740, sequestration: 405, net: 335 },
        { year: '2024', emissions: 660, sequestration: 430, net: 230 },
        { year: '2025', emissions: 595, sequestration: 454, net: 141 },
        { year: '2026', emissions: 540, sequestration: 472, net: 68 },
      ],
      energyMix: [
        { source: 'Community Solar Microgrid', share: 48, capacityKw: 340, color: '#06B6D4' },
        { source: 'Biogas & Agri-Waste', share: 13.2, capacityKw: 94, color: '#10B981' },
        { source: 'State Grid (Hydro/Thermal)', share: 35.8, capacityKw: 254, color: '#3B82F6' },
        { source: 'Diesel Backup Pumps', share: 3, capacityKw: 21, color: '#F59E0B' },
      ],
      milestones: [
        { title: '100% Solar-Powered Irrigation Feeders', targetYear: '2027', progress: 82, metric: '132 / 160 pumps converted' },
        { title: 'Zero Untreated Greywater Discharge', targetYear: '2027', progress: 86, metric: '5 / 6 wards reed-bed treated' },
        { title: '50% Village Canopy & Agroforestry Cover', targetYear: '2028', progress: 92, metric: '46.2% current canopy' },
        { title: 'Net-Zero Panchayat Operations', targetYear: '2029', progress: 89, metric: '68 tCO2e net gap remaining' },
      ],
    },
    mapAssets: [],
    floodZones: [],
  },
];

// Populate Kaveripuram operational datasets cleanly derived with local coordinates & realistic variance
const base = VILLAGES[0];
const kav = VILLAGES[1];
const latShift = kav.centerLat - base.centerLat;
const lngShift = kav.centerLng - base.centerLng;

kav.predictions = base.predictions.map((p) => ({
  ...p,
  confidence: Math.min(96, p.confidence + 2),
  wardVulnerability: p.wardVulnerability.map((w, i) => ({
    ...w,
    ward: kav.wards[i]?.name ?? w.ward,
    riskScore: Math.max(12, w.riskScore - 7),
  })),
}));

kav.projects = base.projects.map((p, i) => ({
  ...p,
  id: `kprj-0${i + 1}`,
  ward: kav.wards[i % kav.wards.length].name,
  estimatedCostLakhs: Math.round(p.estimatedCostLakhs * 1.15),
  beneficiaries: Math.round(p.beneficiaries * 1.2),
}));

kav.complaints = base.complaints.map((c, i) => ({
  ...c,
  id: `KMP-30${45 - i}`,
  ward: kav.wards[i % kav.wards.length].name,
  lat: Number((c.lat + latShift).toFixed(4)),
  lng: Number((c.lng + lngShift).toFixed(4)),
}));

kav.hazards = base.hazards;
kav.emergencyAssets = base.emergencyAssets;
kav.protocols = base.protocols;
kav.mapAssets = base.mapAssets.map((a, i) => ({
  ...a,
  id: `kma-${i + 1}`,
  lat: Number((a.lat + latShift).toFixed(4)),
  lng: Number((a.lng + lngShift).toFixed(4)),
}));
kav.floodZones = base.floodZones.map((fz, i) => ({
  ...fz,
  id: `kfz-${i + 1}`,
  coordinates: fz.coordinates.map(([la, ln]) => [
    Number((la + latShift).toFixed(4)),
    Number((ln + lngShift).toFixed(4)),
  ]),
}));

export function computeSimulationResult(
  village: VillageProfile,
  params: SimulationParams
): SimulationResult {
  // Unit costs in ₹ Lakhs
  const costRoads = params.roadsKm * 18;
  const costTanks = params.waterTanks * 42;
  const costSolar = params.solarPlants * 55;
  const costHospitals = params.hospitals * 68;
  const totalCostLakhs = costRoads + costTanks + costSolar + costHospitals;

  // Sector-specific projected gains (diminishing returns capped at 99)
  const sectorGainMap: Record<SectorKey, number> = {
    water: Math.min(28, params.waterTanks * 5.8 + params.solarPlants * 0.9),
    agriculture: Math.min(18, params.waterTanks * 2.4 + params.solarPlants * 1.8 + params.roadsKm * 0.6),
    roads: Math.min(29, params.roadsKm * 2.4),
    electricity: Math.min(18, params.solarPlants * 3.8),
    healthcare: Math.min(28, params.hospitals * 9.2 + params.roadsKm * 0.5 + params.waterTanks * 0.8),
    education: Math.min(14, params.roadsKm * 0.5 + params.solarPlants * 1.1 + params.hospitals * 0.7),
  };

  const sectorImpacts = village.sectors.map((s) => {
    const projected = Math.min(99, Number((s.score + sectorGainMap[s.key]).toFixed(1)));
    return {
      sector: s.label.split(' ')[0],
      key: s.key,
      current: s.score,
      projected,
      gain: Number((projected - s.score).toFixed(1)),
    };
  });

  const projectedHealthScore = Number(
    (
      sectorImpacts.reduce((acc, item) => acc + item.projected, 0) /
      sectorImpacts.length
    ).toFixed(1)
  );
  const scoreGain = Number(
    Math.max(0, projectedHealthScore - village.overallHealthScore).toFixed(1)
  );

  const beneficiaries = Math.min(
    village.population,
    Math.round(
      params.roadsKm * 280 +
        params.waterTanks * 720 +
        params.solarPlants * 810 +
        params.hospitals * 1550
    )
  );

  const annualCo2SavedTons = Math.round(
    params.solarPlants * 138 + params.waterTanks * 14 + params.roadsKm * 6
  );

  const annualEconomicBenefitLakhs =
    params.solarPlants * 15.5 +
    params.waterTanks * 9.2 +
    params.roadsKm * 4.4 +
    params.hospitals * 12.8;

  const roiYears =
    totalCostLakhs === 0
      ? 0
      : Number(
          Math.max(
            2.1,
            totalCostLakhs / Math.max(1, annualEconomicBenefitLakhs)
          ).toFixed(1)
        );

  const fiveYearTrajectory = ['2026', '2027', '2028', '2029', '2030'].map(
    (year, idx) => {
      const ramp = [0.2, 0.52, 0.78, 0.92, 1.0][idx];
      const baseline = Math.min(95, Number((village.overallHealthScore + idx * 1.2).toFixed(1)));
      const simulated = Math.min(
        98,
        Number((baseline + scoreGain * ramp).toFixed(1))
      );
      return { year, baseline, simulated };
    }
  );

  return {
    totalCostLakhs,
    projectedHealthScore,
    scoreGain,
    beneficiaries,
    annualCo2SavedTons,
    roiYears,
    sectorImpacts,
    fiveYearTrajectory,
  };
}
