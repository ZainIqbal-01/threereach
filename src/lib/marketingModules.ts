// Central registry for the Complete Marketing OS.
// Each module renders inside the Workspace Preview tab.
import {
  Users, Palette, Plug, Search, BarChart3, Target, Calendar,
  PenSquare, Image as ImageIcon, FileStack, Globe, MapPin,
  TrendingUp, Megaphone, Send, Mail, Share2, Layers,
  MousePointerClick, MessageCircle, PieChart, GitBranch,
  Workflow, ShoppingCart, Sparkles, Bot, ListChecks, Shield,
  ShieldCheck, Database, LayoutGrid, GitPullRequest, Footprints,
  CreditCard, Settings as SettingsIcon, Building2, FileBarChart2,
  Zap, Star, MessageSquare, LineChart, type LucideIcon,
} from "lucide-react";

export type ModuleId =
  // Existing (live) modules
  | "overview" | "scan" | "brand" | "optimize" | "distribution"
  | "agents" | "footprint" | "proof" | "reports" | "settings" | "billing"
  // 1. Foundation
  | "team" | "brand-assets" | "integrations"
  // 2. Research
  | "market-research" | "keyword-research" | "competitor-intel" | "customer-research"
  // 3. Planning
  | "campaigns" | "content-calendar" | "personas"
  // 4. Content
  | "ai-content" | "seo-content" | "visual-content" | "content-library"
  // 5. SEO
  | "tech-seo" | "onpage-seo" | "offpage-seo" | "local-seo" | "rank-tracking"
  // 6. Paid Ads
  | "google-ads" | "meta-ads" | "linkedin-ads" | "tiktok-ads" | "ad-intel"
  // 7. Social
  | "social-publishing" | "social-listening" | "social-inbox" | "social-analytics" | "influencers"
  // 8. Email
  | "email-builder" | "email-lists" | "email-automation" | "email-deliverability" | "email-analytics"
  // 9. Distribution
  | "blog-publishing" | "syndication" | "press-release" | "podcasts"
  // 10. Conversion
  | "landing-pages" | "forms" | "popups" | "live-chat" | "webinars"
  // 11. Analytics
  | "web-analytics" | "attribution" | "dashboards" | "cross-channel"
  // 12. CRM
  | "contacts" | "pipeline" | "lead-scoring" | "lead-routing"
  // 13. Automation
  | "workflows" | "triggers"
  // 14. E-commerce
  | "product-feeds" | "abandoned-cart" | "ecom-segments" | "reviews"
  // 15. AI Layer
  | "ai-studio" | "automation-rules"
  // 16. Collaboration
  | "tasks" | "approvals" | "team-chat" | "client-portal"
  // 17. Compliance
  | "privacy" | "brand-safety" | "access-control";

export interface MarketingFeature {
  title: string;
  description: string;
  status?: "live" | "beta" | "soon" | "connect";
}

export interface MarketingKpi {
  label: string;
  value: string;
  delta?: string;
}

export interface MarketingModule {
  id: ModuleId;
  label: string;
  short?: string;
  icon: LucideIcon;
  category: string;
  tagline: string;
  description: string;
  features: MarketingFeature[];
  kpis?: MarketingKpi[];
  integrations?: string[];
  builtin?: boolean; // routes to an existing live page
}

export interface MarketingCategory {
  id: string;
  label: string;
  icon: LucideIcon;
  modules: ModuleId[];
}

const m = (x: MarketingModule) => x;

