import { Github, GitPullRequest, Layers, Target } from "lucide-react";

export const DEVELOPER = {
	name: "Mara Solis",
	handle: "marasolis",
	avatar:
		"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format",
	repos: 34,
	prs: 127,
	skills: [
		{ name: "TypeScript", level: 91, color: "#5b6af0" },
		{ name: "React", level: 88, color: "#5b6af0" },
		{ name: "Next.js", level: 82, color: "#5b6af0" },
		{ name: "REST APIs", level: 76, color: "#22d3ee" },
		{ name: "Node.js", level: 68, color: "#22d3ee" },
		{ name: "Docker", level: 24, color: "#5a6a8a" },
		{ name: "Kubernetes", level: 12, color: "#5a6a8a" },
	],
};

export const ISSUES = [
	{
		id: 1,
		repo: "vercel/swr",
		title: "Add missing TypeScript generics to useSWRInfinite hook",
		labels: ["TypeScript", "React", "Good First Issue"],
		difficulty: "Low",
		matchScore: 96,
		stars: 29400,
		description:
			"The useSWRInfinite hook is missing proper generic type parameters in several edge cases. Contributors should add correct TypeScript generics to improve type safety without breaking existing behavior.",
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
		repo: "t3-oss/create-t3-app",
		title: "Form validation error messages not shown on first submit",
		labels: ["React", "Next.js", "Bug"],
		difficulty: "Low",
		matchScore: 91,
		stars: 24800,
		description:
			"When a user clicks submit without interacting with any fields, zod validation errors are not displayed until the second submission attempt. The issue is in how touched state is initialized.",
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
		id: 3,
		repo: "trpc/trpc",
		title: "REST adapter missing Content-Type header on 204 responses",
		labels: ["TypeScript", "REST APIs", "Node.js"],
		difficulty: "Medium",
		matchScore: 79,
		stars: 34200,
		description:
			"The HTTP REST adapter returns a Content-Type: application/json header on 204 No Content responses, which violates the HTTP spec. The fix requires conditional header logic in the response handler.",
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
		id: 4,
		repo: "shadcn-ui/ui",
		title: "DataTable column visibility toggle doesn't persist on re-render",
		labels: ["React", "TypeScript", "UI"],
		difficulty: "Low",
		matchScore: 87,
		stars: 71000,
		description:
			"Column visibility state in the DataTable component resets to default when the parent component re-renders. Visibility should be controlled externally with the standard React state lifting pattern.",
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
];

export const STEPS = [
	{
		icon: Github,
		number: "01",
		title: "Connect GitHub",
		body: "Link your account. The system reads your repositories, pull requests, and contribution history — not just stars.",
	},
	{
		icon: Layers,
		number: "02",
		title: "Skill Analysis",
		body: "Every file, commit, and review is analyzed to build a capability profile grounded in what you have actually shipped.",
	},
	{
		icon: Target,
		number: "03",
		title: "Issue Matching",
		body: "Open issues across the ecosystem are ranked against your profile. You see only the ones you are most likely to complete.",
	},
	{
		icon: GitPullRequest,
		number: "04",
		title: "Guided Contribution",
		body: "After selecting an issue, receive a contribution guide: relevant files, investigation path, and related pull requests.",
	},
];
