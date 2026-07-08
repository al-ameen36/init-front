import {
	ArrowRight,
	CheckCircle2,
	Code2,
	ExternalLink,
	FileCode,
	ListChecks,
	X,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { MatchRing } from "../../../components/MatchRing";
import type { AnalyzeIssueResponse } from "../types";

export function DetailPanel({
	issue,
	onClose,
}: {
	issue: AnalyzeIssueResponse;
	onClose: () => void;
}) {
	return (
		<motion.div
			key={issue.number}
			initial={{ opacity: 0, x: 20 }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: 20 }}
			transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
			className="flex flex-col h-full"
		>
			<div className="flex items-start gap-3 px-6 py-4 border-border border-b">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1 font-mono text-[10px] text-muted-foreground">
						{issue.repo}
						<span className="px-1.5 py-0.5 border border-border/50 rounded text-[9px]">
							{issue.language}
						</span>
					</div>
					<h2 className="font-medium text-foreground text-sm leading-snug">
						{issue.title}
					</h2>
				</div>
				<button
					type="button"
					onClick={onClose}
					className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
				>
					<X size={15} />
				</button>
			</div>

			<div className="flex-1 space-y-6 px-6 py-5 overflow-y-auto scrollbar-hide">
				<div className="flex items-center gap-3 mb-4">
					{/* <MatchRing score={issue.matchScore} size={52} /> */}
					<MatchRing score={issue.matchScore} size={52} />
					<div>
						<div className="font-medium text-foreground text-sm">
							Match Score
						</div>
						<div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
							{issue.matchScore >= 90
								? "Excellent fit"
								: issue.matchScore >= 80
									? "Strong fit"
									: "Good fit"}
						</div>
					</div>
				</div>

				{/* <div className="space-y-2">
					{issue.matchReasons.map((r, _i) => (
						<div key={r} className="flex items-start gap-2.5">
							<CheckCircle2
								size={13}
								className="mt-0.5 text-emerald-400 shrink-0"
							/>
							<span className="text-muted-foreground text-xs leading-relaxed">
								{r}
							</span>
						</div>
					))}
				</div> */}

				<div className="gap-2 grid grid-cols-3">
					{[
						{
							label: "Difficulty",
							value: issue.guide.difficulty,
							color: issue.guide.difficulty === "Low" ? "#34d399" : "#fbbf24",
						},
						{
							label: "Comments",
							value: `${issue.guide.comments}`,
							color: "#a0aec8",
						},
						{
							label: "Opened",
							value: issue.guide.opened,
							color: "#a0aec8",
						},
					].map(({ label, value, color }) => (
						<div
							key={label}
							className="bg-muted/30 p-3 border border-border rounded-lg text-center"
						>
							<div className="mb-1 font-mono text-[10px] text-muted-foreground">
								{label}
							</div>
							<div className="font-medium text-sm" style={{ color }}>
								{value}
							</div>
						</div>
					))}
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<Zap size={9} />
						Summary
					</div>
					<p className="text-foreground/75 text-xs leading-relaxed">
						{issue.guide.summary}
					</p>
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<FileCode size={9} />
						Relevant files
					</div>
					<div className="space-y-1.5">
						{issue.guide.relevant_files.map((file) => (
							<div
								key={file}
								className="group flex items-center gap-2.5 bg-muted/20 px-3 py-2 border border-border/60 hover:border-white/12 rounded-md transition-colors cursor-pointer"
							>
								<Code2 size={11} className="text-muted-foreground shrink-0" />
								<span className="flex-1 font-mono text-[11px] text-foreground/65 group-hover:text-foreground truncate transition-colors">
									{file}
								</span>
								<ExternalLink
									size={9}
									className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0"
								/>
							</div>
						))}
					</div>
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<ListChecks size={9} />
						Investigation path
					</div>
					<div className="space-y-2.5">
						{issue.guide.investigation_path.map((step, i) => (
							<div key={step} className="flex gap-3">
								<div className="flex justify-center items-center bg-muted/40 mt-0.5 border border-border rounded-full w-4 h-4 shrink-0">
									<span className="font-mono text-[8px] text-muted-foreground">
										{i + 1}
									</span>
								</div>
								<p className="text-foreground/70 text-xs leading-relaxed">
									{step}
								</p>
							</div>
						))}
					</div>
				</div>

				{/* <div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<GitBranch size={9} />
						Related PRs
					</div>
					<div className="flex flex-wrap gap-2">
						{issue.related.map((pr) => (
							<span
								key={pr}
								className="flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-2.5 py-1.5 border border-primary/20 rounded-md font-mono text-[11px] text-primary transition-colors cursor-pointer"
							>
								<GitPullRequest size={10} />
								{pr}
							</span>
						))}
					</div>
				</div> */}
			</div>

			<div className="space-y-2 px-6 py-4 border-border border-t">
				<button
					type="button"
					className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 py-2.5 rounded-lg w-full font-medium text-primary-foreground text-sm transition-all"
				>
					Open on GitHub <ArrowRight size={13} />
				</button>
			</div>
		</motion.div>
	);
}
