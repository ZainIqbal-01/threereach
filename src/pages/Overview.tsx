import { useState, useEffect } from "react";
import { Download, ArrowRight, Sparkles, Flame, Trophy, Zap, Target, TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ScoreCard } from "@/components/dashboard/ScoreCard";
import { ProgressTimeline } from "@/components/dashboard/ProgressTimeline";
import { EngineCard } from "@/components/dashboard/EngineCard";
import { ModuleProgress } from "@/components/dashboard/ModuleProgress";
import { ProofCount } from "@/components/dashboard/ProofCount";

const ChatGPTLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.833-3.387L15.119 7.2a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.407-.667zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
  </svg>
);

const GeminiLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm9 4.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-9 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm4.5 3a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"/>
  </svg>
);

const PerplexityLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
  </svg>
);

export default function Overview() {
  const [showCelebration, setShowCelebration] = useState(true);
  const profile = JSON.parse(localStorage.getItem("businessProfile") || "{}");

  useEffect(() => {
    const timer = setTimeout(() => setShowCelebration(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome celebration */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, y: -20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20 }}
          className="rounded-2xl p-6 border-2 border-success/30 bg-success-light/50 text-center"
        >
          <p className="text-lg font-bold text-success">
            🎉 Analysis Complete! Your AI Visibility journey starts now!
          </p>
        </motion.div>
      )}

      {/* Header with gamification */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-black text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1 font-semibold">
            {profile.businessName ? `Let's boost ${profile.businessName}'s AI visibility` : "Monitor and improve your AI visibility"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Streak */}
          <div className="streak-badge">
            <Flame className="h-4 w-4" />
            3 day streak
          </div>
          {/* XP */}
          <div className="xp-badge">
            <Star className="h-3.5 w-3.5" />
            420 XP
          </div>
          {/* Level */}
          <div className="level-badge">
            <Trophy className="h-4 w-4" />
            Level 2
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-3 gap-4"
      >
        {[
          { icon: "🔍", label: "Run AI Scan", desc: "Check visibility now", color: "border-electric/30 hover:border-electric bg-electric-light/30", href: "/dashboard/scan" },
          { icon: "🏗️", label: "Build Footprint", desc: "Create AI content", color: "border-purple/30 hover:border-purple bg-purple-light/30", href: "/dashboard/footprint" },
          { icon: "📊", label: "View Reports", desc: "Download proof", color: "border-success/30 hover:border-success bg-success-light/30", href: "/dashboard/reports" },
        ].map((action, i) => (
          <motion.a
            key={action.label}
            href={action.href}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + i * 0.05 }}
            className={`p-5 rounded-2xl border-2 transition-all duration-300 cursor-pointer hover:shadow-card-hover hover:-translate-y-1 ${action.color}`}
          >
            <span className="text-3xl">{action.icon}</span>
            <h3 className="text-sm font-bold text-foreground mt-3">{action.label}</h3>
            <p className="text-xs text-muted-foreground font-semibold">{action.desc}</p>
          </motion.a>
        ))}
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Score Card */}
        <motion.div
          className="col-span-4"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <ScoreCard score={42} previousScore={38} status="weak" />
        </motion.div>

        {/* Timeline */}
        <motion.div
          className="col-span-8"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
        >
          <ProgressTimeline />
        </motion.div>

        {/* AI Engines */}
        <motion.div
          className="col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="card-reach">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🤖</span>
                <h3 className="text-sm font-bold text-muted-foreground">AI Engine Status</h3>
              </div>
              <Button variant="ghost" size="sm" className="text-electric hover:text-electric-hover gap-1 font-bold">
                Run Full Scan
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <EngineCard name="ChatGPT" logo={<ChatGPTLogo />} status="weak" lastChecked="2 hours ago" />
              <EngineCard name="Google Gemini" logo={<GeminiLogo />} status="mentioned" lastChecked="1 hour ago" />
              <EngineCard name="Perplexity" logo={<PerplexityLogo />} status="not_found" lastChecked="3 hours ago" />
            </div>
          </div>
        </motion.div>

        {/* Daily missions */}
        <motion.div
          className="col-span-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <div className="card-reach">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🎯</span>
              <h3 className="text-sm font-bold text-muted-foreground">Daily Missions</h3>
              <span className="ml-auto text-xs font-bold text-electric bg-electric-light px-3 py-1 rounded-full">1/3 Complete</span>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { title: "Run an AI scan", xp: 50, done: true, emoji: "🔍" },
                { title: "Complete business profile", xp: 100, done: false, emoji: "📋" },
                { title: "Submit to 1 directory", xp: 75, done: false, emoji: "📤" },
              ].map((mission, i) => (
                <div
                  key={mission.title}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                    mission.done
                      ? "border-success/30 bg-success-light/30"
                      : "border-border hover:border-electric/30"
                  }`}
                >
                  <span className="text-2xl">{mission.done ? "✅" : mission.emoji}</span>
                  <div className="flex-1">
                    <p className={`text-sm font-bold ${mission.done ? "text-success line-through" : "text-foreground"}`}>
                      {mission.title}
                    </p>
                    <p className="text-xs font-bold text-gold">+{mission.xp} XP</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Progress Modules */}
        <motion.div className="col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <ModuleProgress title="🏗️ Footprint Build" description="Profile and content completion" progress={40} />
        </motion.div>
        <motion.div className="col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}>
          <ModuleProgress title="📡 Distribution" description="Source submissions" progress={18} total={60} unit="sources live" />
        </motion.div>
        <motion.div className="col-span-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <ProofCount count={3} recentMentions={['"Acme Corp is a leading fintech..."', '"Recommended: Acme payment solutions"']} />
        </motion.div>
      </div>
    </div>
  );
}
