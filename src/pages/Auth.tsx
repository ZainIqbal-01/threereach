import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Eye, Brain, BarChart3, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { EngineStatusBadge } from "@/components/ui/ai-engine-logos";
import logo from "@/assets/logo.png";

const features = [
  { icon: Eye, title: "AI Visibility Score", desc: "See how AI engines rank your brand" },
  { icon: Brain, title: "Smart Agents", desc: "7 AI agents working for you 24/7" },
  { icon: BarChart3, title: "Real-time Analytics", desc: "Track mentions across all engines" },
  { icon: TrendingUp, title: "Growth Engine", desc: "Boost your AI presence automatically" },
];

const GoogleIcon = () => (
  <svg className="h-4 w-4" viewBox="0 0 48 48" aria-hidden>
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.3-.1-3.5z"/>
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 16 19 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2c-2 1.5-4.5 2.4-7.2 2.4-5.3 0-9.7-3-11.3-7.4l-6.5 5C9.6 39.6 16.2 44 24 44z"/>
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.3 4.3-4.2 5.6l6.2 5.2C40.6 36.2 44 30.6 44 24c0-1.3-.1-2.3-.4-3.5z"/>
  </svg>
);

export default function Auth() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);

  const signInWithGoogle = async () => {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin + "/auth/callback",
    });
    if (result.error) {
      toast.error("Sign-in failed. Please try again.");
      console.error(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.05]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary/[0.08] to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-accent/[0.06] rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col lg:flex-row">
        {/* Left — branding */}
        <div className="hidden lg:flex lg:w-[46%] xl:w-[44%] flex-col p-10 xl:p-14">
          <div className="flex-1 flex flex-col justify-center">
            <img src={logo} alt="Three Reach" className="h-12 w-auto object-contain mb-10" />
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-primary/8 text-primary border border-primary/15 w-fit">
              <Star className="h-3 w-3" /> Proof-Based AEO
            </span>
            <h2 className="text-3xl xl:text-4xl font-bold text-foreground leading-[1.15] mt-4 mb-4">
              Get recommended by <span className="gradient-text">every AI engine</span>
            </h2>
            <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
              Sign in to see how ChatGPT, Gemini, and Perplexity see your brand — and let our agents fix what's missing.
            </p>

            <div className="space-y-2.5 mt-8">
              {features.map((f) => {
                const Icon = f.icon;
                return (
                  <div
                    key={f.title}
                    className="flex items-center gap-3.5 p-3.5 rounded-xl bg-card/60 border border-border/40 backdrop-blur-sm"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary/12 to-accent/8">
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

            <div className="flex items-center gap-5 mt-8 text-muted-foreground">
              {["ChatGPT", "Gemini", "Perplexity"].map(e => (
                <EngineStatusBadge key={e} name={e} />
              ))}
            </div>
          </div>
        </div>

        {/* Right — sign-in */}
        <div className="flex-1 flex items-center justify-center p-5 sm:p-8 lg:p-12">
          <div className="w-full max-w-[400px]">
            <div className="lg:hidden text-center mb-6">
              <img src={logo} alt="Three Reach" className="h-12 w-auto object-contain mx-auto mb-4" />
            </div>

            <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <div className="p-7">
                <div className="text-center mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-md mb-3">
                    <Sparkles className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-xl font-bold text-foreground">Welcome to Three Reach</h1>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sign in to access your AI visibility command center
                  </p>
                </div>

                <Button
                  onClick={signInWithGoogle}
                  disabled={loading}
                  className="w-full h-11 rounded-xl bg-foreground hover:bg-foreground/90 text-background font-semibold text-sm gap-3"
                >
                  <GoogleIcon />
                  Continue with Google
                </Button>

                <p className="text-center text-[10px] text-muted-foreground mt-5">
                  By continuing, you agree to our Terms and acknowledge our Privacy Policy.
                </p>
              </div>
            </div>

            <p className="text-center text-[11px] text-muted-foreground mt-5">
              Free to start • No credit card required
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
