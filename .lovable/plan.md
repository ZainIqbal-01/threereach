
# Lovable-Style Chat Workspace

Reshape the entire dashboard around a **chat + live workspace** layout, mirroring Lovable's editor: conversation on the left drives every action; a tabbed Preview/Code/Files panel on the right reflects the result. All existing modules remain — they're rendered inside the workspace pane and triggered through chat tools.

## New App Shell

Replace `AppLayout` with a 3-pane layout:

```text
┌──────────┬──────────────────┬───────────────────────────┐
│ Sidebar  │   Chat Panel     │   Workspace (tabbed)      │
│ (chats + │  messages,       │  [Preview] [Code] [Files] │
│  modules)│  composer,       │                           │
│          │  tool cards      │  renders active module    │
└──────────┴──────────────────┴───────────────────────────┘
```

- **Left rail (60px)** — collapsed icon sidebar: Star Agent mascot, "New chat", chat history list, module shortcuts (Scan, Brand Intel, Optimize, Distribution, Agents, Reports, Settings), theme toggle.
- **Chat panel (~420px, resizable)** — message stream with markdown rendering, tool-call cards (e.g. "Running AI scan…", "Opening PR #123"), composer with slash commands (`/scan`, `/optimize`, `/brand`, `/post`, `/connect github`), file/URL attach.
- **Workspace pane (flex)** — three tabs:
  - **Preview** — renders the live module relevant to the conversation (Overview dashboard by default; switches to ScanResults, BrandIntel results, Optimize wizard, Distribution composer, Agent hub, etc.).
  - **Code** — diff viewer for GitHub Optimizer runs (file list + monospace diff + PR link).
  - **Files** — generated artifacts (llms.txt, sitemap.xml, schema JSON-LD, reports) with download.

## Chat Engine (Hybrid)

New edge function `chat-orchestrator`:
- Uses Lovable AI Gateway (`google/gemini-2.5-flash`) with **tool-calling**.
- Sends full conversation history each turn.
- Available tools (mapped to existing flows):
  - `run_ai_scan({engines, query})` → calls `ai-scan`
  - `analyze_brand({url})` → calls `analyze-brand`
  - `optimize_repo({repo, scope})` → calls `github-optimize` (mock fallback when no PAT)
  - `generate_content({platform, topic})` → calls `generate-content`
  - `fetch_signals()` → calls `public-signals`
  - `open_module({name})` → switches workspace pane
  - `update_business_profile(...)`
- Each tool returns a structured result the UI renders as a rich card (status, metrics, links).
- Heavy/destructive actions (real GitHub PR, real social posting) stay mocked unless the user has connected creds — keeps the "no keys required" guarantee.

## Persistence (Lovable Cloud)

Two new tables with RLS (auth.uid() = user_id):

- `chat_conversations` — id, user_id, title, last_message_at, pinned, archived.
- `chat_messages` — id, conversation_id, user_id, role (`user`|`assistant`|`tool`|`system`), content (text), tool_name, tool_input jsonb, tool_output jsonb, status, created_at.

Realtime enabled on `chat_messages` so streamed assistant chunks and tool progress appear live.

## Frontend Pieces

New:
- `src/pages/Workspace.tsx` — the new shell, becomes the main `/dashboard/*` route.
- `src/components/chat/ChatPanel.tsx` — message list + composer.
- `src/components/chat/MessageBubble.tsx` — markdown via `react-markdown` + code highlight.
- `src/components/chat/ToolCallCard.tsx` — status, inputs, results, retry.
- `src/components/chat/SlashCommandMenu.tsx` — autocomplete (`/scan`, `/optimize`, …).
- `src/components/chat/ConversationList.tsx` — sidebar history (rename, delete, pin).
- `src/components/workspace/WorkspaceTabs.tsx` — Preview / Code / Files tabs.
- `src/components/workspace/CodeDiffViewer.tsx` — file tree + diff.
- `src/components/workspace/FilesPanel.tsx` — artifact downloads.
- `src/components/workspace/PreviewRouter.tsx` — maps `activeModule` state → existing pages (Overview, AIScan, BrandIntelligence, Optimize, Distribution, AgentCommandCenter, Reports, Settings, BuildFootprint, ProofTracking, Billing).
- `src/hooks/useChat.ts` — conversation state, send, tool dispatch, realtime sub.
- `src/hooks/useWorkspace.ts` — active module + active tab + artifact list.

Edited:
- `src/App.tsx` — `/dashboard/*` renders `Workspace`; legacy routes still resolvable inside the Preview tab.
- `src/components/layout/AppSidebar.tsx` — slim into icon rail used by Workspace; Star Agent mascot retained.
- `src/pages/Optimize.tsx`, `AIScan.tsx`, `BrandIntelligence.tsx`, etc. — wrap with a `embedded` mode prop so they render cleanly inside the Preview tab (no duplicate page chrome).
- Keep ⌘K palette; add it to chat composer for quick tool insertion.

## Backend Pieces

- `supabase/functions/chat-orchestrator/index.ts` — JWT-validated, CORS, Zod-validated body, streams assistant text + tool events; calls existing functions via `supabase.functions.invoke`.
- Migration: tables above + indexes (`conversation_id`, `user_id`), realtime publication, no destructive changes to current schema.

## Coverage Map (every existing feature reachable)

| Module | Trigger | Workspace pane |
|---|---|---|
| Overview dashboard | default / `/overview` | Preview |
| AI Visibility Scan | "Run a scan" / `/scan` | Preview (live results) |
| Brand Intelligence | "Analyze brand X" | Preview (3-phase animation) |
| Build Footprint | "Generate footprint" | Files (artifacts) + Preview |
| GitHub Optimizer | "Optimize my site" / `/optimize` | Code tab (diff + PR) |
| Distribution | "Post about …" | Preview composer |
| Agents (7) | "Run agent X" / `@agent` | Preview hub + tool cards |
| Proof Tracking | "Show proofs" | Preview |
| Reports | "Generate report" | Files (PDF) |
| Settings / Billing | sidebar icons | Preview |
| Onboarding | first-run, in chat | Inline chat wizard |

## Visual Style

Stays on the existing design system (navy/electric/cyan, light default, semantic tokens, `card-reach`, glassmorphic surfaces, Star Agent). Chat bubbles use `card-glass` + subtle `gradient-border`; tool cards use `card-premium` with status pills. No new colors — only existing tokens from `index.css`.

## Out of Scope

- No real GitHub OAuth flow added (still PAT + demo mock).
- No real social-network posting (Distribution stays simulated).
- No removal of existing pages — they're embedded, not deleted, so deep links keep working.

## Rollout

1. DB migration + edge function.
2. Chat hook + components (no routing change yet).
3. New `Workspace` shell behind `/dashboard`; legacy pages embedded.
4. Wire each tool → existing function; verify Scan, Optimize, Brand Intel end-to-end.
5. Polish: slash menu, artifacts panel, realtime streaming, history rename/delete.
