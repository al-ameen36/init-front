import type {
	AnalyzeIssueResponse,
	IssuesResponse,
} from "#/features/dashboard/types";
import type { DeveloperProfile } from "@/features/onboarding/components/data";

export const SERVER_URL =
	import.meta.env.VITE_SERVER_URL || "http://localhost:8000";

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
	const response = await fetch(`${SERVER_URL}/analyze/`, {
		method: "POST",
		headers: {
			"content-type": "application/json",
			accept: "text/event-stream",
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
