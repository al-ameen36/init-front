import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Bookmark, ExternalLink, GitBranch, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { Topbar } from "#/features/dashboard/components/Topbar";
import type { ActiveIssue } from "#/lib/api";
import { fetchActiveIssues, toggleActiveIssue } from "#/lib/api";

export const Route = createFileRoute("/_dashboard/_layout/active")({
	component: RouteComponent,
});

function RouteComponent() {
	const queryClient = useQueryClient();

	const { data: activeIssues = [], isLoading } = useQuery({
		queryKey: ["active-issues"],
		queryFn: fetchActiveIssues,
	});

	const handleRemove = async (repo: string, issueNumber: number) => {
		await toggleActiveIssue(repo, issueNumber);
		queryClient.setQueryData<ActiveIssue[]>(
			["active-issues"],
			(prev) =>
				prev?.filter(
					(a) => !(a.repo === repo && a.issue_number === issueNumber),
				) ?? [],
		);
	};

	return (
		<div className="relative flex flex-col h-full">
			<Topbar
				title="Active Contributions"
				subtitle={`${activeIssues.length} active issue${activeIssues.length !== 1 ? "s" : ""}`}
			/>
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
						{activeIssues.map((item, i) => (
							<motion.div
								key={`${item.repo}-${item.issue_number}`}
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
								<div className="flex items-center gap-1 shrink-0">
									<a
										href={`https://github.com/${item.repo}/issues/${item.issue_number}`}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors"
									>
										<ExternalLink size={11} />
										View
									</a>
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
						))}
					</div>
				)}
			</div>
		</div>
	);
}
