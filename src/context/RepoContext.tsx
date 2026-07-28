import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createContext, type ReactNode, useContext } from "react";
import {
	activateRepo as apiActivateRepo,
	addRepo as apiAddRepo,
	deleteRepo as apiDeleteRepo,
	fetchRepos,
	type RepoItem,
} from "@/lib/api";

export type { RepoItem };

type RepoContextValue = {
	repos: RepoItem[];
	activeRepo: string | null;
	loading: boolean;
	addRepo: (url: string) => Promise<void>;
	removeRepo: (full: string) => Promise<void>;
	setActiveRepo: (full: string) => Promise<void>;
};

const RepoContext = createContext<RepoContextValue | null>(null);

const REPOS_KEY = ["repositories"] as const;

function toFull(repo: RepoItem): string {
	return `${repo.owner}/${repo.name}`;
}

export function RepoProvider({ children }: { children: ReactNode }) {
	const queryClient = useQueryClient();
	const { data: repos = [], isLoading: loading } = useQuery({
		queryKey: REPOS_KEY,
		queryFn: fetchRepos,
	});

	const addRepo = async (url: string) => {
		const current = queryClient.getQueryData<RepoItem[]>(REPOS_KEY) ?? [];
		const parsed = parseRepoUrl(url);
		if (!parsed) return;
		const full = `${parsed.owner}/${parsed.name}`;
		if (current.some((r) => toFull(r) === full)) {
			await setActiveRepo(full);
			return;
		}
		await apiAddRepo(url);
		await queryClient.invalidateQueries({ queryKey: REPOS_KEY });
	};

	const setActiveRepo = async (full: string) => {
		const current = queryClient.getQueryData<RepoItem[]>(REPOS_KEY) ?? [];
		const target = current.find((r) => toFull(r) === full);
		if (!target) return;
		await apiActivateRepo(target.owner, target.name);
		await queryClient.invalidateQueries({ queryKey: REPOS_KEY });
	};

	const removeRepo = async (full: string) => {
		const current = queryClient.getQueryData<RepoItem[]>(REPOS_KEY) ?? [];
		const target = current.find((r) => toFull(r) === full);
		if (!target) return;
		await apiDeleteRepo(target.owner, target.name);
		await queryClient.invalidateQueries({ queryKey: REPOS_KEY });
	};

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
