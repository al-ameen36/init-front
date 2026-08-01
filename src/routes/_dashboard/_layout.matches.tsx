import { useIsFetching, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ChevronDown,
	Filter,
	GitBranch,
	Loader2,
	RefreshCw,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DetailPanel } from "#/features/dashboard/components/DetailPanel";
import { IssueCard } from "#/features/dashboard/components/IssueCard";
import { IssueFilterPopover } from "#/features/dashboard/components/IssueFilterPopover";
import { Topbar } from "#/features/dashboard/components/Topbar";
import type { AnalyzeIssueResponse, Issue } from "#/features/dashboard/types";
import type { ActiveIssue } from "#/lib/api";
import {
	analyzeIssuesStream,
	fetchActiveIssues,
	fetchIssues,
	repoAnalysisState,
	toggleActiveIssue,
} from "#/lib/api";
import { useProfile } from "@/context/ProfileContext";
import { useRepos } from "@/context/RepoContext";

const SORT_OPTIONS = ["Best match", "Newest", "Most active"];

type AnalyzeBatch = Record<number, AnalyzeIssueResponse>;

export const Route = createFileRoute("/_dashboard/_layout/matches")({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = useProfile();
	const { activeRepo, activeRepoItem, loading: reposLoading } = useRepos();
	const queryClient = useQueryClient();
	const profileKey = profile?.username ?? "anon";
	const analyzeKey = ["analyze-batch", activeRepo, profileKey] as const;
	const failedKey = ["analyze-failed", activeRepo, profileKey] as const;
	type FailedState = { issues: Record<number, string>; batch: boolean };
	// Re-hydrate failure state from the cache so it survives navigating away
	// and back (the component unmounts, but React Query's cache persists).
	const initialFailed = queryClient.getQueryData<FailedState>(failedKey) ?? {
		issues: {},
		batch: false,
	};
	const [selectedId, setSelectedId] = useState<number | null>(null);
	const [diffFilter, setDiffFilter] = useState("All");
	const [sort, setSort] = useState("Best match");
	const [showSort, setShowSort] = useState(false);
	const [search, setSearch] = useState("");
	const forceRef = useRef(false);
	const [buildStatus, setBuildStatus] = useState<string | null | undefined>(
		null,
	);
	// Per-issue analysis failures (backend emits `error` SSE events with a
	// `number`); batch-level failures (no `number`) are tracked separately.
	const activeRepoState = activeRepoItem
		? repoAnalysisState(activeRepoItem)
		: null;

	const [failedIssues, setFailedIssues] = useState<Record<number, string>>(
		initialFailed.issues,
	);
	const [batchError, setBatchError] = useState(initialFailed.batch);
	const [refreshingSingle, setRefreshingSingle] = useState<
		Record<number, true>
	>({});

	// Active issues (bookmarked by the user).
	const { data: activeIssues = [] } = useQuery({
		queryKey: ["active-issues"],
		queryFn: fetchActiveIssues,
	});
	const activeSet = new Set(
		activeIssues.map((a: ActiveIssue) => `${a.repo}#${a.issue_number}`),
	);

	// Track in-flight refetches so the UI can show a loading state on a manual
	// refresh. React Query's `isLoading` stays false when cached data exists,
	// so the issues spinner (gated on `issues.length === 0`) never shows on
	// refresh without this.
	const isIssuesFetching =
		useIsFetching({ queryKey: ["issues", activeRepo] }) > 0;
	const [refreshing, setRefreshing] = useState(false);
	const sawFetch = useRef(false);
	useEffect(() => {
		if (!refreshing) {
			sawFetch.current = false;
			return;
		}
		if (isIssuesFetching) sawFetch.current = true;
		if (sawFetch.current && !isIssuesFetching) {
			setRefreshing(false);
			sawFetch.current = false;
		}
	}, [refreshing, isIssuesFetching]);

	// Issues for the active repo (cached across navigation by React Query).
	const {
		data: issuesData,
		isLoading: loading,
		error,
	} = useQuery({
		queryKey: ["issues", activeRepo],
		queryFn: () => fetchIssues(activeRepo as string),
		enabled: !!activeRepo,
	});

	const issues = issuesData?.issues ?? [];

	// One streaming analysis pass for the whole page, cached by repo + profile.
	// Each issue's result is painted the moment it finishes (SSE), so the user
	// never waits for the full batch. Results are written into React Query's
	// cache (both incrementally during streaming and as the final return), so
	// they survive route navigation/remounts instead of being wiped.
	const {
		data: analysisData,
		isFetching: analysisStreaming,
		isError: analysisError,
	} = useQuery({
		queryKey: analyzeKey,
		queryFn: async () => {
			const collected: AnalyzeBatch = {};
			// Only clear the cache when actually (re)streaming; a stale cache
			// hit (e.g. returning to the page) keeps showing prior results.
			if (forceRef.current) {
				queryClient.setQueryData<AnalyzeBatch>(analyzeKey, {});
			}
			setBuildStatus(null);
			const resetFailed: FailedState = { issues: {}, batch: false };
			setFailedIssues({});
			setBatchError(false);
			queryClient.setQueryData(failedKey, resetFailed);
			await analyzeIssuesStream(
				activeRepo as string,
				issues.map((i) => i.number),
				profile,
				{
					force: forceRef.current,
					onEvent: (e) => {
						if (e.type === "status") {
							setBuildStatus(e.message);
						} else if (e.type === "result") {
							setBuildStatus(null);
							collected[e.analysis.number] = e.analysis;
							queryClient.setQueryData<AnalyzeBatch>(analyzeKey, (prev) => ({
								...(prev ?? {}),
								[e.analysis.number]: e.analysis,
							}));
						} else if (e.type === "error") {
							// Backend streams `error` events then ends the stream;
							// surface each so the UI can show "Analysis failed".
							// Persist to the query cache so the state survives
							// navigating away and back.
							setBuildStatus(e.message);
							if (typeof e.number === "number") {
								setFailedIssues((prev) => {
									const next = {
										...prev,
										[e.number as number]: e.message,
									};
									queryClient.setQueryData<FailedState>(failedKey, (cur) => ({
										issues: next,
										batch: cur?.batch ?? false,
									}));
									return next;
								});
							} else {
								setBatchError(true);
								queryClient.setQueryData<FailedState>(failedKey, (cur) => ({
									issues: cur?.issues ?? {},
									batch: true,
								}));
							}
						}
					},
				},
			);
			setBuildStatus(null);
			forceRef.current = false;
			return collected;
		},
		enabled: !!activeRepo && issues.length > 0 && activeRepoState === "ready",
		staleTime: 1000 * 60 * 5,
	});

	const analysisMap = new Map<number, AnalyzeIssueResponse>();
	for (const a of Object.values(analysisData ?? {})) {
		analysisMap.set(a.number, a);
	}

	// Merge analysis results onto each issue for rendering. A card flips to
	// "done" as soon as its own analysis streams in, independent of the rest of
	// the batch still loading.
	const displayIssues: Issue[] = issues.map((issue) => {
		const data = analysisMap.get(issue.number);
		return {
			...issue,
			isActive: activeSet.has(`${issue.repo}#${issue.number}`),
			difficulty: data?.guide.difficulty,
			matchScore: data?.matchScore,
			analysisStatus: data
				? "done"
				: failedIssues[issue.number]
					? "error"
					: batchError
						? "error"
						: analysisStreaming
							? "analyzing"
							: analysisError
								? "error"
								: "idle",
		};
	});

	const filtered = displayIssues
		.filter((i) => {
			if (search && !i.title.toLowerCase().includes(search.toLowerCase()))
				return false;
			if (diffFilter !== "All" && i.difficulty !== diffFilter) return false;
			return true;
		})
		.sort((a, b) => {
			if (sort === "Best match")
				return (b.matchScore ?? 0) - (a.matchScore ?? 0);
			if (sort === "Newest") return Date.parse(b.opened) - Date.parse(a.opened);
			if (sort === "Most active") return b.comments - a.comments;
			return 0;
		});

	const handleAnalyze = (issueNumber: number) => {
		setSelectedId(issueNumber === selectedId ? null : issueNumber);
	};

	const handleRefresh = () => {
		forceRef.current = true;
		if (activeRepo) {
			setRefreshing(true);
			void queryClient.invalidateQueries({ queryKey: ["issues", activeRepo] });
			void queryClient.invalidateQueries({
				queryKey: ["analyze-batch", activeRepo, profileKey],
			});
			queryClient.setQueryData(failedKey, { issues: {}, batch: false });
		}
	};

	const handleSingleRefresh = async (issueNumber: number) => {
		if (!activeRepo) return;
		setRefreshingSingle((prev) => ({ ...prev, [issueNumber]: true }));
		try {
			await analyzeIssuesStream(activeRepo, [issueNumber], profile, {
				force: true,
				onEvent: (e) => {
					if (e.type === "result") {
						const num = e.analysis.number;
						queryClient.setQueryData<AnalyzeBatch>(analyzeKey, (prev) => ({
							...(prev ?? {}),
							[num]: e.analysis,
						}));
						setFailedIssues((prev) => {
							const { [num as number]: _, ...rest } = prev;
							queryClient.setQueryData<FailedState>(failedKey, (cur) => ({
								issues: rest,
								batch: cur?.batch ?? false,
							}));
							return rest;
						});
					} else if (e.type === "error" && typeof e.number === "number") {
						setFailedIssues((prev) => {
							const next = {
								...prev,
								[e.number as number]: e.message,
							};
							queryClient.setQueryData<FailedState>(failedKey, (cur) => ({
								issues: next,
								batch: cur?.batch ?? false,
							}));
							return next;
						});
					}
				},
			});
		} catch (err) {
			setFailedIssues((prev) => {
				const next = { ...prev, [issueNumber]: String(err) };
				queryClient.setQueryData<FailedState>(failedKey, (cur) => ({
					issues: next,
					batch: cur?.batch ?? false,
				}));
				return next;
			});
		} finally {
			setRefreshingSingle((prev) => {
				const { [issueNumber as number]: _, ...rest } = prev;
				return rest;
			});
		}
	};

	const handleToggleActive = async (repo: string, issueNumber: number) => {
		const key = `${repo}#${issueNumber}`;
		const wasActive = activeSet.has(key);
		// Optimistic update
		queryClient.setQueryData<ActiveIssue[]>(["active-issues"], (prev) =>
			wasActive
				? (prev?.filter((a) => `${a.repo}#${a.issue_number}` !== key) ?? [])
				: [
						...(prev ?? []),
						{
							repo,
							issue_number: issueNumber,
							created_at: new Date().toISOString(),
						},
					],
		);
		try {
			await toggleActiveIssue(repo, issueNumber);
		} catch {
			// Revert on failure
			void queryClient.invalidateQueries({ queryKey: ["active-issues"] });
		}
	};

	const selectedIdx = issues.findIndex((i) => i.number === selectedId);
	const selectedAnalysis =
		selectedId != null ? (analysisMap.get(selectedId) ?? null) : null;
	const isAnalyzingSelected =
		selectedIdx >= 0 && analysisStreaming && !selectedAnalysis;

	return (
		<div className="flex flex-col h-full">
			<Topbar
				title="Issue Matches"
				subtitle={
					activeRepo
						? `${issues.length} issues · ${activeRepo} · sorted by compatibility`
						: "Select a repository to match issues against your profile"
				}
			>
				<button
					type="button"
					onClick={handleRefresh}
					className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 hover:border-white/12 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
				>
					<RefreshCw
						size={11}
						className={
							refreshing
								? "shrink-0 animate-spin will-change-transform"
								: "shrink-0"
						}
					/>
					Refresh
				</button>
			</Topbar>

			{!activeRepo ? (
				reposLoading ? (
					<div className="flex flex-col justify-center items-center gap-3 flex-1 text-center">
						<Loader2
							size={22}
							className="text-primary animate-spin will-change-transform"
						/>
						<p className="font-mono text-[11px] text-muted-foreground">
							Loading repositories…
						</p>
					</div>
				) : (
					<div className="flex flex-col justify-center items-center gap-4 flex-1 text-center">
						<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-16 h-16">
							<GitBranch size={24} className="text-primary" />
						</div>
						<div>
							<div className="mb-1 font-medium text-foreground text-base">
								No active repository
							</div>
							<p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
								Add a repository and set it as active to start matching its open
								issues against your skill profile.
							</p>
						</div>
						<Link
							to="/repos"
							className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl font-medium text-primary-foreground text-sm transition-all"
						>
							Go to repositories
						</Link>
					</div>
				)
			) : activeRepoState !== "ready" ? (
				<div className="flex flex-col justify-center items-center gap-4 flex-1 text-center">
					<div className="flex justify-center items-center bg-amber-500/10 border border-amber-500/20 rounded-2xl w-16 h-16">
						<Loader2
							size={24}
							className="text-amber-400 animate-spin will-change-transform"
						/>
					</div>
					<div>
						<div className="mb-1 font-medium text-foreground text-base">
							Analyzing repository…
						</div>
						<p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
							We're analyzing this repository's PR patterns and building a code
							graph. Issue matching will start automatically once it's ready.
						</p>
					</div>
					<div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
						<span className="flex items-center gap-1.5">
							<span
								className={`inline-block rounded-full w-1.5 h-1.5 ${
									activeRepoItem?.playbook_state === "done"
										? "bg-emerald-400"
										: "bg-amber-400 animate-pulse"
								}`}
							/>
							PR patterns
						</span>
						<span className="text-muted-foreground/30">·</span>
						<span className="flex items-center gap-1.5">
							<span
								className={`inline-block rounded-full w-1.5 h-1.5 ${
									activeRepoItem?.graph_state === "done"
										? "bg-emerald-400"
										: "bg-amber-400 animate-pulse"
								}`}
							/>
							Code graph
						</span>
					</div>
				</div>
			) : (
				<>
					{/* Filters */}
					<div className="flex flex-wrap items-center gap-2 px-7 py-3 border-border border-b">
						<div className="flex items-center gap-2 bg-card px-3 py-2 border border-border rounded-lg w-56">
							<Search size={13} className="text-muted-foreground shrink-0" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search issues…"
								className="bg-transparent outline-none w-full font-mono text-foreground placeholder:text-muted-foreground text-xs"
							/>
						</div>

						{/* Active repo indicator — the page is scoped to one repo,
						    so this is just a label, not a clickable filter. */}
						<span className="font-mono text-[11px] px-2.5 py-1.5 rounded-md bg-primary/15 text-primary">
							{activeRepo}
						</span>

						{["All", "Low", "Medium", "High"].map((d) => (
							<button
								type="button"
								key={d}
								onClick={() => setDiffFilter(d)}
								className={`font-mono text-[11px] px-2.5 py-1.5 rounded-md transition-colors ${
									diffFilter === d
										? "bg-primary/15 text-primary"
										: "text-muted-foreground hover:text-foreground hover:bg-white/4"
								}`}
							>
								{d}
							</button>
						))}

						<div className="relative ml-auto">
							<IssueFilterPopover repo={activeRepo as string} />
						</div>

						<div className="relative">
							<button
								type="button"
								onClick={() => setShowSort((p) => !p)}
								className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 hover:border-white/12 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
							>
								<SlidersHorizontal size={11} />
								{sort}
								<ChevronDown size={11} />
							</button>
							<AnimatePresence>
								{showSort && (
									<motion.div
										initial={{ opacity: 0, y: -4 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -4 }}
										transition={{ duration: 0.15 }}
										className="top-full right-0 z-50 absolute bg-popover shadow-2xl shadow-black/50 mt-1 py-1.5 border border-border rounded-xl w-36"
									>
										{SORT_OPTIONS.map((o) => (
											<button
												key={o}
												type="button"
												onClick={() => {
													setSort(o);
													setShowSort(false);
												}}
												className={`w-full text-left font-mono text-[11px] px-3 py-2 transition-colors ${sort === o ? "text-primary bg-primary/8" : "text-muted-foreground hover:text-foreground hover:bg-white/4"}`}
											>
												{o}
											</button>
										))}
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>

					<div className="relative flex flex-1 min-h-0">
						{refreshing && (
							<div className="z-10 flex absolute inset-0 flex-col justify-center items-center gap-3 bg-background/60 backdrop-blur-sm">
								<Loader2
									size={22}
									className="text-primary animate-spin will-change-transform"
								/>
								<p className="font-mono text-[11px] text-muted-foreground">
									Refreshing issues…
								</p>
							</div>
						)}
						<div className="flex-1 space-y-3 px-7 py-5 overflow-y-auto scrollbar-hide">
							{loading && issues.length === 0 ? (
								<div className="flex flex-col justify-center items-center gap-3 py-20 h-full text-center">
									<Loader2
										size={22}
										className="text-primary animate-spin will-change-transform"
									/>
									<p className="font-mono text-[11px] text-muted-foreground">
										Loading issues…
									</p>
								</div>
							) : (
								<>
									<div className="mb-2 font-mono text-[11px] text-muted-foreground">
										{error
											? "Failed to load"
											: buildStatus
												? buildStatus
												: `${filtered.length} result${filtered.length !== 1 ? "s" : ""}`}
									</div>
									{error && (
										<div className="py-8 text-center text-muted-foreground text-sm">
											{String(error)}
										</div>
									)}
									<AnimatePresence mode="popLayout">
										{filtered.map((issue) => (
											<IssueCard
												key={issue.number}
												issue={issue}
												isSelected={selectedId === issue.number}
												onClick={() => handleAnalyze(issue.number)}
												onRefresh={handleSingleRefresh}
												isRefreshing={!!refreshingSingle[issue.number]}
												onToggleActive={() =>
													handleToggleActive(
														issue.repo ?? (activeRepo as string),
														issue.number,
													)
												}
											/>
										))}
									</AnimatePresence>
									{!loading && !error && filtered.length === 0 && (
										<div className="py-16 text-muted-foreground text-center">
											<Filter size={24} className="opacity-30 mx-auto mb-3" />
											<div className="text-sm">
												No issues match these filters
											</div>
										</div>
									)}
								</>
							)}
						</div>

						<AnimatePresence>
							{selectedId && profile && (
								<motion.div
									initial={{ width: 0, opacity: 0 }}
									animate={{ width: 380, opacity: 1 }}
									exit={{ width: 0, opacity: 0 }}
									transition={{
										duration: 0.35,
										ease: [0.16, 1, 0.3, 1],
									}}
									className="border-border border-l overflow-hidden shrink-0"
								>
									<div className="flex flex-col w-[380px] h-full">
										<DetailPanel
											issue={analysisMap.get(selectedId) || null}
											basicIssue={
												displayIssues.find((i) => i.number === selectedId) ||
												null
											}
											isAnalyzing={isAnalyzingSelected}
											onClose={() => setSelectedId(null)}
											onRetry={() => handleSingleRefresh(selectedId)}
											onToggleActive={() => {
												const sel = displayIssues.find(
													(i) => i.number === selectedId,
												);
												if (sel)
													handleToggleActive(
														sel.repo ?? (activeRepo as string),
														sel.number,
													);
											}}
											profile={profile}
										/>
									</div>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				</>
			)}
		</div>
	);
}
