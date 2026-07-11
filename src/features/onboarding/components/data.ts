export type Phase =
	| "connecting"
	| "repos"
	| "languages"
	| "tools"
	| "profile"
	| "done";

export type DeveloperProfile = {
	username?: string;
	avatar_url?: string;
	name?: string;
	bio?: string;
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
	tech_stack?: { packages?: Record<string, number> };
};
