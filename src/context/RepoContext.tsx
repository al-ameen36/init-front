import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";
import { supabase } from "@/lib/supabase";

export type RepoItem = {
	id: string;
	owner: string;
	name: string;
	active: boolean;
};

type RepoContextValue = {
	repos: RepoItem[];
	activeRepo: string | null;
	loading: boolean;
	addRepo: (url: string) => void;
	removeRepo: (full: string) => void;
	setActiveRepo: (full: string) => void;
};

const RepoContext = createContext<RepoContextValue | null>(null);

const REPOS_KEY = ["repositories"] as const;

export async function fetchRepos(): Promise<RepoItem[]> {
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return [];
	const { data, error } = await supabase
		.from("repositories")
		.select("id, owner, name, is_active")
		.eq("user_id", user.id)
		.order("created_at", { ascending: true });
	if (error) {
		console.warn("Failed to load repositories:", error.message);
		return [];
	}
	return (data ?? []).map((r) => ({
		id: r.id,
		owner: r.owner,
		name: r.name,
		active: r.is_active,
	}));
}

function toFull(repo: RepoItem): string {
	return `${repo.owner}/${repo.name}`;
}

function parseRepoUrl(url: string): { owner: string; name: string } | null {
	try {
		const u = new URL(url.trim());
		if (!u.hostname.toLowerCase().endsWith("github.com")) return null;
		const parts = u.pathname.split("/").filter(Boolean);
		if (parts.length < 2) return null;
		return { owner: parts[0], name: parts[1].replace(/\.git$/, "") };
	} catch {
		return null;
	}
}

export function RepoProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();
	const { data: repos = [], isLoading: loading } = useQuery({
		queryKey: REPOS_KEY,
		queryFn: fetchRepos,
	});

	const addRepo = async (url: string) => {
		const parsed = parseRepoUrl(url);
		if (!parsed) return;
		const full = `${parsed.owner}/${parsed.name}`;
		const current = queryClient.getQueryData<RepoItem[]>(REPOS_KEY) ?? [];
		if (current.some((r) => toFull(r) === full)) {
			await setActiveRepo(full);
			return;
		}
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;
		const makeActive = !current.some((r) => r.active);
		const { data, error } = await supabase
			.from("repositories")
			.insert({
				user_id: user.id,
				owner: parsed.owner,
				name: parsed.name,
				is_active: false,
			})
			.select("id")
			.single();
		if (error) {
			console.warn("Failed to add repository:", error.message);
			return;
		}
		if (makeActive && data) {
			await supabase
				.from("repositories")
				.update({ is_active: false })
				.eq("user_id", user.id);
			await supabase
				.from("repositories")
				.update({ is_active: true })
				.eq("id", data.id);
		}
		await queryClient.invalidateQueries({ queryKey: REPOS_KEY });
	};

	const setActiveRepo = async (full: string) => {
		const current = queryClient.getQueryData<RepoItem[]>(REPOS_KEY) ?? [];
		const target = current.find((r) => toFull(r) === full);
		if (!target) return;
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;
		await supabase
			.from("repositories")
			.update({ is_active: false })
			.eq("user_id", user.id);
		await supabase
			.from("repositories")
			.update({ is_active: true })
			.eq("id", target.id);
		await queryClient.invalidateQueries({ queryKey: REPOS_KEY });
	};

	const removeRepo = async (full: string) => {
		const current = queryClient.getQueryData<RepoItem[]>(REPOS_KEY) ?? [];
		const target = current.find((r) => toFull(r) === full);
		if (!target) return;
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) return;
		const wasActive = target.active;
		await supabase.from("repositories").delete().eq("id", target.id);
		if (wasActive) {
			const remaining = current.filter((r) => toFull(r) !== full);
			if (remaining.length > 0) {
				await supabase
					.from("repositories")
					.update({ is_active: true })
					.eq("id", remaining[0].id);
			}
		}
		await queryClient.invalidateQueries({ queryKey: REPOS_KEY });
	};

	// Prefer the repo explicitly marked active; otherwise fall back to the
	// first repo so the Matches page always has something to display.
	const active =
		repos.find((r) => r.active) ?? (repos.length > 0 ? repos[0] : undefined);
	const activeRepo = active ? `${active.owner}/${active.name}` : null;

	return (
		<RepoContext.Provider
			value={{ repos, activeRepo, loading, addRepo, removeRepo, setActiveRepo }}
		>
			{children}
		</RepoContext.Provider>
	);
}

export function useRepos(): RepoContextValue {
	const ctx = useContext(RepoContext);
	if (!ctx) throw new Error("useRepos must be used within a RepoProvider");
	return ctx;
}
