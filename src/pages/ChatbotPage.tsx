import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, RotateCcw, Send } from 'lucide-react';
import {
  ChatMessage,
  PageId,
  SimulationParams,
  VillageComplaint,
  VillageProfile,
} from '../types/village';
import { computeSimulationResult } from '../data/villageData';
import { PageHeader } from '../components/PageHeader';

interface ChatbotPageProps {
  village: VillageProfile;
  complaints: VillageComplaint[];
  simParams: SimulationParams;
  onNavigate: (page: PageId) => void;
}

const SUGGESTED_PROMPTS = [
  'Summarize the village health score and weakest wards',
  'What is our water shortage and flood risk outlook?',
  'Analyze the current What-If infrastructure simulation',
  'Which citizen complaints need urgent dispatch today?',
  'How close are we to Net-Zero 2030 sustainability goals?',
];

function generateGroundedReply(
  query: string,
  village: VillageProfile,
  complaints: VillageComplaint[],
  simParams: SimulationParams
): Omit<ChatMessage, 'id' | 'role' | 'timestamp'> {
  const q = query.toLowerCase();
  const sim = computeSimulationResult(village, simParams);
  const openComplaints = complaints.filter((c) => c.status !== 'Resolved');
  const criticalCount = openComplaints.filter((c) => c.priority === 'Critical').length;
  const weakestSector = [...village.sectors].sort((a, b) => a.score - b.score)[0];
  const strongestSector = [...village.sectors].sort((a, b) => b.score - a.score)[0];

  if (q.includes('water') || q.includes('flood') || q.includes('drought') || q.includes('predict') || q.includes('risk')) {
    const waterPred = village.predictions.find((p) => p.key === 'water_shortage');
    const floodPred = village.predictions.find((p) => p.key === 'flood_risk');
    return {
      content: `Based on ${village.name}'s 90-day predictive models, water shortage deficit risk is projected to reach ${waterPred?.forecastValue ?? '31.2%'} (highest exposure in Ward 4 · North Ridge), while flood risk stands at ${floodPred?.forecastValue ?? '62 / 100'} along the Riverbend Ward 5 culvert corridor. Prioritizing the Ward 4 overhead water tank and desilting 2.4 km of East Canal storm drains will mitigate both hazards before peak season.`,
      metrics: [
        { label: 'Water Deficit Forecast', value: waterPred?.forecastValue ?? '31.2%', note: '91% confidence' },
        { label: 'Flood Risk Index', value: floodPred?.forecastValue ?? '62 / 100', note: 'Ward 5 exposed' },
        { label: 'Water Sector Health', value: `${village.sectors[0].score}/100` },
      ],
      suggestedActions: [
        { label: 'Open AI Predictions', page: 'predictions' },
        { label: 'View Disaster Readiness', page: 'disasters' },
      ],
    };
  }

  if (q.includes('simulat') || q.includes('what-if') || q.includes('road') || q.includes('solar') || q.includes('hospital') || q.includes('budget')) {
    return {
      content: `Your active What-If scenario models ${simParams.roadsKm} km of paved roads, ${simParams.waterTanks} overhead water tank(s), ${simParams.solarPlants} solar microgrid plant(s), and ${simParams.hospitals} health center expansion(s). Total estimated capital cost is ₹${sim.totalCostLakhs} Lakhs, raising the composite Village Health Score from ${village.overallHealthScore} to ${sim.projectedHealthScore}/100 (+${sim.scoreGain} pts) and offsetting ${sim.annualCo2SavedTons} tCO2e per year.`,
      metrics: [
        { label: 'Projected Score', value: `${sim.projectedHealthScore}/100`, note: `+${sim.scoreGain} pts` },
        { label: 'Capital Required', value: `₹${sim.totalCostLakhs}L`, note: `Payback ${sim.roiYears || '—'} yrs` },
        { label: 'Residents Served', value: sim.beneficiaries.toLocaleString() },
      ],
      suggestedActions: [
        { label: 'Adjust What-If Simulator', page: 'simulation' },
        { label: 'Inspect in 3D Twin', page: 'digital-twin' },
      ],
    };
  }

  if (q.includes('complaint') || q.includes('grievance') || q.includes('leak') || q.includes('garbage') || q.includes('light')) {
    const topIssue = openComplaints[0];
    return {
      content: `There are currently ${openComplaints.length} active citizen complaints in ${village.name} (${criticalCount} marked Critical). ${
        topIssue
          ? `The highest urgency ticket is ${topIssue.id} (${topIssue.category}) in ${topIssue.ward}: "${topIssue.title}" with ${topIssue.slaRemainingHours} hours remaining on its SLA.`
          : 'All reported citizen complaints have been resolved.'
      }`,
      metrics: [
        { label: 'Active Complaints', value: String(openComplaints.length) },
        { label: 'Critical Priority', value: String(criticalCount) },
        { label: 'Median Resolution', value: '18.4 hrs', note: '91.6% SLA met' },
      ],
      suggestedActions: [
        { label: 'Manage Complaints', page: 'complaints' },
        { label: 'Locate on GIS Map', page: 'map' },
      ],
    };
  }

  if (q.includes('sustain') || q.includes('carbon') || q.includes('net-zero') || q.includes('green') || q.includes('renew')) {
    const s = village.sustainability;
    return {
      content: `${village.name} holds a Carbon Sustainability Score of ${s.carbonScore}/100. Local renewable generation supplies ${s.renewableSharePercent}% of village energy (${s.solarCapacityKw} kW solar + biogas), while ${s.greenCoverPercent}% canopy cover (${s.greenCoverHectares} ha) sequesters ${s.sequesteredTons} tCO2e annually—leaving a net gap of ${s.netEmissionsTons - s.sequesteredTons} tCO2e toward the 2030 Net-Zero target.`,
      metrics: [
        { label: 'Carbon Score', value: `${s.carbonScore}/100` },
        { label: 'Renewable Share', value: `${s.renewableSharePercent}%` },
        { label: 'Green Cover', value: `${s.greenCoverPercent}%`, note: `${s.greenCoverHectares} ha` },
      ],
      suggestedActions: [{ label: 'Open Sustainability Ledger', page: 'sustainability' }],
    };
  }

  // Default comprehensive village health overview
  return {
    content: `${village.name} currently records an overall Village Health Score of ${village.overallHealthScore}/100 (+${village.overallDelta} YoY) across ${village.population.toLocaleString()} residents. ${strongestSector.label} leads at ${strongestSector.score}/100, while ${weakestSector.label} (${weakestSector.score}/100) represents the top opportunity for capital uplift—particularly in Ward 4 (North Ridge).`,
    metrics: [
      { label: 'Overall Health Score', value: `${village.overallHealthScore}/100`, note: `+${village.overallDelta} YoY` },
      { label: 'Strongest Sector', value: `${strongestSector.score}/100`, note: strongestSector.label },
      { label: 'Priority Gap', value: `${weakestSector.score}/100`, note: weakestSector.label },
    ],
    suggestedActions: [
      { label: 'Open Village Dashboard', page: 'dashboard' },
      { label: 'View AI Development Planner', page: 'planner' },
    ],
  };
}

