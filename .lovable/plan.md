
The user wants an Apple-keynote-style product demo video — not static screenshots with Ken Burns. They want real product motion (clicks, typing, hovers, scrolls, animated UI states), cinematic pacing, premium typography, and a story-driven flow that explains Three Reach AI end-to-end.

Current problem: `WalkthroughVideo.tsx` just pans/zooms PNG screenshots inside a fake browser frame. That's why it feels like a slideshow.

The fix: replace static screenshots with **animated UI recreations** — rebuild key product moments as actual React components inside Remotion, so cursors move, fields type, scores count up, charts draw in, agents activate, posts publish. Then layer cinematic camera moves, parallax, and Apple-style typography reveals over them.

## The Vision — "Three Reach AI Keynote"

A 3-minute cinematic product film modeled after Apple Event product reveals:
- **Cold open hook** (0–8s): Black screen → single line of light → "What if AI never mentioned you?" → Three Reach mark ignites
- **The Problem** (8–25s): Animated stat counters, ChatGPT/Gemini logos pulse, "your brand" notably absent
- **The System reveal** (25–40s): "Introducing Three Reach AI" — logo lockup, tagline, 4-pillar reveal (Scan · Build · Distribute · Prove)
- **Module showcases** (40s–2:30s): 7 chapters, each with a live animated UI mock + voiceover-style caption
- **Agent fleet** (2:30–2:45s): 7 agents activate in sequence around a central core
- **Closing** (2:45–3:00s): "Get cited. Get chosen." → CTA → mark out

## The Motion Direction — "Tech Product / Cinematic Minimal"

- **Palette**: Deep navy `#05070F` → `#0A1226`, electric blue `#1E6BFF`, cyan `#00E5FF`, white `#FFFFFF`, muted `#9AB0D8`
- **Typography**: Inter Display (900 for hero, 500 for body), tight tracking, massive sizes
- **Default entrance**: Blur-to-sharp + spring-up (`damping: 18, stiffness: 110`)
- **Accent motion**: Per-character text reveal with stagger (8 frames apart)
- **Scene transitions**: Mostly invisible cross-fades + occasional cinematic wipes; one signature "shape-morph" between hero scenes
- **Camera**: Subtle parallax on every scene (3 layers moving at different rates), slow push-in on hero shots

## Animated UI Mocks (the key change)

Instead of importing PNGs, build these as Remotion React components with frame-driven animation:

1. **OnboardingMock** — cursor enters → field auto-types "threereach.ai" character-by-character → button glows → "Brand identity built" toast slides in
2. **ScoreMock** — gauge needle springs from 0 → 84, large number counts up, 5 engine bars fill in stagger, "+12 this week" delta pops
3. **ScanMock** — query text types in → "Scanning ChatGPT…" with rotating spinner → result rows drop in one by one with checkmarks → mention highlight pulses
4. **BrandIntelMock** — competitor bar chart races, sentiment dial swings, "Top Gap" card flies in
5. **FootprintMock** — JSON-LD schema lines stream in like a code editor (typewriter), GEO landing wireframe assembles block by block, E-E-A-T meter fills
6. **DistributionMock** — 6 platform tiles arrange in a grid, posts compose with typing animation, "Published" stamps hit each tile in sequence
7. **ProofMock** — screenshot capture flash, timestamp ticks live, citations stack into a pile with a counter
8. **AgentFleetMock** — 7 agent orbs orbit a central core, each lights up + pulses when "active", connection lines draw between them, mission cards fly through

Each mock is a self-contained `<AbsoluteFill>` scene with its own internal frame choreography — these ARE the product, animated.

## Plan — what to build

### New files
- `remotion-demo/src/keynote/KeynoteVideo.tsx` — root composition, all scenes wired with `<TransitionSeries>`
- `remotion-demo/src/keynote/ui/Cursor.tsx` — animated SVG cursor with click pulse
- `remotion-demo/src/keynote/ui/TypewriterText.tsx` — frame-driven character typing
- `remotion-demo/src/keynote/ui/CountUp.tsx` — number that animates 0→target on a spring
- `remotion-demo/src/keynote/ui/Gauge.tsx` — animated arc gauge with needle
- `remotion-demo/src/keynote/ui/AppFrame.tsx` — premium browser/app chrome wrapper with parallax
- `remotion-demo/src/keynote/ui/KineticHeadline.tsx` — Apple-style per-word reveal with blur

- `remotion-demo/src/keynote/scenes/00-ColdOpen.tsx`
- `remotion-demo/src/keynote/scenes/01-Problem.tsx`
- `remotion-demo/src/keynote/scenes/02-Introducing.tsx`
- `remotion-demo/src/keynote/scenes/03-FourPillars.tsx`
- `remotion-demo/src/keynote/scenes/04-Onboarding.tsx`
- `remotion-demo/src/keynote/scenes/05-Score.tsx`
- `remotion-demo/src/keynote/scenes/06-Scan.tsx`
- `remotion-demo/src/keynote/scenes/07-BrandIntel.tsx`
- `remotion-demo/src/keynote/scenes/08-Footprint.tsx`
- `remotion-demo/src/keynote/scenes/09-Distribution.tsx`
- `remotion-demo/src/keynote/scenes/10-Proof.tsx`
- `remotion-demo/src/keynote/scenes/11-AgentFleet.tsx`
- `remotion-demo/src/keynote/scenes/12-Closing.tsx`

### Edited files
- `remotion-demo/src/Root.tsx` — register new `keynote` composition (1920×1080 @ 30fps, ~5400 frames = 3 min)

### Render strategy
- Same proven 3-segment approach via `scripts/render-range.mjs` (frames 0–1799, 1800–3599, 3600–5399)
- Stitch with ffmpeg concat → final `ThreeReachAI-Keynote.mp4` to `/mnt/documents/`

## Trade-offs

- This is a real lift — ~13 new scene files + ~6 reusable UI primitives. But it's the only way to escape "slideshow" feel.
- I'm NOT using your live screenshots anymore — they become animated recreations. The visual fidelity to the actual product will be ~85% (same colors, layout, typography), but every element moves.
- Total render time is similar to before (~3 segments, ffmpeg stitch at the end).

## Outcome

A genuinely cinematic 3-minute keynote where every UI shown is alive — cursors clicking, scores counting, posts publishing, agents activating — set against Apple-style typography and pacing. Final deliverable: `ThreeReachAI-Keynote.mp4` in `/mnt/documents/`.
