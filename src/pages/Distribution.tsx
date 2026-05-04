import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Share2, Sparkles, Send, Eye, Clock, CheckCircle2, 
  ExternalLink, RefreshCw, Plus, FileText, MessageSquare,
  TrendingUp, Zap, ArrowRight, Copy, ThumbsUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { agents } from "@/components/agents/agentRegistry";
import { toast } from "@/hooks/use-toast";
import { useBusinessName } from "@/hooks/useBusinessName";
import { getPlatformLogo, getPlatformBrand } from "@/components/ui/platform-logos";

type Platform = "reddit" | "quora" | "linkedin" | "medium" | "hackernews" | "twitter";
type ContentStatus = "draft" | "generating" | "ready" | "posted" | "failed";

interface PlatformConfig {
  id: Platform;
  name: string;
  description: string;
  autoPost: boolean;
}

interface ContentPost {
  id: string;
  platform: Platform;
  title: string;
  content: string;
  status: ContentStatus;
  scheduledDate?: string;
  postedDate?: string;
  engagement?: { views: number; upvotes: number; comments: number };
}

const platforms: PlatformConfig[] = [
  { id: "reddit", name: "Reddit", description: "Subreddit posts & comments", autoPost: false },
  { id: "quora", name: "Quora", description: "Answer relevant questions", autoPost: false },
  { id: "linkedin", name: "LinkedIn", description: "Professional articles & posts", autoPost: true },
  { id: "medium", name: "Medium", description: "Long-form articles", autoPost: false },
  { id: "hackernews", name: "Hacker News", description: "Tech community visibility", autoPost: false },
  { id: "twitter", name: "X / Twitter", description: "Short-form & threads", autoPost: false },
];

const initialPosts: ContentPost[] = [
  {
    id: "1", platform: "reddit", title: "How AI is changing fintech discovery", 
    content: "We've been exploring how AI search engines like ChatGPT and Perplexity are reshaping how businesses find fintech solutions. Our research shows that 73% of B2B buyers now use AI assistants in their evaluation process...",
    status: "posted", postedDate: "2 hours ago",
    engagement: { views: 1240, upvotes: 45, comments: 12 }
  },
  {
    id: "2", platform: "quora", title: "What are the best payment processing solutions for startups?",
    content: "Great question! As someone working in the fintech space, I'd recommend evaluating solutions based on three key criteria: API flexibility, transparent pricing, and AI-readiness...",
    status: "posted", postedDate: "1 day ago",
    engagement: { views: 3400, upvotes: 89, comments: 7 }
  },
  {
    id: "3", platform: "linkedin", title: "Why Your Brand Needs an AI Visibility Strategy in 2026",
    content: "The way businesses are discovered is fundamentally changing. With over 60% of professional queries now routed through AI assistants, having a strong AI footprint is no longer optional...",
    status: "ready", scheduledDate: "Tomorrow, 9:00 AM"
  },
  {
    id: "4", platform: "medium", title: "The Complete Guide to AI Engine Optimization (AEO)",
    content: "", status: "draft"
  },
];

const statusConfig: Record<ContentStatus, { label: string; className: string; icon: typeof Clock }> = {
  draft: { label: "Draft", className: "bg-secondary text-muted-foreground", icon: FileText },
  generating: { label: "Generating...", className: "bg-primary/10 text-primary", icon: Sparkles },
  ready: { label: "Ready to Post", className: "bg-success-light text-success border border-success/20", icon: CheckCircle2 },
  posted: { label: "Posted", className: "bg-primary/10 text-primary border border-primary/20", icon: CheckCircle2 },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive", icon: RefreshCw },
};

