# Agents — init-front

Guidance for AI coding agents working in the **Init** frontend (TanStack Start /
React 19).

## Commands

```bash
pnpm install
pnpm dev              # vite dev --port 3000
pnpm build            # runs biome check/format then vite build
pnpm test             # vitest run
pnpm check            # biome check
pnpm lint             # biome lint
pnpm format           # biome format
pnpm generate-routes  # tsr generate (after route changes)
```

Always run `pnpm check` (Biome) and `pnpm tsc --noEmit` after edits. The build's
`prebuild` already runs Biome, but run it locally before committing.

## Routing

- File-based routes in `src/routes/`. The dashboard uses a **pathless** layout
  route `src/routes/_dashboard/_layout.tsx`; its children render at URLs
  `/matches`, `/repos`, `/skills`, `/active` (no `/dashboard` segment).
- Generate types after adding/renaming routes: `pnpm generate-routes`.

## State & data fetching

- `src/lib/api.ts` holds `SERVER_URL` + REST helpers. No `/api` proxy — calls
  hit the backend directly.
- Issue analysis streams via `analyzeIssuesStream` (manual `fetch` +
  `ReadableStream` reader parsing `data:` SSE frames), because `EventSource`
  can't send a POST body.
- `ProfileProvider` and `RepoProvider` (in `src/context/`) wrap the app. Use
  `useProfile()` / `useRepos()`.
- React Query caches the issue-analysis batch keyed by
  `["analyze-batch", activeRepo, profileKey]`; results survive route
  navigation. Don't wipe that cache on remount.

## Conventions

- Tailwind v4 utility classes; design tokens via CSS vars (`bg-card`,
  `text-muted-foreground`, etc.).
- Icons from `lucide-react`. Animations from `motion`.
- GitHub links (issue URL, repo, file `blob` URLs) are built in
  `features/dashboard/components/DetailPanel.tsx` — keep them consistent if you
  add new links.
- Prefer editing existing components; dashboard pieces live in
  `src/features/dashboard/components/`.

## Gotchas

- `routes/_dashboard/_layout.active.tsx` uses hardcoded placeholder data — treat
  as WIP, not a real data source.
- `Issue` types live in `src/features/dashboard/types.ts`; the backend
  `AnalyzeIssueResponse` shape must match what `DetailPanel` reads.