export const ChatbotPage: React.FC<ChatbotPageProps> = ({
  village,
  complaints,
  simParams,
  onNavigate,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'welcome-1',
      role: 'assistant',
      timestamp: 'Now',
      content: `Hello. I am the VillageVerse AI Governance Assistant for ${village.name}. Ask me about ward health scores, water or flood forecasts, active citizen complaints, sustainability metrics, or your What-If infrastructure simulations.`,
      metrics: [
        { label: 'Village Health', value: `${village.overallHealthScore}/100` },
        { label: 'Active Complaints', value: String(complaints.filter((c) => c.status !== 'Resolved').length) },
        { label: 'Carbon Score', value: `${village.sustainability.carbonScore}/100` },
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isTyping) return;

    const nowLabel = new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: nowLabel,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    window.setTimeout(() => {
      const reply = generateGroundedReply(trimmed, village, complaints, simParams);
      const aiMsg: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        ...reply,
      };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 450);
  };

  const handleReset = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        timestamp: 'Now',
        content: `Conversation reset. Ready to analyze ${village.name} across health scores, predictions, complaints, and infrastructure plans.`,
      },
    ]);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Village Governance Assistant"
        subtitle="Natural-language decision support grounded in live village health metrics, predictive forecasts, complaint queues, and simulation state."
        meta={[village.name, 'Interactive Frontend Prototype', 'Backend LLM Ready']}
        actions={
          <button
            onClick={handleReset}
            className="px-3.5 py-2 text-xs font-medium text-[#C5D4E8] bg-[#0C172B] hover:bg-[#132442] border border-[#1E3354] rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Session</span>
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Suggested Queries Panel */}
        <div className="lg:col-span-4 rounded-xl bg-[#0C172B] border border-[#1B2E4B] p-5 space-y-4">
          <div>
            <h2 className="font-display text-sm font-semibold text-[#F4F8FF]">
              Suggested Governance Queries
            </h2>
            <p className="text-xs text-[#8BA3C7] mt-0.5">
              Select a prompt to inspect live twin metrics
            </p>
          </div>
          <div className="space-y-2">
            {SUGGESTED_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => sendMessage(prompt)}
                className="w-full text-left px-3.5 py-2.5 rounded-lg bg-[#091324] hover:bg-[#11223E] border border-[#172844] hover:border-cyan-500/40 text-xs text-[#D6E2F3] transition-colors leading-relaxed"
              >
                {prompt}
              </button>
            ))}
          </div>

          <div className="pt-3 border-t border-[#172844] text-[11px] text-[#7890B2] leading-relaxed">
            Connected to live frontend village state (village switch, logged complaints, and What-If sliders). Ready to bind to backend Gemini API endpoints in Phase 2.
          </div>
        </div>

        {/* Right Chat Thread */}
        <div className="lg:col-span-8 rounded-xl bg-[#0C172B] border border-[#1B2E4B] flex flex-col h-[580px]">
          {/* Messages Scroll Viewport */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div className="flex items-center gap-2 text-[11px] text-[#7890B2] mb-1 px-1">
                  <span>
                    {msg.role === 'user' ? 'Panchayat Officer' : 'VillageVerse AI'}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="font-mono">{msg.timestamp}</span>
                </div>

                <div
                  className={`max-w-[88%] rounded-xl px-4 py-3 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-cyan-500/15 border border-cyan-400/35 text-[#F4F8FF]'
                      : 'bg-[#091324] border border-[#192B47] text-[#D6E2F3]'
                  }`}
                >
                  <p>{msg.content}</p>

                  {msg.metrics && msg.metrics.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-[#172844] grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {msg.metrics.map((m) => (
                        <div key={m.label}>
                          <div className="text-[11px] text-[#7890B2]">
                            {m.label}
                          </div>
                          <div className="font-mono text-sm font-semibold text-cyan-300 tabular-nums">
                            {m.value}
                          </div>
                          {m.note && (
                            <div className="text-[10px] text-[#8BA3C7]">
                              {m.note}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-[#172844] flex flex-wrap gap-2">
                      {msg.suggestedActions.map((act) => (
                        <button
                          key={act.label}
                          onClick={() => onNavigate(act.page)}
                          className="px-3 py-1.5 text-xs font-medium text-cyan-300 bg-[#0F1F38] hover:bg-[#152B4D] border border-[#223B63] rounded-md inline-flex items-center gap-1.5 transition-colors"
                        >
                          <span>{act.label}</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="text-xs text-[#8BA3C7] px-1">
                Analyzing village digital twin data...
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="p-4 border-t border-[#172844] flex items-center gap-3"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask about ${village.name}'s water, crops, complaints, or budget...`}
              className="flex-1 bg-[#071020] border border-[#1E3354] rounded-lg px-4 py-2.5 text-sm text-[#F1F5FB] placeholder-[#6E86AA] focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="px-4 py-2.5 text-xs font-semibold text-[#04101E] bg-cyan-400 hover:bg-cyan-300 disabled:opacity-40 rounded-lg transition-colors inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
