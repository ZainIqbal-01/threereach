import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Building2, FileText, ArrowRight, Sparkles, Loader2, Shield, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { StarAgent } from "@/components/StarAgent";
import logo from "@/assets/logo.png";

export default function Onboarding() {
  const navigate = useNavigate();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
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
    
    // Animated progress
    const steps = [10, 25, 40, 55, 70, 85, 95, 100];
    for (let i = 0; i < steps.length; i++) {
      await new Promise(r => setTimeout(r, 300));
      setProgress(steps[i]);
    }
    await new Promise(r => setTimeout(r, 400));
    navigate("/dashboard");
  };

  const isFormValid = formData.websiteUrl.trim() !== "" || formData.businessName.trim() !== "";

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-5">
            <img src={logo} alt="Three Reach" className="h-12" />
          </div>
          <div className="flex justify-center mb-4">
            <StarAgent 
              mood={isAnalyzing ? "scanning" : "waving"} 
              size={80} 
              message={isAnalyzing ? "Scanning AI engines..." : "Hi! Let's check your AI visibility ✨"}
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Analyze Your AI Visibility
          </h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Enter your details to discover how AI engines see your business
          </p>
        </div>

        {/* Form */}
        <div className="card-reach">
          {isAnalyzing ? (
            <div className="py-8 text-center animate-fade-in">
              <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-4">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {progress < 30 ? "Querying ChatGPT..." : progress < 60 ? "Scanning Gemini..." : progress < 90 ? "Analyzing Perplexity..." : "Preparing dashboard..."}
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    <Globe className="h-3 w-3 inline mr-1" />Website URL
                  </label>
                  <Input name="websiteUrl" placeholder="https://yourwebsite.com" value={formData.websiteUrl}
                    onChange={handleInputChange} className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card" />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                    <Building2 className="h-3 w-3 inline mr-1" />Business Name
                  </label>
                  <Input name="businessName" placeholder="Your Company" value={formData.businessName}
                    onChange={handleInputChange} className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card" />
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  <FileText className="h-3 w-3 inline mr-1" />Description
                </label>
                <Textarea name="description" placeholder="Describe your business, products, and services..."
                  value={formData.description} onChange={handleInputChange}
                  className="min-h-[80px] rounded-xl border-border/60 bg-secondary/30 focus:bg-card resize-none" />
              </div>

              <div>
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  <Sparkles className="h-3 w-3 inline mr-1" />Key Services
                </label>
                <Input name="services" placeholder="e.g., Web Dev, Marketing, AI Solutions"
                  value={formData.services} onChange={handleInputChange}
                  className="h-11 rounded-xl border-border/60 bg-secondary/30 focus:bg-card" />
              </div>

              <Button onClick={handleAnalyze} disabled={!isFormValid}
                className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-sm gap-2 btn-primary-glow">
                <Zap className="h-4 w-4" />
                Analyze My AI Visibility
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Trust badges */}
        <div className="mt-6 flex items-center justify-center gap-6 text-muted-foreground">
          {["ChatGPT", "Gemini", "Perplexity"].map((engine) => (
            <div key={engine} className="flex items-center gap-1.5 text-xs">
              <Shield className="h-3 w-3" />
              <span className="font-medium">{engine}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
