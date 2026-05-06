# Make the MVP actually work — keyless public APIs + Lovable AI scoring

Today the dashboard renders mock numbers. We'll replace the mocks with real, verifiable signals from public APIs that need **no API key**, and use **Lovable AI** (already configured via `LOVABLE_API_KEY`) to score them. All four user-selected surfaces (Scan, Overview tiles, Brand Intelligence, Proof & Tracking) get live data.

## What you'll see after this ships
- **Overview tiles** show real counts: Wikipedia ✓/✗, Reddit mentions (last 30d), HN threads, GitHub repos, Wayback snapshots.
- **AI Scan page** lists real cross-source mentions with clickable proof links instead of fake "Best fintech in Pakistan" rows.
- **Brand Intelligence** 3-phase scan calls real APIs in phase 2 and uses Lovable AI to summarize findings in phase 3.
- **Proof & Tracking** lists real verifiable URLs with timestamps and source logos.

## New: one edge function, six sources

Single proxy `supabase/functions/public-signals/index.ts` (avoids browser CORS, lets us cache + rate-limit + score in one round-trip):

| Source | Endpoint (no key) | Used for |
|---|---|---|
| Wikipedia | `en.wikipedia.org/api/rest_v1/page/summary/{brand}` | Authority signal |
| Wayback Machine | `archive.org/wayback/available?url={domain}` | Historical footprint |
| Reddit | `reddit.com/search.json?q={brand}&sort=new&limit=25` | Real mentions |
| Hacker News | `hn.algolia.com/api/v1/search?query={brand}` | Tech mentions |
| GitHub | `api.github.com/search/repositories?q={brand}` | OSS presence |
| DuckDuckGo IA | `api.duckduckgo.com/?q={brand}&format=json` | Instant-answer snippet |

Request body: `{ brand: string, domain?: string }`. Response shape:
```text
{
  brand, fetchedAt,
  sources: {
    wikipedia: { found, title, extract, url } | null,
    wayback:   { snapshots, firstSeen, lastSeen } | null,
    reddit:    { count, items: [{title, subreddit, url, created_utc, score}] },
    hn:        { count, items: [{title, url, points, created_at}] },
    github:    { count, items: [{name, stars, url, description}] },
    ddg:       { abstract, url, related: [...] } | null,
  },
  score: { overall, breakdown: { authority, mentions, freshness, ecosystem }, status: "weak"|"mentioned"|"strong" },
  insights: string[]   // Lovable AI summary bullets
}
```

The function fans out with `Promise.allSettled` (so one slow source can't block the rest), then sends a compact JSON of the results to Lovable AI Gateway (`google/gemini-3-flash-preview`) with a tool-call schema to compute `score` + `insights`. Per-source failures surface as `null` + an `errors[]` array — the existing partial-results banner on the Scan page already handles that.

## Frontend wiring

### New hook
`src/hooks/usePublicSignals.ts` — wraps `supabase.functions.invoke("public-signals", { body })`, caches in `sessionStorage` for 10 min keyed by `brand+domain`, exposes `{ data, loading, error, refetch }`.

### Surfaces

1. **Overview** (`src/pages/Overview.tsx`)
   - Replace static counts in the four Quick Stats cards with `signals.sources.*.count` / boolean.
   - Pass real `score.overall` to `<ScoreCard>` instead of `42`.
   - "Recent Activity" feed gets seeded from `signals.sources.reddit.items` + `hn.items` (newest 4).

2. **AI Scan** (`src/pages/AIScan.tsx`)
   - Replace `initialQueries` mock with rows generated from real `reddit`, `hn`, `wikipedia` items.
   - "Run New Scan" button calls the new function; the existing loading/error/retry/per-engine-error UX (already built) maps cleanly: each `source` is treated like an "engine".

3. **Brand Intelligence** (`src/components/brand-intelligence/AnalyzingPhase.tsx` + `ResultsPhase.tsx`)
   - Phase 2 calls `public-signals` instead of advancing on a timer.
   - Phase 3 renders `score.breakdown` in the existing radial chart and `insights[]` in the bullet list.

4. **Proof & Tracking** (`src/pages/ProofTracking.tsx`)
   - Mentions list reads from `signals.sources.reddit.items` + `hn.items` with their canonical URLs, timestamps, and source logos (we already have Reddit + HN platform logos in `platform-logos.tsx`).

## Persistence (optional, low cost)

After a successful scan we insert one row per source into the existing `scan_history` table (`engine` column doubles as source name: `wikipedia`, `reddit`, etc.). No schema change needed. This makes the dashboard reflect history across sessions.

## Tests

Extend the existing Vitest suite:
- `src/hooks/usePublicSignals.test.ts` — caches in sessionStorage, dedupes in-flight calls, surfaces errors.
- Add to `RunFullScan.e2e.test.tsx`: mock `public-signals` with realistic mixed-source results and assert per-source rows render + AI-generated insights appear.

## Out of scope (callable in a follow-up)
- Auth-gated user-specific scoring (today the function reads `brand`/`domain` from the body and is a public proxy — fine for MVP).
- Rate limit per IP (Lovable AI's 429/402 are surfaced as toasts).
- Adding sources that DO need keys (Twitter, LinkedIn).

## Files touched

**New**
- `supabase/functions/public-signals/index.ts`
- `src/hooks/usePublicSignals.ts`
- `src/hooks/usePublicSignals.test.ts`

**Edited**
- `src/pages/Overview.tsx` — real counts + score
- `src/pages/AIScan.tsx` — real rows from signals
- `src/pages/ProofTracking.tsx` — real mention list
- `src/components/brand-intelligence/AnalyzingPhase.tsx` + `ResultsPhase.tsx` — real fetch + AI insights
- `src/pages/RunFullScan.e2e.test.tsx` — extra mixed-source test

No DB migration. No new dependencies. No new secrets (`LOVABLE_API_KEY` already present).