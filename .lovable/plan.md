

## Improve Dashboard (Overview Page)

The user is on `/dashboard` and wants improvements. Based on what I see, the dashboard is functional but can feel denser and less premium than the rest of the platform. Here's the plan:

### Hero Section Refinement
- **ScoreCard**: Add a subtle radial glow behind the gauge that pulses with the status color, refine typography hierarchy, add a tiny "vs last week" inline sparkline beneath the score for instant context.
- **Welcome card**: Add a layered gradient mesh background (currently uses a flat `gradient-hero`), introduce an animated shimmer on the "Boost Visibility" button, and tighten Nova agent + greeting alignment so it reads as a single composed unit.
- **ProgressTimeline**: Increase spacing, add a soft glow on the active node, and animate the progress bar fill on mount.

### Quick Stats Row
- Add subtle gradient backgrounds per card (currently flat), micro-icon animations on hover, and a "trend chip" (e.g., "+12% this week") to make each stat feel alive instead of static.
- Increase touch targets and improve dark-mode contrast.

### Analytics Charts Row
- Unify card heights, add chart titles with mini-legends, and a shared "Last 7 days" range pill at the top of the row.
- Add hover-state crosshair lines and refined tooltips that match the platform's glassmorphic style.

### AI Engine Status Panel
- Replace flat secondary-bg logo containers with brand-tinted circular wells (e.g., ChatGPT green tint, Gemini blue tint, Perplexity teal tint).
- Add a live "pulse" dot for engines being actively monitored, plus a confidence mini-bar under the badge.

### Module Progress + Proof Grid
- Add gradient progress fills with shimmer, percentage counter that animates up on mount, and a "next milestone" hint below each bar.
- ProofCount: rotate through recent mentions with a gentle fade transition.

### Recent Activity Feed
- Replace emojis with branded engine logos and category icons (lucide), add timestamps with relative + tooltip absolute time, and a "View all" link.
- Group by day with subtle dividers ("Today", "Yesterday", "Earlier").

### Global Polish
- Stagger entry animations more elegantly (60ms intervals instead of all at once).
- Add a subtle gradient mesh background to the main scroll area to lift the page off the flat bg.
- Ensure all cards use consistent border-radius (`rounded-2xl`) and shadow tokens.
- Verify dark mode contrast on every new gradient.

### Files to edit
- `src/pages/Overview.tsx` — restructure hero, stats row spacing, activity feed
- `src/components/dashboard/ScoreCard.tsx` — radial glow, typography
- `src/components/dashboard/ProgressTimeline.tsx` — animated fill, glow
- `src/components/dashboard/EngineCard.tsx` — branded tints, pulse dot
- `src/components/dashboard/ModuleProgress.tsx` — animated counter, shimmer
- `src/components/dashboard/ProofCount.tsx` — rotating mentions
- `src/components/dashboard/VisibilityTrendChart.tsx`, `EngineBreakdownChart.tsx`, `ContentActivityChart.tsx` — unified styling, tooltips

No backend changes. Pure frontend visual + interaction polish, preserving all existing functionality and routes.

