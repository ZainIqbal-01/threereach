import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, Eye, Brain, BarChart3, TrendingUp, Shield, Zap, 
  Globe, CheckCircle2, Star, Sparkles, ChevronRight, Play,
  Bot, Search, Share2, Award, LineChart
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getEngineLogo } from "@/components/ui/ai-engine-logos";
import logo from "@/assets/logo.png";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "AI Engines", href: "#engines" },
  { label: "Pricing", href: "#pricing" },
];

const features = [
  { icon: Eye, title: "AI Visibility Score", desc: "Monitor how AI engines like ChatGPT, Gemini, and Perplexity rank and recommend your brand in real-time.", color: "from-primary to-primary/70" },
  { icon: Brain, title: "6 Smart AI Agents", desc: "Autonomous agents working 24/7 to optimize your content, monitor mentions, and strengthen your AI footprint.", color: "from-accent to-cyan" },
  { icon: BarChart3, title: "Brand Intelligence", desc: "Deep analytics powered by AI to understand your competitive positioning across all generative search engines.", color: "from-primary to-accent" },
  { icon: Shield, title: "Proof & Tracking", desc: "Capture timestamped evidence of your AI visibility with legally defensible proof screenshots.", color: "from-success to-success/70" },
  { icon: TrendingUp, title: "Growth Automation", desc: "Automatically generate optimized content, distribute it across platforms, and boost your AI presence.", color: "from-warning to-warning/70" },
  { icon: Globe, title: "Multi-Engine Coverage", desc: "Comprehensive monitoring across ChatGPT, Google Gemini, Perplexity, Claude, Copilot, and Meta AI.", color: "from-cyan to-accent" },
];

const howItWorks = [
  { step: "01", title: "Connect Your Brand", desc: "Enter your business details and let our AI scan your current visibility across all major AI engines.", icon: Search },
  { step: "02", title: "AI Agents Activate", desc: "Six specialized agents analyze, optimize, and create content tailored for AI engine discovery.", icon: Bot },
  { step: "03", title: "Build & Distribute", desc: "Generate AI-optimized content and distribute it across platforms to maximize your AI footprint.", icon: Share2 },
  { step: "04", title: "Track & Prove", desc: "Monitor real-time visibility changes with timestamped proof and comprehensive analytics.", icon: Award },
];

const engines = [
  { name: "ChatGPT", key: "chatgpt" as const, desc: "OpenAI's conversational AI" },
  { name: "Google Gemini", key: "gemini" as const, desc: "Google's multimodal AI" },
  { name: "Perplexity", key: "perplexity" as const, desc: "AI-powered search engine" },
  { name: "Claude", key: "claude" as const, desc: "Anthropic's AI assistant" },
  { name: "Copilot", key: "copilot" as const, desc: "Microsoft's AI companion" },
  { name: "Meta AI", key: "meta" as const, desc: "Meta's AI platform" },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    desc: "For small businesses getting started with AI visibility.",
    features: ["AI Visibility Score", "3 AI Engine Monitoring", "Weekly Reports", "Basic Analytics", "Email Support"],
    cta: "Start Free Trial",
    popular: false,
  },
  {
    name: "Professional",
    price: "$149",
    period: "/month",
    desc: "For growing businesses serious about AI presence.",
    features: ["Everything in Starter", "6 AI Engine Monitoring", "6 Smart AI Agents", "Brand Intelligence", "Content Generation", "Priority Support"],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations requiring full AI visibility control.",
    features: ["Everything in Professional", "Unlimited Scans", "Custom Integrations", "API Access", "Dedicated Manager", "SLA Guarantee"],
    cta: "Contact Sales",
    popular: false,
  },
];

const testimonials = [
  { name: "Sarah Chen", role: "CMO, TechFlow", text: "Three Reach transformed how we appear in AI search. Our ChatGPT mentions increased 340% in 3 months.", avatar: "SC" },
  { name: "Marcus Williams", role: "Founder, GrowthLab", text: "The AI agents work around the clock. We went from invisible to being recommended by every major AI engine.", avatar: "MW" },
  { name: "Elena Rodriguez", role: "VP Marketing, DataBridge", text: "Finally, a platform that treats AI visibility as seriously as traditional SEO. Game-changing analytics.", avatar: "ER" },
];

const stats = [
  { value: "10K+", label: "Brands Monitored" },
  { value: "6", label: "AI Engines Tracked" },
  { value: "340%", label: "Avg. Visibility Boost" },
  { value: "24/7", label: "Agent Monitoring" },
];

