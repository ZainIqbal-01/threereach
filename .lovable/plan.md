

## Replace emoji icons with real platform brand logos

Currently `src/pages/Distribution.tsx` uses emoji icons (📢, ❓, 💼, ✍️, 🔶, 𝕏) for Reddit, Quora, LinkedIn, Medium, Hacker News and X/Twitter. The codebase already has a clean precedent for AI-engine SVG brand logos in `src/components/ui/ai-engine-logos.tsx` — we'll mirror that pattern for social platforms so every place that displays a platform shows its real, recognizable brand mark.

### What you'll see

- **Distribution page**: Each platform card (Reddit, Quora, LinkedIn, Medium, Hacker News, X) shows its actual brand logo in its official brand color, inside a tinted "well" — same premium look as the AI engine cards.
- **Quick post tiles, post feed, auto-post settings**: All emoji 📢/❓/💼 etc. are replaced with the matching SVG logo.
- **Overview page → Distribution quick action**: Uses the Reddit-style multi-platform mark instead of 📢.
- **TopBar notifications**: "Reddit post got 45 upvotes" notification renders the Reddit alien instead of 📢.

### Logos included (real, official brand marks as inline SVG)

| Platform     | Mark                                               | Brand color           |
|--------------|----------------------------------------------------|-----------------------|
| Reddit       | Snoo alien head (simplified official mark)         | `#FF4500`             |
| Quora        | Stylized "Q" wordmark                              | `#B92B27`             |
| LinkedIn     | "in" rounded square                                | `#0A66C2`             |
| Medium       | "M" with circles (official)                        | `#000000` / adaptive  |
| Hacker News  | "Y" in orange square (official)                    | `#FF6600`             |
| X / Twitter  | Official "X" glyph                                 | `#000000` / adaptive  |

All logos are hand-coded inline SVG (no external requests, no bundle bloat, scale crisply, work in light + dark mode via `currentColor` where appropriate).

### Files to create

- **`src/components/ui/platform-logos.tsx`** — Mirrors `ai-engine-logos.tsx`. Exports:
  - `RedditLogo`, `QuoraLogo`, `LinkedInLogo`, `MediumLogo`, `HackerNewsLogo`, `XLogo` (each accepts `className`/`size`)
  - `getPlatformLogo(platform: string, className?: string)` helper
  - `PLATFORM_BRAND_COLORS` map for tinted backgrounds

### Files to edit

- **`src/pages/Distribution.tsx`**
  - Change `PlatformConfig.icon` from `string` to `React.ReactNode` (or drop it and resolve via `getPlatformLogo(p.id)`).
  - Replace each `<span className="text-lg">{p.icon}</span>` (4 occurrences: lines ~227, 265, 298, 399) with `getPlatformLogo(p.id, "h-5 w-5")` rendered inside the existing tinted well.
- **`src/pages/Overview.tsx`** (line ~214) — Replace the `"📢"` Distribution quick-action icon with the Reddit logo (or a small composite of Reddit + LinkedIn) wrapped in the same gradient tile.
- **`src/components/layout/TopBar.tsx`** (line ~23) — Notification "Reddit post got 45 upvotes" uses `<RedditLogo className="h-4 w-4 text-[#FF4500]" />` instead of 📢.

### Out of scope (won't touch)

- Onboarding step icons (`chatgpt/gemini/perplexity` already use `getEngineLogo` correctly).
- Agent registry icons, status icons, sidebar icons, generic UI emojis (📊, 📄, 🤖) — unrelated to platform branding.

### Technical notes

- **Trademark safety**: Inline SVGs are stylized representations of public brand marks for nominal use (showing "this content is for Reddit"). No copyrighted Snoo artwork is bundled — the Reddit mark is a simplified geometric reproduction.
- **Dark mode**: X and Medium marks use `currentColor` so they invert correctly; Reddit/LinkedIn/Quora/HN keep their fixed brand colors (set explicitly via `style` or arbitrary Tailwind class).
- **No new dependencies**: zero npm installs; everything is hand-rolled SVG matching the existing `ai-engine-logos.tsx` style.

