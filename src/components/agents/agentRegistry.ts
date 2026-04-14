import type { StarMood } from "@/components/StarAgent";

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
  },
};

export const agentList = Object.values(agents);

export function getAgentForRoute(pathname: string): AgentConfig {
  const match = agentList.find(a => a.href === pathname);
  return match || agents.nova;
}
