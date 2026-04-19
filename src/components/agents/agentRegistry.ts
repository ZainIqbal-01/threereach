import type { StarMood } from "@/components/StarAgent";

export interface AgentMission {
  id: string;
  label: string;
  description: string;
  durationSec: number;
}

export interface AgentConfig {
  id: string;
  name: string;
  role: string;
  description: string;
  emoji: string;
  defaultMood: StarMood;
  activeMood: StarMood;
  accentHue: number; // HSL hue for unique color
  module: string;
  href: string;
  statusMessages: {
    idle: string;
    working: string;
    done: string;
  };
  missions: AgentMission[];
}

export const agents: Record<string, AgentConfig> = {
  nova: {
    id: "nova",
    name: "Nova",
    role: "Command Center",
    description: "Your AI operations chief — coordinates all agents and monitors overall visibility health.",
    emoji: "⚡",
    defaultMood: "happy",
    activeMood: "excited",
    accentHue: 217,
    module: "Overview",
    href: "/dashboard",
    statusMessages: {
      idle: "All systems nominal ✨",
      working: "Coordinating agents...",
      done: "Dashboard synced!",
    },
    missions: [
      { id: "nova-sync", label: "Sync all dashboards", description: "Refresh KPIs across modules", durationSec: 18 },
      { id: "nova-health", label: "Run health check", description: "Audit every agent's status", durationSec: 24 },
      { id: "nova-brief", label: "Generate daily brief", description: "Compile executive summary", durationSec: 30 },
    ],
  },
  scout: {
    id: "scout",
    name: "Scout",
    role: "Recon Specialist",
    description: "Infiltrates AI engines to find where and how your brand appears in search results.",
    emoji: "🔍",
    defaultMood: "scanning",
    activeMood: "scanning",
    accentHue: 187,
    module: "AI Visibility Scan",
    href: "/dashboard/scan",
    statusMessages: {
      idle: "Monitoring AI engines...",
      working: "Scanning all engines...",
      done: "Scan complete!",
    },
    missions: [
      { id: "scout-chatgpt", label: "Scan ChatGPT", description: "Probe top 25 prompts", durationSec: 22 },
      { id: "scout-all", label: "Scan all engines", description: "Full sweep of 5 AI engines", durationSec: 45 },
      { id: "scout-deep", label: "Deep crawl", description: "Long-tail prompt expansion", durationSec: 60 },
    ],
  },
  oracle: {
    id: "oracle",
    name: "Oracle",
    role: "Intelligence Analyst",
    description: "Deep-analyzes your brand's perception, sentiment, and competitive positioning across AI platforms.",
    emoji: "🧠",
    defaultMood: "thinking",
    activeMood: "scanning",
    accentHue: 270,
    module: "Brand Intelligence",
    href: "/dashboard/brand-intelligence",
    statusMessages: {
      idle: "Analyzing patterns...",
      working: "Deep analysis in progress...",
      done: "Intelligence report ready!",
    },
    missions: [
      { id: "oracle-sentiment", label: "Sentiment sweep", description: "Score brand tone across engines", durationSec: 28 },
      { id: "oracle-compete", label: "Competitor benchmark", description: "Side-by-side positioning", durationSec: 40 },
      { id: "oracle-narrative", label: "Narrative audit", description: "Detect drifting brand stories", durationSec: 35 },
    ],
  },
  spark: {
    id: "spark",
    name: "Spark",
    role: "Content Creator",
    description: "Generates AI-optimized content for every platform to maximize your brand's reach and visibility.",
    emoji: "✨",
    defaultMood: "excited",
    activeMood: "excited",
    accentHue: 38,
    module: "Distribution",
    href: "/dashboard/distribution",
    statusMessages: {
      idle: "Ready to create 🔥",
      working: "Generating content...",
      done: "Content published!",
    },
    missions: [
      { id: "spark-linkedin", label: "Generate 3 LinkedIn posts", description: "Thought-leadership angle", durationSec: 25 },
      { id: "spark-reddit", label: "Draft Reddit answers", description: "Helpful, non-promo replies", durationSec: 32 },
      { id: "spark-quora", label: "Answer Quora questions", description: "Brand-aligned long-form", durationSec: 38 },
    ],
  },
  atlas: {
    id: "atlas",
    name: "Atlas",
    role: "Architect",
    description: "Builds and maintains your AI-discoverable digital footprint — profiles, knowledge bases, and schemas.",
    emoji: "🏗️",
    defaultMood: "thinking",
    activeMood: "scanning",
    accentHue: 142,
    module: "Build Footprint",
    href: "/dashboard/footprint",
    statusMessages: {
      idle: "Building foundations...",
      working: "Constructing assets...",
      done: "Footprint updated!",
    },
    missions: [
      { id: "atlas-schema", label: "Update schema markup", description: "JSON-LD across pages", durationSec: 20 },
      { id: "atlas-profiles", label: "Refresh profile syndication", description: "Sync 12 directories", durationSec: 36 },
      { id: "atlas-kb", label: "Expand knowledge base", description: "Add 5 entity pages", durationSec: 48 },
    ],
  },
  sentinel: {
    id: "sentinel",
    name: "Sentinel",
    role: "Guardian",
    description: "Monitors and verifies every AI mention of your brand — captures proof and tracks authenticity.",
    emoji: "🛡️",
    defaultMood: "superhero",
    activeMood: "superhero",
    accentHue: 0,
    module: "Proof & Tracking",
    href: "/dashboard/proof",
    statusMessages: {
      idle: "Guarding your mentions...",
      working: "Verifying proofs...",
      done: "All proofs verified!",
    },
    missions: [
      { id: "sentinel-verify", label: "Verify new mentions", description: "Screenshot + hash proofs", durationSec: 26 },
      { id: "sentinel-monitor", label: "Run anomaly check", description: "Flag suspicious citations", durationSec: 30 },
      { id: "sentinel-archive", label: "Archive weekly proofs", description: "Push to immutable store", durationSec: 22 },
    ],
  },
  sage: {
    id: "sage",
    name: "Sage",
    role: "Report Analyst",
    description: "Compiles visibility data into actionable reports and insights for stakeholders.",
    emoji: "📊",
    defaultMood: "thinking",
    activeMood: "scanning",
    accentHue: 200,
    module: "Reports",
    href: "/dashboard/reports",
    statusMessages: {
      idle: "Preparing insights...",
      working: "Compiling report...",
      done: "Report generated!",
    },
    missions: [
      { id: "sage-weekly", label: "Build weekly report", description: "Stakeholder-ready PDF", durationSec: 34 },
      { id: "sage-exec", label: "Generate exec summary", description: "1-page TL;DR", durationSec: 20 },
      { id: "sage-trend", label: "Forecast trend deltas", description: "30-day projection", durationSec: 42 },
    ],
  },
};

export const agentList = Object.values(agents);

export function getAgentForRoute(pathname: string): AgentConfig {
  const match = agentList.find(a => a.href === pathname);
  return match || agents.nova;
}
