import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowRight,
  Box,
  Compass,
  Droplets,
  Leaf,
  MapPin,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
} from 'lucide-react';
import { PageId } from '../types/village';
import { VILLAGE_IMAGES } from '../data/villageData';

interface LandingPageProps {
  onNavigate: (page: PageId) => void;
}

interface StatCounterProps {
  target: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<StatCounterProps> = ({
  target,
  suffix = '',
  prefix = '',
  decimals = 0,
}) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let rafId = 0;
    const duration = 900;
    const start = performance.now();

    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(target * eased);
      if (progress < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target]);

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {decimals > 0 ? value.toFixed(decimals) : Math.round(value).toLocaleString()}
      {suffix}
    </span>
  );
};

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [heroImgFailed, setHeroImgFailed] = useState(false);
  const [solarImgFailed, setSolarImgFailed] = useState(false);
  const [waterImgFailed, setWaterImgFailed] = useState(false);

  return (
    <div className="min-h-screen bg-[#060D1A] text-[#E6EEF8] flex flex-col">
      {/* Strict 3-Zone Top Navigation Bar */}
      <header className="sticky top-0 z-30 bg-[#060D1A]/95 border-b border-[#162742]">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          {/* Zone 1: Single text wordmark */}
          <a
            href="#top"
            className="font-display text-lg font-bold tracking-tight text-[#F4F8FF] whitespace-nowrap shrink-0"
          >
            VillageVerse AI
          </a>

          {/* Zone 2: 5 clean single-line links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#9BB0CE]">
            <a
              href="#capabilities"
              className="hover:text-[#F4F8FF] transition-colors whitespace-nowrap shrink-0"
            >
              Capabilities
            </a>
            <a
              href="#impact"
              className="hover:text-[#F4F8FF] transition-colors whitespace-nowrap shrink-0"
            >
              Measured Impact
            </a>
            <button
              onClick={() => onNavigate('map')}
              className="hover:text-[#F4F8FF] transition-colors whitespace-nowrap shrink-0"
            >
              GIS Map
            </button>
            <button
              onClick={() => onNavigate('digital-twin')}
              className="hover:text-[#F4F8FF] transition-colors whitespace-nowrap shrink-0"
            >
              3D Twin
            </button>
            <button
              onClick={() => onNavigate('simulation')}
              className="hover:text-[#F4F8FF] transition-colors whitespace-nowrap shrink-0"
            >
              Simulator
            </button>
          </nav>

          {/* Zone 3: 1 primary CTA */}
          <div className="shrink-0">
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-4 py-2 text-xs sm:text-sm font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0"
            >
              Launch Platform
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="top" className="relative border-b border-[#152540]">
        <div className="max-w-[1280px] mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            {/* Left Copy Column */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6 flex flex-col justify-center"
            >
              <div className="flex items-center gap-2 text-xs font-medium text-cyan-400 mb-4">
                <span>Rural Digital Twin Platform</span>
                <span aria-hidden="true">·</span>
                <span className="text-[#8BA3C7]">Sundarpur & Kaveripuram Pilot</span>
              </div>

              <h1
                className="font-display font-bold tracking-tight text-[#F6F9FF] leading-[1.08] text-balance"
                style={{ fontSize: 'clamp(2.25rem, 4vw, 3.5rem)' }}
              >
                Intelligent Digital Twins for Sustainable Village Governance
              </h1>

              <p className="mt-5 text-base sm:text-[17px] text-[#9EB2CF] leading-relaxed max-w-xl">
                VillageVerse AI unifies civic health scoring, predictive climate and resource
                forecasting, what-if infrastructure simulation, and real-time 3D spatial modeling so
                panchayat leaders allocate every rupee where citizens need it most.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="px-6 py-3 text-sm font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <span>Open Village Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onNavigate('digital-twin')}
                  className="px-5 py-3 text-sm font-medium text-[#E6EEF8] bg-[#0D1A30] hover:bg-[#142645] border border-[#22395E] rounded-lg transition-colors inline-flex items-center gap-2 whitespace-nowrap shrink-0"
                >
                  <Box className="w-4 h-4 text-emerald-400" />
                  <span>Explore 3D Digital Twin</span>
                </button>
              </div>
            </motion.div>

            {/* Right Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-6"
            >
              <div className="relative h-full min-h-[300px] sm:min-h-[380px] rounded-xl overflow-hidden border border-[#1E3354] bg-[#0B1629]">
                {!heroImgFailed ? (
                  <img
                    src={VILLAGE_IMAGES.hero}
                    alt="Aerial twilight view of Sundarpur smart village showing solar rooftops, paved lit roads, elevated water tower, and green farmland"
                    referrerPolicy="no-referrer"
                    onError={() => setHeroImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#0C1D38] to-[#081326] text-center">
                    <Compass className="w-10 h-10 text-cyan-400 mb-3" />
                    <span className="font-display text-lg font-semibold text-white">
                      Sundarpur Smart Village Digital Twin
                    </span>
                  </div>
                )}
                {/* Measured bottom contrast scrim */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#060D1A]/90 via-[#060D1A]/20 to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4">
                  <div>
                    <div className="text-xs text-cyan-300 font-medium">
                      Sundarpur Gram Panchayat · Tumakuru District
                    </div>
                    <div className="mt-1 text-sm text-[#D6E2F3]">
                      6 Wards · 1,142 Households · 642 Hectares Mapped
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-[#9BB0CE]">Village Health Index</div>
                    <div className="font-mono text-2xl font-semibold text-emerald-400 tabular-nums">
                      76 / 100
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Full-width Animated Quantitative KPI Strip */}
          <div className="mt-12 pt-10 border-t border-[#162742] grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#F6F9FF]">
                <AnimatedCounter target={4820} />
              </div>
              <div className="mt-1.5 text-sm font-medium text-[#C5D4E8]">
                Residents Modeled in Twin
              </div>
              <div className="mt-0.5 text-xs text-[#7E96B8]">
                Across 6 wards & 1,142 households
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-cyan-400">
                <AnimatedCounter target={31.4} decimals={1} suffix="%" />
              </div>
              <div className="mt-1.5 text-sm font-medium text-[#C5D4E8]">
                Faster Complaint Resolution
              </div>
              <div className="mt-0.5 text-xs text-[#7E96B8]">
                Measured over 12-month pilot SLA tracking
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-400">
                <AnimatedCounter target={56.4} decimals={1} suffix="%" />
              </div>
              <div className="mt-1.5 text-sm font-medium text-[#C5D4E8]">
                Local Renewable Energy Mix
              </div>
              <div className="mt-0.5 text-xs text-[#7E96B8]">
                250 kW solar microgrid + biogas units
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-[#F6F9FF]">
                <AnimatedCounter target={91} suffix="%" />
              </div>
              <div className="mt-1.5 text-sm font-medium text-[#C5D4E8]">
                AI Risk Forecast Precision
              </div>
              <div className="mt-0.5 text-xs text-[#7E96B8]">
                Water, flood, crop yield & peak load models
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities Asymmetric Bento Section */}
      <section id="capabilities" className="py-16 lg:py-20 border-b border-[#152540]">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl">
            <div className="text-xs font-medium text-cyan-400">Platform Architecture</div>
            <h2 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F8FF] text-balance">
              One integrated workspace from ward telemetry to 3D infrastructure simulation
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#94AAC9] leading-relaxed">
              Every module connects directly to the village health baseline, enabling planners to
              forecast shortages, simulate capital investments, and verify spatial impact before
              groundbreaking.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Large Primary Bento Card: Water & Risk Modeling */}
            <div className="lg:col-span-7 rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden flex flex-col">
              <div className="h-56 sm:h-64 relative overflow-hidden bg-[#091324]">
                {!waterImgFailed ? (
                  <img
                    src={VILLAGE_IMAGES.water}
                    alt="Modern reinforced concrete overhead village water tower and filtration unit at twilight"
                    referrerPolicy="no-referrer"
                    onError={() => setWaterImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Droplets className="w-10 h-10 text-cyan-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C172B] via-[#0C172B]/25 to-transparent" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#7E96B8]">
                    01. Predictive Analytics & Infrastructure Twin
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-[#F4F8FF]">
                    Forecast Water Shortages, Floods, Crop Yields & Peak Grid Load
                  </h3>
                  <p className="mt-2.5 text-sm text-[#94AAC9] leading-relaxed">
                    Monitor piezometer groundwater depth, culvert siltation, NDVI vegetation vigor,
                    and transformer feeder load across 30-, 90-, and 180-day planning horizons.
                  </p>
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-4 pt-4 border-t border-[#172844]">
                  <button
                    onClick={() => onNavigate('predictions')}
                    className="text-sm font-medium text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Inspect AI Predictions</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                  <span className="text-[#263C61]" aria-hidden="true">|</span>
                  <button
                    onClick={() => onNavigate('disasters')}
                    className="text-sm font-medium text-[#B7C8E0] hover:text-white transition-colors"
                  >
                    Disaster Preparedness
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Solar Sustainability Card */}
            <div className="lg:col-span-5 rounded-xl bg-[#0C172B] border border-[#1B2E4B] overflow-hidden flex flex-col">
              <div className="h-56 sm:h-64 relative overflow-hidden bg-[#091324]">
                {!solarImgFailed ? (
                  <img
                    src={VILLAGE_IMAGES.solar}
                    alt="Rural community solar microgrid panels installed alongside green irrigated agricultural farmland"
                    referrerPolicy="no-referrer"
                    onError={() => setSolarImgFailed(true)}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Leaf className="w-10 h-10 text-emerald-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C172B] via-[#0C172B]/25 to-transparent" />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs text-[#7E96B8]">
                    02. Net-Zero Village Sustainability
                  </div>
                  <h3 className="mt-2 font-display text-xl font-semibold text-[#F4F8FF]">
                    Carbon Accounting, Canopy Cover & Solar Microgrids
                  </h3>
                  <p className="mt-2.5 text-sm text-[#94AAC9] leading-relaxed">
                    Track emissions against agroforestry carbon sequestration, solar feeder share,
                    and rainwater recharge across every fiscal year.
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-[#172844]">
                  <button
                    onClick={() => onNavigate('sustainability')}
                    className="text-sm font-medium text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1.5 transition-colors"
                  >
                    <span>Open Sustainability Ledger</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Second Row: 3 Structured Operational Modules */}
            <button
              onClick={() => onNavigate('simulation')}
              className="lg:col-span-4 text-left rounded-xl bg-[#0C172B] hover:bg-[#101F39] border border-[#1B2E4B] hover:border-cyan-500/40 p-6 transition-colors group"
            >
              <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-[#F4F8FF] group-hover:text-cyan-300 transition-colors">
                03. What-If Policy Simulator
              </h3>
              <p className="mt-2 text-sm text-[#94AAC9] leading-relaxed">
                Test adding paved roads, overhead water tanks, solar plants, and health centers to
                preview projected health score gains, ROI, and CO2 savings.
              </p>
            </button>

            <button
              onClick={() => onNavigate('map')}
              className="lg:col-span-4 text-left rounded-xl bg-[#0C172B] hover:bg-[#101F39] border border-[#1B2E4B] hover:border-cyan-500/40 p-6 transition-colors group"
            >
              <MapPin className="w-5 h-5 text-emerald-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-[#F4F8FF] group-hover:text-cyan-300 transition-colors">
                04. Leaflet GIS & 3D Village Twin
              </h3>
              <p className="mt-2 text-sm text-[#94AAC9] leading-relaxed">
                Inspect ward infrastructure, flood polygons, and citizen complaints on OpenStreetMap
                or orbit the procedural Three.js 3D twin.
              </p>
            </button>

            <button
              onClick={() => onNavigate('planner')}
              className="lg:col-span-4 text-left rounded-xl bg-[#0C172B] hover:bg-[#101F39] border border-[#1B2E4B] hover:border-cyan-500/40 p-6 transition-colors group"
            >
              <TrendingUp className="w-5 h-5 text-cyan-400" />
              <h3 className="mt-4 font-display text-lg font-semibold text-[#F4F8FF] group-hover:text-cyan-300 transition-colors">
                05. AI Development Planner & Grievances
              </h3>
              <p className="mt-2 text-sm text-[#94AAC9] leading-relaxed">
                Rank capital projects by impact-per-rupee while resolving water leakage, broken
                road, sanitation, and streetlight reports under live SLAs.
              </p>
            </button>
          </div>
        </div>
      </section>

      {/* Proof of Impact Section */}
      <section id="impact" className="py-16 lg:py-20">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="rounded-xl bg-[#0B1528] border border-[#1B2E4B] p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
                <ShieldCheck className="w-4 h-4" />
                <span>Evidence-Backed Rural Planning</span>
              </div>
              <h2 className="mt-3 font-display text-2xl sm:text-3xl font-bold tracking-tight text-[#F4F8FF] text-balance">
                Built for Gram Panchayats, District Collectors, and Rural Infrastructure Engineers
              </h2>
              <p className="mt-3 text-sm sm:text-base text-[#94AAC9] leading-relaxed">
                Explore the full interactive Sundarpur & Kaveripuram digital twin workspace—complete
                with six-sector health scoring, live complaint intake, AI chatbot guidance, GIS
                layers, and Three.js spatial visualization.
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <button
                onClick={() => onNavigate('dashboard')}
                className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Enter Sundarpur Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('assistant')}
                className="w-full sm:w-auto px-6 py-3 text-sm font-medium text-[#D6E2F3] bg-[#10203A] hover:bg-[#162C4F] border border-[#233B61] rounded-lg transition-colors inline-flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Ask AI Village Assistant</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Clean Quiet Footer */}
      <footer className="mt-auto border-t border-[#152540] py-8">
        <div className="max-w-[1280px] mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#738BB0]">
          <div className="font-display font-semibold text-[#C5D4E8]">
            VillageVerse AI — Intelligent Village Digital Twin
          </div>
          <div className="flex flex-wrap items-center gap-5">
            <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
              Dashboard
            </button>
            <button onClick={() => onNavigate('predictions')} className="hover:text-white transition-colors">
              Predictions
            </button>
            <button onClick={() => onNavigate('map')} className="hover:text-white transition-colors">
              GIS Map
            </button>
            <button onClick={() => onNavigate('digital-twin')} className="hover:text-white transition-colors">
              3D Digital Twin
            </button>
            <button onClick={() => onNavigate('sustainability')} className="hover:text-white transition-colors">
              Sustainability
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
