// ─────────────────────────────────────────────────────────────────────────────
// GEO Playbook — single source of truth derived from the source documents
// (7-Level Playbook, 14 Ways To Get Cited, GEO Explained, ACP, LinkedIn SEO)
// ─────────────────────────────────────────────────────────────────────────────

export type LevelKey =
  | "audit"
  | "foundations"
  | "optimise"
  | "authority"
  | "formats"
  | "entity"
  | "monitor";

export interface PlaybookLevel {
  key: LevelKey;
  number: number;
  title: string;
  goal: string;
  mindset: string;
  summary: string;
  /** Route that lets the user "do" this level */
  route: string;
  /** Checklist items — completion stored in localStorage(`geo-checklist`) */
  checklist: { id: string; label: string }[];
}

export const LEVELS: PlaybookLevel[] = [
  {
    key: "audit",
    number: 1,
    title: "Audit",
    goal: "Discover where you rank across ChatGPT, Perplexity, Claude & Gemini.",
    mindset: "Be curious.",
    summary:
      "Test where you appear (or don't) across the major AI engines. Identify which brands are mentioned regularly and ask AI to explain itself.",
    route: "/dashboard/scan",
    checklist: [
      { id: "audit.scan-chatgpt", label: "Run a visibility scan in ChatGPT" },
      { id: "audit.scan-perplexity", label: "Run a visibility scan in Perplexity" },
      { id: "audit.scan-gemini", label: "Run a visibility scan in Gemini / Google AI" },
      { id: "audit.scan-claude", label: "Run a visibility scan in Claude" },
      { id: "audit.competitors", label: "Identify 3 competitor brands AI mentions" },
    ],
  },
  {
    key: "foundations",
    number: 2,
    title: "Foundations",
    goal: "Make your site easy for AI to crawl & trust.",
    mindset: "Act as an engineer — this part isn't sexy but absolutely vital.",
    summary:
      "Implement schema markup, clean up your sitemap, optimise robots.txt and verify crawlability. If AI can't crawl your site, you don't exist in AI search.",
    route: "/dashboard/foundations",
    checklist: [
      { id: "foundations.robots", label: "robots.txt allows OAI-SearchBot, GPTBot, PerplexityBot, ClaudeBot" },
      { id: "foundations.llmstxt", label: "Publish llms.txt declaring key URLs" },
      { id: "foundations.sitemap", label: "Submit XML sitemap (refreshed)" },
      { id: "foundations.schema-org", label: "Organization schema published site-wide" },
      { id: "foundations.schema-faq", label: "FAQ schema on at least one page" },
      { id: "foundations.ssr", label: "Content rendered server-side (no JS-only)" },
      { id: "foundations.alt", label: "All images have descriptive alt text" },
    ],
  },
  {
    key: "optimise",
    number: 3,
    title: "Optimise",
    goal: "Turn existing pages into AI-friendly answers.",
    mindset: "Think about how real people ask questions.",
    summary:
      "Add FAQ sections, conversational headers, and natural language that matches how people ask AI questions. Don't start from scratch — make what you already have answer better.",
    route: "/dashboard/aeo-optimizer",
    checklist: [
      { id: "optimise.headers-questions", label: "H2/H3 headers reformatted as real questions" },
      { id: "optimise.faqs", label: "3-5 FAQs added per key page" },
      { id: "optimise.summary-block", label: "Summary block / TL;DR at top of every page" },
      { id: "optimise.short-paras", label: "Paragraphs under 60 words for AI extraction" },
      { id: "optimise.bofu-pages", label: "BOFU pages built (alternatives, vs, pricing, comparisons)" },
    ],
  },
  {
    key: "authority",
    number: 4,
    title: "Authority",
    goal: "Become a valuable source AI engines reference.",
    mindset: "Build long-term authority with original data.",
    summary:
      "Create original research, proprietary data, charts and case studies. Get cited across multiple platforms — this is the slowest level but compounds the most.",
    route: "/dashboard/footprint",
    checklist: [
      { id: "authority.unique-data", label: "At least one piece of proprietary data / original research published" },
      { id: "authority.case-study", label: "Customer case study with measurable outcomes" },
      { id: "authority.eeat-experience", label: "E-E-A-T: Experience signals on key pages" },
      { id: "authority.eeat-expertise", label: "E-E-A-T: Expertise / author credentials visible" },
      { id: "authority.eeat-authority", label: "E-E-A-T: Authority — awards, mentions, citations" },
      { id: "authority.eeat-trust", label: "E-E-A-T: Trust — security, certifications, transparency" },
    ],
  },
  {
    key: "formats",
    number: 5,
    title: "Formats",
    goal: "Produce quotable content AI engines can extract.",
    mindset: "Teach like you're training a smart intern.",
    summary:
      "Create AI-optimised content using Q&A formats, structured data, comparison tables and step-by-step howtos. Repurpose one piece into 8 signals.",
    route: "/dashboard/content-studio",
    checklist: [
      { id: "formats.qa", label: "Published a Q&A / FAQ-style article" },
      { id: "formats.howto", label: "Published a How-To with HowTo schema" },
      { id: "formats.comparison", label: "Published a comparison / vs / alternatives page" },
      { id: "formats.video", label: "Published a YouTube tutorial (75% non-branded citations)" },
      { id: "formats.repurposed", label: "Repurposed 1 piece into ≥4 of the 8 signal channels" },
    ],
  },
  {
    key: "entity",
    number: 6,
    title: "Entity Signals",
    goal: "Clearly link your brand to your topic across the web.",
    mindset: "Focus on fewer, stronger signals that make a difference.",
    summary:
      "Secure citations in news, industry publications, LinkedIn, Reddit, Wikipedia. By this stage you're not just a website — you're an entity AI must recognise.",
    route: "/dashboard/linkedin",
    checklist: [
      { id: "entity.linkedin", label: "LinkedIn profile fully optimized for AEO (7-step)" },
      { id: "entity.reddit", label: "Active presence on Reddit (#1 cited domain at 11.29%)" },
      { id: "entity.wikipedia", label: "Wikipedia entry / mention exists" },
      { id: "entity.youtube", label: "YouTube channel with tutorial content" },
      { id: "entity.reviews", label: "Active G2 / Trustpilot / Capterra profiles" },
      { id: "entity.news", label: "At least one news / industry publication mention" },
    ],
  },
  {
    key: "monitor",
    number: 7,
    title: "Monitor & Scale",
    goal: "Build a feedback loop to keep improving.",
    mindset: "Iterate relentlessly. Act like a scientist.",
    summary:
      "Identify which content gets referenced, double down on what works, and continuously optimise based on visibility data. Refresh top content quarterly for AI training cycles.",
    route: "/dashboard/citations",
    checklist: [
      { id: "monitor.weekly-scan", label: "Weekly visibility scan automated" },
      { id: "monitor.citation-tracker", label: "Citation tracking enabled across 4+ engines" },
      { id: "monitor.refresh-90", label: "Top 5 pages refreshed within last 90 days" },
      { id: "monitor.competitor-track", label: "Competitor share-of-voice monitored" },
      { id: "monitor.kpi-report", label: "Monthly GEO performance report exported" },
    ],
  },
];

