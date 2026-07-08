import { createFileRoute } from "@tanstack/react-router";
import {
	AlertCircle,
	BookOpen,
	CheckCircle2,
	Clock,
	GitBranch,
	GitMerge,
	Layers,
	Package,
	Plus,
	Shield,
	Star,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import { ComplexityBadge } from "#/features/dashboard/components/ComplexityBadge";
import { Topbar } from "#/features/dashboard/components/Topbar";
import { LANG_COLOR } from "#/features/dashboard/data";

export const Route = createFileRoute("/_dashboard/_layout/repos")({
	component: RouteComponent,
});

type Repo = {
	id: number;
	owner: string;
	name: string;
	language: string;
	complexity: string;
	stars: number;
	contributors: string[];
	lastCommit: string;
	openIssues: number;
	goodFirstIssues: number;
	matchedIssues: number;
	techStack: string[];
	dependencies: string[];
	hasContributing: true;
};

function RouteComponent() {
	const repos: Repo[] = [];
	const onAdd = () => {};
	const onRemove = (_id: number) => {};

	return (
		<div className="flex flex-col h-full">
			<Topbar
				title="Repositories"
				subtitle={`${repos.length} repo${repos.length !== 1 ? "s" : ""} added · issues matched against your profile`}
			>
				<button
					type="button"
					onClick={onAdd}
					className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg font-medium text-primary-foreground text-sm transition-colors"
				>
					<Plus size={14} />
					Add repository
				</button>
			</Topbar>

			<div className="flex-1 px-7 py-6 overflow-y-auto scrollbar-hide">
				{repos.length === 0 ? (
					<div className="flex flex-col justify-center items-center gap-4 py-20 h-full text-center">
						<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-16 h-16">
							<GitBranch size={24} className="text-primary" />
						</div>
						<div>
							<div className="mb-1 font-medium text-foreground text-base">
								No repositories added yet
							</div>
							<p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
								Add a GitHub repository you want to contribute to. We'll analyze
								its tech stack, complexity, and open issues — then match them to
								your skills.
							</p>
						</div>
						<button
							type="button"
							onClick={onAdd}
							className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 px-6 py-3 rounded-xl font-medium text-primary-foreground text-sm transition-all"
						>
							<Plus size={14} />
							Add your first repository
						</button>
					</div>
				) : (
					<div className="space-y-4 max-w-3xl">
						{repos.map((repo, i) => (
							<motion.div
								key={repo.id}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{
									delay: i * 0.07,
									duration: 0.4,
									ease: [0.16, 1, 0.3, 1],
								}}
								className="bg-card border border-border rounded-xl overflow-hidden"
							>
								{/* Header */}
								<div className="flex items-start gap-4 p-5 border-border border-b">
									<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-xl w-10 h-10 shrink-0">
										<BookOpen size={16} className="text-primary" />
									</div>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1">
											<span className="font-mono text-muted-foreground text-xs">
												{repo.owner}
											</span>
											<span className="font-mono text-muted-foreground/40 text-xs">
												/
											</span>
											<span className="font-medium text-foreground text-sm">
												{repo.name}
											</span>
											<ComplexityBadge level={repo.complexity} />
										</div>
										<div className="flex items-center gap-4">
											<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
												<span
													className="inline-block rounded-full w-2 h-2"
													style={{
														backgroundColor:
															LANG_COLOR[repo.language] ?? "#a0aec8",
													}}
												/>
												{repo.language}
											</span>
											<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
												<Star size={9} />
												{(repo.stars / 1000).toFixed(1)}k
											</span>
											<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
												<Clock size={9} />
												Last commit {repo.lastCommit}
											</span>
											<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
												<GitMerge size={9} />
												{repo.contributors} contributors
											</span>
										</div>
									</div>
									<button
										type="button"
										onClick={() => onRemove(repo.id)}
										className="p-1.5 text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0"
									>
										<X size={14} />
									</button>
								</div>

								{/* Stats */}
								<div className="grid grid-cols-4 divide-x divide-border">
									{[
										{ label: "Open issues", value: repo.openIssues, sub: null },
										{
											label: "Your matches",
											value: repo.matchedIssues,
											sub: "matched",
											highlight: true,
										},
										{
											label: "Good first",
											value: repo.goodFirstIssues,
											sub: "issues",
										},
										{
											label: "Contributors",
											value: repo.contributors,
											sub: null,
										},
									].map(({ label, value, sub, highlight }) => (
										<div key={label} className="px-4 py-3 text-center">
											<div className="mb-1 font-mono text-[10px] text-muted-foreground">
												{label}
											</div>
											<div
												className="font-medium text-xl"
												style={{ color: highlight ? "#5b6af0" : "#e8edf8" }}
											>
												{value}
											</div>
											{sub && (
												<div className="font-mono text-[9px] text-muted-foreground">
													{sub}
												</div>
											)}
										</div>
									))}
								</div>

								{/* Tech stack + onboarding */}
								<div className="grid grid-cols-2 border-border border-t divide-x divide-border">
									<div className="px-5 py-4">
										<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground">
											<Layers size={9} />
											Tech stack
										</div>
										<div className="flex flex-wrap gap-1.5">
											{repo.techStack.map((t) => (
												<span
													key={t}
													className="px-1.5 py-0.5 rounded font-mono text-[10px]"
													style={{
														color: LANG_COLOR[t] ?? "#a0aec8",
														background: `${LANG_COLOR[t] ?? "#a0aec8"}15`,
													}}
												>
													{t}
												</span>
											))}
										</div>
										<div className="mt-3">
											<div className="flex items-center gap-1.5 mb-1.5 font-mono text-[10px] text-muted-foreground">
												<Package size={9} />
												Dependencies
											</div>
											<div className="flex flex-wrap gap-1">
												{repo.dependencies.map((d) => (
													<span
														key={d}
														className="px-1.5 py-0.5 border border-border/50 rounded font-mono text-[10px] text-muted-foreground"
													>
														{d}
													</span>
												))}
											</div>
										</div>
									</div>
									<div className="px-5 py-4">
										<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground">
											<Shield size={9} />
											Contributor onboarding
										</div>
										<div className="space-y-2">
											{[
												{
													label: "CONTRIBUTING.md present",
													ok: repo.hasContributing,
												},
												{
													label: `${repo.goodFirstIssues} good first issues`,
													ok: repo.goodFirstIssues > 0,
												},
												{ label: "Active maintainers", ok: true },
											].map(({ label, ok }) => (
												<div key={label} className="flex items-center gap-2">
													{ok ? (
														<CheckCircle2
															size={11}
															className="text-emerald-400 shrink-0"
														/>
													) : (
														<AlertCircle
															size={11}
															className="text-amber-400 shrink-0"
														/>
													)}
													<span className="font-mono text-[10px] text-foreground/70">
														{label}
													</span>
												</div>
											))}
										</div>
									</div>
								</div>
							</motion.div>
						))}

						<button
							type="button"
							onClick={onAdd}
							className="flex justify-center items-center gap-2 hover:bg-primary/5 py-4 border border-border hover:border-primary/40 border-dashed rounded-xl w-full font-medium text-muted-foreground hover:text-primary text-sm transition-all"
						>
							<Plus size={14} />
							Add another repository
						</button>
					</div>
				)}
			</div>
		</div>
	);
}
