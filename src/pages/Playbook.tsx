import { useGEOMaturity } from "@/hooks/useGEOMaturity";
import { LEVELS, CITATION_TACTICS, PILLARS, FUNNEL_STAGES } from "@/lib/geoPlaybook";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Circle, Sparkles, Target, Brain, BookOpen } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Playbook() {
  const { state, toggle, score, completedLevels, currentLevel } = useGEOMaturity();

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Hero */}
      <div className="rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-accent p-6 md:p-8 text-primary-foreground shadow-card relative overflow-hidden">
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider opacity-90">
            <BookOpen className="h-3.5 w-3.5" /> The 7-Level GEO Playbook
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold mt-2">Dominate AI Search, level by level.</h1>
          <p className="text-sm md:text-base opacity-90 mt-2 max-w-2xl">
            A systematic ladder for getting cited by ChatGPT, Perplexity, Claude and Gemini — based on the playbook from Searchable.com plus our own extensions.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-xl px-3 py-2">
              <Target className="h-4 w-4" />
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Maturity</div>
                <div className="text-lg font-bold leading-none">{score}<span className="text-xs opacity-80">/100</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-xl px-3 py-2">
              <CheckCircle2 className="h-4 w-4" />
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Levels</div>
                <div className="text-lg font-bold leading-none">{completedLevels}<span className="text-xs opacity-80">/7</span></div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/15 backdrop-blur rounded-xl px-3 py-2">
              <Sparkles className="h-4 w-4" />
              <div>
                <div className="text-[10px] uppercase tracking-wider opacity-80">Up next</div>
                <div className="text-sm font-semibold leading-none">L{currentLevel.number} · {currentLevel.title}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="ladder" className="w-full">
        <TabsList className="bg-card border border-border rounded-xl">
          <TabsTrigger value="ladder">7-Level Ladder</TabsTrigger>
          <TabsTrigger value="citations">14 Citation Tactics</TabsTrigger>
          <TabsTrigger value="pillars">5 GEO Pillars</TabsTrigger>
          <TabsTrigger value="funnel">Content Funnel</TabsTrigger>
        </TabsList>

        {/* ─── 7-LEVEL LADDER ─── */}
        <TabsContent value="ladder" className="space-y-3 mt-4">
          {LEVELS.map((lvl) => {
            const done = lvl.checklist.filter((c) => state[c.id]).length;
            const total = lvl.checklist.length;
            const pct = Math.round((done / total) * 100);
            const complete = done === total;
            return (
              <div key={lvl.key} className="rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex items-start gap-4">
                  <div className={`shrink-0 flex h-12 w-12 items-center justify-center rounded-xl text-sm font-bold ${
                    complete ? "bg-success text-success-foreground" : "bg-primary/10 text-primary"
                  }`}>
                    {complete ? <CheckCircle2 className="h-5 w-5" /> : `L${lvl.number}`}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3 flex-wrap">
                      <div>
                        <h3 className="text-base font-bold text-foreground">{lvl.title}</h3>
                        <p className="text-xs text-muted-foreground">{lvl.summary}</p>
                      </div>
                      <Link to={lvl.route} className="text-xs font-medium text-primary hover:underline flex items-center gap-1 shrink-0">
                        Open module <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>

                    <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40">
                        <Target className="h-3 w-3 text-primary" />
                        <span className="text-muted-foreground"><strong className="text-foreground">Goal:</strong> {lvl.goal}</span>
                      </div>
                      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-secondary/40">
                        <Brain className="h-3 w-3 text-accent" />
                        <span className="text-muted-foreground"><strong className="text-foreground">Mindset:</strong> {lvl.mindset}</span>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center justify-between text-[11px] mb-1.5">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-semibold text-foreground">{done}/{total} · {pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <div className={`h-full transition-all ${complete ? "bg-success" : "bg-gradient-to-r from-primary to-accent"}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-1.5">
                      {lvl.checklist.map((item) => (
                        <label key={item.id} className="flex items-start gap-2 px-2.5 py-2 rounded-lg hover:bg-secondary/40 transition-colors cursor-pointer">
                          <Checkbox checked={!!state[item.id]} onCheckedChange={() => toggle(item.id)} className="mt-0.5" />
                          <span className={`text-[12px] leading-snug ${state[item.id] ? "text-muted-foreground line-through" : "text-foreground"}`}>
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </TabsContent>

        {/* ─── 14 CITATION TACTICS ─── */}
        <TabsContent value="citations" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {CITATION_TACTICS.map((t) => (
              <div key={t.n} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold">
                    {t.n}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-semibold text-foreground">{t.title}</h4>
                      {t.stat && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-success/15 text-success whitespace-nowrap">
                          {t.stat}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t.why}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ─── 5 PILLARS ─── */}
        <TabsContent value="pillars" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {PILLARS.map((p) => (
              <div key={p.id} className="rounded-xl border border-border bg-card p-4 shadow-card">
                <h4 className="text-sm font-bold text-foreground">{p.name}</h4>
                <p className="text-[11px] text-muted-foreground italic mt-0.5">{p.why}</p>
                <ul className="mt-3 space-y-1">
                  {p.points.map((pt) => (
                    <li key={pt} className="flex items-start gap-2 text-xs text-foreground">
                      <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" /> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* ─── CONTENT FUNNEL ─── */}
        <TabsContent value="funnel" className="mt-4">
          <div className="space-y-2">
            {FUNNEL_STAGES.map((s, i) => (
              <div key={s.stage} className="rounded-xl border border-border bg-card p-4 shadow-card flex items-center gap-4">
                <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground text-sm font-bold">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-foreground">{s.stage}</h4>
                  <p className="text-[11px] text-muted-foreground"><strong>Goal:</strong> {s.goal}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{s.how}</p>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
