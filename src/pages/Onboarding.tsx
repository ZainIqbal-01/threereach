import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Globe, Building2, FileText, ArrowRight, Sparkles, Zap, Shield, Eye, Brain,
  BarChart3, TrendingUp, CheckCircle2, Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarAgent } from "@/components/StarAgent";
import logo from "@/assets/logo.png";

const features = [
  { icon: Eye, title: "AI Visibility Score", desc: "See how AI engines rank your brand" },
  { icon: Brain, title: "Smart Agents", desc: "6 AI agents working for you 24/7" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track mentions across all engines" },
  { icon: TrendingUp, title: "Growth Engine", desc: "Boost your AI presence automatically" },
];

const analysisSteps = [
  { label: "Connecting to ChatGPT...", icon: "🤖" },
  { label: "Scanning Google Gemini...", icon: "✨" },
  { label: "Querying Perplexity...", icon: "🔍" },
  { label: "Analyzing brand mentions...", icon: "📊" },
  { label: "Calculating visibility score...", icon: "📈" },
  { label: "Preparing your dashboard...", icon: "🚀" },
];

function FloatingOrb({ className }: { className: string }) {
  return <div className={`absolute rounded-full pointer-events-none ${className}`} />;
}

function GridPattern() {
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
  );
}

export default function Onboarding() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    websiteUrl: "",
    businessName: "",
    description: "",
    services: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAnalyze = async () => {
    if (!formData.websiteUrl && !formData.businessName) return;
    setIsAnalyzing(true);
    localStorage.setItem("businessProfile", JSON.stringify(formData));
    localStorage.setItem("onboardingComplete", "true");

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

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Rich animated background */}
      <div className="absolute inset-0">
        <GridPattern />
        {/* Gradient base */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.06]" />
        {/* Floating orbs */}
        <FloatingOrb className="top-[10%] right-[15%] w-72 h-72 bg-primary/[0.06] blur-[80px] animate-float" />
        <FloatingOrb className="bottom-[15%] left-[10%] w-96 h-96 bg-accent/[0.08] blur-[100px] animate-float" style-delay />
        <FloatingOrb className="top-[50%] left-[50%] w-64 h-64 bg-primary/[0.04] blur-[60px] animate-float" />
        {/* Radial glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-primary/[0.06] to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left panel — branding */}
        <div className="hidden lg:flex lg:w-[45%] xl:w-[42%] flex-col justify-between p-10 xl:p-14">
          <div>
            <img src={logo} alt="Three Reach" className="h-11 mb-14 animate-fade-in" />
            <h2 className="text-3xl xl:text-[2.5rem] font-bold text-foreground leading-[1.15] mb-5 animate-slide-up">
              Discover how{" "}
              <span className="gradient-text">AI engines</span>
              <br />see your brand
            </h2>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed animate-slide-up stagger-2">
              Enter your business details and our intelligent agents will scan ChatGPT, Gemini, and Perplexity to reveal your brand's AI visibility score.
            </p>
          </div>

          <div className="space-y-3 mt-10">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-card/70 border border-border/40 backdrop-blur-md hover:border-primary/20 hover:shadow-card-hover transition-all duration-300 animate-slide-up cursor-default group"
                  style={{ animationDelay: `${0.15 + i * 0.08}s`, animationFillMode: "both" }}
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/15 to-accent/10 group-hover:from-primary/25 group-hover:to-accent/20 transition-colors">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-5 mt-12 text-muted-foreground animate-fade-in stagger-5">
            {["ChatGPT", "Gemini", "Perplexity"].map(e => (
              <div key={e} className="flex items-center gap-1.5 text-xs font-medium">
                <div className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
                <span>{e}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-md animate-scale-in">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <img src={logo} alt="Three Reach" className="h-10 mx-auto mb-5" />
              <StarAgent
                mood={isAnalyzing ? "scanning" : "waving"}
                size={72}
                message={isAnalyzing ? "Scanning AI engines..." : "Let's check your AI visibility ✨"}
              />
            </div>

            {/* Desktop agent */}
            <div className="hidden lg:flex justify-center mb-5">
              <StarAgent
                mood={isAnalyzing ? "scanning" : "waving"}
                size={80}
                message={isAnalyzing ? "Scanning AI engines..." : "Hi! Let's get started ✨"}
              />
            </div>

            <div className="text-center mb-5">
              <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
                {isAnalyzing ? "Analyzing Your Brand" : "Analyze Your AI Visibility"}
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {isAnalyzing
                  ? `Scanning AI engines for "${formData.businessName || "your brand"}"...`
                  : "Enter your details to discover how AI engines see your business"}
              </p>
            </div>

            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 p-6 shadow-lg relative overflow-hidden">
              {/* Top gradient line */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

              {isAnalyzing ? (
                <div className="py-4 animate-fade-in space-y-5">
                  <div className="relative">
                    <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300 ease-out relative"
                        style={{
                          width: `${progress}%`,
                          background: `linear-gradient(90deg, hsl(var(--primary)), hsl(var(--accent)))`,
                        }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" style={{ backgroundSize: '200% 100%' }} />
                      </div>
                    </div>
                    <span className="absolute right-0 -top-6 text-xs font-mono text-primary font-bold">{progress}%</span>
                  </div>

                  <div className="space-y-2">
                    {analysisSteps.map((step, i) => (
                      <div
                        key={i}
                        className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-500 ${
                          i < currentStep
                            ? "bg-success/10 border border-success/20"
                            : i === currentStep
                            ? "bg-primary/10 border border-primary/25"
                            : "opacity-30 border border-transparent"
                        }`}
                      >
                        <span className="text-base shrink-0">{step.icon}</span>
                        <span className="text-xs font-medium text-foreground flex-1">{step.label}</span>
                        {i < currentStep && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {i === currentStep && (
                          <div className="h-4 w-4 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Globe className="h-3 w-3" />Website URL
                      </label>
                      <Input
                        name="websiteUrl"
                        placeholder="https://yourwebsite.com"
                        value={formData.websiteUrl}
                        onChange={handleInputChange}
                        className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card transition-colors focus-glow"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                        <Building2 className="h-3 w-3" />Business Name *
                      </label>
                      <Input
                        name="businessName"
                        placeholder="Your Company Name"
                        value={formData.businessName}
                        onChange={handleInputChange}
                        className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card transition-colors focus-glow"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <FileText className="h-3 w-3" />Description
                    </label>
                    <Textarea
                      name="description"
                      placeholder="Describe your business, products, and target audience..."
                      value={formData.description}
                      onChange={handleInputChange}
                      className="min-h-[90px] rounded-xl border-border/60 bg-secondary/30 focus:bg-card resize-none transition-colors focus-glow"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                      <Sparkles className="h-3 w-3" />Key Services / Products
                    </label>
                    <Input
                      name="services"
                      placeholder="e.g., Web Dev, Marketing, AI Solutions"
                      value={formData.services}
                      onChange={handleInputChange}
                      className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card transition-colors focus-glow"
                    />
                  </div>

                  <Button
                    onClick={handleAnalyze}
                    disabled={!isFormValid}
                    className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2.5 btn-primary-glow group"
                  >
                    <Rocket className="h-4 w-4 group-hover:animate-bounce" />
                    Analyze My AI Visibility
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>

                  <p className="text-center text-[10px] text-muted-foreground pt-1">
                    Free scan • No credit card required • Results in 30 seconds
                  </p>
                </div>
              )}
            </div>

            {/* Mobile trust badges */}
            <div className="lg:hidden mt-6 flex items-center justify-center gap-5 text-muted-foreground">
              {["ChatGPT", "Gemini", "Perplexity"].map(engine => (
                <div key={engine} className="flex items-center gap-1.5 text-xs font-medium">
                  <div className="h-1.5 w-1.5 rounded-full bg-success pulse-dot" />
                  <span>{engine}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
