import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Github,
  KeyRound,
  Sparkles,
  GitPullRequest,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useBusinessName } from "@/hooks/useBusinessName";
import { toast } from "@/hooks/use-toast";

type Step = "connect" | "scanning" | "configure" | "running" | "done";

const MOCK_REPOS: Repo[] = [
  { full_name: "acme/marketing-site", private: false, default_branch: "main" },
  { full_name: "acme/landing-page", private: false, default_branch: "main" },
  { full_name: "acme/docs", private: true, default_branch: "main" },
  { full_name: "acme/blog", private: false, default_branch: "main" },
];

const SCAN_STEPS = [
  "Authenticating with GitHub…",
  "Fetching your repositories…",
  "Analyzing repo structure & frameworks…",
  "Detecting SEO/GEO opportunities…",
  "Ready to optimize.",
];

interface Repo {
  full_name: string;
  private: boolean;
  default_branch: string;
}

const SCOPES = [
  { id: "seo", label: "SEO meta + JSON-LD schema", desc: "Title, description, OG, Twitter, Organization & WebSite schema." },
  { id: "geo", label: "GEO / AI engine optimization", desc: "llms.txt, citation-ready summaries for ChatGPT, Perplexity, Gemini." },
  { id: "sitemap", label: "Sitemap + robots.txt", desc: "Generated sitemap.xml and robots.txt." },
  { id: "perf", label: "Performance + accessibility", desc: "Headers, font-display, preconnect, lazy hints." },
];

