import type { AnalysisPhase } from "./types";

export const USER = {
	name: "Mara Solis",
	handle: "marasolis",
	avatar:
		"https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop&auto=format",
	prs: 127,
	repos: 34,
	streak: 12,
};

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
