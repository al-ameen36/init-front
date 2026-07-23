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

Always run `pnpm check` (Biome) and `pnpm tsc --noEmit` after edits.

## Routing

- File-based routes in `src/routes/`. Dashboard uses a **pathless** layout
  `src/routes/_dashboard/_layout.tsx`; children at `/matches`, `/repos`,
  `/skills`, `/active`.
- Generate types after adding/renaming routes: `pnpm generate-routes`.

## State & data fetching

- `src/lib/api.ts` holds `SERVER_URL` + REST/SSE helpers. No `/api` proxy.
- `readSSEStream` parses SSE from `ReadableStream`. Handles `\n\n` and
  `\r\n\r\n` separators, bare JSON frames, and throws on malformed JSON.
  The `done` check runs after the frame loop to drain remaining buffer.
- `fetchRepoPattern` accepts both JSON and SSE responses, including raw
  playbook objects without an event envelope. Uses `retry: false`.
- Issue analysis streams via `analyzeIssuesStream` (manual `fetch` +
  `ReadableStream` reader, because `EventSource` can't send POST).
- `ProfileProvider` and `RepoProvider` (in `src/context/`) wrap the app.
  Use `useProfile()` / `useRepos()`.
- React Query caches issue-analysis batches keyed by
  `["analyze-batch", activeRepo, profileKey]`.

## Conventions

- Tailwind v4 utilities; design tokens via CSS vars (`bg-card`,
  `text-muted-foreground`, etc.).
- Icons from `lucide-react`. Animations from `motion`.
- GitHub links are built in `features/dashboard/components/DetailPanel.tsx`.
- Prefer editing existing components in `src/features/dashboard/components/`.

## Gotchas

- `routes/_dashboard/_layout.active.tsx` uses hardcoded placeholder data.
- `Issue` types live in `src/features/dashboard/types.ts`.
- `vite.config.ts` uses `manualChunks` to split `recharts` and `motion` into
  separate cached chunks. Main bundle: ~566 KB min / ~165 KB gzip.
