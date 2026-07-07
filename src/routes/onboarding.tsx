import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Terminal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { DoneScreen } from "#/features/onboarding/components/DoneScreen";
import { LivePanel } from "#/features/onboarding/components/LivePanel";
import type { PhaseId } from "#/features/onboarding/types";

export const Route = createFileRoute("/onboarding")({
	component: RouteComponent,
});

// ─── Phases ───────────────────────────────────────────────────────────────────

const PHASES: {
	id: PhaseId;
	label: string;
	detail: string;
	duration: number;
}[] = [
	{
		id: "connecting",
		label: "Connecting to GitHub",
		detail: "Authenticating OAuth token",
		duration: 900,
	},
	{
		id: "repos",
		label: "Fetching repositories",
		detail: "Reading 34 repositories",
		duration: 1400,
	},
	{
		id: "languages",
		label: "Analyzing languages",
		detail: "Detecting frameworks and tooling",
		duration: 1600,
	},
	{
		id: "history",
		label: "Reading contribution history",
		detail: "127 pull requests · 843 commits",
		duration: 1500,
	},
	{
		id: "profile",
		label: "Building capability profile",
		detail: "Scoring proficiency across 6 domains",
		duration: 1400,
	},
	{
		id: "matching",
		label: "Scanning issue database",
		detail: "Comparing against 12,840 open issues",
		duration: 1800,
	},
	{
		id: "done",
		label: "Profile ready",
		detail: "8 high-probability matches found",
		duration: 0,
	},
];

function RouteComponent() {
	const navigate = useNavigate();
	const [phaseIndex, setPhaseIndex] = useState(0);
	const current = PHASES[phaseIndex];
	const isDone = current.id === "done";
	const progress = (phaseIndex / (PHASES.length - 1)) * 100;

	useEffect(() => {
		if (isDone) return;
		const t = setTimeout(
			() => setPhaseIndex((i) => Math.min(i + 1, PHASES.length - 1)),
			current.duration,
		);
		return () => clearTimeout(t);
	}, [isDone, current.duration]);

	return (
		<div
			className="flex flex-col bg-background min-h-screen text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			{/* Progress bar */}
			<div className="bg-border h-0.5">
				<motion.div
					className="bg-primary h-full"
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				/>
			</div>

			{/* Nav */}
			<div className="flex justify-between items-center px-8 py-4 border-border border-b">
				<div className="flex items-center gap-2">
					<div className="flex justify-center items-center bg-primary rounded-md w-7 h-7">
						<Terminal size={13} className="text-white" />
					</div>
					<span className="font-mono font-medium text-foreground">init</span>
					<span className="font-mono text-[10px] text-muted-foreground">
						.dev
					</span>
				</div>
				<div className="font-mono text-[11px] text-muted-foreground">
					{isDone ? "Complete" : "Analyzing your profile…"}
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-1 justify-center items-start px-6 py-12 overflow-y-auto scrollbar-hide">
				<div className="w-full max-w-4xl">
					<AnimatePresence mode="wait">
						{isDone ? (
							<motion.div
								key="done"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								className="flex justify-center items-center min-h-[55vh]"
							>
								<DoneScreen onEnter={() => navigate({ to: "/dashboard" })} />
							</motion.div>
						) : (
							<motion.div
								key="analyzing"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="gap-10 grid grid-cols-1 lg:grid-cols-[260px_1fr]"
							>
								{/* Timeline */}
								<div>
									<div className="mb-6 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
										Analysis steps
									</div>
									{PHASES.filter((p) => p.id !== "done").map((p, i) => {
										const done = i < phaseIndex;
										const active = i === phaseIndex;
										return (
											<div key={p.id} className="flex items-start gap-3 mb-1">
												<div className="flex flex-col items-center pt-0.5 shrink-0">
													<div
														className="flex justify-center items-center border-2 rounded-full w-5 h-5 transition-all duration-500"
														style={{
															borderColor:
																done || active
																	? "#5b6af0"
																	: "rgba(255,255,255,0.1)",
															backgroundColor: done ? "#5b6af0" : "transparent",
														}}
													>
														{done ? (
															<CheckCircle2
																size={10}
																className="text-background"
															/>
														) : active ? (
															<motion.div
																animate={{ rotate: 360 }}
																transition={{
																	repeat: Infinity,
																	duration: 1,
																	ease: "linear",
																}}
															>
																<Loader2 size={10} className="text-primary" />
															</motion.div>
														) : (
															<div className="bg-white/15 rounded-full w-1.5 h-1.5" />
														)}
													</div>
													{i < PHASES.length - 2 && (
														<div
															className="mt-1 w-px"
															style={{
																height: 28,
																backgroundColor: done
																	? "#5b6af0"
																	: "rgba(255,255,255,0.07)",
															}}
														/>
													)}
												</div>
												<div className="pb-5">
													<div
														className="font-medium text-sm transition-colors duration-300"
														style={{
															color: active
																? "#e8edf8"
																: done
																	? "#6b7a9d"
																	: "#3a4a6a",
														}}
													>
														{p.label}
													</div>
													{active && (
														<motion.div
															initial={{ opacity: 0 }}
															animate={{ opacity: 1 }}
															className="mt-0.5 font-mono text-[10px] text-muted-foreground"
														>
															{p.detail}
														</motion.div>
													)}
													{done && (
														<div className="mt-0.5 font-mono text-[10px] text-primary/60">
															Done
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>

								{/* Live data */}
								<div>
									<div className="mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
										Live data
									</div>
									<div className="flex items-center gap-3 mb-4">
										<motion.div
											animate={{ opacity: [1, 0.3, 1] }}
											transition={{
												repeat: Infinity,
												duration: 1.2,
												ease: "easeInOut",
											}}
											className="bg-primary rounded-full w-1.5 h-1.5"
										/>
										<span className="font-medium text-foreground text-sm">
											{current.label}
										</span>
										<span className="font-mono text-[11px] text-muted-foreground">
											{current.detail}
										</span>
									</div>
									<div className="max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-hide">
										<LivePanel phase={current.id} />
									</div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
