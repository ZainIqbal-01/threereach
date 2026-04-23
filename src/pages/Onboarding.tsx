import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe, Building2, FileText, ArrowRight, Sparkles, Eye, Brain,
  BarChart3, TrendingUp, CheckCircle2, Rocket, Star
} from "lucide-react";
import { EngineStatusBadge, getEngineLogo } from "@/components/ui/ai-engine-logos";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarAgent } from "@/components/StarAgent";
import { sanitize, validateOnboardingForm } from "@/lib/validation";
import { useAuth } from "@/hooks/useAuth";
import { useBusinessProfile } from "@/hooks/useBusinessProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

const features = [
  { icon: Eye, title: "AI Visibility Score", desc: "See how AI engines rank your brand" },
  { icon: Brain, title: "Smart Agents", desc: "6 AI agents working for you 24/7" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track mentions across all engines" },
  { icon: TrendingUp, title: "Growth Engine", desc: "Boost your AI presence automatically" },
];

const analysisSteps = [
  { label: "Connecting to ChatGPT...", icon: "chatgpt" as const },
  { label: "Scanning Google Gemini...", icon: "gemini" as const },
  { label: "Querying Perplexity...", icon: "perplexity" as const },
  { label: "Analyzing brand mentions...", icon: "📊" },
  { label: "Calculating visibility score...", icon: "📈" },
  { label: "Preparing your dashboard...", icon: "🚀" },
];

const stats = [
  { value: "10K+", label: "Brands Analyzed" },
  { value: "3", label: "AI Engines" },
  { value: "24/7", label: "Monitoring" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { profile, update } = useBusinessProfile();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    websiteUrl: "",
    businessName: "",
    description: "",
    services: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Redirect to /auth if signed out, or to /dashboard if onboarding already complete
  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      navigate("/auth", { replace: true });
      return;
    }
    if (profile.onboardingComplete) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, authLoading, profile.onboardingComplete, navigate]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const sanitized = sanitize(value);
    setFormData((prev) => ({ ...prev, [name]: sanitized }));
    setFormErrors((prev) => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const handleAnalyze = async () => {
    const validation = validateOnboardingForm(formData);
    if (!validation.valid) {
      setFormErrors(validation.errors);
      return;
    }
    setFormErrors({});
    setIsAnalyzing(true);
    await update({
      businessName: formData.businessName,
      websiteUrl: formData.websiteUrl,
      description: formData.description,
      onboardingComplete: true,
    });

    for (let i = 0; i < analysisSteps.length; i++) {
      setCurrentStep(i);
      const target = Math.round(((i + 1) / analysisSteps.length) * 100);
      for (let p = (i === 0 ? 0 : Math.round((i / analysisSteps.length) * 100)); p <= target; p += 2) {
        await new Promise(r => setTimeout(r, 35));
        setProgress(p);
      }
      setProgress(target);
      await new Promise(r => setTimeout(r, 350));
    }
    await new Promise(r => setTimeout(r, 300));
    navigate("/dashboard");
  };

  const isFormValid = formData.websiteUrl.trim() !== "" || formData.businessName.trim() !== "";
  void user; // referenced via guard

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated mesh background */}
      <div className="absolute inset-0">
        {/* Grid pattern */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="currentColor" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        {/* Gradient layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.03] via-background to-accent/[0.04]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary/[0.07] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent/[0.05] rounded-full blur-[120px] animate-float" />
        <div className="absolute top-1/4 -right-20 w-[400px] h-[400px] bg-primary/[0.04] rounded-full blur-[100px] animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left panel — branding showcase */}
        <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col p-10 xl:p-14">
          <div className="flex-1 flex flex-col justify-center">
            <img src={logo} alt="Three Reach" className="h-12 w-auto object-contain mb-10 animate-fade-in" />
            
            <div className="mb-2 animate-slide-up">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/8 text-primary border border-primary/15">
                <Star className="h-3 w-3" /> AI-Powered Platform
              </span>
            </div>
            
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-[1.15] mb-4 animate-slide-up stagger-1" style={{ animationFillMode: 'both' }}>
              Discover how{" "}
              <span className="gradient-text">AI engines</span>
              <br />see your brand
            </h2>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed animate-slide-up stagger-2" style={{ animationFillMode: 'both' }}>
              Enter your business details and our intelligent agents will scan ChatGPT, Gemini, and Perplexity to reveal your brand's AI visibility score.
            </p>

            {/* Stats row */}
            <div className="flex items-center gap-6 mt-8 mb-8 animate-slide-up stagger-3" style={{ animationFillMode: 'both' }}>
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-xl font-bold gradient-text">{s.value}</p>
                  <p className="text-[10px] text-muted-foreground font-medium mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>

            {/* Feature cards */}
            <div className="space-y-2.5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm hover:border-primary/20 hover:bg-card/80 transition-all duration-300 animate-slide-up group"
                    style={{ animationDelay: `${0.2 + i * 0.07}s`, animationFillMode: "both" }}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/12 to-accent/8 group-hover:from-primary/20 group-hover:to-accent/15 transition-colors">
                      <Icon className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="text-[13px] font-semibold text-foreground">{f.title}</p>
                      <p className="text-[11px] text-muted-foreground">{f.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Engine status */}
            <div className="flex items-center gap-5 mt-8 text-muted-foreground animate-fade-in stagger-5" style={{ animationFillMode: 'both' }}>
              {["ChatGPT", "Gemini", "Perplexity"].map(e => (
                <EngineStatusBadge key={e} name={e} />
              ))}
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[420px] animate-scale-in">
            {/* Mobile header */}
            <div className="lg:hidden text-center mb-6">
              <img src={logo} alt="Three Reach" className="h-12 w-auto object-contain mx-auto mb-4" />
              <StarAgent
                mood={isAnalyzing ? "scanning" : "waving"}
                size={68}
                message={isAnalyzing ? "Scanning AI engines..." : "Let's check your AI visibility ✨"}
              />
            </div>

            {/* Desktop agent */}
            <div className="hidden lg:flex justify-center mb-4">
              <StarAgent
                mood={isAnalyzing ? "scanning" : "waving"}
                size={76}
                message={isAnalyzing ? "Scanning AI engines..." : "Hi! Let's get started ✨"}
              />
            </div>

            <div className="text-center mb-5">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                {isAnalyzing ? "Analyzing Your Brand" : "Analyze Your AI Visibility"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isAnalyzing
                  ? `Scanning AI engines for "${formData.businessName || "your brand"}"...`
                  : "Enter your details to discover how AI engines see your business"}
              </p>
            </div>

            {/* Main card */}
            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg relative overflow-hidden">
              {/* Gradient border top */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              
              <div className="p-6">
                {isAnalyzing ? (
                  <div className="py-3 animate-fade-in space-y-5">
                    {/* Progress bar */}
                    <div className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-medium text-muted-foreground">Scanning progress</span>
                        <span className="text-xs font-mono text-primary font-bold">{progress}%</span>
                      </div>
                      <div className="w-full h-2.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300 ease-out relative"
                          style={{
                            width: `${progress}%`,
                            background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
                          }}
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                        </div>
                      </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-1.5">
                      {analysisSteps.map((step, i) => (
                        <div
                          key={i}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-500 ${
                            i < currentStep
                              ? "bg-success/8 border border-success/15"
                              : i === currentStep
                              ? "bg-primary/8 border border-primary/20"
                              : "opacity-25 border border-transparent"
                          }`}
                        >
                          <span className="text-sm shrink-0">{["chatgpt","gemini","perplexity"].includes(step.icon) ? getEngineLogo(step.icon, "h-4 w-4") : step.icon}</span>
                          <span className="text-[12px] font-medium text-foreground flex-1">{step.label}</span>
                          {i < currentStep && <CheckCircle2 className="h-3.5 w-3.5 text-success" />}
                          {i === currentStep && (
                            <div className="h-3.5 w-3.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Globe className="h-3 w-3" />Website URL
                        </label>
                        <Input
                          name="websiteUrl"
                          placeholder="https://yourwebsite.com"
                          value={formData.websiteUrl}
                          onChange={handleInputChange}
                          maxLength={500}
                          className={`h-10 rounded-xl border-border/60 bg-secondary/30 focus:bg-card transition-colors focus-glow text-sm ${formErrors.websiteUrl ? "border-destructive" : ""}`}
                        />
                        {formErrors.websiteUrl && <p className="text-[10px] text-destructive mt-1">{formErrors.websiteUrl}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                          <Building2 className="h-3 w-3" />Business Name *
                        </label>
                        <Input
                          name="businessName"
                          placeholder="Your Company Name"
                          value={formData.businessName}
                          onChange={handleInputChange}
                          maxLength={200}
                          className={`h-10 rounded-xl border-border/60 bg-secondary/30 focus:bg-card transition-colors focus-glow text-sm ${formErrors.businessName ? "border-destructive" : ""}`}
                        />
                        {formErrors.businessName && <p className="text-[10px] text-destructive mt-1">{formErrors.businessName}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <FileText className="h-3 w-3" />Description
                      </label>
                      <Textarea
                        name="description"
                        placeholder="Describe your business, products, and target audience..."
                        value={formData.description}
                        onChange={handleInputChange}
                        maxLength={1000}
                        className={`min-h-[80px] rounded-xl border-border/60 bg-secondary/30 focus:bg-card resize-none transition-colors focus-glow text-sm ${formErrors.description ? "border-destructive" : ""}`}
                      />
                      {formErrors.description && <p className="text-[10px] text-destructive mt-1">{formErrors.description}</p>}
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Sparkles className="h-3 w-3" />Key Services / Products
                      </label>
                      <Input
                        name="services"
                        placeholder="e.g., Web Dev, Marketing, AI Solutions"
                        value={formData.services}
                        onChange={handleInputChange}
                        maxLength={500}
                        className={`h-10 rounded-xl border-border/60 bg-secondary/30 focus:bg-card transition-colors focus-glow text-sm ${formErrors.services ? "border-destructive" : ""}`}
                      />
                    </div>

                    <Button
                      onClick={handleAnalyze}
                      disabled={!isFormValid}
                      className="w-full h-11 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 btn-primary-glow group"
                    >
                      <Rocket className="h-4 w-4 group-hover:animate-bounce" />
                      Analyze My AI Visibility
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>

                    <p className="text-center text-[10px] text-muted-foreground">
                      Free scan • No credit card required • Results in 30 seconds
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile trust badges */}
            <div className="lg:hidden mt-5 flex items-center justify-center gap-5 text-muted-foreground">
              {["ChatGPT", "Gemini", "Perplexity"].map(engine => (
                <EngineStatusBadge key={engine} name={engine} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
