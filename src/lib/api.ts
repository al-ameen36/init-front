import type {
	AnalyzeIssueResponse,
	ContributorPlaybook,
	IssuesResponse,
} from "#/features/dashboard/types";
import type { DeveloperProfile } from "@/features/onboarding/components/data";
import { supabase } from "@/lib/supabase";

export const SERVER_URL =
	import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

async function authHeaders(): Promise<Record<string, string>> {
	const headers: Record<string, string> = { accept: "application/json" };
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;
	if (token) headers.Authorization = `Bearer ${token}`;
	return headers;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
	const headers = await authHeaders();
	const response = await fetch(`${SERVER_URL}${path}`, {
		...init,
		headers: {
			...headers,
			...(init?.headers as Record<string, string> | undefined),
		},
	});

	if (!response.ok) {
		if (response.status === 401 && typeof window !== "undefined") {
			window.location.href = "/signin";
		}
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

export type AnalyzeStreamEvent =
	| { type: "status"; stage: string; message: string }
	| { type: "result"; analysis: AnalyzeIssueResponse }
	| { type: "error"; number?: number; message: string };

export type AnalyzeStreamOptions = {
	force?: boolean;
	signal?: AbortSignal;
	onEvent?: (event: AnalyzeStreamEvent) => void;
};

/**
 * Streams analysis over SSE via a POST body. EventSource can't send a body, so
 * we read the streamed response manually and emit each parsed event.
 */
export async function analyzeIssuesStream(
	repo: string,
	issueNumbers: number[],
	profile?: DeveloperProfile | null,
	opts: AnalyzeStreamOptions = {},
): Promise<void> {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;

	const response = await fetch(`${SERVER_URL}/analyze/`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "text/event-stream",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({
			repo,
			issue_numbers: issueNumbers,
			developer_profile: profile ?? null,
			force: opts.force ?? false,
		}),
		signal: opts.signal,
	});

	if (!response.ok || !response.body) {
		throw new Error(`Analysis stream failed: ${response.statusText}`);
	}

	const reader = response.body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });

		while (true) {
			const sep = buffer.indexOf("\n\n");
			if (sep === -1) break;

			const frame = buffer.slice(0, sep);
			buffer = buffer.slice(sep + 2);

			const dataLine = frame
				.split("\n")
				.find((line) => line.startsWith("data:"));
			if (!dataLine) continue;

			const payload = dataLine.slice(5).trim();
			if (!payload) continue;

			try {
				opts.onEvent?.(JSON.parse(payload) as AnalyzeStreamEvent);
			} catch {
				// Ignore malformed frames.
			}
		}
	}
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

export type GithubStats = {
	activity: number[];
	streak: number;
	languages: { name: string; bytes: number; value: number }[];
	repos: number;
	merged_prs: number;
	total_stars: number;
	total_commits: number;
};

export function fetchGithubStats(username: string): Promise<GithubStats> {
	return request<GithubStats>(
		`/github/stats?username=${encodeURIComponent(username)}`,
	);
}

export function fetchRepoPattern(
	repo: string,
	limit = 5,
): Promise<ContributorPlaybook> {
	return request<ContributorPlaybook>("/pr-pattern/analyze", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ repo, limit }),
	});
}

// The backend authenticates SSE streams (EventSource can't send a header) via
// the HttpOnly `sb-access-token` cookie. Push the current Supabase access token
// there so the /developer/events stream can verify it. Re-sync on refresh.
export async function syncBackendSession(accessToken: string): Promise<void> {
	await fetch(`${SERVER_URL}/auth/session`, {
		method: "POST",
		credentials: "include",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ access_token: accessToken }),
	}).catch(() => {});
}

export async function clearBackendSession(): Promise<void> {
	await fetch(`${SERVER_URL}/auth/logout`, {
		method: "POST",
		credentials: "include",
	}).catch(() => {});
}