// ─── 14 Ways To Get Cited By AI ──────────────────────────────────────────────
export interface CitationTactic {
  n: number;
  title: string;
  why: string;
  /** Optional supporting stat from the documents */
  stat?: string;
}

export const CITATION_TACTICS: CitationTactic[] = [
  { n: 1, title: "Publish Unique Data", why: "AI prioritises original statistics & proprietary research. Refresh regularly." },
  { n: 2, title: "Frame Titles Clearly", why: "Start titles with How / Why / Top X to match AI interpretation patterns." },
  { n: 3, title: "Generate External Mentions", why: "85% of brand citations originate from third-party sources.", stat: "85% from 3rd parties" },
  { n: 4, title: "Add Structured Data", why: "FAQ + HowTo schema boosts citation likelihood by 13%.", stat: "+13% citations" },
  { n: 5, title: "Expand Platform Coverage", why: "Perplexity references UGC in 91% of responses; Gemini only 7%.", stat: "91% UGC on Perplexity" },
  { n: 6, title: "Optimise for Readability", why: "Well-structured content is 49% more likely to appear in AI answers.", stat: "+49% AI answers" },
  { n: 7, title: "Build Internal Link Networks", why: "AI traces contextual anchors to assess topic expertise depth." },
  { n: 8, title: "Update Content Consistently", why: "Pages refreshed within 90 days are cited 3× more frequently.", stat: "3× citations < 90 days" },
  { n: 9, title: "Create Educational Videos", why: "YouTube drives 75% of citations for non-branded searches.", stat: "75% non-branded via YouTube" },
  { n: 10, title: "Maintain Consistent Messaging", why: "Aligned tone & data across touchpoints strengthen entity recognition." },
  { n: 11, title: "Format Headers as Questions", why: "Question headers double extraction & citation chances.", stat: "2× extraction rate" },
  { n: 12, title: "Keep Reviews Current", why: "G2 & Trustpilot influence AI trust algorithms." },
  { n: 13, title: "Aim for Citations + Mentions", why: "Earning both has 40% higher recurring visibility.", stat: "+40% recurring" },
  { n: 14, title: "Build UGC Presence", why: "YouTube + LinkedIn account for 48% of AI citations.", stat: "48% of citations" },
];

