import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface PublicSignals {
  brand: string;
  domain: string;
  fetchedAt: string;
  sources: {
    wikipedia: { found: boolean; title?: string; extract?: string; url?: string } | null;
    wayback: { available: boolean; timestamp?: string; url?: string } | null;
    reddit: { count: number; items: Array<{ title: string; subreddit: string; url: string; created_utc: number; score: number }> } | null;
    hackernews: { count: number; items: Array<{ title: string; url: string; points: number; created_at: string }> } | null;
    github: { count: number; items: Array<{ name: string; stars: number; url: string; description: string | null }> } | null;
    duckduckgo: { abstract: string | null; url: string | null; related: Array<{ text: string; url: string }> } | null;
  };
  score: {
    overall: number;
    status: "weak" | "mentioned" | "strong";
    breakdown: { authority: number; mentions: number; freshness: number; ecosystem: number };
  } | null;
  insights: string[];
  errors: string[];
}

const TTL_MS = 10 * 60 * 1000;
const cacheKey = (brand: string, domain: string) => `signals:${brand.toLowerCase()}:${(domain || "").toLowerCase()}`;

const inflight = new Map<string, Promise<PublicSignals>>();

async function invokeOnce(brand: string, domain: string): Promise<PublicSignals> {
  const key = cacheKey(brand, domain);
  const existing = inflight.get(key);
  if (existing) return existing;

  const p = (async () => {
    const { data, error } = await supabase.functions.invoke("public-signals", {
      body: { brand, domain },
    });
    if (error) throw error;
    return data as PublicSignals;
  })();
  inflight.set(key, p);
  try {
    const res = await p;
    return res;
  } finally {
    inflight.delete(key);
  }
}

export function usePublicSignals(brand: string | undefined, domain?: string) {
  const [data, setData] = useState<PublicSignals | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastKey = useRef<string>("");

  const load = useCallback(
    async (force = false) => {
      if (!brand) return;
      const key = cacheKey(brand, domain || "");
      lastKey.current = key;

      // Cache check
      if (!force) {
        try {
          const cached = sessionStorage.getItem(key);
          if (cached) {
            const parsed = JSON.parse(cached) as { at: number; data: PublicSignals };
            if (Date.now() - parsed.at < TTL_MS) {
              setData(parsed.data);
              return;
            }
          }
        } catch {
          /* ignore */
        }
      }

      setLoading(true);
      setError(null);
      try {
        const res = await invokeOnce(brand, domain || "");
        if (lastKey.current !== key) return; // stale
        setData(res);
        try {
          sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data: res }));
        } catch {
          /* quota — ignore */
        }
      } catch (e) {
        setError((e as Error)?.message || "Failed to load signals");
      } finally {
        setLoading(false);
      }
    },
    [brand, domain],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: () => load(true) };
}
