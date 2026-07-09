# Init (Frontend)

TanStack Start web app for **Init**. The landing experience is the developer
onboarding ("Contributor Compass") flow: the frontend starts a profile analysis
on the backend and reveals each step live as the backend streams it over SSE.

## Stack

- TanStack Start (React 19, file-based routing)
- Tailwind CSS v4
- Biome (lint + format)
- Nitro (production server adapter)
- `motion`, `recharts`, `lucide-react`, `zod`

## Setup

```bash
pnpm install

# configure the backend URL
cp .env.example .env
```

```dotenv
# .env
SERVER_URL=http://localhost:8000
```

`SERVER_URL` is read at runtime in `src/lib/api.ts` and used directly for both
the REST call and the SSE connection — there is **no** `/api` proxy.

## Running

```bash
pnpm dev        # vite dev --port 3000  -> http://localhost:3000
```

## Scripts

```bash
pnpm dev          # start dev server on :3000
pnpm build        # production build (runs biome check/format first)
pnpm test         # vitest run
pnpm check        # biome check
pnpm lint         # biome lint
pnpm format       # biome format
pnpm generate-routes  # tsr generate
```

## Routes

| Route          | Purpose                                                  |
| -------------- | -------------------------------------------------------- |
| `/`            | Landing page                                             |
| `/signin`      | Sign in                                                  |
| `/signup`      | Sign up                                                  |
| `/onboarding`  | Developer analysis flow (SSE-driven timeline)            |
| `/matches`     | Matches dashboard (post-analysis CTA target)             |
| `/dashboard/*` | Authenticated dashboard (skills, repos, active, matches) |

## Onboarding flow (`/onboarding`)

`useOnboardingAnalysis` (in `src/hooks/`) starts the analysis and opens an
`EventSource` at `${SERVER_URL}/developer/events/${job_id}`. As each backend
event arrives the profile data is merged and a `phaseIndex` advances:

| Phase | Event          | Timeline step                |
| ----- | -------------- | ---------------------------- |
| 1     | open / profile | Connecting to GitHub         |
| 2     | repositories   | Fetching repositories        |
| 3     | languages      | Analyzing languages          |
| 4     | technologies   | Analyzing tools              |
| 5     | pull_requests  | Reading contribution history |
| 6     | completed      | Completing profile           |

The UI advances steps one at a time on a fixed 700ms dwell (`STEP_DWELL_MS`) so
steps reveal sequentially even if backend events arrive batched. The live data
panel (`features/onboarding/components/DevLivePanel.tsx`) shows repos,
languages, technologies, and contribution history. When the `completed` event
arrives the **Enter dashboard** button navigates to `/matches`.

> The demo username is hardcoded (`yyx990803`) — no auth or input yet.

## Project layout

```
src/routes/                       file-based routes
src/hooks/useOnboardingAnalysis.ts   SSE runner + event -> phase mapping
src/lib/api.ts                    SERVER_URL + REST helpers
src/features/onboarding/          onboarding UI (DevLivePanel, data, helpers)
src/features/dashboard/           dashboard types/components
```
