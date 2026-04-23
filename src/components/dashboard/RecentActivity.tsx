import { useEffect, useState } from "react";
import { Clock, ArrowRight, Send, BarChart3, Wand2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { getEngineLogo } from "@/components/ui/ai-engine-logos";

interface ActivityItem {
  id: string;
  category: "engine" | "score" | "scan";
  engine?: string;
  text: string;
  ago: string;
  absolute: string;
  group: "Today" | "Yesterday" | "Earlier";
  href: string;
}

function relative(iso: string): { ago: string; absolute: string; group: ActivityItem["group"] } {
  const date = new Date(iso);
  const diff = Date.now() - date.getTime();
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);
  const ago =
    mins < 60 ? `${mins}m ago` : hours < 24 ? `${hours}h ago` : `${days}d ago`;
  const group: ActivityItem["group"] = days === 0 ? "Today" : days === 1 ? "Yesterday" : "Earlier";
  return { ago, absolute: date.toLocaleString(), group };
}

const groupOrder = ["Today", "Yesterday", "Earlier"] as const;

export function RecentActivity() {
  const { user } = useAuth();
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    (async () => {
      const { data } = await supabase
        .from("scan_history")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(8);
      const mapped: ActivityItem[] = (data ?? []).map((row) => {
        const r = relative(row.created_at);
        const isAggregate = row.engine === "aggregate";
        return {
          id: row.id,
          category: isAggregate ? "scan" : "engine",
          engine: isAggregate ? undefined : row.engine,
          text: isAggregate
            ? `Brand analysis completed (score ${Math.round(Number(row.score ?? 0))}/100)`
            : `${row.engine} ${row.status === "mentioned" ? "mentioned" : row.status === "weak" ? "weakly referenced" : "did not mention"} your brand`,
          ago: r.ago,
          absolute: r.absolute,
          group: r.group,
          href: isAggregate ? "/dashboard/brand-intelligence" : "/dashboard/scan",
        };
      });
      setItems(mapped);
      setLoading(false);
    })();
  }, [user]);

  const grouped = items.reduce<Record<string, ActivityItem[]>>((acc, item) => {
    (acc[item.group] ||= []).push(item);
    return acc;
  }, {});

  const categoryIcon = (item: ActivityItem) => {
    if (item.category === "engine" && item.engine) return getEngineLogo(item.engine, "h-4 w-4");
    if (item.category === "score") return <BarChart3 className="h-4 w-4 text-success" />;
    return <Wand2 className="h-4 w-4 text-warning" />;
  };

  return (
    <div className="card-reach">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-semibold text-foreground">Recent Activity</h3>
        </div>
        <Link
          to="/dashboard/proof"
          className="flex items-center gap-1.5 text-xs font-medium text-primary hover:text-primary/80 transition-colors group"
        >
          View all
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {loading ? (
        <div className="space-y-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <div className="text-center py-8 text-xs text-muted-foreground">
          <Send className="h-5 w-5 mx-auto mb-2 opacity-40" />
          No activity yet. Run your first scan to populate this feed.
        </div>
      ) : (
        <div className="space-y-4">
          {groupOrder.map((groupKey) => {
            const groupItems = grouped[groupKey];
            if (!groupItems || groupItems.length === 0) return null;
            return (
              <div key={groupKey}>
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                    {groupKey}
                  </span>
                  <div className="flex-1 h-px bg-border/60" />
                </div>
                <div className="space-y-1.5">
                  {groupItems.map((activity) => (
                    <Link
                      key={activity.id}
                      to={activity.href}
                      className="flex items-center gap-3 p-3 md:p-3.5 rounded-xl hover:bg-secondary/60 transition-all group"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/70 shrink-0 group-hover:bg-card transition-colors">
                        {categoryIcon(activity)}
                      </div>
                      <p className="text-xs text-foreground flex-1 line-clamp-1">{activity.text}</p>
                      <span
                        className="text-[10px] text-muted-foreground shrink-0 hidden sm:inline tabular-nums"
                        title={activity.absolute}
                      >
                        {activity.ago}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground/0 group-hover:text-primary transition-all group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
