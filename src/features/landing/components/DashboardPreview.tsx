import {
	ChevronRight,
	Code2,
	GitPullRequest,
	Search,
	Star,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { DifficultyBadge } from "#/components/DifficultyBadge";
import { MatchRing } from "#/components/MatchRing";
import { SkillBar } from "#/components/SkillBar";
import { DEVELOPER, ISSUES } from "../data";

export function DashboardPreview({
	onSelectIssue,
}: {
	onSelectIssue: (issue: (typeof ISSUES)[0]) => void;
}) {
	const [activeId, setActiveId] = useState<number | null>(null);

	const handleSelect = (issue: (typeof ISSUES)[0]) => {
		setActiveId(issue.id);
		onSelectIssue(issue);
	};

	return (
		<section className="mx-auto px-6 py-24 max-w-6xl">
			<div className="mb-12">
				<div className="mb-3 font-mono text-muted-foreground text-xs uppercase tracking-widest">
					Live Demo
				</div>
				<h2
					className="font-normal text-foreground text-3xl md:text-4xl"
					style={{ fontFamily: "'DM Serif Display', serif" }}
				>
					Your contribution dashboard
				</h2>
			</div>

			<div className="gap-6 grid grid-cols-1 lg:grid-cols-[320px_1fr]">
				<div className="bg-card border border-border rounded-xl h-fit overflow-hidden">
					<div className="flex items-center gap-4 p-6 border-border border-b">
						<img
							src={DEVELOPER.avatar}
							alt={DEVELOPER.name}
							className="border border-border rounded-full w-12 h-12 object-cover"
						/>
						<div>
							<div className="font-medium text-foreground text-sm">
								{DEVELOPER.name}
							</div>
							<div className="font-mono text-muted-foreground text-xs">
								@{DEVELOPER.handle}
							</div>
						</div>
					</div>
					<div className="gap-4 grid grid-cols-2 p-6 border-border border-b">
						{[
							{ icon: Code2, label: "Repositories", value: DEVELOPER.repos },
							{
								icon: GitPullRequest,
								label: "Pull Requests",
								value: DEVELOPER.prs,
							},
						].map(({ icon: Icon, label, value }) => (
							<div key={label} className="space-y-1">
								<div className="flex items-center gap-1.5 text-muted-foreground">
									<Icon size={11} />
									<span className="font-mono text-[10px]">{label}</span>
								</div>
								<div className="font-medium text-foreground text-xl">
									{value}
								</div>
							</div>
						))}
					</div>
					<div className="space-y-4 p-6">
						<div className="mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							Capability Profile
						</div>
						{DEVELOPER.skills.map((skill, i) => (
							<SkillBar key={skill.name} {...skill} delay={i * 80} />
						))}
					</div>
				</div>

				<div className="space-y-3">
					<div className="flex items-center gap-3 mb-5">
						<div className="flex flex-1 items-center gap-2 bg-card px-3 py-2 border border-border rounded-lg">
							<Search size={13} className="text-muted-foreground" />
							<span className="font-mono text-muted-foreground text-xs">
								4 matches · sorted by compatibility
							</span>
						</div>
					</div>
					{ISSUES.map((issue, i) => (
						<motion.div
							key={issue.id}
							initial={{ opacity: 0, x: 16 }}
							whileInView={{ opacity: 1, x: 0 }}
							viewport={{ once: true, margin: "-40px" }}
							transition={{
								delay: i * 0.08,
								duration: 0.5,
								ease: [0.16, 1, 0.3, 1],
							}}
							onClick={() => handleSelect(issue)}
							className={`border rounded-xl p-5 cursor-pointer transition-all duration-200 group ${activeId === issue.id ? "border-primary/50 bg-primary/5" : "border-border bg-card hover:border-white/15 hover:bg-card/80"}`}
						>
							<div className="flex items-start gap-4">
								<MatchRing score={issue.matchScore} size={52} />
								<div className="flex-1 min-w-0">
									<div className="flex justify-between items-start gap-3 mb-2">
										<div>
											<div className="mb-1 font-mono text-[10px] text-muted-foreground">
												{issue.repo}
											</div>
											<div className="font-medium text-foreground group-hover:text-white text-sm leading-snug transition-colors">
												{issue.title}
											</div>
										</div>
										<ChevronRight
											size={16}
											className={`shrink-0 mt-0.5 transition-all ${activeId === issue.id ? "text-primary rotate-90" : "text-muted-foreground/30 group-hover:text-muted-foreground"}`}
										/>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<DifficultyBadge level={issue.difficulty} />
										{issue.labels.map((label) => (
											<span
												key={label}
												className="px-2 py-0.5 border border-border rounded font-mono text-[10px] text-muted-foreground"
											>
												{label}
											</span>
										))}
										<span className="flex items-center gap-1 ml-auto font-mono text-[10px] text-muted-foreground">
											<Star size={10} />
											{(issue.stars / 1000).toFixed(1)}k
										</span>
									</div>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
