

The user wants a dedicated **Agent Operations** experience where they can:
1. Deploy agents (turn them on/off, assign missions)
2. See real-time progress of what each agent is doing
3. Watch agents work live (activity stream)
4. See what each agent will do next (queued/upcoming actions)

Looking at the codebase: there's already an `AgentHub` component on the dashboard with basic working/idle states, plus a 7-agent registry (`agentRegistry.ts`) — Nova, Scout, Oracle, Spark, Atlas, Sentinel, Sage. We should build a dedicated **Agent Command Center** page that goes much deeper than the current hub card.

## Plan: Agent Command Center

### New Route
- `/dashboard/agents` — full-page Agent Command Center
- Add to `AppSidebar.tsx` with `Bot` icon, between Overview and AI Scan
- Add route in `App.tsx`

### Page Structure (`src/pages/AgentCommandCenter.tsx`)

**1. Hero Strip — Fleet Status**
- Headline "Agent Command Center" + Nova mascot
- Live counters: Active / Idle / Tasks completed today / Queue depth
- Global "Deploy All" / "Pause All" controls
- Animated mesh background

**2. Agent Roster Grid (7 cards)**
Each card shows:
- Star Agent avatar with mood + brand-tinted halo
- Name, role, current mission status (Active / Idle / Paused)
- **Deploy toggle** (switch) — turns agent on/off
- Live progress bar with shimmer (current task %)
- "Now doing" line with spinner + live action text
- "Up next" mini queue (2–3 upcoming actions with ETA)
- Quick-deploy menu: pick a mission preset (e.g., for Scout: "Scan ChatGPT", "Scan all engines", "Deep crawl")
- Stats row: tasks/day, success rate, last run

**3. Live Activity Stream (right rail or bottom)**
- Real-time scrolling feed: `[10:42] Scout → completed scan on Perplexity (12 mentions found)`
- Color-coded by agent (using `accentHue`)
- Auto-scroll with pause-on-hover
- Filter chips by agent

**4. Mission Queue Panel**
- Kanban-style: "In Progress | Queued | Completed (today)"
- Drag-free, just visual columns with task cards
- Each task shows assigned agent badge + ETA + progress

**5. Agent Detail Drawer (on card click)**
- Slide-in sheet with: full mission history, performance chart (last 7 days), task log, manual command input ("Run a custom scan…")

### Supporting Components (new)
- `src/components/agents/AgentControlCard.tsx` — the main grid card with deploy toggle, progress, up-next queue
- `src/components/agents/LiveActivityStream.tsx` — scrolling feed with agent-color rows
- `src/components/agents/MissionQueue.tsx` — 3-column kanban
- `src/components/agents/AgentDetailDrawer.tsx` — slide-in sheet
- `src/components/agents/FleetStatusBar.tsx` — top metrics strip
- `src/hooks/useAgentSimulation.ts` — central state hook simulating live agent activity (deploys, progress ticks, completions, queue advancement) so all panels stay in sync

### Mission Presets (in `agentRegistry.ts` extension)
Add a `missions: { id, label, description, durationSec }[]` array per agent so deploy menus have real options (Scout → "Scan ChatGPT", Oracle → "Sentiment sweep", Spark → "Generate 3 LinkedIn posts", etc.).

### Animations & Polish
- Cards stagger in (60ms intervals)
- Active agents pulse with their accent halo
- Progress bars use `progress-shimmer` from `index.css`
- Activity stream rows fade-in from top
- Toast on deploy/pause actions
- Glassmorphic styling, `rounded-2xl`, mesh background

### Dashboard Integration
- Update existing `AgentHub.tsx` on `/dashboard` to add a "Open Command Center →" link in the header
- Keep AgentHub as the compact summary; Command Center is the deep view

### Files to create/edit
**Create:**
- `src/pages/AgentCommandCenter.tsx`
- `src/components/agents/AgentControlCard.tsx`
- `src/components/agents/LiveActivityStream.tsx`
- `src/components/agents/MissionQueue.tsx`
- `src/components/agents/AgentDetailDrawer.tsx`
- `src/components/agents/FleetStatusBar.tsx`
- `src/hooks/useAgentSimulation.ts`

**Edit:**
- `src/components/agents/agentRegistry.ts` — add `missions` array per agent
- `src/components/layout/AppSidebar.tsx` — add "Agents" nav item
- `src/App.tsx` — add `/dashboard/agents` route
- `src/components/agents/AgentHub.tsx` — add "Open Command Center" link

No backend changes — uses simulated real-time state via the `useAgentSimulation` hook (consistent with existing `AgentHub` pattern). When real data is wired later, only the hook needs to swap to Supabase realtime.