export const MARKETING_MODULES: Record<ModuleId, MarketingModule> = {
  // ---- Live, existing modules ----
  overview: m({ id: "overview", label: "Overview", icon: LayoutGrid, category: "core", tagline: "Mission control", description: "Your visibility score, signals, and next best actions.", features: [], builtin: true }),
  scan: m({ id: "scan", label: "AI Scan", icon: Search, category: "core", tagline: "AI visibility scan", description: "Test how ChatGPT, Gemini and Perplexity answer questions about your brand.", features: [], builtin: true }),
  brand: m({ id: "brand", label: "Brand Intel", icon: Sparkles, category: "core", tagline: "Brand intelligence", description: "Immersive 3-phase brand presence analysis.", features: [], builtin: true }),
  optimize: m({ id: "optimize", label: "Optimize Code", icon: GitPullRequest, category: "core", tagline: "GitHub optimizer", description: "Open a PR that ships SEO, GEO, sitemap and perf wins.", features: [], builtin: true }),
  distribution: m({ id: "distribution", label: "Distribution", icon: Megaphone, category: "core", tagline: "AI-optimized posts", description: "Generate and post content tuned for answer engines.", features: [], builtin: true }),
  agents: m({ id: "agents", label: "Agents", icon: Bot, category: "core", tagline: "7 AI agents", description: "Schedule and orchestrate the agent fleet.", features: [], builtin: true }),
  footprint: m({ id: "footprint", label: "Footprint", icon: Footprints, category: "core", tagline: "GEO footprint", description: "Schema, llms.txt, geo landing pages.", features: [], builtin: true }),
  proof: m({ id: "proof", label: "Proof", icon: ShieldCheck, category: "core", tagline: "Citation tracking", description: "Where AI engines cite you.", features: [], builtin: true }),
  reports: m({ id: "reports", label: "Reports", icon: FileBarChart2, category: "core", tagline: "Reports", description: "Exportable cross-channel reports.", features: [], builtin: true }),
  settings: m({ id: "settings", label: "Settings", icon: SettingsIcon, category: "core", tagline: "Workspace settings", description: "Profile, business and preferences.", features: [], builtin: true }),
  billing: m({ id: "billing", label: "Billing", icon: CreditCard, category: "core", tagline: "Plans & usage", description: "Subscription and usage.", features: [], builtin: true }),

  // ---- 1. Foundation ----
  team: m({ id: "team", label: "Team & Roles", icon: Users, category: "foundation", tagline: "Multi-user accounts",
    description: "Invite teammates, assign roles, manage workspaces and audit trails.",
    kpis: [{ label: "Members", value: "1" }, { label: "Workspaces", value: "1" }, { label: "Audit events", value: "248" }],
    features: [
      { title: "Role-based permissions", description: "Owner, Admin, Editor, Viewer." },
      { title: "Workspaces", description: "Switch between client / agency accounts.", status: "soon" },
      { title: "Audit trail", description: "Every action timestamped." },
      { title: "SSO", description: "SAML & OIDC.", status: "soon" },
    ] }),
  "brand-assets": m({ id: "brand-assets", label: "Brand Assets", icon: Palette, category: "foundation", tagline: "Brand guidelines",
    description: "Logos, colors, fonts, voice profiles and competitor tracking — single source of truth.",
    kpis: [{ label: "Assets", value: "0" }, { label: "Voice profiles", value: "1" }, { label: "Competitors tracked", value: "0" }],
    features: [
      { title: "Asset library", description: "Logos, colors, fonts, templates." },
      { title: "Brand voice profiles", description: "Used by AI generators." },
      { title: "Competitor profiles", description: "Reused across modules." },
    ] }),
  integrations: m({ id: "integrations", label: "Integrations", icon: Plug, category: "foundation", tagline: "OAuth & API hub",
    description: "Connect every channel — OAuth, API keys, webhooks, sync schedules in one place.",
    integrations: ["Google Ads","Meta","LinkedIn","TikTok","HubSpot","Shopify","Slack","Zapier","Stripe","Mailchimp"],
    features: [
      { title: "OAuth manager", description: "Connect & rotate tokens." },
      { title: "API key vault", description: "Encrypted per-workspace." },
      { title: "Webhook receivers", description: "Inbound event router." },
      { title: "Sync scheduling", description: "Cron-style refresh." },
    ] }),

  // ---- 2. Research ----
  "market-research": m({ id: "market-research", label: "Market Research", icon: BarChart3, category: "research", tagline: "Trends & sentiment",
    description: "Industry trends, sentiment and market opportunity mapping.",
    integrations: ["Google Trends","NewsAPI","Brandwatch"],
    features: [
      { title: "Industry trends", description: "Surfaced via news + trends APIs." },
      { title: "Sentiment", description: "Social listening rollups." },
      { title: "Opportunity map", description: "TAM / SAM heatmap." },
    ] }),
  "keyword-research": m({ id: "keyword-research", label: "Keyword Research", icon: Search, category: "research", tagline: "Discover & cluster",
    description: "Discover, cluster and map keywords with volume, difficulty and SERP data.",
    integrations: ["DataForSEO","SEMrush","Ahrefs","SerpApi"],
    features: [
      { title: "Discovery", description: "Seed → expanded list." },
      { title: "Clustering", description: "Topic groups." },
      { title: "Question mining", description: "PAA & AnswerThePublic." },
      { title: "SERP analysis", description: "Top results, features." },
    ] }),
  "competitor-intel": m({ id: "competitor-intel", label: "Competitor Intel", icon: Target, category: "research", tagline: "Spy & gap",
    description: "Track competitor sites, backlinks, ads and content gaps.",
    integrations: ["BuiltWith","SimilarWeb","SpyFu","Ad Library"],
    features: [
      { title: "Site tracking", description: "Tech stack & traffic." },
      { title: "Backlink analysis", description: "Source quality & velocity." },
      { title: "Ad spy", description: "Active creatives." },
      { title: "Content gap", description: "What they rank for that you don't." },
    ] }),
  "customer-research": m({ id: "customer-research", label: "Customer Research", icon: MessageCircle, category: "research", tagline: "Surveys & reviews",
    description: "Surveys, reviews, social listening and interview scheduling.",
    integrations: ["Typeform","Trustpilot","Calendly","Mention"],
    features: [
      { title: "Surveys", description: "Distribute and aggregate." },
      { title: "Review aggregation", description: "Multi-platform." },
      { title: "Social listening", description: "Mentions & sentiment." },
      { title: "Interview scheduling", description: "Calendly sync." },
    ] }),

  // ---- 3. Planning ----
  campaigns: m({ id: "campaigns", label: "Campaign Planner", icon: Calendar, category: "planning", tagline: "Plan & budget",
    description: "Campaign timelines, budgets, OKRs and resourcing.",
    kpis: [{ label: "Active campaigns", value: "0" }, { label: "Quarter budget", value: "$0" }],
    features: [
      { title: "Calendar & timeline", description: "Visual roadmap." },
      { title: "Budget allocation", description: "Per channel." },
      { title: "Goals (OKR/KPI)", description: "Tied to dashboards." },
      { title: "Gantt", description: "Dependencies & milestones." },
    ] }),
  "content-calendar": m({ id: "content-calendar", label: "Content Calendar", icon: Calendar, category: "planning", tagline: "Multi-channel calendar",
    description: "Ideate, brief, assign and ship across every channel.",
    features: [
      { title: "Multi-channel view", description: "Blog, social, email, ads." },
      { title: "Brief templates", description: "Reusable structure." },
      { title: "Approval workflows", description: "Editor → reviewer → publisher." },
      { title: "Deadlines", description: "Slip alerts." },
    ] }),
  personas: m({ id: "personas", label: "Personas", icon: Users, category: "planning", tagline: "Customer personas",
    description: "Build personas, journeys, pain points and segments.",
    features: [
      { title: "Persona builder", description: "Demographics + psychographics." },
      { title: "Journey mapping", description: "Touchpoints across funnel." },
      { title: "Segments", description: "Reused across email & ads." },
    ] }),

  // ---- 4. Content ----
  "ai-content": m({ id: "ai-content", label: "AI Content", icon: PenSquare, category: "content", tagline: "Generate everything",
    description: "Blogs, social copy, ad copy, emails, product descriptions, meta tags.",
    integrations: ["OpenAI","Anthropic","Gemini"],
    features: [
      { title: "Blog generation", description: "Long-form drafts." },
      { title: "Social copy", description: "Per-platform tuned." },
      { title: "Ad copy", description: "Headline + body + CTA." },
      { title: "Email templates", description: "Tone-matched." },
      { title: "Meta tags", description: "Title + description." },
    ] }),
  "seo-content": m({ id: "seo-content", label: "SEO Optimizer", icon: TrendingUp, category: "content", tagline: "Optimize while writing",
    description: "Real-time on-page scoring, readability, internal linking and schema.",
    integrations: ["Clearscope","SurferSEO","Readable"],
    features: [
      { title: "On-page score", description: "Coverage vs SERP." },
      { title: "Readability", description: "Flesch-Kincaid." },
      { title: "Internal linking", description: "Auto-suggested." },
      { title: "Schema generator", description: "Article, FAQ, HowTo." },
    ] }),
  "visual-content": m({ id: "visual-content", label: "Visual Studio", icon: ImageIcon, category: "content", tagline: "Images & video",
    description: "Generate, edit, and template visuals — images, videos, thumbnails.",
    integrations: ["DALL-E","Stable Diffusion","Cloudinary","Synthesia"],
    features: [
      { title: "Image generation", description: "Brand-styled." },
      { title: "Background removal", description: "One-click." },
      { title: "Video creation", description: "Talking head & cuts." },
      { title: "Thumbnails", description: "YouTube ready." },
    ] }),
  "content-library": m({ id: "content-library", label: "Content Library", icon: FileStack, category: "content", tagline: "Versioning & reuse",
    description: "Version, tag, template and reuse every asset.",
    features: [
      { title: "Versioning", description: "Restore any prior draft." },
      { title: "Tags & categories", description: "Filter & search." },
      { title: "Templates", description: "Spin up faster." },
    ] }),

  // ---- 5. SEO ----
  "tech-seo": m({ id: "tech-seo", label: "Technical SEO", icon: Globe, category: "seo", tagline: "Crawl & fix",
    description: "Crawl your site, find issues, fix sitemap, robots, schema, speed.",
    integrations: ["Screaming Frog","PageSpeed","GTmetrix"],
    features: [
      { title: "Site crawler", description: "Find broken links & duplicates." },
      { title: "Sitemap & robots", description: "Auto-managed." },
      { title: "Page speed", description: "Core Web Vitals tracking." },
      { title: "Schema validator", description: "Per-page audit." },
      { title: "Redirect map", description: "301/302 manager." },
    ] }),
  "onpage-seo": m({ id: "onpage-seo", label: "On-Page SEO", icon: PenSquare, category: "seo", tagline: "Per-page wins",
    description: "Title/meta, headers, alt text, internal links, density.",
    features: [
      { title: "Title & meta", description: "Bulk editor." },
      { title: "Header structure", description: "H1–H6 audit." },
      { title: "Alt text", description: "AI suggestions." },
      { title: "Internal linking", description: "Cluster-aware." },
    ] }),
  "offpage-seo": m({ id: "offpage-seo", label: "Off-Page SEO", icon: Share2, category: "seo", tagline: "Backlinks & DA",
    description: "Backlink monitoring, link building, disavow, domain authority.",
    integrations: ["Ahrefs","Moz"],
    features: [
      { title: "Backlink monitor", description: "New & lost daily." },
      { title: "Link prospects", description: "Sorted by DA." },
      { title: "Disavow file", description: "Manage toxic links." },
    ] }),
  "local-seo": m({ id: "local-seo", label: "Local SEO", icon: MapPin, category: "seo", tagline: "GBP & citations",
    description: "Google Business Profile, citations, reviews, local rank, NAP consistency.",
    integrations: ["Google Business Profile","Yext"],
    features: [
      { title: "GBP manager", description: "Posts, photos, hours." },
      { title: "Citations", description: "Build & monitor." },
      { title: "Reviews", description: "Respond & request." },
      { title: "Local rank", description: "Grid view." },
    ] }),
  "rank-tracking": m({ id: "rank-tracking", label: "Rank Tracking", icon: LineChart, category: "seo", tagline: "Daily SERP tracking",
    description: "Daily ranks across devices, locations, SERP features.",
    integrations: ["AccuRanker","SERPWatcher"],
    kpis: [{ label: "Tracked KWs", value: "0" }, { label: "Top 10", value: "0" }, { label: "Featured snippets", value: "0" }],
    features: [
      { title: "Daily tracking", description: "Desktop & mobile." },
      { title: "SERP features", description: "Snippets, PAA, packs." },
      { title: "Competitor compare", description: "Side-by-side." },
    ] }),

  // ---- 6. Paid Ads ----
  "google-ads": m({ id: "google-ads", label: "Google Ads", icon: Megaphone, category: "ads", tagline: "Search & shopping",
    description: "Build, bid, A/B test and optimize Google Ads campaigns.",
    integrations: ["Google Ads API"],
    features: [
      { title: "Campaign builder", description: "Search, Display, YouTube." },
      { title: "Bid automation", description: "tCPA / tROAS." },
      { title: "A/B copy", description: "Winners auto-promoted." },
      { title: "Quality score", description: "Per-keyword diagnostics." },
      { title: "Shopping feeds", description: "Merchant Center sync." },
    ] }),
  "meta-ads": m({ id: "meta-ads", label: "Meta Ads", icon: Megaphone, category: "ads", tagline: "Facebook & Instagram",
    description: "Audiences, creatives, pixel, catalogs, retargeting.",
    integrations: ["Meta Marketing API"],
    features: [
      { title: "Audience builder", description: "Lookalikes & custom." },
      { title: "Creative tests", description: "Per-asset breakdown." },
      { title: "Pixel & CAPI", description: "Server-side ready." },
      { title: "Catalog", description: "Product feed sync." },
      { title: "Retargeting", description: "Funnel-aware." },
    ] }),
  "linkedin-ads": m({ id: "linkedin-ads", label: "LinkedIn Ads", icon: Megaphone, category: "ads", tagline: "B2B targeting",
    description: "Sponsored content, InMail, lead gen forms, ABM.",
    integrations: ["LinkedIn Ads API"],
    features: [
      { title: "Sponsored content", description: "Job/Industry targeting." },
      { title: "InMail", description: "Personalized at scale." },
      { title: "Lead gen forms", description: "Native conversion." },
      { title: "ABM", description: "Account lists." },
    ] }),
  "tiktok-ads": m({ id: "tiktok-ads", label: "TikTok Ads", icon: Megaphone, category: "ads", tagline: "Short-form video",
    description: "Video ads, Spark Ads, audience segmentation.",
    integrations: ["TikTok for Business"],
    features: [
      { title: "Video ads", description: "Vertical native." },
      { title: "Spark Ads", description: "Boost organic." },
      { title: "Audiences", description: "Interest & behavior." },
    ] }),
  "ad-intel": m({ id: "ad-intel", label: "Ad Intelligence", icon: PieChart, category: "ads", tagline: "Cross-platform ROAS",
    description: "Unified ROAS, attribution, automated bid adjustments.",
    kpis: [{ label: "Spend MTD", value: "$0" }, { label: "ROAS", value: "—" }, { label: "CPA", value: "—" }],
    features: [
      { title: "Cross-platform spend", description: "One pane of glass." },
      { title: "Attribution", description: "Multi-touch." },
      { title: "Auto-bidding", description: "Rules + ML." },
    ] }),

  // ---- 7. Social ----
  "social-publishing": m({ id: "social-publishing", label: "Publishing", icon: Send, category: "social", tagline: "Schedule everywhere",
    description: "Queue, schedule and bulk-upload to every social platform.",
    integrations: ["FB","IG","X","LinkedIn","TikTok","Pinterest","YouTube","Threads"],
    features: [
      { title: "Multi-platform posting", description: "From one composer." },
      { title: "Best time", description: "Per-channel ML." },
      { title: "Bulk upload", description: "CSV ingest." },
      { title: "RSS → social", description: "Auto-syndicate." },
    ] }),
  "social-listening": m({ id: "social-listening", label: "Listening", icon: ListChecks, category: "social", tagline: "Mentions & trends",
    description: "Track mentions, hashtags, competitors and sentiment.",
    integrations: ["Brandwatch","Mention"],
    features: [
      { title: "Mention tracking", description: "Real-time alerts." },
      { title: "Hashtag monitoring", description: "Trending now." },
      { title: "Sentiment", description: "Per mention." },
      { title: "Competitor analysis", description: "Volume vs you." },
    ] }),
  "social-inbox": m({ id: "social-inbox", label: "Social Inbox", icon: MessageSquare, category: "social", tagline: "Unified engagement",
    description: "All comments + DMs in one inbox, with templates and routing.",
    features: [
      { title: "Unified inbox", description: "Across networks." },
      { title: "Templates", description: "Quick replies." },
      { title: "Assignment & routing", description: "Per agent / queue." },
      { title: "Sentiment tags", description: "Auto-classified." },
    ] }),
  "social-analytics": m({ id: "social-analytics", label: "Social Analytics", icon: BarChart3, category: "social", tagline: "Growth & engagement",
    description: "Followers, engagement rate, top content, audience demographics.",
    kpis: [{ label: "Followers", value: "0" }, { label: "Eng. rate", value: "—" }, { label: "Reach 30d", value: "0" }],
    features: [
      { title: "Growth tracking", description: "Per-channel." },
      { title: "Top content", description: "By format & topic." },
      { title: "Demographics", description: "Audience splits." },
    ] }),
  influencers: m({ id: "influencers", label: "Influencers", icon: Star, category: "social", tagline: "Discover & manage",
    description: "Find, outreach, manage campaigns and measure ROI.",
    features: [
      { title: "Discovery", description: "By niche & engagement." },
      { title: "Outreach CRM", description: "Sequences." },
      { title: "Campaigns", description: "Briefs & deliverables." },
      { title: "ROI", description: "Tracked links." },
    ] }),

  // ---- 8. Email ----
  "email-builder": m({ id: "email-builder", label: "Email Builder", icon: Mail, category: "email", tagline: "Drag-and-drop",
    description: "Templates, dynamic blocks, personalization, responsive testing.",
    integrations: ["SendGrid","Mailchimp","Postmark"],
    features: [
      { title: "Drag & drop editor", description: "Live preview." },
      { title: "Dynamic blocks", description: "Per segment." },
      { title: "Tokens", description: "First name → product." },
      { title: "Responsive test", description: "Across clients." },
    ] }),
  "email-lists": m({ id: "email-lists", label: "Lists & Segments", icon: Database, category: "email", tagline: "Hygiene & segments",
    description: "Import, segment, tag and clean your lists.",
    integrations: ["NeverBounce","ZeroBounce"],
    features: [
      { title: "Import / export", description: "CSV / API." },
      { title: "Segment builder", description: "Conditional logic." },
      { title: "Custom fields", description: "Schema-flex." },
      { title: "Hygiene", description: "Bounce-prevention." },
    ] }),
  "email-automation": m({ id: "email-automation", label: "Email Automation", icon: Workflow, category: "email", tagline: "Sequences & drips",
    description: "Welcome, drip, abandoned cart, re-engagement, behavioral triggers.",
    features: [
      { title: "Welcome series", description: "Templated." },
      { title: "Drip campaigns", description: "Time + behavior." },
      { title: "Abandoned cart", description: "Multi-step." },
      { title: "Re-engagement", description: "Win-back." },
    ] }),
  "email-deliverability": m({ id: "email-deliverability", label: "Deliverability", icon: Shield, category: "email", tagline: "Inbox placement",
    description: "Spam scoring, SPF/DKIM/DMARC, bounce handling.",
    integrations: ["Mail Tester"],
    features: [
      { title: "Spam score", description: "Pre-send check." },
      { title: "SPF/DKIM/DMARC", description: "Live validation." },
      { title: "Inbox placement", description: "Seed tests." },
    ] }),
  "email-analytics": m({ id: "email-analytics", label: "Email Analytics", icon: BarChart3, category: "email", tagline: "Open / click / revenue",
    description: "Opens, clicks, conversions, revenue attribution, heat maps.",
    integrations: ["Litmus"],
    kpis: [{ label: "Open rate", value: "—" }, { label: "CTR", value: "—" }, { label: "Revenue / send", value: "—" }],
    features: [
      { title: "Per campaign", description: "Drill-down." },
      { title: "Revenue attribution", description: "Order-level." },
      { title: "Heatmaps", description: "Click density." },
    ] }),

  // ---- 9. Distribution ----
  "blog-publishing": m({ id: "blog-publishing", label: "Blog Publishing", icon: GitBranch, category: "distro", tagline: "WordPress & friends",
    description: "Push to WordPress, Webflow, Shopify, Ghost, custom CMS.",
    integrations: ["WordPress","Webflow","Shopify","Ghost"],
    features: [
      { title: "WordPress", description: "REST API." },
      { title: "Webflow", description: "CMS API." },
      { title: "Shopify blog", description: "Native API." },
      { title: "Custom CMS", description: "Webhook adapters." },
    ] }),
  syndication: m({ id: "syndication", label: "Syndication", icon: Share2, category: "distro", tagline: "Republish wisely",
    description: "Cross-post to Medium, LinkedIn Articles, Dev.to, Hashnode.",
    features: [
      { title: "Medium", description: "Canonical-safe." },
      { title: "LinkedIn Articles", description: "Native publish." },
      { title: "Dev.to / Hashnode", description: "Tech audiences." },
      { title: "Guest posts", description: "Pipeline tracking." },
    ] }),
  "press-release": m({ id: "press-release", label: "Press Release", icon: Megaphone, category: "distro", tagline: "PR distribution",
    description: "PR newswire, journalist database, media kit hosting.",
    features: [
      { title: "Newswire", description: "Wide reach." },
      { title: "Journalist DB", description: "Beat-targeted." },
      { title: "Media kit", description: "Brand assets bundle." },
    ] }),
  podcasts: m({ id: "podcasts", label: "Podcasts", icon: Megaphone, category: "distro", tagline: "Multi-platform audio",
    description: "RSS feed, multi-platform distribution, transcripts.",
    integrations: ["Spotify","Apple Podcasts","AssemblyAI"],
    features: [
      { title: "RSS feed", description: "Compliant." },
      { title: "Distribution", description: "Spotify, Apple." },
      { title: "Transcripts", description: "Auto-generated." },
    ] }),

  // ---- 10. Conversion ----
  "landing-pages": m({ id: "landing-pages", label: "Landing Pages", icon: Layers, category: "conversion", tagline: "Drag & drop builder",
    description: "Templates, A/B tests, dynamic text, mobile-first.",
    features: [
      { title: "Drag & drop", description: "Block library." },
      { title: "A/B testing", description: "Built-in stats." },
      { title: "Dynamic text", description: "Per UTM." },
      { title: "Speed", description: "Edge-cached." },
    ] }),
  forms: m({ id: "forms", label: "Forms", icon: PenSquare, category: "conversion", tagline: "Multi-step + logic",
    description: "Conditional logic, lead scoring, spam protection.",
    integrations: ["reCAPTCHA"],
    features: [
      { title: "Multi-step", description: "Higher conversion." },
      { title: "Conditional logic", description: "Branching." },
      { title: "Progressive profiling", description: "Less friction." },
    ] }),
  popups: m({ id: "popups", label: "Pop-ups & CTAs", icon: MousePointerClick, category: "conversion", tagline: "Behavior triggers",
    description: "Exit intent, slide-ins, sticky bars, timed triggers.",
    features: [
      { title: "Exit intent", description: "Last-chance offer." },
      { title: "Slide-ins", description: "Non-intrusive." },
      { title: "Sticky bars", description: "Always-on CTA." },
      { title: "Behavior triggers", description: "Scroll & time." },
    ] }),
  "live-chat": m({ id: "live-chat", label: "Live Chat", icon: MessageCircle, category: "conversion", tagline: "Bots + humans",
    description: "Chat widget, bot builder, AI replies, lead qualification.",
    integrations: ["Intercom","Drift"],
    features: [
      { title: "Widget", description: "Brand-styled." },
      { title: "Bot builder", description: "Visual flows." },
      { title: "AI replies", description: "RAG over your docs." },
      { title: "Meeting booking", description: "Calendar sync." },
    ] }),
  webinars: m({ id: "webinars", label: "Webinars", icon: Calendar, category: "conversion", tagline: "Schedule & host",
    description: "Scheduling, registration, reminders, replay hosting.",
    integrations: ["Zoom","WebinarJam"],
    features: [
      { title: "Scheduling", description: "Multi-session." },
      { title: "Registration", description: "Branded forms." },
      { title: "Reminders", description: "Email + SMS." },
      { title: "Replay", description: "Hosted." },
    ] }),

  // ---- 11. Analytics ----
  "web-analytics": m({ id: "web-analytics", label: "Web Analytics", icon: LineChart, category: "analytics", tagline: "GA4 + privacy first",
    description: "GA4 + Plausible/Fathom, events, goals, e-commerce, custom dimensions.",
    integrations: ["GA4","Plausible","Fathom"],
    features: [
      { title: "GA4", description: "Live read." },
      { title: "Privacy-first", description: "Plausible / Fathom." },
      { title: "Event tracking", description: "Auto + custom." },
      { title: "E-commerce", description: "Revenue & products." },
    ] }),
  attribution: m({ id: "attribution", label: "Attribution", icon: GitBranch, category: "analytics", tagline: "Multi-touch models",
    description: "First / last / linear / time-decay / custom rules.",
    features: [
      { title: "Multi-touch", description: "Across channels." },
      { title: "First / last touch", description: "Classic." },
      { title: "Time decay", description: "Recent-weighted." },
      { title: "Custom rules", description: "Your model." },
    ] }),
  dashboards: m({ id: "dashboards", label: "Dashboards", icon: PieChart, category: "analytics", tagline: "Custom widgets",
    description: "Drag-and-drop dashboards with real-time data.",
    features: [
      { title: "Widget library", description: "Charts & metrics." },
      { title: "Real-time", description: "WebSockets." },
      { title: "Trend analysis", description: "Period comparisons." },
    ] }),
  "cross-channel": m({ id: "cross-channel", label: "Cross-Channel", icon: BarChart3, category: "analytics", tagline: "Unified ROI",
    description: "All channels, one view — budget vs results, LTV, funnel.",
    kpis: [{ label: "Channels", value: "0" }, { label: "Total ROAS", value: "—" }, { label: "LTV", value: "—" }],
    features: [
      { title: "Unified view", description: "All sources." },
      { title: "Budget vs results", description: "Per channel." },
      { title: "Funnel", description: "Drop-off." },
    ] }),

  // ---- 12. CRM ----
  contacts: m({ id: "contacts", label: "Contacts", icon: Users, category: "crm", tagline: "CRM & enrichment",
    description: "Database, custom fields, enrichment, dedupe, scoring.",
    integrations: ["HubSpot","Salesforce","Clearbit","Hunter.io"],
    features: [
      { title: "Database", description: "Search + filter." },
      { title: "Enrichment", description: "Auto-fill profiles." },
      { title: "Dedupe", description: "Fuzzy match." },
      { title: "Scoring", description: "Hot lead alerts." },
    ] }),
  pipeline: m({ id: "pipeline", label: "Pipeline", icon: GitBranch, category: "crm", tagline: "Deals & forecast",
    description: "Deal stages, kanban, forecasting, win/loss, activity log.",
    kpis: [{ label: "Open deals", value: "0" }, { label: "Pipeline", value: "$0" }, { label: "Forecast", value: "$0" }],
    features: [
      { title: "Kanban stages", description: "Drag to move." },
      { title: "Forecast", description: "Probability-weighted." },
      { title: "Win/loss", description: "Reasons tracked." },
    ] }),
  "lead-scoring": m({ id: "lead-scoring", label: "Lead Scoring", icon: TrendingUp, category: "crm", tagline: "Behavior + AI",
    description: "Behavioral, demographic, engagement and AI-powered scoring.",
    features: [
      { title: "Behavior score", description: "Visits / events." },
      { title: "Demographic score", description: "ICP fit." },
      { title: "AI score", description: "Conversion likelihood." },
    ] }),
  "lead-routing": m({ id: "lead-routing", label: "Lead Routing", icon: Send, category: "crm", tagline: "Round-robin + rules",
    description: "Round-robin, territory, rules-based routing with notifications.",
    features: [
      { title: "Round-robin", description: "Fair distribution." },
      { title: "Territory", description: "Geo / vertical." },
      { title: "Rules", description: "Custom logic." },
    ] }),

  // ---- 13. Automation ----
  workflows: m({ id: "workflows", label: "Workflows", icon: Workflow, category: "automation", tagline: "Visual builder",
    description: "Triggers → conditions → actions, with timers and branches.",
    features: [
      { title: "Visual editor", description: "Drag nodes." },
      { title: "Conditions", description: "If/then." },
      { title: "Timers", description: "Delays / wait until." },
      { title: "Branches", description: "Parallel paths." },
    ] }),
  triggers: m({ id: "triggers", label: "Triggers", icon: Zap, category: "automation", tagline: "Event router",
    description: "Form, page visit, email engagement, purchase, custom events, webhooks.",
    features: [
      { title: "Form submit", description: "Native." },
      { title: "Page visit", description: "Pixel." },
      { title: "Webhooks", description: "Inbound." },
      { title: "Custom events", description: "Track API." },
    ] }),

  // ---- 14. E-commerce ----
  "product-feeds": m({ id: "product-feeds", label: "Product Feeds", icon: ShoppingCart, category: "ecom", tagline: "Merchant feeds",
    description: "Google Shopping, Meta catalog, dynamic pricing, inventory sync.",
    integrations: ["Google Merchant","Meta Catalog","Shopify"],
    features: [
      { title: "Google feed", description: "Merchant Center." },
      { title: "Meta catalog", description: "FB/IG ads." },
      { title: "Dynamic pricing", description: "Rules." },
      { title: "Inventory sync", description: "Real-time." },
    ] }),
  "abandoned-cart": m({ id: "abandoned-cart", label: "Abandoned Cart", icon: ShoppingCart, category: "ecom", tagline: "Recover revenue",
    description: "Tracking, recovery emails, SMS, exit-intent offers.",
    features: [
      { title: "Tracking", description: "Per-cart events." },
      { title: "Recovery emails", description: "Multi-step." },
      { title: "SMS reminders", description: "Optional channel." },
      { title: "Exit-intent", description: "On-site." },
    ] }),
  "ecom-segments": m({ id: "ecom-segments", label: "Customer Segments", icon: Users, category: "ecom", tagline: "RFM & LTV",
    description: "RFM, purchase history, predicted LTV, churn risk.",
    features: [
      { title: "RFM", description: "Recency/Freq/Monetary." },
      { title: "Purchase segments", description: "Auto-built." },
      { title: "Predicted LTV", description: "ML model." },
      { title: "Churn risk", description: "Early warning." },
    ] }),
  reviews: m({ id: "reviews", label: "Reviews", icon: Star, category: "ecom", tagline: "Request & respond",
    description: "Automate review requests, aggregate, respond, sentiment.",
    features: [
      { title: "Review requests", description: "Post-purchase." },
      { title: "Aggregation", description: "Multi-platform." },
      { title: "Response mgmt", description: "Templates + AI." },
    ] }),

  // ---- 15. AI Layer ----
  "ai-studio": m({ id: "ai-studio", label: "AI Studio", icon: Sparkles, category: "ai", tagline: "All AI in one place",
    description: "Generate content, images, translations, sentiment, predictions.",
    integrations: ["OpenAI","Anthropic","Gemini","DeepL","Stability"],
    features: [
      { title: "Content gen", description: "Multi-model." },
      { title: "Image gen", description: "DALL-E + SDXL." },
      { title: "Translation", description: "DeepL quality." },
      { title: "Predictive", description: "Forecasts." },
      { title: "Anomaly detection", description: "Alerts." },
    ] }),
  "automation-rules": m({ id: "automation-rules", label: "Auto Rules", icon: Zap, category: "ai", tagline: "If/then everywhere",
    description: "Scheduled tasks, sync rules, alerts, auto-optimization.",
    features: [
      { title: "Scheduled tasks", description: "Cron." },
      { title: "Data sync", description: "Bi-directional." },
      { title: "Alerts", description: "Slack / email." },
      { title: "Auto-optimize", description: "Bid / budget shifts." },
    ] }),

  // ---- 16. Collaboration ----
  tasks: m({ id: "tasks", label: "Tasks & Projects", icon: ListChecks, category: "collab", tagline: "Get work done",
    description: "Tasks, kanban, gantt, time tracking, dependencies.",
    integrations: ["Toggl","Harvest"],
    features: [
      { title: "Tasks", description: "Assignees & due dates." },
      { title: "Kanban", description: "Drag stages." },
      { title: "Gantt", description: "Timeline view." },
      { title: "Time tracking", description: "Per task." },
    ] }),
  approvals: m({ id: "approvals", label: "Approvals", icon: ShieldCheck, category: "collab", tagline: "Review & sign-off",
    description: "Multi-step approvals, comments, version control.",
    features: [
      { title: "Multi-step", description: "Sequential or parallel." },
      { title: "Comments", description: "Threaded." },
      { title: "Versioning", description: "Diff & restore." },
    ] }),
  "team-chat": m({ id: "team-chat", label: "Team Chat", icon: MessageSquare, category: "collab", tagline: "In-app messaging",
    description: "Messages, mentions, Slack integration, activity feed.",
    integrations: ["Slack"],
    features: [
      { title: "In-app", description: "Per project." },
      { title: "@mentions", description: "Notifications." },
      { title: "Slack mirror", description: "Two-way." },
    ] }),
  "client-portal": m({ id: "client-portal", label: "Client Portal", icon: Building2, category: "collab", tagline: "Branded access",
    description: "Guest access, branded workspaces, client-facing reports.",
    features: [
      { title: "Client portals", description: "Per account." },
      { title: "Guest access", description: "Limited scope." },
      { title: "White-label", description: "Logo + colors." },
    ] }),

  // ---- 17. Compliance ----
  privacy: m({ id: "privacy", label: "Data Privacy", icon: Shield, category: "compliance", tagline: "GDPR ready",
    description: "Consent, cookie banner, privacy policy, data export/deletion.",
    features: [
      { title: "Cookie consent", description: "Geo-aware." },
      { title: "Privacy policy", description: "Generator." },
      { title: "Data export", description: "DSAR ready." },
      { title: "Consent log", description: "Auditable." },
    ] }),
  "brand-safety": m({ id: "brand-safety", label: "Brand Safety", icon: ShieldCheck, category: "compliance", tagline: "Moderation & guardrails",
    description: "Content moderation, profanity filter, brand guideline enforcement, plagiarism.",
    integrations: ["Perspective","Copyscape"],
    features: [
      { title: "Moderation", description: "Toxicity scoring." },
      { title: "Profanity", description: "Configurable." },
      { title: "Brand rules", description: "Linter." },
      { title: "Plagiarism", description: "Cross-web check." },
    ] }),
  "access-control": m({ id: "access-control", label: "Access Control", icon: Shield, category: "compliance", tagline: "Permissions & 2FA",
    description: "RBAC, 2FA, IP whitelisting, session management, API logs.",
    features: [
      { title: "RBAC", description: "Per-feature." },
      { title: "2FA", description: "TOTP / WebAuthn." },
      { title: "IP whitelist", description: "Workspace level." },
      { title: "API logs", description: "Audit." },
    ] }),
};