// ─── Citation Domain Leaderboard (Source: SEMrush via GEO Screenshots doc) ──
export const CITATION_DOMAINS = [
  { domain: "reddit.com", pct: 11.29, kind: "Community" },
  { domain: "linkedin.com", pct: 11.03, kind: "Professional" },
  { domain: "wikipedia.org", pct: 9.53, kind: "Reference" },
  { domain: "youtube.com", pct: 8.77, kind: "Video" },
  { domain: "medium.com", pct: 5.83, kind: "Publishing" },
  { domain: "facebook.com", pct: 5.55, kind: "Social" },
  { domain: "nih.gov", pct: 4.58, kind: "Authority" },
  { domain: "instagram.com", pct: 3.7, kind: "Social" },
  { domain: "forbes.com", pct: 3.43, kind: "Press" },
  { domain: "google.com", pct: 3.18, kind: "Search" },
  { domain: "quora.com", pct: 2.82, kind: "Community" },
  { domain: "sciencedirect.com", pct: 2.14, kind: "Authority" },
  { domain: "researchgate.net", pct: 2.13, kind: "Authority" },
  { domain: "yahoo.com", pct: 1.96, kind: "Press" },
  { domain: "businesswire.com", pct: 1.93, kind: "Press" },
  { domain: "amazon.com", pct: 1.8, kind: "Commerce" },
];

// ─── AEO Repurposing Map: 1 post → 8 signals ────────────────────────────────
export const REPURPOSE_SIGNALS = [
  { id: "forum", title: "Forum Seeding", format: "Reddit / Quora reply", impact: "UGC signals + off-site mentions", icon: "💬" },
  { id: "short", title: "Short Video", format: "60s TikTok / YouTube Short", impact: "Discoverability + entity recognition", icon: "🎬" },
  { id: "faq", title: "FAQ Expansion", format: "3-5 FAQs on-page", impact: "Surfaces brand in prompts", icon: "❓" },
  { id: "linkedin", title: "LinkedIn Post", format: "Carousel / text post", impact: "Co-mentions + authority perception", icon: "💼" },
  { id: "outreach", title: "Citation Outreach", format: "Pitch to blogs / press", impact: "3rd-party validation for AI citations", icon: "📰" },
  { id: "visual", title: "Visual Breakdown", format: "Infographic / diagram", impact: "Shareable backlink magnet", icon: "📊" },
  { id: "entity", title: "Entity Linking", format: "Internal + external links to entities", impact: "Knowledge Graph alignment", icon: "🔗" },
  { id: "audio", title: "Audio Clip", format: "2-3 min explainer + schema", impact: "Inclusion in AI answers", icon: "🎙️" },
];

