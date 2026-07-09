import { useEffect, useRef, useState } from "react";
import type { DeveloperProfile } from "@/features/onboarding/components/data";
import { SERVER_URL, startDeveloperAnalysis } from "@/lib/api";

export type { DeveloperProfile } from "@/features/onboarding/components/data";

const DEMO_USER = "yyx990803";

function toProfile(d: Record<string, unknown>): Partial<DeveloperProfile> {
	const out: Record<string, unknown> = {};

	if (d.username != null) out.username = d.username;
	if (d.count != null) out.repos_count = d.count;
	if (d.repositories != null) out.repos_count = d.repositories;
	if (d.repos != null) out.public_repos = d.repos;
	if (d.stars != null) out.total_stars = d.stars;
	if (d.languages != null) out.primary_languages = d.languages;
	if (d.packages != null) {
		out.tech_stack = { packages: Object.keys(d.packages as object) };
	}
	if (d.technologies != null) {
		out.tech_stack = { packages: Object.keys(d.technologies as object) };
	}
	if (d.total != null || d.merged != null) {
		out.merged_prs = (d.merged as number) ?? 0;
	}
	if (
		d.pull_requests != null &&
		typeof d.pull_requests === "object" &&
		(d.pull_requests as { merged?: number }).merged != null
	) {
		out.merged_prs = (d.pull_requests as { merged: number }).merged;
	}

	return out as Partial<DeveloperProfile>;
}

export function useOnboardingAnalysis(): {
	profile: DeveloperProfile | null;
	loading: boolean;
	phaseIndex: number;
	error: string | null;
} {
	const [profile, setProfile] = useState<DeveloperProfile | null>(null);
	const [loading, setLoading] = useState(true);
	const [phaseIndex, setPhaseIndex] = useState(0);
	const [error, setError] = useState<string | null>(null);
	const started = useRef(false);
	const finished = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		const run = async () => {
			try {
				const { job_id } = await startDeveloperAnalysis(DEMO_USER);
				const es = new EventSource(`${SERVER_URL}/developer/events/${job_id}`);

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
					finished.current = true;
					const parsed = JSON.parse(e.data) as Record<string, unknown>;
					const payload = (parsed.data as Record<string, unknown>) ?? parsed;
					setProfile((prev) => ({ ...prev, ...toProfile(payload) }));
					setPhaseIndex(6);
					setLoading(false);
					es.close();
				});

				es.addEventListener("error", (e) => {
					if (finished.current) return;
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
				setError(
					err instanceof Error ? err.message : "Failed to start analysis",
				);
				setLoading(false);
			}
		};

		void run();
	}, []);

	return { profile, loading, phaseIndex, error };
}
