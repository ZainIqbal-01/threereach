import { ExternalLink, Globe, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePublicSignals } from "@/hooks/usePublicSignals";
import { RedditLogo, HackerNewsLogo } from "@/components/ui/platform-logos";

interface LiveSignalsPanelProps {
  brand: string;
  domain?: string;
}

const Stat = ({
  label,
  value,
  hint,
  icon,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
}) => (
  <div className="rounded-xl border border-border/50 bg-secondary/20 p-3">
    <div className="flex items-center gap-1.5 mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
      {icon}
      {label}
    </div>
    <div className="text-base font-bold text-foreground tabular-nums">{value}</div>
    {hint && <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{hint}</div>}
  </div>
);

export function LiveSignalsPanel({ brand, domain }: LiveSignalsPanelProps) {
  const { data, loading, error, refetch } = usePublicSignals(brand, domain);

  return (
    <div className="card-premium">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Live Public Signals</h3>
          <span className="text-[10px] text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
            {loading ? "fetching…" : data ? "real data" : error ? "error" : "—"}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={refetch}
          disabled={loading}
          className="h-8 rounded-lg text-xs gap-1.5"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} /> Refresh
        </Button>
      </div>

      {error && (
        <div className="text-[11px] text-destructive bg-destructive/10 border border-destructive/30 rounded-lg p-2.5 mb-3">
          {error}
        </div>
      )}

      {loading && !data && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-secondary/30 animate-pulse" />
          ))}
        </div>
      )}

      {data && data.sources && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
            <Stat
              label="Wikipedia"
              value={data.sources.wikipedia?.found ? "Listed" : "Missing"}
              hint={data.sources.wikipedia?.title}
              icon={<Globe className="h-3 w-3" />}
            />
            <Stat
              label="Reddit"
              value={data.sources.reddit?.count ?? 0}
              hint={data.sources.reddit?.items[0]?.subreddit ? `r/${data.sources.reddit.items[0].subreddit}` : "no recent threads"}
              icon={<RedditLogo className="h-3 w-3" style={{ color: "#FF4500" }} />}
            />
            <Stat
              label="Hacker News"
              value={data.sources.hackernews?.count ?? 0}
              hint={data.sources.hackernews?.items[0]?.title?.slice(0, 28)}
              icon={<HackerNewsLogo className="h-3 w-3" style={{ color: "#FF6600" }} />}
            />
            <Stat
              label="GitHub"
              value={data.sources.github?.count ?? 0}
              hint={data.sources.github?.items[0]?.name}
            />
            <Stat
              label="Wayback"
              value={data.sources.wayback?.available ? "Indexed" : "—"}
              hint={data.sources.wayback?.timestamp?.slice(0, 8)}
            />
          </div>

          {data.score && (
            <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5 p-4 mb-3">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
                    AI-Computed Visibility
                  </div>
                  <div className="text-2xl font-bold gradient-text tabular-nums">
                    {data.score.overall}
                    <span className="text-sm text-muted-foreground font-normal">/100</span>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${
                    data.score.status === "strong"
                      ? "bg-success/15 text-success"
                      : data.score.status === "mentioned"
                        ? "bg-warning/15 text-warning"
                        : "bg-destructive/15 text-destructive"
                  }`}
                >
                  {data.score.status}
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-center">
                {(["authority", "mentions", "freshness", "ecosystem"] as const).map((k) => (
                  <div key={k}>
                    <div className="text-[10px] text-muted-foreground capitalize">{k}</div>
                    <div className="text-sm font-semibold text-foreground tabular-nums">
                      {data.score!.breakdown[k]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {data.insights.length > 0 && (
            <div className="space-y-1.5 mb-3">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-1.5">
                AI Insights
              </div>
              {data.insights.map((ins, i) => (
                <div
                  key={i}
                  className="flex gap-2 text-[11px] text-foreground bg-secondary/30 rounded-lg px-3 py-2 border border-border/40"
                >
                  <Sparkles className="h-3 w-3 text-primary shrink-0 mt-0.5" />
                  {ins}
                </div>
              ))}
            </div>
          )}

          {(data.sources.reddit?.items?.length || data.sources.hackernews?.items?.length) ? (
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold mb-2">
                Recent verifiable mentions
              </div>
              <div className="space-y-1">
                {[
                  ...(data.sources.reddit?.items.slice(0, 3).map((i) => ({
                    title: i.title,
                    url: i.url,
                    source: "Reddit",
                    sub: `r/${i.subreddit}`,
                  })) || []),
                  ...(data.sources.hackernews?.items.slice(0, 2).map((i) => ({
                    title: i.title,
                    url: i.url,
                    source: "HN",
                    sub: `${i.points || 0} pts`,
                  })) || []),
                ].slice(0, 5).map((m, i) => (
                  <a
                    key={i}
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary/40 transition-colors text-[11px] group"
                  >
                    <span className="text-muted-foreground font-mono text-[10px] w-12 shrink-0">{m.source}</span>
                    <span className="text-foreground line-clamp-1 flex-1">{m.title}</span>
                    <span className="text-muted-foreground text-[10px] shrink-0 hidden sm:inline">{m.sub}</span>
                    <ExternalLink className="h-3 w-3 text-muted-foreground/40 group-hover:text-primary" />
                  </a>
                ))}
              </div>
            </div>
          ) : null}

          {data.errors.length > 0 && (
            <div className="mt-3 text-[10px] text-muted-foreground border-t border-border/40 pt-2">
              Note: {data.errors.length} source(s) unavailable
            </div>
          )}
        </>
      )}
    </div>
  );
}
