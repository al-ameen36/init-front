import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState } from "react";
import type { DeveloperProfile } from "@/features/onboarding/components/data";
import { supabase } from "@/lib/supabase";

type ProfileContextValue = {
	profile: DeveloperProfile | null;
	loading: boolean;
	setProfile: (profile: DeveloperProfile) => void;
	clearProfile: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

type ProfileRow = {
	id: string;
	username?: string | null;
	avatar_url?: string | null;
	name?: string | null;
	bio?: string | null;
	repos_count?: number | null;
	merged_prs?: number | null;
	total_commits?: number | null;
	total_stars?: number | null;
	primary_languages?: string[] | null;
	public_repos?: DeveloperProfile["public_repos"] | null;
	tech_stack?: { packages?: Record<string, number> } | null;
};

function rowToProfile(row: ProfileRow): DeveloperProfile {
	return {
		username: row.username ?? undefined,
		avatar_url: row.avatar_url ?? undefined,
		name: row.name ?? undefined,
		bio: row.bio ?? undefined,
		repos_count: row.repos_count ?? undefined,
		merged_prs: row.merged_prs ?? undefined,
		total_stars: row.total_stars ?? undefined,
		primary_languages: row.primary_languages ?? [],
		public_repos: row.public_repos ?? [],
		tech_stack: row.tech_stack?.packages
			? { packages: row.tech_stack.packages as Record<string, number> }
			: undefined,
		commit_stats:
			row.total_commits != null
				? { total_commits: row.total_commits }
				: undefined,
	};
}

function profileToRow(profile: DeveloperProfile) {
	return {
		username: profile.username,
		avatar_url: profile.avatar_url,
		name: profile.name,
		bio: profile.bio,
		repos_count: profile.repos_count,
		merged_prs: profile.merged_prs,
		total_commits: profile.commit_stats?.total_commits,
		total_stars: profile.total_stars,
		primary_languages: profile.primary_languages ?? [],
		public_repos: profile.public_repos ?? [],
		tech_stack: { packages: profile.tech_stack?.packages ?? {} },
		updated_at: new Date().toISOString(),
	};
}

export function ProfileProvider({ children }: { children: ReactNode }) {
	const [profile, setProfileState] = useState<DeveloperProfile | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		let cancelled = false;

		(async () => {
			// Hydrate from Supabase when authenticated.
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user && !cancelled) {
				const { data } = await supabase
					.from("profiles")
					.select("*")
					.eq("id", user.id)
					.maybeSingle();
				if (data && !cancelled) setProfileState(rowToProfile(data));
			}

			if (!cancelled) setLoading(false);
		})();

		return () => {
			cancelled = true;
		};
	}, []);

	const setProfile = (next: DeveloperProfile) => {
		setProfileState(next);
		supabase.auth.getUser().then(({ data: { user } }) => {
			if (!user) return;
			supabase
				.from("profiles")
				.upsert({ id: user.id, ...profileToRow(next) })
				.then(({ error }) => {
					if (error) console.warn("Failed to persist profile:", error);
				});
		});
	};

	const clearProfile = () => {
		setProfileState(null);
	};

	return (
		<ProfileContext.Provider
			value={{ profile, loading, setProfile, clearProfile }}
		>
			{children}
		</ProfileContext.Provider>
	);
}

export function useProfile() {
	const ctx = useContext(ProfileContext);
	if (!ctx) {
		throw new Error("useProfile must be used within a ProfileProvider");
	}
	return ctx;
}
