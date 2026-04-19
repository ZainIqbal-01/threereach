import { useState } from "react";
import { Check, Edit2, Eye, RefreshCw, FileText, HelpCircle, Shield, User, Sparkles, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AgentBadge } from "@/components/agents/AgentBadge";
import { agents } from "@/components/agents/agentRegistry";
import { toast } from "@/hooks/use-toast";
import { useBusinessName } from "@/hooks/useBusinessName";
import { BrandContextEditor, BrandContextValue } from "@/components/footprint/BrandContext";
import { EEATPanel, EEATState, EEATKey } from "@/components/footprint/EEATPanel";
import { SchemaGenerators } from "@/components/footprint/SchemaGenerators";
import { FootprintScore } from "@/components/footprint/FootprintScore";
import { GeoLandingPreview } from "@/components/footprint/GeoLandingPreview";
import { geoLandingTemplate } from "@/components/footprint/templates";

interface ContentAsset {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "draft" | "published" | "needs_update";
  lastUpdated?: string;
  content?: string;
}

interface ProfileField {
  name: string;
  completed: boolean;
  value?: string;
}

const defaultBrandCtx: BrandContextValue = {
  sector: "Fintech",
  audience: "SMB founders & finance teams",
  usp: "",
  founderName: "",
  founderTitle: "",
  yearFounded: "2020",
  hqLocation: "Global",
};

const defaultEEAT: EEATState = {
  experience: { enabled: false, content: "" },
  expertise: { enabled: false, content: "" },
  authority: { enabled: false, content: "" },
  trust: { enabled: false, content: "" },
};