// ─── 30 AI Search Content Types ─────────────────────────────────────────────
export const CONTENT_TYPES = [
  { type: "Long-form blog", difficulty: "med", value: "high" },
  { type: "Comparison page (X vs Y)", difficulty: "low", value: "high" },
  { type: "Alternatives page", difficulty: "low", value: "high" },
  { type: "Pricing page", difficulty: "low", value: "high" },
  { type: "FAQ hub", difficulty: "low", value: "high" },
  { type: "How-To tutorial", difficulty: "med", value: "high" },
  { type: "Glossary / dictionary", difficulty: "low", value: "med" },
  { type: "Original research / report", difficulty: "high", value: "high" },
  { type: "Industry benchmark", difficulty: "high", value: "high" },
  { type: "Case study", difficulty: "med", value: "high" },
  { type: "Customer story", difficulty: "med", value: "med" },
  { type: "Tools / calculators", difficulty: "high", value: "high" },
  { type: "Templates / checklists", difficulty: "low", value: "med" },
  { type: "Statistics roundup", difficulty: "med", value: "high" },
  { type: "Expert interview", difficulty: "med", value: "med" },
  { type: "Podcast appearance", difficulty: "med", value: "med" },
  { type: "YouTube tutorial", difficulty: "med", value: "high" },
  { type: "Short-form video", difficulty: "low", value: "med" },
  { type: "LinkedIn carousel", difficulty: "low", value: "high" },
  { type: "Twitter / X thread", difficulty: "low", value: "low" },
  { type: "Reddit answer", difficulty: "low", value: "high" },
  { type: "Quora answer", difficulty: "low", value: "med" },
  { type: "Wikipedia entry", difficulty: "high", value: "high" },
  { type: "Press release", difficulty: "med", value: "med" },
  { type: "Guest post", difficulty: "med", value: "med" },
  { type: "Slideshare deck", difficulty: "low", value: "low" },
  { type: "Audio clip / podcast snippet", difficulty: "low", value: "low" },
  { type: "Infographic", difficulty: "med", value: "med" },
  { type: "Newsletter feature", difficulty: "med", value: "med" },
  { type: "G2 / Trustpilot review collection", difficulty: "low", value: "high" },
] as const;

// ─── 5 Pillars of GEO ────────────────────────────────────────────────────────
export const PILLARS = [
  { id: "technical", name: "Technical", points: ["Schema (FAQ, How-To, Product)", "Server-side rendering", "Image alt text"], why: "AI can't rank what it can't crawl." },
  { id: "onpage", name: "On-Page", points: ["BOFU landing pages", "Alternatives & vs pages", "Summaries + FAQs"], why: "AI traffic is high-intent — the page must convert." },
  { id: "intent", name: "Intent", points: ["Map keywords to intent", "Cluster by topic", "Prioritise high-traffic gains"], why: "Relevance beats volume." },
  { id: "offpage", name: "Off-Page", points: ["Omnichannel content", "PR + linkable assets", "Optimize video, audio, images"], why: "Google ranks ecosystems, not isolated posts." },
  { id: "ai-strategy", name: "AI Strategy", points: ["Learn how LLMs interpret content", "Understand each platform", "Optimize for discovery"], why: "If AI can't access it, it won't recommend it." },
];

// ─── 5-Stage SEO Content Funnel (with 2026 updates) ─────────────────────────
export const FUNNEL_STAGES = [
  { stage: "ACCESS", goal: "Make content visible to crawlers + LLMs", how: "Schema-rich pages, crawlable blogs, long-tail queries." },
  { stage: "AUTHORITY", goal: "Build trust humans + AIs recognise", how: "Expert blogs with lived experience, original insights, proof." },
  { stage: "VISIBILITY", goal: "Optimize for retrieval + citations", how: "FAQs, explainers, comparisons, lists, tables." },
  { stage: "ENGAGEMENT", goal: "Turn visibility into high-intent signals", how: "Buyer guides, pricing, calculators, quizzes." },
  { stage: "MOMENTUM", goal: "Keep content cited, refreshed & remembered", how: "Refresh quarterly, public sources, track prompts." },
];

// ─── ACP / Agentic Commerce ──────────────────────────────────────────────────
export const ACP_BOTS = [
  { ua: "OAI-SearchBot", source: "OpenAI / ChatGPT" },
  { ua: "GPTBot", source: "OpenAI training" },
  { ua: "PerplexityBot", source: "Perplexity" },
  { ua: "ClaudeBot", source: "Anthropic / Claude" },
  { ua: "Google-Extended", source: "Google AI / Gemini" },
  { ua: "anthropic-ai", source: "Anthropic legacy" },
  { ua: "CCBot", source: "Common Crawl (training)" },
];