export const MARKETING_CATEGORIES: MarketingCategory[] = [
  { id: "core", label: "Reach Core", icon: Sparkles, modules: ["overview","scan","brand","optimize","distribution","agents","footprint","proof","reports"] },
  { id: "foundation", label: "Foundation", icon: Building2, modules: ["team","brand-assets","integrations"] },
  { id: "research", label: "Research", icon: Search, modules: ["market-research","keyword-research","competitor-intel","customer-research"] },
  { id: "planning", label: "Planning", icon: Calendar, modules: ["campaigns","content-calendar","personas"] },
  { id: "content", label: "Content", icon: PenSquare, modules: ["ai-content","seo-content","visual-content","content-library"] },
  { id: "seo", label: "SEO", icon: Globe, modules: ["tech-seo","onpage-seo","offpage-seo","local-seo","rank-tracking"] },
  { id: "ads", label: "Paid Ads", icon: Megaphone, modules: ["google-ads","meta-ads","linkedin-ads","tiktok-ads","ad-intel"] },
  { id: "social", label: "Social", icon: Share2, modules: ["social-publishing","social-listening","social-inbox","social-analytics","influencers"] },
  { id: "email", label: "Email", icon: Mail, modules: ["email-builder","email-lists","email-automation","email-deliverability","email-analytics"] },
  { id: "distro", label: "Distribution", icon: Send, modules: ["blog-publishing","syndication","press-release","podcasts"] },
  { id: "conversion", label: "Conversion", icon: MousePointerClick, modules: ["landing-pages","forms","popups","live-chat","webinars"] },
  { id: "analytics", label: "Analytics", icon: BarChart3, modules: ["web-analytics","attribution","dashboards","cross-channel"] },
  { id: "crm", label: "CRM", icon: Users, modules: ["contacts","pipeline","lead-scoring","lead-routing"] },
  { id: "automation", label: "Automation", icon: Workflow, modules: ["workflows","triggers"] },
  { id: "ecom", label: "E-commerce", icon: ShoppingCart, modules: ["product-feeds","abandoned-cart","ecom-segments","reviews"] },
  { id: "ai", label: "AI Layer", icon: Sparkles, modules: ["ai-studio","automation-rules"] },
  { id: "collab", label: "Collaboration", icon: ListChecks, modules: ["tasks","approvals","team-chat","client-portal"] },
  { id: "compliance", label: "Compliance", icon: Shield, modules: ["privacy","brand-safety","access-control"] },
  { id: "system", label: "System", icon: SettingsIcon, modules: ["settings","billing"] },
];

export function getModule(id: string): MarketingModule | undefined {
  return (MARKETING_MODULES as any)[id];
}
