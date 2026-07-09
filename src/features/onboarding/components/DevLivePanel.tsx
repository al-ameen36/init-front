import {
	CheckCircle2,
	Code,
	Code2,
	GitCommitVertical,
	Github,
	GitPullRequest,
	Layers,
	Star,
} from "lucide-react";
import { motion } from "motion/react";
import type { DeveloperProfile } from "@/hooks/useOnboardingAnalysis";
import type { Phase } from "./data";
import { useCountUp } from "./helpers";

export function DevLivePanel({
	phase,
	analysis,
	loading,
}: {
	phase: Phase;
	analysis?: DeveloperProfile;
	loading?: boolean;
}) {
	const isReady = analysis !== undefined && analysis !== null;
	const username = isReady ? analysis?.username || null : null;

	const repoCount = useCountUp(
		analysis?.repos_count || 0,
		isReady &&
			["repos", "languages", "history", "profile", "matching", "done"].includes(
				phase,
			),
		1200,
	);
	const prCount = useCountUp(
		analysis?.merged_prs || 0,
		isReady && ["history", "profile", "matching", "done"].includes(phase),
		1100,
	);
	const commitCount = useCountUp(
		analysis?.commit_stats?.total_commits || 0,
		isReady && ["history", "profile", "matching", "done"].includes(phase),
		1200,
	);
	const totalStars = analysis?.total_stars || 0;
	const foundLangs = analysis?.primary_languages?.length || 0;

	const repos = analysis?.public_repos || [];
	const languages = analysis?.primary_languages || [];
	const techPackages = analysis?.tech_stack?.packages || [];
	const showRepos = [
		"repos",
		"languages",
		"history",
		"profile",
		"matching",
		"done",
	].includes(phase);
	const showLangs = [
		"languages",
		"history",
		"profile",
		"matching",
		"done",
	].includes(phase);
	const showTech = ["history", "profile", "matching", "done"].includes(phase);
	const showHistory = ["history", "profile", "matching", "done"].includes(
		phase,
	);

	return (
		<div className="space-y-4">
			{loading || !isReady ? (
				<div className="flex items-center gap-3 bg-card px-4 py-3 border border-border rounded-xl">
					<div className="flex justify-center items-center bg-muted/50 border border-border rounded-lg w-8 h-8">
						<Github size={15} className="text-muted-foreground" />
					</div>
					<div className="flex-1">
						<div className="font-medium text-muted-foreground text-xs">
							Fetching GitHub data...
						</div>
						<div className="font-mono text-[10px] text-muted-foreground">
							github.com/...
						</div>
					</div>
					<div className="border-2 border-primary border-t-transparent rounded-full w-4 h-4 animate-spin" />
				</div>
			) : (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					className="flex items-center gap-3 bg-card px-4 py-3 border border-border rounded-xl"
				>
					<div className="flex justify-center items-center bg-white/8 border border-border rounded-lg w-8 h-8">
						<Github size={15} className="text-foreground" />
					</div>
					<div className="flex-1">
						<div className="font-medium text-foreground text-xs">
							{username}
						</div>
						<div className="font-mono text-[10px] text-muted-foreground">
							github.com/{username}
						</div>
					</div>
					<CheckCircle2 size={14} className="text-emerald-400" />
				</motion.div>
			)}

			{analysis && showRepos && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="bg-card border border-border rounded-xl overflow-hidden"
				>
					<div className="flex items-center gap-2 bg-muted/20 px-4 py-2.5 border-border border-b">
						<Code2 size={11} className="text-muted-foreground" />
						<span className="font-mono text-[10px] text-muted-foreground">
							<span className="font-medium text-foreground">{repoCount}</span>{" "}
							repositories
						</span>
					</div>
					<div className="divide-y divide-border/50">
						{repos.slice(0, 5).map((r, i) => (
							<motion.div
								key={r.name}
								initial={{ opacity: 0, x: -6 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.12, duration: 0.3 }}
								className="flex items-center gap-3 px-4 py-2.5"
							>
								<span className="flex-1 font-mono text-foreground/70 text-xs">
									{r.name}
								</span>
								<span
									className="px-1.5 py-0.5 rounded font-mono text-[10px]"
									style={{ color: "#3178c6", background: "#3178c615" }}
								>
									{r.language || "JavaScript"}
								</span>
								<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
									<Star size={9} />
									{r.stars || 0}
								</span>
							</motion.div>
						))}
						{repos.length > 5 && (
							<div className="flex items-center gap-1 px-4 py-2">
								<span className="font-mono text-[10px] text-muted-foreground/40">
									+ {repos.length - 5} more
								</span>
							</div>
						)}
					</div>
				</motion.div>
			)}

			{analysis && showLangs && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="space-y-2 bg-card p-4 border border-border rounded-xl"
				>
					<div className="mb-3 font-mono text-[10px] text-muted-foreground">
						Detected languages
					</div>
					{languages.slice(0, 4).map((lang, i) => (
						<motion.div
							key={lang}
							initial={{ opacity: 0, x: -4 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.1 }}
							className="flex items-center gap-2"
						>
							<CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
							<span className="flex-1 font-medium text-foreground text-xs capitalize">
								{lang}
							</span>
							<span className="font-mono text-[10px] text-muted-foreground">
								Detected
							</span>
						</motion.div>
					))}
				</motion.div>
			)}
			{analysis && showTech && techPackages.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="space-y-2 bg-card p-4 border border-border rounded-xl"
				>
					<div className="mb-3 font-mono text-[10px] text-muted-foreground">
						Technologies found
					</div>
					{techPackages.slice(0, 6).map((pkg, i) => (
						<motion.div
							key={pkg}
							initial={{ opacity: 0, x: -4 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ delay: i * 0.08 }}
							className="flex items-center gap-2"
						>
							<Layers size={11} className="text-primary shrink-0" />
							<span className="flex-1 font-medium text-foreground text-xs">
								{pkg}
							</span>
						</motion.div>
					))}
					{techPackages.length > 6 && (
						<div className="flex items-center gap-1 px-4 py-2">
							<span className="font-mono text-[10px] text-muted-foreground/40">
								+ {techPackages.length - 6} more
							</span>
						</div>
					)}
				</motion.div>
			)}

			{analysis && showHistory && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="gap-2 grid grid-cols-2"
				>
					{[
						{
							icon: GitCommitVertical,
							label: "Commits",
							value: commitCount,
							color: "#22d3ee",
						},
						{
							icon: Star,
							label: `${totalStars.toLocaleString()}`,
							sub: "stars",
							color: "#f59e0b",
						},
						{
							icon: Code,
							label: `${foundLangs} lang`,
							sub: "found",
							color: "#10b981",
						},
						{
							icon: GitPullRequest,
							label: `${prCount} prs`,
							sub: "merged",
							color: "#6366f1",
						},
					].map(({ icon: Icon, label, value, color, sub }) => (
						<div
							key={label || sub}
							className="bg-card p-3 border border-border rounded-xl text-center"
						>
							{Icon && (
								<Icon size={13} style={{ color }} className="mx-auto mb-1.5" />
							)}
							<div className="font-medium text-foreground text-base">
								{value !== undefined
									? value.toLocaleString()
									: sub
										? label
										: "…"}
							</div>
							<div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
								{value === undefined ? sub : label}
							</div>
						</div>
					))}
				</motion.div>
			)}
		</div>
	);
}
