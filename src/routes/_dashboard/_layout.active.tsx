import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Bookmark,
	ExternalLink,
	GitBranch,
	Loader2,
	RefreshCw,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { Topbar } from "#/features/dashboard/components/Topbar";
import type { ActiveIssue, MergedPRResult } from "#/lib/api";
import {
	checkMergedPRs,
	fetchActiveIssues,
	toggleActiveIssue,
} from "#/lib/api";

export const Route = createFileRoute("/_dashboard/_layout/active")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();

	const { data: activeIssues = [], isLoading } = useQuery({
		queryKey: ["active-issues"],
		queryFn: fetchActiveIssues,
	});

	const [mergedMap, setMergedMap] = useState<Record<string, MergedPRResult>>(
		{},
	);
	const [checking, setChecking] = useState(false);

	const checkMerged = useCallback(async (issues: ActiveIssue[]) => {
		if (issues.length === 0) return;
		setChecking(true);
		try {
			const results = await checkMergedPRs(
				issues.map((i) => ({
					repo: i.repo,
					issue_number: i.issue_number,
				})),
			);
			setMergedMap(
				Object.fromEntries(
					results.map((r) => [`${r.repo}#${r.issue_number}`, r]),
				),
			);
		} catch {
			// silent — merge status is best-effort
		} finally {
			setChecking(false);
		}
	}, []);

	useEffect(() => {
		if (activeIssues.length > 0) checkMerged(activeIssues);
	}, [activeIssues, checkMerged]);

	const handleRemove = async (repo: string, issueNumber: number) => {
		await toggleActiveIssue(repo, issueNumber);
		queryClient.setQueryData<ActiveIssue[]>(
			["active-issues"],
			(prev) =>
				prev?.filter(
					(a) => !(a.repo === repo && a.issue_number === issueNumber),
				) ?? [],
		);
		setMergedMap((prev) => {
			const next = { ...prev };
			delete next[`${repo}#${issueNumber}`];
			return next;
		});
	};

	return (
		<div className="relative flex flex-col h-full">
			<Topbar
				title="Active Contributions"
				subtitle={`${activeIssues.length} active issue${activeIssues.length !== 1 ? "s" : ""}`}
			>
				{activeIssues.length > 0 && (
					<button
						type="button"
						onClick={() => checkMerged(activeIssues)}
						disabled={checking}
						className="flex items-center gap-1.5 bg-white/4 hover:bg-white/6 px-3 py-1.5 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
					>
						<RefreshCw size={12} className={checking ? "animate-spin" : ""} />
						Refresh
					</button>
				)}
			</Topbar>
			<div className="flex-1 px-7 py-6 overflow-y-auto scrollbar-hide">
				{isLoading ? (
					<div className="flex flex-col justify-center items-center gap-3 py-20 text-center">
						<Loader2
							size={22}
							className="text-primary animate-spin will-change-transform"
						/>
						<p className="font-mono text-[11px] text-muted-foreground">
							Loading active issues…
						</p>
					</div>
				) : activeIssues.length === 0 ? (
					<div className="flex flex-col justify-center items-center gap-4 py-20 text-center">
						<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-14 h-14">
							<Bookmark size={22} className="text-primary" />
						</div>
						<div>
							<div className="font-medium text-foreground text-lg">
								No active issues
							</div>
							<p className="mt-1 max-w-xs text-muted-foreground text-sm leading-relaxed">
								Bookmark issues from the Matches tab to track them here.
							</p>
						</div>
						<Link
							to="/matches"
							className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-6 py-3 rounded-xl font-medium text-primary-foreground text-sm transition-all"
						>
							Go to matches
						</Link>
					</div>
				) : (
					<div className="space-y-3">
						{activeIssues.map((item, i) => {
							const key = `${item.repo}#${item.issue_number}`;
							const merged = mergedMap[key];
							return (
								<motion.div
									key={key}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ delay: i * 0.05 }}
									className="group flex items-center gap-4 bg-card p-4 border border-border rounded-xl"
								>
									<div className="flex justify-center items-center bg-muted/40 border border-border rounded-lg w-9 h-9 shrink-0">
										<GitBranch size={16} className="text-muted-foreground" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-mono text-[10px] text-muted-foreground">
											{item.repo}
										</div>
										<div className="font-medium text-foreground text-sm leading-snug">
											Issue #{item.issue_number}
										</div>
										<div className="font-mono text-[10px] text-muted-foreground/60">
											Added {new Date(item.created_at).toLocaleDateString()}
										</div>
									</div>
									<div className="flex items-center gap-2 shrink-0">
										{merged?.merged && merged.pr_url ? (
											<a
												href={merged.pr_url}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-lg font-mono text-[11px] text-emerald-400 hover:bg-emerald-500/20 transition-colors"
											>
												PR #{merged.pr_number}
												<ExternalLink size={10} />
											</a>
										) : (
											<a
												href={`https://github.com/${item.repo}/issues/${item.issue_number}`}
												target="_blank"
												rel="noopener noreferrer"
												className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
											>
												<ExternalLink size={11} />
												View
											</a>
										)}
										<button
											type="button"
											onClick={() => handleRemove(item.repo, item.issue_number)}
											className="hover:bg-white/5 p-1.5 rounded-lg text-primary transition-colors"
											title="Remove from active"
										>
											<Bookmark size={14} fill="currentColor" />
										</button>
									</div>
								</motion.div>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
