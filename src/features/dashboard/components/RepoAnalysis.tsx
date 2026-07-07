import {
	Activity,
	ArrowRight,
	CheckCircle2,
	GitBranch,
	GitPullRequest,
	Layers,
	Loader2,
	Package,
	Shield,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { LANG_COLOR, REPO_ANALYSIS_PHASES } from "../data";
import type { AddedRepo } from "../types";
import { ComplexityBadge } from "./ComplexityBadge";

export function RepoAnalysisModal({
	url,
	onDone,
	onClose,
}: {
	url: string;
	onDone: (repo: AddedRepo) => void;
	onClose: () => void;
}) {
	const [phaseIndex, setPhaseIndex] = useState(0);
	const current = REPO_ANALYSIS_PHASES[phaseIndex];
	const isDone = current.id === "done";

	useEffect(() => {
		if (isDone) return;
		const t = setTimeout(
			() =>
				setPhaseIndex((i) => Math.min(i + 1, REPO_ANALYSIS_PHASES.length - 1)),
			current.duration,
		);
		return () => clearTimeout(t);
	}, [isDone, current.duration]);

	// Parse a plausible repo name from the URL
	const parts = url
		.replace("https://github.com/", "")
		.replace("http://github.com/", "")
		.split("/");
	const owner = parts[0] ?? "owner";
	const name = parts[1] ?? "repo";

	// Simulate result data
	const result: AddedRepo = {
		id: Date.now(),
		url,
		name,
		owner,
		language: "TypeScript",
		stars: 29400,
		complexity: "Medium",
		openIssues: 47,
		matchedIssues: 8,
		techStack: ["TypeScript", "React", "Vitest", "tsup"],
		dependencies: ["react", "react-dom", "swr"],
		lastCommit: "2 days ago",
		contributors: 142,
		hasContributing: true,
		goodFirstIssues: 6,
	};

	const progress = (phaseIndex / (REPO_ANALYSIS_PHASES.length - 1)) * 100;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="z-50 fixed inset-0 flex justify-center items-center p-4"
			style={{ background: "rgba(7,11,18,0.85)", backdropFilter: "blur(8px)" }}
			onClick={isDone ? undefined : onClose}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.96, y: 16 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.96, y: 16 }}
				transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
				onClick={(e) => e.stopPropagation()}
				className="bg-card shadow-2xl shadow-black/60 border border-border rounded-2xl w-full max-w-lg overflow-hidden"
			>
				{/* Progress bar */}
				<div className="bg-border h-0.5">
					<motion.div
						className="bg-primary h-full"
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.5, ease: "easeOut" }}
					/>
				</div>

				{!isDone ? (
					<div className="p-6">
						<div className="flex items-center gap-3 mb-5">
							<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-xl w-9 h-9">
								<GitBranch size={16} className="text-primary" />
							</div>
							<div>
								<div className="font-mono text-muted-foreground text-xs">
									{owner}
								</div>
								<div className="font-medium text-foreground text-sm">
									{name}
								</div>
							</div>
						</div>

						{/* Steps */}
						<div className="space-y-1 mb-5">
							{REPO_ANALYSIS_PHASES.filter((p) => p.id !== "done").map(
								(p, i) => {
									const done = i < phaseIndex;
									const active = i === phaseIndex;
									return (
										<div key={p.id} className="flex items-center gap-3 py-1.5">
											<div
												className="flex justify-center items-center border rounded-full w-4 h-4 transition-all shrink-0"
												style={{
													borderColor:
														done || active
															? "#5b6af0"
															: "rgba(255,255,255,0.1)",
													backgroundColor: done ? "#5b6af0" : "transparent",
												}}
											>
												{done ? (
													<CheckCircle2 size={9} className="text-background" />
												) : active ? (
													<motion.div
														animate={{ rotate: 360 }}
														transition={{
															repeat: Infinity,
															duration: 1,
															ease: "linear",
														}}
													>
														<Loader2 size={9} className="text-primary" />
													</motion.div>
												) : (
													<div className="bg-white/10 rounded-full w-1 h-1" />
												)}
											</div>
											<span
												className="text-xs transition-colors"
												style={{
													color: active
														? "#e8edf8"
														: done
															? "#5a6a8a"
															: "#3a4a6a",
												}}
											>
												{p.label}
											</span>
											{active && (
												<motion.span
													initial={{ opacity: 0 }}
													animate={{ opacity: 1 }}
													className="ml-auto font-mono text-[10px] text-muted-foreground"
												>
													{p.detail}
												</motion.span>
											)}
										</div>
									);
								},
							)}
						</div>

						<div className="flex items-center gap-2 text-muted-foreground">
							<motion.div
								animate={{ opacity: [1, 0.3, 1] }}
								transition={{ repeat: Infinity, duration: 1.2 }}
								className="bg-primary rounded-full w-1.5 h-1.5"
							/>
							<span className="font-mono text-[11px]">{current.label}…</span>
						</div>
					</div>
				) : (
					<div className="p-6">
						<div className="flex items-center gap-3 mb-5">
							<CheckCircle2 size={20} className="text-emerald-400" />
							<div>
								<div className="font-mono text-muted-foreground text-xs">
									Analysis complete
								</div>
								<div className="font-medium text-foreground text-sm">
									{owner}/{name}
								</div>
							</div>
						</div>

						{/* Results grid */}
						<div className="gap-3 grid grid-cols-2 mb-5">
							<div className="bg-muted/10 p-4 border border-border rounded-xl">
								<div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] text-muted-foreground">
									<Layers size={9} />
									Tech stack
								</div>
								<div className="flex flex-wrap gap-1.5">
									{result.techStack.map((t) => (
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
							</div>

							<div className="bg-muted/10 p-4 border border-border rounded-xl">
								<div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] text-muted-foreground">
									<Activity size={9} />
									Complexity
								</div>
								<ComplexityBadge level={result.complexity} />
								<div className="mt-2 font-mono text-[10px] text-muted-foreground">
									{result.contributors} contributors
								</div>
							</div>

							<div className="bg-muted/10 p-4 border border-border rounded-xl">
								<div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] text-muted-foreground">
									<GitPullRequest size={9} />
									Issues
								</div>
								<div className="font-medium text-foreground text-xl">
									{result.openIssues}
								</div>
								<div className="mt-0.5 font-mono text-[10px] text-primary">
									{result.matchedIssues} match your profile
								</div>
							</div>

							<div className="bg-muted/10 p-4 border border-border rounded-xl">
								<div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] text-muted-foreground">
									<Shield size={9} />
									Onboarding
								</div>
								<div className="space-y-1">
									{result.hasContributing && (
										<div className="flex items-center gap-1.5">
											<CheckCircle2 size={10} className="text-emerald-400" />
											<span className="font-mono text-[10px] text-foreground/70">
												CONTRIBUTING.md
											</span>
										</div>
									)}
									<div className="flex items-center gap-1.5">
										<CheckCircle2 size={10} className="text-emerald-400" />
										<span className="font-mono text-[10px] text-foreground/70">
											{result.goodFirstIssues} good first issues
										</span>
									</div>
								</div>
							</div>
						</div>

						{/* Key deps */}
						<div className="bg-muted/10 mb-5 p-3 border border-border rounded-xl">
							<div className="flex items-center gap-1.5 mb-2 font-mono text-[10px] text-muted-foreground">
								<Package size={9} />
								Key dependencies
							</div>
							<div className="flex flex-wrap gap-2">
								{result.dependencies.map((d) => (
									<span
										key={d}
										className="px-2 py-0.5 border border-border/60 rounded font-mono text-[10px] text-muted-foreground"
									>
										{d}
									</span>
								))}
							</div>
						</div>

						<button
							type="button"
							onClick={() => onDone(result)}
							className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 py-3 rounded-xl w-full font-medium text-primary-foreground text-sm transition-all"
						>
							Add to dashboard <ArrowRight size={13} />
						</button>
					</div>
				)}
			</motion.div>
		</motion.div>
	);
}
