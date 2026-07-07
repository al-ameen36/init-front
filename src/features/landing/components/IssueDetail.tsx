import {
	ArrowRight,
	Code2,
	ExternalLink,
	FileCode,
	GitBranch,
	Github,
	GitPullRequest,
	ListChecks,
	X,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { DifficultyBadge } from "#/components/DifficultyBadge";
import { MatchRing } from "#/components/MatchRing";
import type { ISSUES } from "../data";

export function IssueDetail({
	issue,
	onClose,
}: {
	issue: (typeof ISSUES)[0];
	onClose: () => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="z-50 fixed inset-0 flex justify-center items-end md:items-center p-4 md:p-8"
			style={{ background: "rgba(7,11,18,0.8)", backdropFilter: "blur(8px)" }}
			onClick={onClose}
		>
			<motion.div
				initial={{ opacity: 0, y: 40, scale: 0.97 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				exit={{ opacity: 0, y: 40, scale: 0.97 }}
				transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
				onClick={(e) => e.stopPropagation()}
				className="bg-card shadow-2xl shadow-black/60 border border-border rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto"
			>
				<div className="top-0 sticky flex items-start gap-4 bg-card px-6 py-4 border-border border-b">
					<div className="flex-1 min-w-0">
						<div className="flex items-center gap-2 mb-1 font-mono text-[10px] text-muted-foreground">
							<span>{issue.repo}</span>
							<span className="text-border">·</span>
							<DifficultyBadge level={issue.difficulty} />
						</div>
						<div className="font-medium text-foreground text-base leading-snug">
							{issue.title}
						</div>
					</div>
					<div className="flex items-center gap-3 shrink-0">
						<MatchRing score={issue.matchScore} size={48} />
						<button
							type="button"
							onClick={onClose}
							className="p-1 text-muted-foreground hover:text-foreground transition-colors"
						>
							<X size={18} />
						</button>
					</div>
				</div>

				<div className="space-y-7 p-6">
					<div>
						<div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<Zap size={10} />
							Issue summary
						</div>
						<p className="text-foreground/80 text-sm leading-relaxed">
							{issue.description}
						</p>
					</div>
					<div>
						<div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<FileCode size={10} />
							Relevant files
						</div>
						<div className="space-y-2">
							{issue.files.map((file) => (
								<div
									key={file}
									className="group flex items-center gap-3 bg-muted/30 px-3 py-2.5 border border-border hover:border-white/15 rounded-md transition-colors cursor-pointer"
								>
									<Code2 size={12} className="text-muted-foreground shrink-0" />
									<span className="font-mono text-foreground/70 group-hover:text-foreground text-xs transition-colors">
										{file}
									</span>
									<ExternalLink
										size={10}
										className="ml-auto text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
									/>
								</div>
							))}
						</div>
					</div>
					<div>
						<div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<ListChecks size={10} />
							Investigation path
						</div>
						<div className="space-y-3">
							{issue.steps.map((step, i) => (
								<div key={step} className="flex gap-3">
									<div className="flex justify-center items-center bg-muted/40 border border-border rounded-full w-5 h-5 shrink-0">
										<span className="font-mono text-[9px] text-muted-foreground">
											{i + 1}
										</span>
									</div>
									<p className="pt-0.5 text-foreground/75 text-sm leading-relaxed">
										{step}
									</p>
								</div>
							))}
						</div>
					</div>
					<div>
						<div className="flex items-center gap-2 mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<GitBranch size={10} />
							Related pull requests
						</div>
						<div className="flex flex-wrap gap-2">
							{issue.related.map((pr) => (
								<span
									key={pr}
									className="flex items-center gap-1.5 bg-primary/5 hover:bg-primary/10 px-3 py-1.5 border border-primary/20 rounded-md font-mono text-primary text-xs transition-colors cursor-pointer"
								>
									<GitPullRequest size={11} />
									{pr}
								</span>
							))}
						</div>
					</div>
					<button
						type="button"
						className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 py-3 rounded-lg w-full font-medium text-primary-foreground transition-all"
					>
						<Github size={15} />
						Open in GitHub
						<ArrowRight size={14} />
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}
