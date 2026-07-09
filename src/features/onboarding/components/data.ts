export type Phase =
	| "connecting"
	| "repos"
	| "languages"
	| "history"
	| "profile"
	| "matching"
	| "done";

export type AccountType = "developer" | "organization";

export type DeveloperProfile = {
	username?: string;
	repos_count?: number;
	merged_prs?: number;
	commit_stats?: { total_commits?: number };
	total_stars?: number;
	primary_languages?: string[];
	public_repos?: {
		name: string;
		language?: string | null;
		stars?: number;
	}[];
	tech_stack?: { packages?: string[] };
};