export default function LandingPage() {
  const navigate = useNavigate();

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      {/* ─── Navbar ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 h-16">
          <div className="flex items-center gap-2">
            <img src={logo} alt="Three Reach AI" className="h-8 w-auto" />
            <span className="text-lg font-bold text-foreground tracking-tight">Three Reach</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => (
              <button key={l.href} onClick={() => scrollTo(l.href)} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {l.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate("/onboarding")} className="hidden sm:inline-flex">
              Log in
            </Button>
            <Button size="sm" onClick={() => navigate("/onboarding")} className="btn-primary-glow">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 gradient-hero" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-1/4 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">The Future of AI Visibility is Here</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 animate-slide-up">
            Make Your Business{" "}
            <span className="gradient-text">Discoverable</span>
            <br />
            <span className="text-foreground">in AI</span>
          </h1>
          
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground mb-10 animate-slide-up stagger-2">
            Monitor, optimize, and grow your brand's presence across ChatGPT, Gemini, Perplexity, and every major AI engine — all from one intelligent platform.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up stagger-3">
            <Button size="lg" onClick={() => navigate("/onboarding")} className="btn-primary-glow text-base px-8 h-12">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => scrollTo("#how-it-works")} className="text-base px-8 h-12">
              <Play className="w-4 h-4" /> See How It Works
            </Button>
          </div>

          {/* Engine logos row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 opacity-60">
            {engines.map(e => (
              <div key={e.key} className="flex items-center gap-2">
                <img src={getEngineLogo(e.key)} alt={e.name} className="w-6 h-6 object-contain" />
                <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{e.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ─── */}
      <section className="border-y border-border/40 bg-card/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-extrabold gradient-text">{s.value}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section id="features" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <Zap className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Features</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to <span className="gradient-text">Dominate AI Search</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">A comprehensive suite of tools designed to make your brand the top recommendation across every AI engine.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={f.title} className="card-premium group hover:border-primary/30 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="py-20 md:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 mb-4">
              <LineChart className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-medium text-accent uppercase tracking-wider">How It Works</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">From <span className="gradient-text">Invisible to Inevitable</span></h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Four simple steps to transform your brand's AI visibility.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative text-center">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-px bg-gradient-to-r from-primary/30 to-transparent" />
                )}
                <div className="w-24 h-24 mx-auto rounded-2xl bg-card border border-border/60 flex flex-col items-center justify-center mb-5 shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all">
                  <span className="text-xs font-bold text-primary mb-1">{item.step}</span>
                  <item.icon className="w-8 h-8 text-foreground" />
                </div>
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── AI Engines ─── */}
      <section id="engines" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <Globe className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">AI Engine Coverage</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Monitor <span className="gradient-text">Every AI Engine</span> That Matters</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">We track your brand across all major generative AI platforms so you never miss a mention.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {engines.map(e => (
              <div key={e.key} className="card-premium text-center py-8 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 hover:shadow-card-hover">
                <img src={getEngineLogo(e.key)} alt={e.name} className="w-12 h-12 mx-auto mb-3 object-contain" />
                <div className="font-semibold text-sm">{e.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{e.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="py-20 md:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-warning/20 bg-warning/5 mb-4">
              <Star className="w-3.5 h-3.5 text-warning" />
              <span className="text-xs font-medium text-warning uppercase tracking-wider">Testimonials</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by <span className="gradient-text">Forward-Thinking</span> Brands</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="card-premium">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-warning text-warning" />)}
                </div>
                <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-sm font-bold text-primary-foreground">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-semibold">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Pricing ─── */}
      <section id="pricing" className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-medium text-primary uppercase tracking-wider">Pricing</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, <span className="gradient-text">Transparent</span> Pricing</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Start free. Scale as you grow. No hidden fees.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map(plan => (
              <div key={plan.name} className={`card-premium relative flex flex-col ${plan.popular ? "border-primary/40 shadow-glow scale-[1.02]" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${plan.popular ? "btn-primary-glow" : ""}`}
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => navigate("/onboarding")}
                >
                  {plan.cta} <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section className="py-20 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-6">
            Ready to Be <span className="gradient-text">Discovered by AI</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of forward-thinking brands already dominating AI search results. Start your free trial today.
          </p>
          <Button size="lg" onClick={() => navigate("/onboarding")} className="btn-primary-glow text-base px-10 h-13">
            Get Started for Free <ArrowRight className="w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="border-t border-border/40 bg-card/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Three Reach AI" className="h-8 w-auto" />
                <span className="font-bold text-foreground">Three Reach</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">Making businesses discoverable in the age of AI-powered search.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => scrollTo("#features")} className="hover:text-foreground transition-colors">Features</button></li>
                <li><button onClick={() => scrollTo("#pricing")} className="hover:text-foreground transition-colors">Pricing</button></li>
                <li><button onClick={() => scrollTo("#engines")} className="hover:text-foreground transition-colors">AI Engines</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">About</button></li>
                <li><button className="hover:text-foreground transition-colors">Blog</button></li>
                <li><button className="hover:text-foreground transition-colors">Careers</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button className="hover:text-foreground transition-colors">Privacy</button></li>
                <li><button className="hover:text-foreground transition-colors">Terms</button></li>
                <li><button className="hover:text-foreground transition-colors">Security</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-muted-foreground">© {new Date().getFullYear()} Three Reach AI. All rights reserved.</p>
            <div className="flex items-center gap-4 opacity-50">
              {engines.slice(0, 4).map(e => (
                <img key={e.key} src={getEngineLogo(e.key)} alt={e.name} className="w-5 h-5 object-contain" />
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
