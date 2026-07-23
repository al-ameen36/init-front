# Init

> An AI onboarding engineer that helps developers understand unfamiliar codebases and contribute to open source with confidence.

Init analyzes your GitHub profile, understands a repository's architecture, and matches you with issues that fit your experience. Instead of spending hours figuring out where to start, Init generates an investigation plan that guides you through the codebase.

---

## Features

- GitHub authentication
- Automatic developer profile generation
- Live onboarding powered by SSE
- Personalized issue recommendations
- AI-generated investigation guides
- Repository management
- Developer skills dashboard
- Streaming issue analysis

---

## Tech Stack

React 19, TanStack Start, TanStack Query, Tailwind CSS v4, Supabase,
Motion, Recharts, Zod, Biome.

---

## Getting Started

```bash
pnpm install
cp .env.example .env
pnpm dev
```

```dotenv
VITE_SERVER_URL=http://localhost:8000
VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-anon-key>
```

App runs at `http://localhost:3000`.

---

## Pages

| Route            | Description                        |
| ---------------- | ---------------------------------- |
| `/`              | Landing page                       |
| `/signin`        | Sign in                            |
| `/signup`        | Create account                     |
| `/auth/callback` | GitHub OAuth callback              |
| `/onboarding`    | Live profile analysis              |
| `/matches`       | Personalized issue recommendations |
| `/repos`         | Repository management              |
| `/skills`        | Skills dashboard                   |
| `/active`        | Active contributions               |

---

## Application Flow

1. **Onboarding** — On sign-in, Init streams a developer profile from the backend
   (profile, repos, languages, technologies, contribution history).
2. **Repository Matching** — Users pick a repo. Init fetches issues, analyzes the
   codebase, and streams match scores, investigation guides, and relevant files.
3. **Investigation Guide** — Each matched issue includes relevant files, reading
   order, key concepts, implementation hints, and GitHub links.

---

## Project Structure

```text
src/
├── routes/          # file-based routes
├── features/        # landing, onboarding, dashboard
├── context/         # ProfileProvider, RepoProvider
├── hooks/
├── lib/             # api.ts, supabase.ts
├── components/      # shared UI (RequireAuth, MatchRing, etc.)
└── styles/          # tailwind + theme CSS
```

---

## Related Projects

- **[init-back](https://github.com/al-ameen36/init-back)** — FastAPI backend.
