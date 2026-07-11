import { createFileRoute } from "@tanstack/react-router";
import {
	AlertCircle,
	CheckCircle2,
	Clock,
	ExternalLink,
	GitPullRequest,
	MessageSquare,
} from "lucide-react";
import { motion } from "motion/react";
import { Topbar } from "#/features/dashboard/components/Topbar";

export const Route = createFileRoute("/_dashboard/_layout/active")({
	component: RouteComponent,
});

function RouteComponent() {
	const ACTIVE = [
		{
			id: 101,
			repo: "radix-ui/primitives",
			title: "Fix focus trap not releasing on Dialog with nested portals",
			status: "in_review",
			prNumber: 3204,
			updatedHoursAgo: 2,
			comments: 8,
		},
		{
			id: 102,
			repo: "biomejs/biome",
			title: "Add lint rule for unused catch bindings",
			status: "changes_requested",
			prNumber: 2891,
			updatedHoursAgo: 18,
			comments: 14,
		},
	];
	const statusCfg: Record<
		string,
		{ label: string; color: string; icon: React.ElementType }
	> = {
		in_review: { label: "In Review", color: "#5b6af0", icon: GitPullRequest },
		changes_requested: {
			label: "Changes Requested",
			color: "#fbbf24",
			icon: AlertCircle,
		},
		merged: { label: "Merged", color: "#34d399", icon: CheckCircle2 },
	};
	return (
		<div className="relative flex flex-col h-full">
			<Topbar
				title="Active Contributions"
				subtitle={`${ACTIVE.length} open pull requests`}
			/>
			<div className="flex-1 space-y-4 px-7 py-6 overflow-y-auto scrollbar-hide">
				{ACTIVE.map((pr, i) => {
					const cfg = statusCfg[pr.status];
					return (
						<motion.div
							key={pr.id}
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: i * 0.08 }}
							className="bg-card p-5 border border-border rounded-xl"
						>
							<div className="flex items-start gap-4">
								<div className="flex justify-center items-center bg-muted/40 border border-border rounded-lg w-9 h-9 shrink-0">
									<cfg.icon size={16} style={{ color: cfg.color }} />
								</div>
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2 mb-1">
										<span className="font-mono text-[10px] text-muted-foreground">
											{pr.repo}
										</span>
										<span
											className="font-mono text-[10px]"
											style={{ color: cfg.color }}
										>
											· {cfg.label}
										</span>
									</div>
									<div className="mb-3 font-medium text-foreground text-sm leading-snug">
										{pr.title}
									</div>
									<div className="flex items-center gap-4">
										<span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
											<GitPullRequest size={11} />
											PR #{pr.prNumber}
										</span>
										<span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
											<Clock size={11} />
											Updated {pr.updatedHoursAgo}h ago
										</span>
										<span className="flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
											<MessageSquare size={11} />
											{pr.comments} comments
										</span>
									</div>
								</div>
								<button
									type="button"
									className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors shrink-0"
								>
									<ExternalLink size={11} />
									View PR
								</button>
							</div>
							{pr.status === "changes_requested" && (
								<div className="flex items-start gap-2.5 bg-amber-400/6 mt-4 px-3.5 py-3 border border-amber-400/15 rounded-lg">
									<AlertCircle
										size={13}
										className="mt-0.5 text-amber-400 shrink-0"
									/>
									<p className="text-amber-400/80 text-xs leading-relaxed">
										A reviewer has requested changes. Address the feedback and
										push an update.
									</p>
								</div>
							)}
						</motion.div>
					);
				})}

				<div className="mt-8">
					<div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<CheckCircle2 size={10} className="text-emerald-400" />
						Recently merged
					</div>
					{[
						{
							repo: "vitejs/vite",
							title: "Fix HMR not triggering on tsconfig path alias changes",
							mergedDaysAgo: 4,
							prNumber: 18291,
						},
						{
							repo: "microsoft/TypeScript",
							title:
								"Improve error message for circular reference in mapped types",
							mergedDaysAgo: 11,
							prNumber: 57803,
						},
					].map((pr) => (
						<div
							key={pr.prNumber}
							className="group flex items-center gap-3 py-3 border-border/40 border-b"
						>
							<CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
							<div className="flex-1 min-w-0">
								<div className="font-mono text-[10px] text-muted-foreground">
									{pr.repo} · PR #{pr.prNumber}
								</div>
								<div className="text-foreground/75 group-hover:text-foreground text-sm truncate transition-colors">
									{pr.title}
								</div>
							</div>
							<span className="font-mono text-[10px] text-muted-foreground/50 shrink-0">
								{pr.mergedDaysAgo}d ago
							</span>
						</div>
					))}
				</div>
			</div>

			{/* Coming soon overlay — feature not yet live */}
			<div className="z-20 absolute inset-0 flex flex-col justify-center items-center bg-background/80 backdrop-blur-sm">
				<motion.div
					initial={{ opacity: 0, scale: 0.96 }}
					animate={{ opacity: 1, scale: 1 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col items-center gap-3 text-center px-6"
				>
					<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-14 h-14">
						<Clock size={22} className="text-primary" />
					</div>
					<div>
						<div className="font-medium text-foreground text-lg">
							Coming Soon
						</div>
						<p className="mt-1 max-w-xs text-muted-foreground text-sm leading-relaxed">
							Live contribution tracking is on its way. We're wiring up real PR
							status from your connected repositories.
						</p>
					</div>
				</motion.div>
			</div>
		</div>
	);
}
