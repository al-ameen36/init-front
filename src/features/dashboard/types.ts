export type Issue = {
	id: number;
	repo: string;
	title: string;
	labels: string[];
	difficulty: "Low" | "Medium" | "High";
	matchScore: number;
	stars: number;
	openedDaysAgo: number;
	comments: number;
	description: string;
	matchReasons: string[];
	files: string[];
	steps: string[];
	related: string[];
	language: string;
	bookmarked: boolean;
};

export type RepoStatus = "idle" | "analyzing" | "done";

export type AnalysisPhase =
	| "cloning"
	| "stack"
	| "complexity"
	| "issues"
	| "matching"
	| "done";

export type AddedRepo = {
	id: number;
	url: string;
	name: string;
	owner: string;
	language: string;
	stars: number;
	complexity: "Low" | "Medium" | "High";
	openIssues: number;
	matchedIssues: number;
	techStack: string[];
	dependencies: string[];
	lastCommit: string;
	contributors: number;
	hasContributing: boolean;
	goodFirstIssues: number;
};

export type NavId = "matches" | "repos" | "active" | "skills";
