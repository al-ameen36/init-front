import { BookmarkIcon, Clock, MessageSquare, Star } from "lucide-react";
import { motion } from "motion/react";
import { DifficultyBadge } from "../../../components/DifficultyBadge";
import { MatchRing } from "../../../components/MatchRing";
import type { Issue } from "../types";

export function IssueCard({
	issue,
	isSelected,
	onClick,
	onBookmark,
}: {
	issue: Issue;
	isSelected: boolean;
	onClick: () => void;
	onBookmark: () => void;
}) {
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
				<MatchRing score={81} size={42} />
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<span className="font-mono text-[10px] text-muted-foreground">
							REPO_NAME
						</span>
						<span className="flex items-center gap-0.5 font-mono text-[10px] text-muted-foreground/50">
							<Star size={9} />
							{(3 / 1000).toFixed(0)}k
						</span>
					</div>
					<div className="pr-6 font-medium text-foreground group-hover:text-white text-sm leading-snug transition-colors">
						{issue.title}
					</div>
				</div>
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation();
						onBookmark();
					}}
					className="absolute top-4 right-4 p-1 rounded transition-colors text-muted-foreground/30 hover:text-muted-foreground"
				>
					<BookmarkIcon size={13} fill="none" />
				</button>
			</div>
			<div className="flex flex-wrap items-center gap-1.5">
				<DifficultyBadge level={"High"} />
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
						{issue.opened}d
					</span>
				</div>
			</div>
		</motion.div>
	);
}
