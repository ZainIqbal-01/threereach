

# What to Improve in Three Reach AI

Based on a review of your codebase, here are the most impactful improvements grouped by priority. You can approve any combination and I'll implement them.

---

## 1. Critical: No Real Authentication

**Problem:** "Login" is just a `localStorage.setItem("onboardingComplete", "true")` flag in `App.tsx`. Anyone can bypass it by opening DevTools. All "user" data (business profile, scan history, resources) lives in `localStorage` only — it's lost when switching devices/browsers and not actually private.

**Fix:** Add real Lovable Cloud auth (email + Google), a `profiles` table, and migrate `businessProfile`, `scanHistory`, and uploaded resources to the database with RLS policies.

---

## 2. High: Mock Data Everywhere

Most "live" numbers are hardcoded:
- `Overview.tsx`: score `42`, `+12%`, `3 verified mentions`, `18/60 sources` — all static
- `recentActivity` array — fake entries with fake timestamps
- Engine cards: ChatGPT `34%`, Gemini `67%` — hardcoded
- `ProgressTimeline`, `ModuleProgress`, `ProofCount` — placeholder values

**Fix:** Wire dashboard widgets to actual scan results from the `analyze-brand` / `ai-scan` edge functions, store results in DB, compute trends from history.

---

## 3. High: Enrichment Data Is Collected But Never Used

The new `EnrichmentBanner` + `EnrichmentDialog` collect detailed info, PDFs, and links — but nothing reads them. The `analyze-brand` and `generate-content` edge functions don't receive the enrichment payload, so uploads have zero effect on AI output.

**Fix:** Pass `businessProfile.detailedInfo`, `resources`, and links into the edge function prompts so Gemini actually grounds responses in user-provided context.

---

## 4. Medium: Storage & Scale Issues

- PDFs are stored as **base64 in localStorage** (5MB limit per file, ~5–10MB total quota for the whole origin) — will silently fail on the 2nd or 3rd upload.
- `scanHistory` also in localStorage — no cross-device sync.

**Fix:** Move file uploads to Lovable Cloud Storage (signed URLs), keep only metadata in DB.

---

## 5. Medium: UX & Polish Gaps

- **No loading skeletons** on dashboard widgets — feels jumpy on slow connections.
- **No empty states** — new users with 0 scans see fake "3 verified mentions."
- **`Export` button** dumps a plain `.txt` file — should be PDF or branded CSV.
- **Mobile sidebar** opens but no swipe-to-close gesture.
- **No error boundaries** — one component crash blanks the whole page.
- **Toast spam**: several actions fire toasts that overlap; needs a queue/dedupe.

---

## 6. Medium: Agent Command Center Is Visual-Only

The 7 agents in `AgentHub` / `AgentCommandCenter` show animations and "missions" but don't actually do anything — schedules, workflows, and the activity stream are all simulated by `useAgentSimulation`. Either label it clearly as a "preview" or wire one or two agents (e.g., Oracle for scans, Echo for distribution) to real edge functions.

---

## 7. Low: Code Health

- `supabase/functions/elevenlabs-audio/` is dead code (you abandoned the narration feature).
- `remotion-demo/` directory ships with the project repo — should be moved to a separate repo or `.gitignored` from the build.
- Several files exceed 400 lines (`Overview.tsx` = 463, `AgentCommandCenter`, `BuildFootprint`) — split into smaller components for maintainability.
- No tests beyond `example.test.ts`.

---

## 8. Low: SEO & Marketing

- `index.html` likely missing per-page meta tags (only the OG image is set).
- No `sitemap.xml` or structured data — ironic for an "AI visibility" tool.
- Robots.txt is default.

---

## Recommended Sequencing

| Order | Theme | Effort |
|-------|-------|--------|
| 1 | Real auth + DB migration of profile/history | L |
| 2 | Wire enrichment into AI prompts | S |
| 3 | Replace mock dashboard data with real scans | M |
| 4 | File uploads → Cloud Storage | S |
| 5 | UX polish (skeletons, empty states, error boundaries) | M |
| 6 | Wire 1–2 agents to real actions | M |
| 7 | Code cleanup & SEO | S |

---

## Technical Notes

- Auth: `supabase.auth` with email/password + Google OAuth, redirect URL set to `https://threereach.lovable.app`. Auto-confirm OFF.
- New tables: `profiles`, `business_profiles`, `business_resources`, `scan_history`, `agent_runs` — all with `user_id uuid` + RLS `auth.uid() = user_id`.
- Storage bucket: `business-resources` (private, signed URL access).
- Roles handled via separate `user_roles` table + `has_role()` security-definer function (per project standard).
- Migrate existing localStorage data on first login via a one-time client-side migration helper.

**Tell me which sections (1–8) to implement, or say "do all priority 1–4" and I'll start.**