export default function BuildFootprint() {
  const businessName = useBusinessName();
  const [brandCtx, setBrandCtx] = useState<BrandContextValue>(defaultBrandCtx);
  const [eeat, setEeat] = useState<EEATState>(defaultEEAT);
  const [activeTab, setActiveTab] = useState("identity");

  const [profileFields, setProfileFields] = useState<ProfileField[]>([
    { name: "Business Description", completed: true, value: "Leading fintech company" },
    { name: "Core Services", completed: true, value: "Payment processing, APIs" },
    { name: "Founding Year", completed: true, value: "2020" },
    { name: "Location & Markets", completed: true, value: "Global" },
    { name: "Trust Statements", completed: false },
    { name: "Key Differentiators", completed: false },
    { name: "Client Testimonials", completed: false },
    { name: "Awards & Recognition", completed: false },
  ]);

  const [contentAssets, setContentAssets] = useState<ContentAsset[]>([
    { id: "landing", title: "AI Landing Page", description: "Optimized page for AI engine discovery", icon: <FileText className="h-5 w-5" />, status: "published", lastUpdated: "Jan 15, 2026", content: geoLandingTemplate({ name: businessName, ctx: defaultBrandCtx }) },
    { id: "knowledge", title: "Knowledge Base Page", description: "Structured business information", icon: <FileText className="h-5 w-5" />, status: "draft", content: "" },
    { id: "faq", title: "FAQ Schema", description: "Structured Q&A for AI engines", icon: <HelpCircle className="h-5 w-5" />, status: "needs_update", lastUpdated: "Dec 28, 2025" },
    { id: "trust", title: "Trust Page", description: "Credibility and trust signals", icon: <Shield className="h-5 w-5" />, status: "draft", content: "" },
    { id: "founder", title: "Founder Profile Page", description: "Leadership visibility content", icon: <User className="h-5 w-5" />, status: "published", lastUpdated: "Jan 10, 2026" },
  ]);

  const [editingField, setEditingField] = useState<number | null>(null);
  const [fieldValue, setFieldValue] = useState("");
  const [editingAsset, setEditingAsset] = useState<string | null>(null);
  const [assetContent, setAssetContent] = useState("");
  const [previewingAsset, setPreviewingAsset] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [previewingEeat, setPreviewingEeat] = useState<EEATKey | null>(null);

  const completedFields = profileFields.filter((f) => f.completed).length;
  const profileProgress = (completedFields / profileFields.length) * 100;
  const publishedAssets = contentAssets.filter((a) => a.status === "published").length;

  const statusConfig = {
    draft: { label: "Draft", className: "bg-secondary text-muted-foreground" },
    published: { label: "Published", className: "bg-success-light text-success border border-success/20" },
    needs_update: { label: "Needs Update", className: "bg-warning-light text-warning border border-warning/20" },
  };

  const startEditField = (index: number) => {
    setEditingField(index);
    setFieldValue(profileFields[index].value || "");
  };

  const saveField = (index: number) => {
    if (!fieldValue.trim()) {
      toast({ title: "Enter a value", variant: "destructive" });
      return;
    }
    setProfileFields(prev => prev.map((f, i) => i === index ? { ...f, completed: true, value: fieldValue } : f));
    setEditingField(null);
    setFieldValue("");
    toast({ title: "✅ Field saved", description: `${profileFields[index].name} has been updated` });
  };

  const startEditAsset = (id: string) => {
    const asset = contentAssets.find(a => a.id === id);
    setEditingAsset(id);
    setAssetContent(asset?.content || "");
  };

  const saveAsset = () => {
    if (!editingAsset) return;
    setContentAssets(prev => prev.map(a =>
      a.id === editingAsset
        ? { ...a, content: assetContent, status: "published" as const, lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
        : a
    ));
    setEditingAsset(null);
    toast({ title: "✅ Content saved & published", description: "Your content asset has been updated" });
  };

  const autoGenerate = () => {
    setIsGenerating(true);
    toast({ title: "⚡ Auto-generating content…", description: "AI is creating GEO/AEO-optimized content for all draft assets" });

    setTimeout(() => {
      setContentAssets(prev => prev.map(a => {
        if (a.status === "draft" || a.status === "needs_update") {
          return {
            ...a,
            content: a.id === "landing"
              ? geoLandingTemplate({ name: businessName, ctx: brandCtx })
              : `# ${a.title}\n\nAI-generated content for ${a.description}.\n\nThis content has been optimized for AI engine discovery using ${businessName}'s brand context.`,
            status: "published" as const,
            lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          };
        }
        return a;
      }));
      setIsGenerating(false);
      toast({ title: "🎉 All content generated!", description: "AI has created and published optimized content for all assets" });
    }, 2000);
  };

  const publishLanding = () => {
    setIsPublishing(true);
    setTimeout(() => {
      setContentAssets(prev => prev.map(a => a.id === "landing"
        ? { ...a, content: geoLandingTemplate({ name: businessName, ctx: brandCtx }), status: "published" as const, lastUpdated: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
        : a
      ));
      setIsPublishing(false);
      toast({ title: "🚀 Landing published", description: "Your GEO/AEO-optimized landing page is live" });
    }, 1200);
  };

  const handleFix = (action: "context" | "profile" | "assets" | "eeat") => {
    if (action === "context") setActiveTab("identity");
    if (action === "profile") setActiveTab("identity");
    if (action === "assets") { setActiveTab("assets"); autoGenerate(); }
    if (action === "eeat") setActiveTab("eeat");
  };

  const previewAsset = contentAssets.find(a => a.id === previewingAsset);
  const editAsset = contentAssets.find(a => a.id === editingAsset);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:justify-between">
        <div className="flex items-center gap-4">
          <AgentBadge agent={agents.atlas} isWorking={isGenerating || isPublishing} size={48} />
          <div>
            <h1 className="text-xl font-bold text-foreground">Build AI Footprint</h1>
            <p className="text-sm text-muted-foreground">Atlas builds GEO, AEO & E-E-A-T content that AI engines trust</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-primary/10 text-primary">GEO</span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-accent/10 text-accent">AEO</span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-success-light text-success">E-E-A-T</span>
          <span className="px-2 py-1 rounded-lg text-[10px] font-semibold bg-warning-light text-warning">Schema</span>
        </div>
      </div>

      {/* Score strip */}
      <FootprintScore
        ctx={brandCtx}
        profileCompleted={completedFields}
        profileTotal={profileFields.length}
        publishedAssets={publishedAssets}
        totalAssets={contentAssets.length}
        eeat={eeat}
        onFix={handleFix}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 rounded-xl">
          <TabsTrigger value="identity" className="text-xs rounded-lg">Identity</TabsTrigger>
          <TabsTrigger value="landing" className="text-xs rounded-lg">GEO Landing</TabsTrigger>
          <TabsTrigger value="eeat" className="text-xs rounded-lg">E-E-A-T</TabsTrigger>
          <TabsTrigger value="schema" className="text-xs rounded-lg">Schema</TabsTrigger>
          <TabsTrigger value="assets" className="text-xs rounded-lg">Assets</TabsTrigger>
        </TabsList>

        {/* IDENTITY */}
        <TabsContent value="identity" className="mt-5">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-7">
              <BrandContextEditor value={brandCtx} onChange={setBrandCtx} />
            </div>
            <div className="lg:col-span-5">
              <div className="card-reach h-full">
                <h3 className="text-sm font-semibold text-foreground mb-1">Knowledge Identity</h3>
                <p className="text-[11px] text-muted-foreground mb-5">Complete your business profile for AI optimization</p>

                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-foreground">Completeness</span>
                    <span className="text-xs font-bold text-primary">{Math.round(profileProgress)}%</span>
                  </div>
                  <Progress value={profileProgress} className="h-2" />
                </div>

                <div className="space-y-2">
                  {profileFields.map((field, i) => (
                    <div key={i} className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-200 ${
                      field.completed ? "bg-success-light/50 border-success/20" : "bg-secondary/30 border-border/60 hover:border-primary/30"
                    }`}>
                      {editingField === i ? (
                        <div className="flex items-center gap-2 w-full">
                          <Input value={fieldValue} onChange={(e) => setFieldValue(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && saveField(i)}
                            placeholder={`Enter ${field.name}…`}
                            className="h-7 text-xs flex-1" autoFocus />
                          <Button size="sm" onClick={() => saveField(i)} className="h-7 px-2"><Save className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => setEditingField(null)} className="h-7 px-2"><X className="h-3 w-3" /></Button>
                        </div>
                      ) : (
                        <>
                          <div className="flex items-center gap-2.5">
                            <div className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                              field.completed ? "bg-success text-primary-foreground" : "bg-secondary text-muted-foreground"
                            }`}>
                              {field.completed ? <Check className="h-3 w-3" /> : <span>{i + 1}</span>}
                            </div>
                            <div>
                              <span className={`text-xs ${field.completed ? "text-foreground" : "text-muted-foreground"}`}>{field.name}</span>
                              {field.value && <p className="text-[10px] text-muted-foreground">{field.value}</p>}
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => startEditField(i)} className="text-primary h-6 px-2 text-[10px]">
                            {field.completed ? "Edit" : "Add"}
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* GEO LANDING */}
        <TabsContent value="landing" className="mt-5">
          <GeoLandingPreview businessName={businessName} ctx={brandCtx} onPublish={publishLanding} isPublishing={isPublishing} />
        </TabsContent>

        {/* E-E-A-T */}
        <TabsContent value="eeat" className="mt-5">
          <EEATPanel
            businessName={businessName}
            ctx={brandCtx}
            state={eeat}
            onChange={setEeat}
            onPreview={(k) => setPreviewingEeat(k)}
          />
        </TabsContent>

        {/* SCHEMA */}
        <TabsContent value="schema" className="mt-5">
          <SchemaGenerators businessName={businessName} ctx={brandCtx} />
        </TabsContent>

        {/* ASSETS */}
        <TabsContent value="assets" className="mt-5">
          <div className="card-reach">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-foreground">AI Content Assets</h3>
                <p className="text-[11px] text-muted-foreground">Publish optimized content for AI discovery</p>
              </div>
              <Button size="sm" onClick={autoGenerate} disabled={isGenerating}
                className="h-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs gap-1">
                {isGenerating ? <RefreshCw className="h-3 w-3 animate-spin" /> : <Sparkles className="h-3 w-3" />}
                {isGenerating ? "Generating…" : "Auto-Generate"}
              </Button>
            </div>

            <div className="space-y-3">
              {contentAssets.map((asset) => {
                const status = statusConfig[asset.status];
                return (
                  <div key={asset.id} className="flex items-center justify-between p-4 rounded-xl border border-border/60 hover:border-primary/20 transition-all duration-200 group">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        {asset.icon}
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-foreground">{asset.title}</h4>
                        <p className="text-[10px] text-muted-foreground">{asset.description}</p>
                        {asset.lastUpdated && <p className="text-[10px] text-muted-foreground mt-0.5">Updated: {asset.lastUpdated}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-medium ${status.className}`}>{status.label}</span>
                      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => startEditAsset(asset.id)}>
                          <Edit2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => setPreviewingAsset(asset.id)}>
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit Modal */}
      {editingAsset && editAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in p-4" onClick={() => setEditingAsset(null)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-2xl w-full animate-scale-in shadow-lg max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Edit: {editAsset.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setEditingAsset(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>
            <Textarea value={assetContent} onChange={(e) => setAssetContent(e.target.value)}
              className="min-h-[300px] rounded-xl border-border/60 bg-secondary/30 font-mono text-xs" />
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setEditingAsset(null)} className="rounded-xl text-xs">Cancel</Button>
              <Button onClick={saveAsset} className="rounded-xl text-xs gap-1 bg-primary hover:bg-primary/90 text-primary-foreground">
                <Save className="h-3 w-3" /> Save & Publish
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewingAsset && previewAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in p-4" onClick={() => setPreviewingAsset(null)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-2xl w-full animate-scale-in shadow-lg max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground">Preview: {previewAsset.title}</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewingAsset(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>
            <div className="bg-secondary/30 rounded-xl p-5 border border-border/40">
              {previewAsset.content ? (
                <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-sans">{previewAsset.content}</pre>
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-muted-foreground mb-3">No content yet</p>
                  <Button size="sm" onClick={() => { setPreviewingAsset(null); startEditAsset(previewAsset.id); }} className="rounded-xl text-xs gap-1">
                    <Edit2 className="h-3 w-3" /> Create Content
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* E-E-A-T Preview Modal */}
      {previewingEeat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm animate-fade-in p-4" onClick={() => setPreviewingEeat(null)}>
          <div className="bg-card rounded-2xl border border-border/60 p-6 max-w-2xl w-full animate-scale-in shadow-lg max-h-[80vh] overflow-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-foreground capitalize">{previewingEeat} content</h3>
              <Button variant="ghost" size="sm" onClick={() => setPreviewingEeat(null)} className="h-7 w-7 p-0"><X className="h-4 w-4" /></Button>
            </div>
            <div className="bg-secondary/30 rounded-xl p-5 border border-border/40">
              <pre className="text-xs text-foreground whitespace-pre-wrap leading-relaxed font-sans">{eeat[previewingEeat].content}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
