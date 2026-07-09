import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import {
	ChevronDown,
	Filter,
	RefreshCw,
	Search,
	SlidersHorizontal,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { z } from "zod";
import { DetailPanel } from "#/features/dashboard/components/DetailPanel";
import { IssueCard } from "#/features/dashboard/components/IssueCard";
import { Topbar } from "#/features/dashboard/components/Topbar";
import type {
	AnalyzeIssueResponse,
	Issue,
	IssuesResponse,
} from "#/features/dashboard/types";
import { analyzeIssue as callAnalyzeIssue, fetchIssues } from "#/lib/api";

const SORT_OPTIONS = ["Best match", "Newest", "Most stars", "Most active"];
const tempRepo = "psf/requests";

const fetchPopularIssues = createServerFn().handler(
	async (): Promise<IssuesResponse> => {
		return fetchIssues(tempRepo);
	},
);

const IssueSchema = z.object({
	repo: z.string().min(1),
	issueNumber: z.number().min(0),
});

const analyzeIssue = createServerFn({ method: "POST" })
	.validator(IssueSchema)
	.handler(
		async ({ data: { repo, issueNumber } }): Promise<AnalyzeIssueResponse> => {
			return callAnalyzeIssue(repo, issueNumber);
		},
	);

export const Route = createFileRoute("/_dashboard/_layout/matches")({
	component: RouteComponent,
	loader: async (): Promise<{ issues: Issue[]; error: string | null }> => {
		try {
			const issuesData = await fetchPopularIssues();

			return { issues: issuesData.issues, error: null };
		} catch (error) {
			console.error("Error fetching issues:", error);
			return { issues: [], error: "Failed to load issues" };
		}
	},
});

function RouteComponent() {
	const { issues } = Route.useLoaderData();
	const [selectedId, setSelectedId] = useState<number | null>(1);
	const [repoFilter, setRepoFilter] = useState("all");
	const [diffFilter, setDiffFilter] = useState("All");
	const [sort, setSort] = useState("Best match");
	const [showSort, setShowSort] = useState(false);
	const [search, setSearch] = useState("");
	const [currentIssue, setCurrentIssue] = useState<AnalyzeIssueResponse | null>(
		null,
	);

	// const repoOptions = ["all", ...addedRepos.map((r) => r.name)];
	const repoOptions = ["all"];

	const filtered = issues
		.filter((i) => {
			// if (repoFilter !== "all" && !i.repo.includes(repoFilter)) return false;
			// if (diffFilter !== "All" && i.difficulty !== diffFilter) return false;
			if (
				search &&
				!i.title.toLowerCase().includes(search.toLowerCase())
				// &&
				// !i.repo.toLowerCase().includes(search.toLowerCase())
			)
				return false;
			return true;
		})
		.sort((a, b) => {
			// if (sort === "Best match") return b.matchScore - a.matchScore;
			// if (sort === "Newest") return a.openedDaysAgo - b.openedDaysAgo;
			// if (sort === "Most stars") return b.stars - a.stars;
			if (sort === "Most active") return b.comments - a.comments;
			return 0;
		});

	const toggleBookmark = (_id: number) => () => {};
	// setIssues((prev) =>
	// 	prev.map((i) => (i.id === id ? { ...i, bookmarked: !i.bookmarked } : i)),
	// );

	const handleAnalyze = async (issueNumber: number) => {
		setSelectedId(issueNumber === selectedId ? null : issueNumber);
		try {
			const data = await analyzeIssue({
				data: {
					repo: tempRepo,
					issueNumber,
				},
			});

			setCurrentIssue(data);
		} catch (error) {
			console.error("Analysis failed:", error);
		}
	};

	return (
		<div className="flex flex-col h-full">
			<Topbar
				title="Issue Matches"
				subtitle={`${issues.length} issues · sorted by compatibility`}
			>
				<button
					type="button"
					className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 hover:border-white/12 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
				>
					<RefreshCw size={11} />
					Refresh
				</button>
			</Topbar>

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

				{/* Repo filter chips */}
				{repoOptions.map((r) => (
					<button
						type="button"
						key={r}
						onClick={() => setRepoFilter(r)}
						className={`font-mono text-[11px] px-2.5 py-1.5 rounded-md transition-colors ${
							repoFilter === r
								? "bg-primary/15 text-primary"
								: "text-muted-foreground hover:text-foreground hover:bg-white/4"
						}`}
					>
						{r === "all" ? "All repos" : r}
					</button>
				))}

				{/* {addedRepos.length > 0 && <div className="bg-border w-px h-4" />} */}
				{1 > 0 && <div className="bg-border w-px h-4" />}

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

			<div className="flex flex-1 min-h-0">
				<div className="flex-1 space-y-3 px-7 py-5 overflow-y-auto scrollbar-hide">
					<div className="mb-2 font-mono text-[11px] text-muted-foreground">
						{filtered.length} result{filtered.length !== 1 ? "s" : ""}
					</div>
					<AnimatePresence mode="popLayout">
						{filtered.map((issue) => (
							<IssueCard
								key={issue.number}
								issue={issue}
								isSelected={selectedId === issue.number}
								onClick={() => handleAnalyze(issue.number)}
								onBookmark={() => toggleBookmark(issue.number)}
							/>
						))}
					</AnimatePresence>
					{filtered.length === 0 && (
						<div className="py-16 text-muted-foreground text-center">
							<Filter size={24} className="opacity-30 mx-auto mb-3" />
							<div className="text-sm">No issues match these filters</div>
						</div>
					)}
				</div>

				<AnimatePresence>
					{currentIssue && (
						<motion.div
							initial={{ width: 0, opacity: 0 }}
							animate={{ width: 380, opacity: 1 }}
							exit={{ width: 0, opacity: 0 }}
							transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
							className="border-border border-l overflow-hidden shrink-0"
						>
							<div className="flex flex-col w-[380px] h-full">
								<DetailPanel
									issue={currentIssue}
									onClose={() => setSelectedId(null)}
								/>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</div>
	);
}
