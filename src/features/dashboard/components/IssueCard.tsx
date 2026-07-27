import { AlertTriangle, Clock, MessageSquare } from "lucide-react";
import { motion } from "motion/react";
import { DifficultyBadge } from "../../../components/DifficultyBadge";
import { MatchRing } from "../../../components/MatchRing";
import type { Issue } from "../types";
import { BookmarkButton } from "./BookmarkButton";

export function IssueCard({
	issue,
	isSelected,
	onClick,
	onToggleActive,
}: {
	issue: Issue;
	isSelected: boolean;
	onClick: () => void;
	onToggleActive?: () => void;
}) {
	const matchScore = issue.matchScore;
	const difficulty = issue.difficulty;
	const repoName = issue.repo ?? "unknown";
	const isAnalyzed = issue.analysisStatus === "done";
	const isLoading = issue.analysisStatus === "analyzing";
	const isError = issue.analysisStatus === "error";

	return (
		<motion.div
			layout
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -4 }}
			transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
			onClick={onClick}
			className={`relative border rounded-xl p-4 cursor-pointer transition-all duration-150 group ${
				isSelected
					? "border-primary/40 bg-primary/6 shadow-lg shadow-primary/10"
					: "border-border bg-card hover:border-white/12 hover:bg-white/[0.02]"
			}`}
		>
			<div className="flex items-start gap-3 mb-3">
				<MatchRing score={matchScore} size={42} isLoading={isLoading} />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<span className="font-mono text-[10px] text-muted-foreground">
							{repoName}
						</span>
						{isError && (
							<span className="flex items-center gap-1 font-mono text-[10px] text-destructive/80">
								<AlertTriangle size={9} />
								Analysis failed
							</span>
						)}
					</div>
					<div className="pr-6 font-medium text-foreground group-hover:text-white text-sm leading-snug transition-colors">
						{issue.title}
					</div>
				</div>
				{onToggleActive && (
					<BookmarkButton
						isActive={!!issue.isActive}
						onClick={onToggleActive}
						className="absolute top-3 right-3"
					/>
				)}
			</div>
			<div className="flex flex-wrap items-center gap-1.5">
				{isAnalyzed && difficulty && <DifficultyBadge level={difficulty} />}
				{issue.labels.slice(0, 2).map((l) => (
					<span
						key={l}
						className="px-2 py-0.5 border border-border/60 rounded-sm font-mono text-[10px] text-muted-foreground"
					>
						{l}
					</span>
				))}
				<div className="flex items-center gap-3 ml-auto">
					<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
						<MessageSquare size={9} />
						{issue.comments}
					</span>
					<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
						<Clock size={9} />
						{issue.opened}
					</span>
				</div>
			</div>
		</motion.div>
	);
}
