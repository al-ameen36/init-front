# Init

> An AI onboarding engineer that helps developers understand unfamiliar codebases and contribute to open source with confidence.

Init analyzes your GitHub profile, understands a repository's architecture, and matches you with issues that fit your experience. Instead of spending hours figuring out where to start, Init generates an investigation plan that guides you through the codebase.

This repository contains the web application that powers the Init experience.

---

## Features

- 🚀 GitHub authentication
- 👤 Automatic developer profile generation
- 📊 Live onboarding experience powered by Server-Sent Events
- 🎯 Personalized issue recommendations
- 🧠 AI-generated investigation guides
- 📁 Repository management
- 📈 Developer skills dashboard
- ⚡ Streaming issue analysis

---

## User Journey

```text
Sign in with GitHub
          │
          ▼
Analyze Developer Profile
          │
          ▼
Understand Skills & Technologies
          │
          ▼
Select Repository
          │
          ▼
Match Issues
          │
          ▼
Generate Investigation Guide
          │
          ▼
Start Contributing
```

---

## Tech Stack

- React 19
- TanStack Start
- Tailwind CSS v4
- TanStack Query
- Supabase
- Motion
- Recharts
- Zod
- Biome

---

## Getting Started

### Install dependencies

```bash
pnpm install
```

### Configure environment

```bash
cp .env.example .env
```

```dotenv
VITE_SERVER_URL=http://localhost:8000

VITE_SUPABASE_URL=https://<project>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<publishable-anon-key>
```

---

## Running

```bash
pnpm dev
```

The application runs at:

```
http://localhost:3000
```

---

## Scripts

```bash
pnpm dev
pnpm build
pnpm test
pnpm check
pnpm lint
pnpm format
pnpm generate-routes
```

---

## Authentication

Authentication is handled with **Supabase GitHub OAuth**.

After signing in, Init automatically uses your GitHub account to:

- Build your developer profile
- Analyze repositories you've worked on
- Match issues against your experience
- Persist your profile and tracked repositories

---

## Application Flow

### 1. Developer Onboarding

When a user signs in, Init builds a live developer profile by streaming analysis from the backend.

The onboarding experience progressively reveals:

- Profile information
- Repositories
- Languages
- Technologies
- Contribution history

instead of waiting for the entire analysis to finish.

---

### 2. Repository Matching

After onboarding, users choose a repository.

Init then:

- Fetches open issues
- Analyzes the repository
- Matches each issue against the developer profile
- Streams results as they become available

Each issue receives:

- Match score
- Required skills
- Summary
- Investigation guide
- Relevant files

---

### 3. Investigation Guide

Rather than simply recommending an issue, Init explains **how to approach it**.

Each guide includes:

- Relevant files
- Suggested reading order
- Important concepts
- Implementation hints
- Links back to GitHub

The goal is to help developers spend less time navigating unfamiliar codebases and more time solving the problem.

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

## Project Structure

```text
src/
├── routes/
├── features/
│   ├── landing/
│   ├── onboarding/
│   └── dashboard/
├── context/
├── hooks/
├── lib/
├── components/
└── styles/
```

---

## Roadmap

- ✅ GitHub authentication
- ✅ Developer profile analysis
- ✅ Live onboarding
- ✅ Repository management
- ✅ Personalized issue matching
- ✅ Investigation guides
- ⏳ Pull request planning
- ⏳ Interactive code walkthroughs
- ⏳ AI code explanations
- ⏳ Team onboarding
- ⏳ VS Code extension

---

## Why Init?

Finding an issue is easy.

Understanding **where to start** is the hard part.

Init bridges that gap by combining your experience with an understanding of the repository to generate actionable investigation plans before you write a single line of code.

Instead of asking:

> _"Where is this implemented?"_

you can focus on:

> _"How do I solve it?"_

---

## Related Projects

- **[init-back](https://github.com/al-ameen36/init-back)** — the FastAPI backend that powers this frontend. It orchestrates GitHub, Graph Sitter, LLMs, and Supabase to deliver profile analysis, issue matching, and investigation guides over its API.
