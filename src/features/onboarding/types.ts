export type PhaseId =
	| "profile"
	| "repositories"
	| "languages"
	| "technologies"
	| "pull_requests"
	| "done";

export type DevResult = {
	username?: string;
	avatar_url?: string;
	name?: string;
	bio?: string;
	repositories?: number;
	stars?: number;
	languages?: string[];
	technologies?: Record<string, number>;
	pull_requests?: { total: number; merged: number };
};
