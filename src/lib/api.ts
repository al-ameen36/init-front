import type {
	AnalyzeIssueResponse,
	IssuesResponse,
} from "#/features/dashboard/types";
import type { DeveloperProfile } from "@/features/onboarding/components/data";

export const SERVER_URL = process.env.SERVER_URL || "http://localhost:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const response = await fetch(`${SERVER_URL}${path}`, {
		headers: { accept: "application/json" },
		...init,
	});

	if (!response.ok) {
		throw new Error(`API ${path} failed: ${response.statusText}`);
	}

	return response.json() as Promise<T>;
}

export function fetchIssues(repo: string): Promise<IssuesResponse> {
	return request<IssuesResponse>(`/issues/${repo}`);
}

export type RepoMeta = {
	owner: string;
	name: string;
	full_name: string;
	description: string | null;
	language: string | null;
	stars: number;
	forks: number;
	open_issues_count: number;
	html_url: string | null;
	pushed_at: string | null;
	topics: string[];
};

export function fetchRepoMeta(owner: string, name: string): Promise<RepoMeta> {
	return request<RepoMeta>(`/repo/${owner}/${name}`);
}

export function analyzeIssue(
	repo: string,
	issueNumber: number,
	profile?: DeveloperProfile | null,
): Promise<AnalyzeIssueResponse> {
	return request<AnalyzeIssueResponse>("/analyze/", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({
			repo,
			issue_number: issueNumber,
			developer_profile: profile ?? null,
		}),
	});
}

export function startDeveloperAnalysis(
	username: string,
): Promise<{ job_id: string }> {
	return request<{ job_id: string }>("/developer/analyze", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ username }),
	});
}
