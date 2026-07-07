import type { AnalysisPhase, Issue } from "./types";

export const USER = {
	name: "Mara Solis",
	handle: "marasolis",
	avatar:
		"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format",
	prs: 127,
	repos: 34,
	streak: 12,
};

export const ALL_ISSUES: Issue[] = [
	{
		id: 1,
		repo: "vercel/swr",
		title: "Add missing TypeScript generics to useSWRInfinite hook",
		labels: ["good first issue", "typescript"],
		difficulty: "Low",
		matchScore: 96,
		stars: 29400,
		openedDaysAgo: 3,
		comments: 7,
		language: "TypeScript",
		bookmarked: false,
		description:
			"The useSWRInfinite hook is missing proper generic type parameters in several edge cases. Contributors should add correct TypeScript generics to improve type safety without breaking existing behavior.",
		matchReasons: [
			"Strong TypeScript proficiency detected (91/100)",
			"React ecosystem experience matches codebase patterns",
			"Low complexity — isolated to type definitions",
		],
		files: [
			"src/infinite/index.ts",
			"src/types.ts",
			"test/use-swr-infinite.test.tsx",
		],
		steps: [
			"Reproduce the type error with the minimal example in the issue",
			"Review the existing generics in useSWR for reference patterns",
			"Add missing generic constraints to useSWRInfinite",
			"Run the existing test suite to confirm no regressions",
			"Add a test case covering the fixed scenario",
		],
		related: ["PR #2341", "PR #2198"],
	},
	{
		id: 2,
		repo: "shadcn-ui/ui",
		title: "DataTable column visibility toggle doesn't persist on re-render",
		labels: ["bug", "react"],
		difficulty: "Low",
		matchScore: 91,
		stars: 71000,
		openedDaysAgo: 5,
		comments: 12,
		language: "TypeScript",
		bookmarked: false,
		description:
			"Column visibility state in the DataTable component resets to default when the parent component re-renders.",
		matchReasons: [
			"React state management is a demonstrated strength",
			"Previous work in component libraries detected",
			"Issue is isolated to a single component file",
		],
		files: [
			"apps/www/registry/default/example/data-table.tsx",
			"apps/www/content/docs/components/data-table.mdx",
		],
		steps: [
			"Review current columnVisibility state placement in data-table.tsx",
			"Lift state to the parent component or use controlled pattern",
			"Update the docs example to show controlled usage",
			"Test by triggering re-renders and confirming visibility persists",
		],
		related: ["PR #3241"],
	},
	{
		id: 3,
		repo: "t3-oss/create-t3-app",
		title: "Form validation error messages not shown on first submit",
		labels: ["bug", "next.js"],
		difficulty: "Low",
		matchScore: 88,
		stars: 24800,
		openedDaysAgo: 2,
		comments: 4,
		language: "TypeScript",
		bookmarked: true,
		description:
			"When a user clicks submit without interacting with any fields, zod validation errors are not displayed until the second submission attempt.",
		matchReasons: [
			"Next.js expertise confirmed across 8 repositories",
			"Form handling patterns detected in prior contributions",
			"Low-risk change — touches only client-side state",
		],
		files: [
			"src/components/form/FormField.tsx",
			"src/hooks/useFormValidation.ts",
		],
		steps: [
			"Reproduce by scaffolding a new T3 app and submitting the form cold",
			"Trace the touched state initialization in useFormValidation.ts",
			"Set all fields to touched on the first submit attempt",
			"Verify error messages appear correctly on initial submit",
		],
		related: ["PR #891", "Issue #860"],
	},
	{
		id: 4,
		repo: "trpc/trpc",
		title: "REST adapter missing Content-Type header on 204 responses",
		labels: ["bug", "api"],
		difficulty: "Medium",
		matchScore: 79,
		stars: 34200,
		openedDaysAgo: 8,
		comments: 19,
		language: "TypeScript",
		bookmarked: false,
		description:
			"The HTTP REST adapter returns a Content-Type: application/json header on 204 No Content responses, which violates the HTTP spec.",
		matchReasons: [
			"REST API knowledge detected in previous projects",
			"TypeScript proficiency aligns with codebase",
			"Medium complexity — requires understanding of HTTP semantics",
		],
		files: [
			"packages/server/src/adapters/fetch/fetchRequestHandler.ts",
			"packages/server/src/http/resolveHTTPResponse.ts",
		],
		steps: [
			"Locate header assignment in resolveHTTPResponse.ts",
			"Add a conditional check — skip Content-Type when status is 204",
			"Update the fetchRequestHandler to propagate the fix",
			"Add integration tests covering 204 response scenarios",
		],
		related: ["PR #5102", "PR #4988"],
	},
	{
		id: 5,
		repo: "pmndrs/zustand",
		title: "Add devtools middleware TypeScript types for custom serializers",
		labels: ["enhancement", "typescript"],
		difficulty: "Medium",
		matchScore: 83,
		stars: 47800,
		openedDaysAgo: 11,
		comments: 6,
		language: "TypeScript",
		bookmarked: false,
		description:
			"The devtools middleware does not expose proper TypeScript types when a custom state serializer is passed.",
		matchReasons: [
			"State management patterns found in React projects",
			"TypeScript generic experience is well-evidenced",
			"Middleware architecture aligns with Node.js background",
		],
		files: ["src/middleware/devtools.ts", "src/types.ts"],
		steps: [
			"Reproduce the type loss by passing a custom serializer in TypeScript strict mode",
			"Trace where generics are dropped in the devtools wrapper",
			"Augment the function signature to thread the serializer type through",
			"Add test types using tsd or expect-type",
		],
		related: ["PR #2108"],
	},
	{
		id: 6,
		repo: "next-auth/next-auth",
		title: "Session callback type loses custom user fields in TypeScript",
		labels: ["typescript", "bug", "good first issue"],
		difficulty: "Low",
		matchScore: 85,
		stars: 24600,
		openedDaysAgo: 6,
		comments: 9,
		language: "TypeScript",
		bookmarked: true,
		description:
			"When augmenting the Session interface via module augmentation, custom fields added to session.user are not reflected in the session callback's type signature.",
		matchReasons: [
			"Auth patterns found in Next.js projects",
			"TypeScript module augmentation is within demonstrated skill set",
			"Isolated to type declaration files only",
		],
		files: [
			"packages/next-auth/src/types.ts",
			"packages/next-auth/src/index.ts",
		],
		steps: [
			"Reproduce with a minimal Next.js + next-auth setup and a custom session field",
			"Locate where session callback types are declared",
			"Ensure the generic thread passes augmented types through",
			"Verify with a TypeScript playground snippet in the PR",
		],
		related: ["PR #10341"],
	},
];