export default function Optimize() {
  const businessName = useBusinessName();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const fromScan = params.get("from") === "scan";

  const [step, setStep] = useState<Step>("connect");
  const [token, setToken] = useState("");
  const [savingToken, setSavingToken] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loadingRepos, setLoadingRepos] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<string>("");
  const [scope, setScope] = useState<string[]>(["seo", "geo", "sitemap", "perf"]);
  const [website, setWebsite] = useState("");
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<{
    pr_url: string;
    pr_number: number;
    files: number;
    summary: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [scanIdx, setScanIdx] = useState(0);
  const [demoMode, setDemoMode] = useState(false);

  // Check if connection exists
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("github_connections")
        .select("github_username")
        .maybeSingle();
      if (data?.github_username) {
        setUsername(data.github_username);
        setStep("configure");
        loadRepos();
      }
    })();
  }, []);

  async function loadRepos() {
    setLoadingRepos(true);
    try {
      const { data, error } = await supabase.functions.invoke("github-optimize", {
        body: { action: "list_repos" },
      });
      if (error) throw error;
      setRepos(data.repos || []);
      if (data.username) setUsername(data.username);
    } catch (e: any) {
      toast({ title: "Could not load repos", description: e.message, variant: "destructive" });
    } finally {
      setLoadingRepos(false);
    }
  }

  async function saveToken() {
    if (!token.trim()) return;
    setSavingToken(true);
    try {
      const { data, error } = await supabase.functions.invoke("github-optimize", {
        body: { action: "save_token", token: token.trim() },
      });
      if (error) throw error;
      setUsername(data.username);
      setToken("");
      toast({ title: "GitHub connected", description: `Signed in as ${data.username}` });
      setStep("configure");
      loadRepos();
    } catch (e: any) {
      toast({ title: "Connection failed", description: e.message, variant: "destructive" });
    } finally {
      setSavingToken(false);
    }
  }

  function startDemoConnect() {
    setDemoMode(true);
    setStep("scanning");
    setScanIdx(0);
    setUsername("demo-user");
    let i = 0;
    const tick = () => {
      i += 1;
      setScanIdx(i);
      if (i < SCAN_STEPS.length - 1) {
        setTimeout(tick, 700);
      } else {
        setTimeout(() => {
          setRepos(MOCK_REPOS);
          setSelectedRepo(MOCK_REPOS[0].full_name);
          setStep("configure");
        }, 600);
      }
    };
    setTimeout(tick, 600);
  }
    if (!selectedRepo) {
      toast({ title: "Select a repo", variant: "destructive" });
      return;
    }
    if (scope.length === 0) {
      toast({ title: "Select at least one scope", variant: "destructive" });
      return;
    }
    setRunning(true);
    setStep("running");
    setError(null);
    try {
      const { data, error } = await supabase.functions.invoke("github-optimize", {
        body: {
          action: "run",
          repo: selectedRepo,
          scope,
          brand: businessName,
          website: website || undefined,
        },
      });
      if (error) throw error;
      setResult(data);
      setStep("done");
      toast({ title: "Pull request opened!", description: `#${data.pr_number} on ${selectedRepo}` });
    } catch (e: any) {
      setError(e.message || "Optimization failed");
      setStep("configure");
      toast({ title: "Optimization failed", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  }

  function toggleScope(id: string) {
    setScope((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]));
  }

  return (
    <div className="space-y-6 animate-slide-in max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3">
        {fromScan && (
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/scan")} className="gap-1.5">
            <ArrowLeft className="h-4 w-4" /> Back to scan
          </Button>
        )}
      </div>
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <Sparkles className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Optimize your code</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Connect your GitHub repo and we'll open a Pull Request with AI-generated SEO, GEO,
            sitemap and performance fixes — based on your latest scan.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2 text-[11px]">
        {(["connect", "configure", "running", "done"] as Step[]).map((s, i) => {
          const idx = ["connect", "configure", "running", "done"].indexOf(step);
          const active = i === idx;
          const done = i < idx || step === "done";
          return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center font-semibold ${
                  done
                    ? "bg-primary text-primary-foreground"
                    : active
                    ? "bg-primary/15 text-primary border border-primary/40"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {done && !active ? <CheckCircle2 className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={active ? "text-foreground font-medium" : "text-muted-foreground"}>
                {s === "connect" ? "Connect" : s === "configure" ? "Configure" : s === "running" ? "Optimize" : "Done"}
              </span>
              {i < 3 && <div className="w-6 h-px bg-border mx-1" />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Connect */}
      {step === "connect" && (
        <div className="card-reach space-y-4">
          <div className="flex items-center gap-2">
            <Github className="h-4 w-4" />
            <h3 className="text-sm font-semibold text-foreground">Connect GitHub</h3>
          </div>
          <p className="text-xs text-muted-foreground">
            Paste a fine-grained Personal Access Token. We use it only to read your repo and open a
            pull request — token is stored encrypted and never leaves your account.
          </p>

          <div className="rounded-xl border border-border/60 bg-secondary/30 p-3 space-y-1.5">
            <div className="flex items-center gap-2 text-[11px] font-semibold text-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Required token permissions
            </div>
            <ul className="text-[11px] text-muted-foreground list-disc pl-5 space-y-0.5">
              <li>Repository → <strong>Contents: Read &amp; Write</strong></li>
              <li>Repository → <strong>Pull requests: Read &amp; Write</strong></li>
              <li>Repository → <strong>Metadata: Read</strong> (default)</li>
            </ul>
            <a
              href="https://github.com/settings/personal-access-tokens/new"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-primary inline-flex items-center gap-1 mt-1"
            >
              Create token on GitHub <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pat" className="text-xs">GitHub Personal Access Token</Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                id="pat"
                type="password"
                placeholder="github_pat_..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="pl-9 h-11 rounded-xl"
              />
            </div>
          </div>

          <Button
            onClick={saveToken}
            disabled={!token.trim() || savingToken}
            className="w-full h-11 rounded-xl gap-2"
          >
            {savingToken ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-4 w-4" />}
            {savingToken ? "Verifying..." : "Connect repository"}
          </Button>
        </div>
      )}

      {/* Step 2: Configure */}
      {step === "configure" && (
        <div className="space-y-4">
          {username && (
            <div className="card-reach flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary" />
                <span className="text-xs text-foreground">
                  Connected as <strong>@{username}</strong>
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStep("connect")}
                className="text-[11px] h-7"
              >
                Change token
              </Button>
            </div>
          )}

          <div className="card-reach space-y-4">
            <h3 className="text-sm font-semibold text-foreground">Pick a repository</h3>
            {loadingRepos ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading repos…
              </div>
            ) : (
              <div className="max-h-56 overflow-y-auto rounded-xl border border-border/60 divide-y divide-border/40">
                {repos.length === 0 && (
                  <p className="text-xs text-muted-foreground p-3">No repositories found.</p>
                )}
                {repos.map((r) => (
                  <button
                    key={r.full_name}
                    onClick={() => setSelectedRepo(r.full_name)}
                    className={`w-full text-left px-3 py-2.5 text-xs hover:bg-secondary/40 flex items-center justify-between ${
                      selectedRepo === r.full_name ? "bg-primary/10" : ""
                    }`}
                  >
                    <span className="font-medium text-foreground truncate">{r.full_name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {r.private ? "private" : "public"} · {r.default_branch}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="card-reach space-y-3">
            <Label className="text-xs">Website URL (optional)</Label>
            <Input
              placeholder="https://yoursite.com"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="h-10 rounded-xl"
            />
          </div>

          <div className="card-reach space-y-3">
            <h3 className="text-sm font-semibold text-foreground">Optimization scope</h3>
            <div className="space-y-2">
              {SCOPES.map((s) => (
                <label
                  key={s.id}
                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-secondary/40 cursor-pointer"
                >
                  <Checkbox
                    checked={scope.includes(s.id)}
                    onCheckedChange={() => toggleScope(s.id)}
                    className="mt-0.5"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-foreground">{s.label}</div>
                    <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="card-reach border-destructive/40 bg-destructive/5 flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          )}

          <Button
            onClick={runOptimization}
            disabled={!selectedRepo || running}
            className="w-full h-11 rounded-xl gap-2 btn-primary-glow"
          >
            <GitPullRequest className="h-4 w-4" />
            Generate optimization PR
          </Button>
        </div>
      )}

      {/* Step 3: Running */}
      {step === "running" && (
        <div className="card-reach text-center py-10 space-y-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="text-sm font-medium text-foreground">Optimizing your repository…</p>
          <p className="text-xs text-muted-foreground">
            Analyzing code, generating fixes with AI, creating branch and pull request. This can take 30–60s.
          </p>
        </div>
      )}

      {/* Step 4: Done */}
      {step === "done" && result && (
        <div className="card-reach space-y-4 border-primary/40 bg-primary/5">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Pull request opened</h3>
          </div>
          <p className="text-xs text-muted-foreground">{result.summary}</p>
          <div className="text-xs">
            <strong className="text-foreground">{result.files}</strong> files changed on{" "}
            <code className="text-[11px] bg-secondary px-1.5 py-0.5 rounded">{selectedRepo}</code>
          </div>
          <div className="flex gap-2">
            <Button
              asChild
              className="flex-1 h-10 rounded-xl gap-2"
            >
              <a href={result.pr_url} target="_blank" rel="noreferrer">
                <GitPullRequest className="h-4 w-4" /> View PR #{result.pr_number}
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setResult(null);
                setStep("configure");
              }}
              className="h-10 rounded-xl"
            >
              Run again
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
