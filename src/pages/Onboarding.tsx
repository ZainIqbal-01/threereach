import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Globe, Building2, FileText, ArrowRight, ArrowLeft, Sparkles, Loader2, Rocket, Target, Zap, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import logo from "@/assets/logo.png";

const steps = [
  { id: "welcome", title: "welcome" },
  { id: "website", title: "Website URL" },
  { id: "business", title: "Business Name" },
  { id: "description", title: "Description" },
  { id: "services", title: "Services" },
  { id: "ready", title: "Ready!" },
];

const mascotEmojis = ["🤖", "🔍", "🧠", "✨", "🚀", "🎯"];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState("");
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

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: return true;
      case 1: return formData.websiteUrl.trim() !== "";
      case 2: return formData.businessName.trim() !== "";
      case 3: return true; // optional
      case 4: return true; // optional
      case 5: return true;
      default: return false;
    }
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    localStorage.setItem("businessProfile", JSON.stringify(formData));
    localStorage.setItem("onboardingComplete", "true");

    const stages = [
      { text: "🔍 Scanning ChatGPT for your brand...", progress: 15 },
      { text: "🧠 Querying Google Gemini...", progress: 30 },
      { text: "🌐 Checking Perplexity AI...", progress: 45 },
      { text: "📊 Analyzing sentiment & tone...", progress: 60 },
      { text: "🏆 Calculating visibility score...", progress: 75 },
      { text: "📋 Building your dashboard...", progress: 90 },
      { text: "✨ Almost done!", progress: 100 },
    ];

    for (const stage of stages) {
      setAnalysisStage(stage.text);
      setAnalysisProgress(stage.progress);
      await new Promise((r) => setTimeout(r, 600));
    }

    await new Promise((r) => setTimeout(r, 500));
    navigate("/dashboard");
  };

  const progressPercent = (currentStep / (steps.length - 1)) * 100;

  if (isAnalyzing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          {/* Animated mascot */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl mb-8"
          >
            🤖
          </motion.div>

          <h2 className="text-2xl font-bold text-foreground mb-2">
            Analyzing Your AI Visibility
          </h2>
          <p className="text-muted-foreground mb-8">
            Hang tight! We're scanning AI engines for <span className="font-bold text-electric">{formData.businessName || formData.websiteUrl}</span>
          </p>

          {/* Progress bar */}
          <div className="relative h-4 bg-muted rounded-full overflow-hidden mb-4">
            <motion.div
              className="absolute inset-y-0 left-0 rounded-full"
              style={{ background: "var(--gradient-fun)" }}
              animate={{ width: `${analysisProgress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>

          <motion.p
            key={analysisStage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-sm font-semibold text-foreground"
          >
            {analysisStage}
          </motion.p>

          {/* Fun floating elements */}
          <div className="relative mt-8 h-20">
            {["ChatGPT", "Gemini", "Perplexity"].map((engine, i) => (
              <motion.div
                key={engine}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: analysisProgress > (i + 1) * 20 ? 1 : 0.3,
                  scale: analysisProgress > (i + 1) * 20 ? 1 : 0.8,
                }}
                className={`inline-flex items-center gap-2 mx-2 px-4 py-2 rounded-full border-2 text-sm font-bold transition-colors ${
                  analysisProgress > (i + 1) * 20
                    ? "border-success bg-success-light text-success"
                    : "border-border bg-muted text-muted-foreground"
                }`}
              >
                {analysisProgress > (i + 1) * 20 ? "✅" : "⏳"} {engine}
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top progress bar */}
      <div className="sticky top-0 z-50 bg-card border-b-2 border-border px-6 py-4">
        <div className="max-w-xl mx-auto flex items-center gap-4">
          {currentStep > 0 && (
            <button onClick={prevStep} className="text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="h-6 w-6" />
            </button>
          )}
          <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: "var(--gradient-primary)" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <span className="text-sm font-bold text-muted-foreground">
            {currentStep}/{steps.length - 1}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-xl">
          <AnimatePresence mode="wait">
            {/* Step 0: Welcome */}
            {currentStep === 0 && (
              <motion.div
                key="welcome"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <img src={logo} alt="Three Reach" className="h-20 mx-auto mb-6" />
                </motion.div>
                
                <h1 className="text-4xl font-black text-foreground mb-4">
                  Ready to get <span className="gradient-text">discovered</span> by AI? 🚀
                </h1>
                <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
                  Let's find out how visible your business is to ChatGPT, Gemini, and Perplexity
                </p>

                <div className="flex justify-center gap-4 mb-8">
                  {[
                    { emoji: "🤖", label: "ChatGPT" },
                    { emoji: "✨", label: "Gemini" },
                    { emoji: "🔍", label: "Perplexity" },
                  ].map((engine, i) => (
                    <motion.div
                      key={engine.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.15 }}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border-2 border-border w-28"
                    >
                      <span className="text-3xl">{engine.emoji}</span>
                      <span className="text-xs font-bold text-muted-foreground">{engine.label}</span>
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={nextStep}
                  className="h-14 px-10 text-lg font-bold bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl btn-fun"
                >
                  Let's Go! <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Step 1: Website URL */}
            {currentStep === 1 && (
              <motion.div
                key="website"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <motion.span
                  className="text-6xl block mb-6"
                  animate={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🌐
                </motion.span>
                <h2 className="text-3xl font-black text-foreground mb-3">
                  What's your website?
                </h2>
                <p className="text-muted-foreground mb-8">
                  We'll scan it to understand your business
                </p>
                <div className="max-w-md mx-auto">
                  <Input
                    name="websiteUrl"
                    placeholder="https://yourwebsite.com"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    className="h-14 text-lg text-center rounded-2xl border-2 font-semibold"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed() && nextStep()}
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="mt-8 h-14 px-10 text-lg font-bold bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl btn-fun"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Business Name */}
            {currentStep === 2 && (
              <motion.div
                key="business"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <motion.span
                  className="text-6xl block mb-6"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  🏢
                </motion.span>
                <h2 className="text-3xl font-black text-foreground mb-3">
                  What's your business name?
                </h2>
                <p className="text-muted-foreground mb-8">
                  This is how AI engines should know you
                </p>
                <div className="max-w-md mx-auto">
                  <Input
                    name="businessName"
                    placeholder="Your Company Name"
                    value={formData.businessName}
                    onChange={handleInputChange}
                    className="h-14 text-lg text-center rounded-2xl border-2 font-semibold"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && canProceed() && nextStep()}
                  />
                </div>
                <Button
                  onClick={nextStep}
                  disabled={!canProceed()}
                  className="mt-8 h-14 px-10 text-lg font-bold bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl btn-fun"
                >
                  Continue <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </motion.div>
            )}

            {/* Step 3: Description */}
            {currentStep === 3 && (
              <motion.div
                key="description"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <motion.span
                  className="text-6xl block mb-6"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  📝
                </motion.span>
                <h2 className="text-3xl font-black text-foreground mb-3">
                  Tell us about your business
                </h2>
                <p className="text-muted-foreground mb-8">
                  Optional but helps us give better results!
                </p>
                <div className="max-w-md mx-auto">
                  <Textarea
                    name="description"
                    placeholder="Describe what your business does..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="min-h-[120px] text-base rounded-2xl border-2 resize-none"
                    autoFocus
                  />
                </div>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    onClick={nextStep}
                    variant="ghost"
                    className="h-14 px-8 text-lg font-bold rounded-2xl text-muted-foreground"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="h-14 px-10 text-lg font-bold bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl btn-fun"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Services */}
            {currentStep === 4 && (
              <motion.div
                key="services"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                className="text-center"
              >
                <motion.span
                  className="text-6xl block mb-6"
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                >
                  ⚡
                </motion.span>
                <h2 className="text-3xl font-black text-foreground mb-3">
                  What do you offer?
                </h2>
                <p className="text-muted-foreground mb-8">
                  Optional — list your key products or services
                </p>
                <div className="max-w-md mx-auto">
                  <Input
                    name="services"
                    placeholder="e.g., Web Dev, Marketing, Consulting"
                    value={formData.services}
                    onChange={handleInputChange}
                    className="h-14 text-lg text-center rounded-2xl border-2 font-semibold"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && nextStep()}
                  />
                </div>
                <div className="mt-8 flex items-center justify-center gap-4">
                  <Button
                    onClick={nextStep}
                    variant="ghost"
                    className="h-14 px-8 text-lg font-bold rounded-2xl text-muted-foreground"
                  >
                    Skip
                  </Button>
                  <Button
                    onClick={nextStep}
                    className="h-14 px-10 text-lg font-bold bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl btn-fun"
                  >
                    Continue <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 5: Ready */}
            {currentStep === 5 && (
              <motion.div
                key="ready"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center"
              >
                <motion.div
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="text-7xl mb-6"
                >
                  🚀
                </motion.div>
                <h2 className="text-3xl font-black text-foreground mb-3">
                  All set! Let's discover your AI visibility
                </h2>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  We'll scan <span className="font-bold text-electric">ChatGPT</span>, <span className="font-bold text-purple">Gemini</span>, and <span className="font-bold text-cyan">Perplexity</span> to see if they know about{" "}
                  <span className="font-bold text-foreground">{formData.businessName || formData.websiteUrl}</span>
                </p>

                {/* Summary cards */}
                <div className="max-w-sm mx-auto space-y-3 mb-8">
                  {[
                    { icon: "🌐", label: "Website", value: formData.websiteUrl },
                    { icon: "🏢", label: "Business", value: formData.businessName },
                    ...(formData.description ? [{ icon: "📝", label: "Description", value: formData.description.slice(0, 50) + (formData.description.length > 50 ? "..." : "") }] : []),
                    ...(formData.services ? [{ icon: "⚡", label: "Services", value: formData.services }] : []),
                  ].map((item, i) => (
                    <motion.div
                      key={item.label}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-card border-2 border-border text-left"
                    >
                      <span className="text-2xl">{item.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-muted-foreground">{item.label}</p>
                        <p className="text-sm font-semibold text-foreground truncate">{item.value}</p>
                      </div>
                      <CheckCircle2 className="h-5 w-5 text-success shrink-0" />
                    </motion.div>
                  ))}
                </div>

                <Button
                  onClick={handleAnalyze}
                  className="h-16 px-12 text-xl font-black bg-electric hover:bg-electric-hover text-primary-foreground rounded-2xl btn-fun"
                >
                  <Sparkles className="mr-2 h-6 w-6" />
                  Analyze My Visibility!
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