export const SKILL_RADAR = [
	{ skill: "TypeScript", value: 91 },
	{ skill: "React", value: 88 },
	{ skill: "Next.js", value: 82 },
	{ skill: "REST APIs", value: 76 },
	{ skill: "Node.js", value: 68 },
	{ skill: "Testing", value: 61 },
];

export const ACTIVITY = [
	4, 0, 2, 7, 3, 0, 0, 5, 8, 2, 1, 0, 6, 4, 0, 0, 3, 9, 5, 2, 0, 1, 4, 7, 3, 0,
	2, 5,
];

export const REPO_ANALYSIS_PHASES: {
	id: AnalysisPhase;
	label: string;
	detail: string;
	duration: number;
}[] = [
	{
		id: "cloning",
		label: "Cloning repository",
		detail: "Fetching file tree and metadata",
		duration: 1000,
	},
	{
		id: "stack",
		label: "Detecting tech stack",
		detail: "Scanning package manifests and imports",
		duration: 1300,
	},
	{
		id: "complexity",
		label: "Assessing complexity",
		detail: "LOC, contributor count, PR velocity",
		duration: 1100,
	},
	{
		id: "issues",
		label: "Reading open issues",
		detail: "Fetching labels, comments, age",
		duration: 1200,
	},
	{
		id: "matching",
		label: "Matching to your profile",
		detail: "Comparing issue requirements to your skills",
		duration: 1400,
	},
	{ id: "done", label: "Done", detail: "", duration: 0 },
];

export const LANG_COLOR: Record<string, string> = {
	TypeScript: "#3178c6",
	JavaScript: "#f7df1e",
	Go: "#00add8",
	Python: "#3572a5",
	Rust: "#dea584",
	Ruby: "#cc342d",
};
