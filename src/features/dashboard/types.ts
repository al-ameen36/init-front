// export type Issue = {
// 	id: number;
// 	repo: string;
// 	title: string;
// 	labels: string[];
// 	difficulty: "Low" | "Medium" | "High";
// 	matchScore: number;
// 	stars: number;
// 	openedDaysAgo: number;
// 	comments: number;
// 	description: string;
// 	matchReasons: string[];
// 	files: string[];
// 	steps: string[];
// 	related: string[];
// 	language: string;
// 	bookmarked: boolean;
// };

export type Issue = {
	number: number;
	title: string;
	url: string;
	labels: string[];
	comments: number;
	opened: string;
	repo?: string;
	matchScore?: number;
	difficulty?: "Low" | "Medium" | "High";
	analysisStatus?: "idle" | "analyzing" | "done" | "error";
};

export type IssuesResponse = {
	issues: Issue[];
};

export type ScoredFile = {
	file: string;
	confidence_score: number;
	reasoning: string;
};

export type InvestigationGuide = {
	difficulty: "Low" | "Medium" | "High";
	comments: number;
	opened: string;
	summary: string;
	relevant_files: string[];
	investigation_path: string[];
	required_skills: string[];
};

export type AnalyzeIssueResponse = {
	number: number;
	title: string;
	repo: string;
	language: string;
	matchScore: number;
	matchReasons: string[];
	related: string[];
	scored_files: ScoredFile[];
	guide: InvestigationGuide;
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
