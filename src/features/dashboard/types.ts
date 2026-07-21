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

// ---- Contributor Playbook (backend /pr-pattern) ----

export type Recommendation = {
	title: string;
	description: string;
	priority: "high" | "medium" | "low";
	evidence: string[];
};

export type ChecklistItem = {
	text: string;
	required: boolean;
};

export type ExamplePR = {
	number: number;
	title: string;
	url: string;
	summary: string;
};

export type PRStats = {
	min_time_to_merge_hours: number;
	max_time_to_merge_hours: number;
	min_files_changed: number;
	max_files_changed: number;
	min_insertions: number;
	max_insertions: number;
	min_deletions: number;
	max_deletions: number;
	min_review_rounds: number;
	max_review_rounds: number;
};

export type ContributorPlaybook = {
	summary: string;
	recommendations: Recommendation[];
	checklist: ChecklistItem[];
	example_prs: ExamplePR[];
	prs_analyzed: number;
	repo: string;
	stats: PRStats;
	created_at?: string;
	updated_at?: string;
};
