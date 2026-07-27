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

// ---------------------------------------------------------------------------
// Shared SSE stream parser
// ---------------------------------------------------------------------------

/**
 * Reads an SSE response body and yields each parsed JSON event.
 *
 * Both `analyzeIssuesStream` and `fetchRepoPattern` previously duplicated this
 * ~25-line loop verbatim. This utility centralises the framing logic once.
 */
async function* readSSEStream<T>(
	body: ReadableStream<Uint8Array>,
	onBuffer?: (buffer: string) => void,
): AsyncGenerator<T> {
	const reader = body.getReader();
	const decoder = new TextDecoder();
	let buffer = "";

	while (true) {
		const { done, value } = await reader.read();
		if (value) {
			buffer += decoder.decode(value, { stream: true });
			if (onBuffer) onBuffer(buffer);
		}

		while (true) {
			let sep = buffer.indexOf("\n\n");
			let advance = 2;
			if (sep === -1) {
				sep = buffer.indexOf("\r\n\r\n");
				advance = 4;
			}
			if (sep === -1) break;

			const frame = buffer.slice(0, sep);
			buffer = buffer.slice(sep + advance);

			let payload = "";

			for (const line of frame.split("\n")) {
				if (line.startsWith("data:")) {
					payload += (payload ? "\n" : "") + line.slice(5).trim();
				}
			}

			if (!payload) {
				const trimmed = frame.trim();
				if (trimmed.startsWith("{") && trimmed.endsWith("}")) {
					payload = trimmed;
				} else {
					continue;
				}
			}

			try {
				yield JSON.parse(payload) as T;
			} catch (err) {
				const msg = err instanceof Error ? err.message : String(err);
				throw new Error(
					`SSE JSON parse error: ${msg}. Payload: ${payload.slice(0, 100)}...`,
				);
			}
		}

		if (done) break;
	}
}

// ---------------------------------------------------------------------------

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

	for await (const event of readSSEStream<AnalyzeStreamEvent>(response.body)) {
		if (opts.signal?.aborted) break;
		opts.onEvent?.(event);
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

export type RepoPatternEvent =
	| { type: "status"; message: string }
	| { type: "progress"; message: string; current: number; total: number }
	| { type: "result"; playbook: ContributorPlaybook }
	| { type: "error"; message: string };

export type RepoPatternStreamOptions = {
	force?: boolean;
	signal?: AbortSignal;
	onEvent?: (event: RepoPatternEvent) => void;
};

/**
 * Streams PR pattern analysis over SSE via a POST body.
 * Reads the streamed response manually and emits each parsed event.
 * Resolves with the final ContributorPlaybook.
 */
export async function fetchRepoPattern(
	repo: string,
	limit = 5,
	opts: RepoPatternStreamOptions = {},
): Promise<ContributorPlaybook> {
	const { data } = await supabase.auth.getSession();
	const token = data.session?.access_token;

	const response = await fetch(`${SERVER_URL}/pr-pattern/analyze`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "text/event-stream",
			...(token ? { Authorization: `Bearer ${token}` } : {}),
		},
		body: JSON.stringify({ repo, limit, force: opts.force ?? false }),
		signal: opts.signal,
	});

	if (!response.ok || !response.body) {
		throw new Error(`Repo pattern analysis failed: ${response.statusText}`);
	}

	const contentType = response.headers.get("content-type") || "";
	if (contentType.includes("application/json")) {
		const data = await response.json();
		if (data.type === "result" && data.playbook) return data.playbook;
		if (data.repo && data.stats) return data as ContributorPlaybook;
	}

	let rawBuffer = "";
	for await (const event of readSSEStream<RepoPatternEvent>(
		response.body,
		(b) => {
			rawBuffer = b;
		},
	)) {
		if (opts.signal?.aborted) {
			throw new Error("Stream aborted");
		}
		opts.onEvent?.(event);
		if (event.type === "result") {
			return event.playbook;
		}
		// Fallback: if backend returns raw playbook via stream without event envelope
		if ("repo" in event && "stats" in event) {
			return event as unknown as ContributorPlaybook;
		}
		if (event.type === "error") {
			throw new Error(event.message);
		}
	}

	throw new Error(
		`Stream ended without result. Buffer preview: ${rawBuffer.slice(0, 200)}...`,
	);
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

// ---------------------------------------------------------------------------
// Active issues
// ---------------------------------------------------------------------------

export type ActiveIssue = {
	repo: string;
	issue_number: number;
	created_at: string;
};

export function fetchActiveIssues(): Promise<ActiveIssue[]> {
	return request<ActiveIssue[]>("/active-issues");
}

export function toggleActiveIssue(
	repo: string,
	issueNumber: number,
): Promise<{ active: boolean }> {
	return request<{ active: boolean }>("/active-issues", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify({ repo, issue_number: issueNumber }),
	});
}

export type MergedPRResult = {
	repo: string;
	issue_number: number;
	merged: boolean;
	pr_number: number | null;
	pr_url: string | null;
	pr_title: string | null;
};

export function checkMergedPRs(
	issues: { repo: string; issue_number: number }[],
): Promise<MergedPRResult[]> {
	return request<MergedPRResult[]>("/active-issues/check", {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(issues),
	});
}
