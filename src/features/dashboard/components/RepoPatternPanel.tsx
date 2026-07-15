import { useQuery } from "@tanstack/react-query";
import {
	AlertCircle,
	BarChart3,
	BookOpen,
	CheckCircle2,
	GitPullRequest,
	ListChecks,
	Loader2,
	Star,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import { fetchRepoPattern } from "@/lib/api";
import type { ContributorPlaybook, PRStats, Recommendation } from "../types";

function PriorityBadge({ priority }: { priority: Recommendation["priority"] }) {
	const colors = {
		high: "bg-destructive/10 border-destructive/20 text-destructive",
		medium: "bg-yellow-500/10 border-yellow-500/20 text-yellow-500",
		low: "bg-muted/50 border-border text-muted-foreground",
	};
	return (
		<span
			className={`px-1.5 py-0.5 border rounded font-mono text-[9px] uppercase tracking-wider ${colors[priority]}`}
		>
			{priority}
		</span>
	);
}

function Section({
	icon: Icon,
	title,
	children,
}: {
	icon: typeof BookOpen;
	title: string;
	children: React.ReactNode;
}) {
	return (
		<div>
			<div className="flex items-center gap-1.5 mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
				<Icon size={9} />
				{title}
			</div>
			{children}
		</div>
	);
}

function Stat({
	label,
	value,
	note,
}: {
	label: string;
	value: string;
	note?: string;
}) {
	return (
		<div className="flex flex-col gap-0.5">
			<span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
				{label}
			</span>
			<span className="font-medium text-foreground text-sm">{value}</span>
			{note && (
				<span className="font-mono text-[9px] text-muted-foreground">
					{note}
				</span>
			)}
		</div>
	);
}

function StatsGrid({ stats }: { stats: PRStats }) {
	const pct = (n: number) => `${Math.round(n * 100)}%`;
	return (
		<Section icon={BarChart3} title="At a glance">
			<div className="grid grid-cols-2 gap-x-6 gap-y-3">
				<Stat
					label="Avg merge time"
					value={`${stats.avg_time_to_merge_hours}h`}
				/>
				<Stat
					label="Avg files changed"
					value={String(stats.avg_files_changed)}
				/>
				<Stat
					label="Median reviews"
					value={String(stats.median_review_rounds)}
				/>
				<Stat
					label="Avg insertions"
					value={`+${stats.avg_insertions}`}
					note={`-${stats.avg_deletions} deletions`}
				/>
				<Stat label="With tests" value={pct(stats.merge_rate_with_tests)} />
				<Stat
					label="Linked issue"
					value={pct(stats.merge_rate_with_linked_issue)}
				/>
				<Stat
					label="Conventional title"
					value={pct(stats.merge_rate_conventional_title)}
				/>
			</div>
		</Section>
	);
}

function SummaryTab({ playbook }: { playbook: ContributorPlaybook }) {
	return (
		<div className="space-y-6">
			<div className="font-mono text-[11px] text-muted-foreground">
				Based on {playbook.prs_analyzed} merged PR
				{playbook.prs_analyzed === 1 ? "" : "s"}
			</div>
			{playbook.summary && (
				<div className="p-3 bg-muted/30 border border-border rounded-lg text-foreground/80 text-sm leading-relaxed">
					{playbook.summary}
				</div>
			)}
			<StatsGrid stats={playbook.stats} />
			{playbook.recommendations.length > 0 && (
				<Section icon={Star} title="Top recommendations">
					<div className="space-y-3">
						{playbook.recommendations.map((rec, i) => (
							<div
								key={rec.title}
								className="p-3 bg-muted/20 border border-border rounded-lg space-y-2"
							>
								<div className="flex items-center gap-2">
									<span className="font-mono text-[10px] text-muted-foreground w-4">
										{i + 1}.
									</span>
									<span className="font-medium text-foreground text-xs">
										{rec.title}
									</span>
									<PriorityBadge priority={rec.priority} />
								</div>
								<p className="text-foreground/70 text-xs leading-relaxed pl-6">
									{rec.description}
								</p>
								{rec.evidence.length > 0 && (
									<div className="pl-6 space-y-1">
										{rec.evidence.map((e) => (
											<div
												key={e}
												className="flex items-start gap-1.5 text-muted-foreground"
											>
												<span className="mt-1.5 w-1 h-1 rounded-full bg-primary/60 shrink-0" />
												<span className="font-mono text-[10px] leading-relaxed">
													{e}
												</span>
											</div>
										))}
									</div>
								)}
							</div>
						))}
					</div>
				</Section>
			)}
		</div>
	);
}

function ChecklistTab({ playbook }: { playbook: ContributorPlaybook }) {
	const required = playbook.checklist.filter((c) => c.required);
	const optional = playbook.checklist.filter((c) => !c.required);
	return (
		<div className="space-y-6">
			{required.length > 0 && (
				<Section icon={ListChecks} title="Required">
					<div className="space-y-2">
						{required.map((item) => (
							<div key={item.text} className="flex items-start gap-2 text-xs">
								<CheckCircle2
									size={12}
									className="text-primary mt-0.5 shrink-0"
								/>
								<span className="text-foreground/80">{item.text}</span>
							</div>
						))}
					</div>
				</Section>
			)}
			{optional.length > 0 && (
				<Section icon={BookOpen} title="Best practices">
					<div className="space-y-2">
						{optional.map((item) => (
							<div key={item.text} className="flex items-start gap-2 text-xs">
								<CheckCircle2
									size={12}
									className="text-muted-foreground mt-0.5 shrink-0"
								/>
								<span className="text-foreground/70">{item.text}</span>
							</div>
						))}
					</div>
				</Section>
			)}
			{playbook.checklist.length === 0 && (
				<div className="text-muted-foreground text-xs">
					No checklist items generated.
				</div>
			)}
		</div>
	);
}

function ExamplesTab({ playbook }: { playbook: ContributorPlaybook }) {
	return (
		<div className="space-y-6">
			{playbook.example_prs.length > 0 && (
				<Section icon={GitPullRequest} title="Example PRs">
					<div className="space-y-3">
						{playbook.example_prs.map((pr) => (
							<div
								key={pr.number}
								className="p-3 bg-muted/20 border border-border rounded-lg space-y-2"
							>
								<div className="flex items-center gap-2">
									<span className="font-mono text-[10px] text-muted-foreground">
										#{pr.number}
									</span>
									<a
										href={pr.url}
										target="_blank"
										rel="noopener noreferrer"
										className="font-medium text-foreground text-xs hover:underline truncate"
									>
										{pr.title}
									</a>
								</div>
								<p className="text-foreground/70 text-xs leading-relaxed">
									{pr.summary}
								</p>
							</div>
						))}
					</div>
				</Section>
			)}
			{playbook.example_prs.length === 0 && (
				<div className="text-muted-foreground text-xs">
					No example PRs identified.
				</div>
			)}
		</div>
	);
}

type Tab = "summary" | "checklist" | "examples";

const TABS: { id: Tab; label: string; icon: typeof BookOpen }[] = [
	{ id: "summary", label: "Guide", icon: BookOpen },
	{ id: "checklist", label: "Checklist", icon: ListChecks },
	{ id: "examples", label: "Examples", icon: GitPullRequest },
];

export function RepoPatternPanel({
	repo,
	onClose,
}: {
	repo: string;
	onClose: () => void;
}) {
	const { data, isLoading, isError } = useQuery({
		queryKey: ["repoPattern", repo],
		queryFn: () => fetchRepoPattern(repo),
	});

	const [tab, setTab] = useState<Tab>("summary");

	return (
		<motion.div
			key={repo}
			initial={{ x: 20 }}
			animate={{ x: 0 }}
			exit={{ x: 20 }}
			transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
			className="relative flex flex-col h-full overflow-hidden"
		>
			<div className="relative z-30 flex items-center gap-3 px-6 py-4 border-border border-b">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1 font-mono text-[10px] text-muted-foreground">
						<GitPullRequest size={9} />
						Contributor playbook
					</div>
					<h2 className="font-medium text-foreground text-sm truncate">
						{repo}
					</h2>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
					aria-label="Close"
				>
					<X size={15} />
				</button>
			</div>

			<div className="flex gap-1 px-3 py-2 border-border border-b">
				{TABS.map(({ id, label, icon: Icon }) => (
					<button
						key={id}
						type="button"
						onClick={() => setTab(id)}
						className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-md font-mono text-[10px] transition-colors ${
							tab === id
								? "bg-primary/15 text-primary"
								: "text-muted-foreground hover:text-foreground hover:bg-white/5"
						}`}
					>
						<Icon size={10} />
						{label}
					</button>
				))}
			</div>

			<div className="flex-1 px-6 py-5 overflow-y-auto scrollbar-hide">
				{isLoading && (
					<div className="flex flex-col justify-center items-center gap-3 py-16 text-center">
						<Loader2
							size={20}
							className="text-primary animate-spin will-change-transform"
						/>
						<p className="font-mono text-[11px] text-muted-foreground">
							Analyzing merged PRs…
						</p>
					</div>
				)}
				{isError && (
					<div className="flex flex-col justify-center items-center gap-3 py-16 text-center">
						<AlertCircle size={28} className="text-destructive/60" />
						<p className="font-mono text-[11px] text-muted-foreground">
							Could not analyze this repository.
						</p>
					</div>
				)}
				{data && tab === "summary" && <SummaryTab playbook={data} />}
				{data && tab === "checklist" && <ChecklistTab playbook={data} />}
				{data && tab === "examples" && <ExamplesTab playbook={data} />}
			</div>
		</motion.div>
	);
}

import { useState } from "react";