export default function Distribution() {
  const businessName = useBusinessName();
  const [posts, setPosts] = useState<ContentPost[]>(initialPosts);
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | null>(null);
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState<"professional" | "casual" | "thought-leader" | "data-driven">("professional");
  const [generatingId, setGeneratingId] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [filterStatus, setFilterStatus] = useState<ContentStatus | "all">("all");
  const [filterPlatform, setFilterPlatform] = useState<Platform | "all">("all");
  const TOPIC_MAX = 280;

  const tones: Array<{ id: typeof tone; label: string; emoji: string }> = [
    { id: "professional", label: "Professional", emoji: "💼" },
    { id: "casual", label: "Casual", emoji: "💬" },
    { id: "thought-leader", label: "Thought Leader", emoji: "🎯" },
    { id: "data-driven", label: "Data-Driven", emoji: "📊" },
  ];

  const generateContent = async (platform: Platform) => {
    if (!topic.trim()) {
      toast({ title: "Enter a topic", description: "Provide a topic for AI to generate content", variant: "destructive" });
      return;
    }

    const newId = crypto.randomUUID();
    const platformConfig = platforms.find(p => p.id === platform)!;
    
    const newPost: ContentPost = {
      id: newId, platform, title: `AI-generated: ${topic}`, content: "", status: "generating"
    };
    
    setPosts(prev => [newPost, ...prev]);
    setGeneratingId(newId);

    try {
      const { data, error } = await supabase.functions.invoke("generate-content", {
        body: { topic, platform, brandName: businessName, industry: "", tone },
      });

      if (error) throw error;

      setPosts(prev => prev.map(p => 
        p.id === newId 
          ? { ...p, content: data.content || "", status: "ready" as ContentStatus, title: data.title || `${topic} - ${platformConfig.name}` }
          : p
      ));
      toast({ title: "✨ AI Content generated!", description: `Real AI-optimized post ready for ${platformConfig.name}` });
    } catch (err: any) {
      console.error("Content generation error:", err);
      setPosts(prev => prev.map(p => 
        p.id === newId ? { ...p, status: "failed" as ContentStatus } : p
      ));
      toast({ title: "Generation failed", description: err?.message || "Could not generate content", variant: "destructive" });
    } finally {
      setGeneratingId(null);
      setTopic("");
      setShowGenerator(false);
    }
  };

  const publishPost = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId 
        ? { ...p, status: "posted" as ContentStatus, postedDate: "Just now", engagement: { views: 0, upvotes: 0, comments: 0 } }
        : p
    ));
    toast({ title: "Published!", description: "Your content has been posted successfully" });
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    toast({ title: "Copied!", description: "Content copied to clipboard" });
  };

  const postedCount = posts.filter(p => p.status === "posted").length;
  const readyCount = posts.filter(p => p.status === "ready").length;
  const totalEngagement = posts.reduce((sum, p) => sum + (p.engagement?.views || 0), 0);

  return (
    <div className="space-y-4 md:space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 md:gap-4">
          <AgentBadge agent={agents.spark} isWorking={!!generatingId} size={40} />
          <div>
            <h1 className="text-lg md:text-xl font-bold text-foreground">Content Distribution Engine</h1>
            <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
              Spark generates AI-optimized content & distributes it everywhere
            </p>
          </div>
        </div>
        <Button onClick={() => setShowGenerator(true)} className="rounded-xl gap-2 h-10 bg-primary hover:bg-primary/90 text-primary-foreground btn-primary-glow w-full sm:w-auto">
          <Sparkles className="h-4 w-4" />
          Generate Content
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="metric-card">
          <div className="metric-value">{platforms.length}</div>
          <div className="metric-label">Platforms</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{postedCount}</div>
          <div className="metric-label">Published</div>
        </div>
        <div className="metric-card">
          <div className="metric-value">{readyCount}</div>
          <div className="metric-label">Ready to Post</div>
        </div>
        <div className="metric-card">
          <div className="metric-value flex items-center justify-center gap-1">
            {totalEngagement > 1000 ? `${(totalEngagement / 1000).toFixed(1)}k` : totalEngagement}
            <TrendingUp className="h-4 w-4 text-success" />
          </div>
          <div className="metric-label">Total Reach</div>
        </div>
      </div>

      {/* AI Content Generator Modal */}
      {showGenerator && (
        <div className="card-reach gradient-border animate-scale-in">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <AgentBadge agent={agents.spark} mood="thinking" size={40} showRole={false} />
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Content Generator</h3>
                <p className="text-[11px] text-muted-foreground">Describe your topic and I'll create platform-optimized content</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setShowGenerator(false)} className="text-muted-foreground">✕</Button>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider block">Topic / Key Message</label>
                <span className={`text-[10px] tabular-nums ${topic.length > TOPIC_MAX ? "text-destructive font-semibold" : "text-muted-foreground"}`}>
                  {topic.length}/{TOPIC_MAX}
                </span>
              </div>
              <Textarea
                placeholder="e.g., How AI is changing business discovery, Why AEO matters in 2026, Our latest product features..."
                value={topic}
                onChange={(e) => setTopic(e.target.value.slice(0, TOPIC_MAX))}
                className="min-h-[80px] rounded-xl border-border/60 bg-secondary/30 focus:bg-card resize-none"
              />
            </div>

            {/* Tone presets */}
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Tone</label>
              <div className="flex flex-wrap gap-2">
                {tones.map((t) => {
                  const active = tone === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTone(t.id)}
                      className={`text-[11px] font-medium px-3 py-1.5 rounded-full border transition-all ${
                        active
                          ? "bg-primary/10 border-primary/40 text-primary"
                          : "bg-secondary/40 border-border/60 text-muted-foreground hover:border-primary/30 hover:text-foreground"
                      }`}
                    >
                      <span className="mr-1">{t.emoji}</span>
                      {t.label}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2 block">Select Platform</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {platforms.map((p) => {
                  const brand = getPlatformBrand(p.id);
                  const active = selectedPlatform === p.id;
                  return (
                    <button
                      key={p.id}
                      onClick={() => setSelectedPlatform(p.id)}
                      className="platform-badge justify-start"
                      style={active ? { background: brand.bg, borderColor: brand.ring, color: brand.text } : undefined}
                    >
                      <span className="shrink-0">{getPlatformLogo(p.id, "h-5 w-5")}</span>
                      <div className="text-left">
                        <div className="text-xs font-semibold">{p.name}</div>
                        <div className="text-[10px] text-muted-foreground">{p.description}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <Button 
              onClick={() => selectedPlatform && generateContent(selectedPlatform)}
              disabled={!topic.trim() || !selectedPlatform || !!generatingId}
              className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold gap-2"
            >
              {generatingId ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  Generating AI Content...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4" />
                  Generate & Preview
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Platform Overview */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {platforms.map((p) => {
          const platformPosts = posts.filter(post => post.platform === p.id);
          const posted = platformPosts.filter(post => post.status === "posted").length;
          const brand = getPlatformBrand(p.id);
          return (
            <div
              key={p.id}
              className="card-reach p-4 text-center border"
              style={{ background: brand.bg, borderColor: brand.ring }}
            >
              <div className="flex justify-center mb-2">{getPlatformLogo(p.id, "h-7 w-7")}</div>
              <div className="text-xs font-semibold text-foreground">{p.name}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{posted} posts</div>
              <div className="flex items-center justify-center gap-1 mt-1">
                <div className={`h-1.5 w-1.5 rounded-full ${posted > 0 ? "bg-success" : "bg-muted-foreground/30"}`} />
                <span className="text-[9px] text-muted-foreground">{posted > 0 ? "Active" : "Not started"}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Content Feed */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-sm font-semibold text-foreground">Content Feed</h2>
          <div className="flex items-center gap-1.5 flex-wrap">
            {(["all", "ready", "posted", "draft"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all capitalize ${
                  filterStatus === s
                    ? "bg-primary/10 border-primary/40 text-primary"
                    : "bg-secondary/40 border-border/60 text-muted-foreground hover:border-primary/30"
                }`}
              >
                {s === "all" ? `All (${posts.length})` : s}
              </button>
            ))}
            <span className="mx-1 h-3 w-px bg-border" />
            <button
              onClick={() => setFilterPlatform("all")}
              className={`text-[10px] font-medium px-2.5 py-1 rounded-full border transition-all ${
                filterPlatform === "all"
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-secondary/40 border-border/60 text-muted-foreground hover:border-primary/30"
              }`}
            >
              All platforms
            </button>
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilterPlatform(p.id)}
                title={p.name}
                className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                  filterPlatform === p.id ? "border-primary/50 ring-2 ring-primary/20" : "border-border/60 opacity-60 hover:opacity-100"
                }`}
              >
                {getPlatformLogo(p.id, "h-3 w-3")}
              </button>
            ))}
          </div>
        </div>

        {posts
          .filter((p) => (filterStatus === "all" || p.status === filterStatus) && (filterPlatform === "all" || p.platform === filterPlatform))
          .map((post) => {
          const platform = platforms.find(p => p.id === post.platform)!;
          const status = statusConfig[post.status];
          const StatusIcon = status.icon;
          
          const brand = getPlatformBrand(platform.id);
          return (
            <div key={post.id} className="card-reach p-5 animate-fade-in">
              <div className="flex items-start gap-4">
                {/* Platform icon */}
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-xl border shrink-0"
                  style={{ background: brand.bg, borderColor: brand.ring }}
                >
                  {getPlatformLogo(platform.id, "h-5 w-5")}
                </div>
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-semibold" style={{ color: brand.text }}>{platform.name}</span>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-medium ${status.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{post.title}</h3>
                    </div>
                    
                    {post.postedDate && (
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 shrink-0">
                        <Clock className="h-3 w-3" />
                        {post.postedDate}
                      </span>
                    )}
                  </div>
                  
                  {/* Content preview */}
                  {post.content && (
                    <div className="bg-secondary/50 rounded-xl p-3 mb-3">
                      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 whitespace-pre-line">
                        {post.content}
                      </p>
                    </div>
                  )}
                  
                  {/* Engagement */}
                  {post.engagement && (
                    <div className="flex items-center gap-4 mb-3">
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <Eye className="h-3 w-3" />
                        {post.engagement.views.toLocaleString()} views
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {post.engagement.upvotes} upvotes
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <MessageSquare className="h-3 w-3" />
                        {post.engagement.comments} comments
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {post.status === "ready" && (
                      <Button onClick={() => publishPost(post.id)} size="sm" className="h-7 px-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground text-[11px] gap-1.5">
                        <Send className="h-3 w-3" />
                        Publish Now
                      </Button>
                    )}
                    {post.content && (
                      <Button variant="ghost" size="sm" onClick={() => copyContent(post.content)} className="h-7 px-2 text-[11px] text-muted-foreground gap-1">
                        <Copy className="h-3 w-3" />
                        Copy
                      </Button>
                    )}
                    {post.status === "posted" && (
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-[11px] text-primary gap-1">
                        <ExternalLink className="h-3 w-3" />
                        View Post
                      </Button>
                    )}
                    {post.status === "draft" && (
                      <Button variant="ghost" size="sm" onClick={() => { setSelectedPlatform(post.platform); setShowGenerator(true); }} className="h-7 px-2 text-[11px] text-primary gap-1">
                        <Sparkles className="h-3 w-3" />
                        Generate with AI
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto Distribution Settings */}
      <div className="card-reach">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <AgentBadge agent={agents.spark} mood="superhero" size={36} showRole={false} />
            <div>
              <h3 className="text-sm font-semibold text-foreground">Auto Distribution</h3>
              <p className="text-[11px] text-muted-foreground">Configure automatic posting schedules</p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {platforms.slice(0, 3).map((p) => (
            <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-2">
                <span className="shrink-0">{getPlatformLogo(p.id, "h-5 w-5")}</span>
                <span className="text-xs font-medium text-foreground">{p.name}</span>
              </div>
              <Switch defaultChecked={p.autoPost} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
