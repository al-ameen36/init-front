import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AlertCircle,
	BarChart3,
	BookOpen,
	CheckCircle2,
	Clipboard,
	ClipboardCheck,
	GitPullRequest,
	ListChecks,
	Loader2,
	RefreshCw,
	Star,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
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
	return (
		<Section icon={BarChart3} title="At a glance">
			<div className="grid grid-cols-2 gap-x-6 gap-y-3">
				<Stat
					label="Merge time"
					value={`${stats.min_time_to_merge_hours}h – ${stats.max_time_to_merge_hours}h`}
				/>
				<Stat
					label="Files changed"
					value={`${stats.min_files_changed} – ${stats.max_files_changed}`}
				/>
				<Stat
					label="Review rounds"
					value={`${stats.min_review_rounds} – ${stats.max_review_rounds}`}
				/>
				<Stat
					label="Insertions"
					value={`+${stats.min_insertions} – +${stats.max_insertions}`}
					note={`-${stats.min_deletions} – -${stats.max_deletions} deletions`}
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
			{playbook?.stats && <StatsGrid stats={playbook.stats} />}
			{playbook?.recommendations?.length > 0 && (
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
	const required = playbook?.checklist?.filter((c) => c.required) || [];
	const optional = playbook?.checklist?.filter((c) => !c.required) || [];
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
			{(!playbook?.checklist || playbook.checklist.length === 0) && (
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
			{playbook?.example_prs?.length > 0 && (
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
			{(!playbook?.example_prs || playbook.example_prs.length === 0) && (
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

function timeAgo(iso: string): string {
	const diff = Date.now() - new Date(iso).getTime();
	const minute = 60_000;
	const hour = 3_600_000;
	const day = 86_400_000;
	if (diff < minute) return "just now";
	if (diff < hour) return `${Math.floor(diff / minute)}m ago`;
	if (diff < day) return `${Math.floor(diff / hour)}h ago`;
	return `${Math.floor(diff / day)}d ago`;
}

export function RepoPatternPanel({
	repo,
	onClose,
}: {
	repo: string;
	onClose: () => void;
}) {
	const queryClient = useQueryClient();
	const [statusMsg, setStatusMsg] = useState<string | null>(null);
	const setStatusRef = useRef(setStatusMsg);
	setStatusRef.current = setStatusMsg;

	const forceRefetch = useRef(false);

	const { data, isLoading, isError, isFetching, error, refetch } = useQuery({
		queryKey: ["repoPattern", repo],
		retry: false,
		queryFn: ({ signal }) => {
			const force = forceRefetch.current;
			forceRefetch.current = false;
			return fetchRepoPattern(repo, 5, {
				signal,
				force,
				onEvent: (e) => {
					if (e.type === "status" || e.type === "progress") {
						setStatusRef.current(e.message);
					} else {
						setStatusRef.current(null);
					}
				},
			});
		},
	});

	const [tab, setTab] = useState<Tab>("summary");
	const [copied, setCopied] = useState(false);

	const handleRefresh = useCallback(() => {
		queryClient.removeQueries({ queryKey: ["repoPattern", repo] });
		forceRefetch.current = true;
		refetch();
		setStatusMsg("Starting analysis…");
	}, [queryClient, repo, refetch]);

	const buildCopyText = () => {
		const lines: string[] = [];
		lines.push(`Contributor playbook: ${repo}`);
		lines.push("");
		if (data) {
			lines.push("Summary");
			lines.push(data.summary || "—");
			lines.push("");
			if (data.stats) {
				const s = data.stats;
				lines.push("At a glance");
				lines.push(
					`Merge time: ${s.min_time_to_merge_hours}h – ${s.max_time_to_merge_hours}h`,
				);
				lines.push(
					`Files changed: ${s.min_files_changed} – ${s.max_files_changed}`,
				);
				lines.push(
					`Review rounds: ${s.min_review_rounds} – ${s.max_review_rounds}`,
				);
				lines.push(`Insertions: +${s.min_insertions} – +${s.max_insertions}`);
				lines.push(`Deletions: -${s.min_deletions} – -${s.max_deletions}`);
				lines.push("");
			}
			if (data.recommendations?.length > 0) {
				lines.push("Recommendations");
				for (const rec of data.recommendations) {
					lines.push(`${rec.title} [${rec.priority}]`);
					lines.push(rec.description);
					if (rec.evidence.length > 0) {
						for (const e of rec.evidence) lines.push(`  - ${e}`);
					}
					lines.push("");
				}
			}
			if (data.checklist?.length > 0) {
				lines.push("Checklist");
				for (const item of data.checklist) {
					lines.push(
						`[${item.required ? "required" : "optional"}] ${item.text}`,
					);
				}
				lines.push("");
			}
			if (data.example_prs?.length > 0) {
				lines.push("Example PRs");
				for (const pr of data.example_prs) {
					lines.push(`#${pr.number} ${pr.title}`);
					lines.push(pr.url);
					lines.push(pr.summary);
					lines.push("");
				}
			}
		}
		return lines.join("\n");
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(buildCopyText());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// silent fail
		}
	};

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
					{isFetching && statusMsg ? (
						<div className="mt-1 font-mono text-[9px] text-primary">
							{statusMsg}
						</div>
					) : data?.updated_at ? (
						<div className="mt-1 font-mono text-[9px] text-muted-foreground/60">
							Analyzed {timeAgo(data.updated_at)}
						</div>
					) : null}
				</div>
				<div className="flex items-center gap-1 shrink-0">
					<button
						type="button"
						onClick={handleRefresh}
						disabled={isFetching}
						className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
						aria-label="Refresh analysis"
					>
						<RefreshCw
							size={14}
							className={isFetching ? "animate-spin will-change-transform" : ""}
						/>
					</button>
					<button
						type="button"
						onClick={handleCopy}
						className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
						title="Copy content"
					>
						{copied ? (
							<ClipboardCheck size={14} className="text-emerald-400" />
						) : (
							<Clipboard size={14} />
						)}
					</button>
					<button
						type="button"
						onClick={onClose}
						className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
						aria-label="Close"
					>
						<X size={15} />
					</button>
				</div>
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
							{statusMsg || "Analyzing merged PRs…"}
						</p>
					</div>
				)}
				{isError && (
					<div className="flex flex-col justify-center items-center gap-3 py-16 text-center">
						<AlertCircle size={28} className="text-destructive/60" />
						<p className="font-mono text-[11px] text-muted-foreground">
							{error instanceof Error
								? error.message
								: "Could not analyze this repository."}
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
