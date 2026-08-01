import { useEffect, useRef, useState } from "react";
import type { DeveloperProfile } from "@/features/onboarding/components/data";
import { SERVER_URL, startDeveloperAnalysis } from "@/lib/api";

export type { DeveloperProfile } from "@/features/onboarding/components/data";

function toProfile(d: Record<string, unknown>): Partial<DeveloperProfile> {
	const out: Record<string, unknown> = {};

	if (d.username != null) out.username = d.username;
	if (d.avatar_url != null) out.avatar_url = d.avatar_url;
	if (d.name != null) out.name = d.name;
	if (d.bio != null) out.bio = d.bio;
	if (d.count != null) out.repos_count = d.count;
	if (d.repos != null) out.public_repos = d.repos;
	if (d.stars != null) out.total_stars = d.stars;
	if (d.languages != null) out.primary_languages = d.languages;
	if (d.packages != null) {
		out.tech_stack = { packages: d.packages as Record<string, number> };
	} else if (Array.isArray(d.technologies)) {
		out.tech_stack = {
			packages: Object.fromEntries(
				(d.technologies as string[]).map((t) => [t, 1]),
			),
		};
	}
	if (d.merged != null) out.merged_prs = d.merged as number;
	if (d.total_commits != null) {
		out.commit_stats = { total_commits: d.total_commits as number };
	}

	return out as Partial<DeveloperProfile>;
}

/**
 * Streams a developer GitHub analysis over SSE. Runs whenever `runKey`
 * changes (or on mount), so callers can re-trigger the same flow the
 * onboarding screen uses.
 */
export function useDeveloperAnalysis(
	username: string | null,
	runKey = 0,
): {
	profile: DeveloperProfile | null;
	loading: boolean;
	phaseIndex: number;
	error: string | null;
} {
	const [profile, setProfile] = useState<DeveloperProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [phaseIndex, setPhaseIndex] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const esRef = useRef<EventSource | null>(null);

	useEffect(() => {
		void runKey;
		esRef.current?.close();
		esRef.current = null;
		setProfile(null);
		setPhaseIndex(0);
		setError(null);
		setLoading(true);

		if (!username) {
			setError("No GitHub username found for the signed-in account.");
			setLoading(false);
			return;
		}

		let cancelled = false;
		let finished = false;

		const run = async () => {
			try {
				const { job_id } = await startDeveloperAnalysis(username);
				if (cancelled) return;
				const es = new EventSource(`${SERVER_URL}/developer/events/${job_id}`, {
					withCredentials: true,
				});
				esRef.current = es;

				const apply = (e: MessageEvent) => {
					const parsed = JSON.parse(e.data) as Record<string, unknown>;
					const payload = (parsed.data as Record<string, unknown>) ?? parsed;
					setProfile((prev) => ({ ...prev, ...toProfile(payload) }));
				};

				const phaseForStep: Record<string, number> = {
					profile: 1,
					repositories: 2,
					languages: 3,
					technologies: 4,
					pull_requests: 5,
				};

				es.onopen = () => setPhaseIndex(1);

				for (const step of Object.keys(phaseForStep)) {
					es.addEventListener(step, (e) => {
						apply(e);
						setPhaseIndex(phaseForStep[step]);
					});
				}

				es.addEventListener("completed", (e) => {
					finished = true;
					apply(e);
					setPhaseIndex(6);
					setLoading(false);
					es.close();
				});

				es.addEventListener("error", (e) => {
					if (finished || cancelled) return;
					es.close();
					let message = "Analysis failed or connection lost.";
					try {
						const d = JSON.parse((e as MessageEvent).data) as {
							message?: string;
							data?: { message?: string };
						};
						const detail = d.message ?? d.data?.message;
						if (detail) message = detail;
					} catch {}
					setError(message);
					setLoading(false);
				});
			} catch (err) {
				if (cancelled) return;
				setError(
					err instanceof Error ? err.message : "Failed to start analysis",
				);
				setLoading(false);
			}
		};

		void run();

		return () => {
			cancelled = true;
			esRef.current?.close();
			esRef.current = null;
		};
	}, [username, runKey]);

	return { profile, loading, phaseIndex, error };
}
