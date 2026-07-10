import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, CircleDot, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { DevLivePanel } from "@/features/onboarding/components/DevLivePanel";
import type { Phase } from "@/features/onboarding/components/data";
import { useOnboardingAnalysis } from "@/hooks/useOnboardingAnalysis";

const STEP_DWELL_MS = 700;

export function OnboardingView() {
	const navigate = useNavigate();
	const { profile, loading, phaseIndex, error } = useOnboardingAnalysis();

	const [displayPhase, setDisplayPhase] = useState(0);
	useEffect(() => {
		if (displayPhase >= phaseIndex) return;
		const t = setTimeout(
			() => setDisplayPhase(displayPhase + 1),
			STEP_DWELL_MS,
		);
		return () => clearTimeout(t);
	}, [displayPhase, phaseIndex]);

	const progress = (displayPhase / 6) * 100;
	const accentColor = "#5b6af0";

	const panelPhase: Phase =
		displayPhase >= 6
			? "done"
			: displayPhase >= 5
				? "profile"
				: displayPhase >= 4
					? "tools"
					: displayPhase >= 2
						? "languages"
						: displayPhase >= 1
							? "repos"
							: "connecting";

	return (
		<div
			className="flex flex-col bg-background min-h-screen text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			<div className="bg-border h-0.5">
				<motion.div
					className="h-full"
					style={{ backgroundColor: accentColor }}
					animate={{ width: `${progress}%` }}
					transition={{ duration: 0.6, ease: "easeOut" }}
				/>
			</div>

			<div className="flex justify-between items-center px-8 py-4 border-border border-b">
				<div className="flex items-center gap-2.5">
					<div className="flex justify-center items-center bg-primary rounded-md w-7 h-7">
						<CircleDot size={14} className="text-white" />
					</div>
					<span className="font-medium text-foreground text-sm">
						Contributor Compass
					</span>
				</div>
				<div className="font-mono text-[11px] text-muted-foreground">
					{loading ? "Analyzing..." : "Ready"}
				</div>
			</div>

			<div className="flex flex-1 justify-center items-start px-6 py-12 overflow-y-auto scrollbar-hide">
				<div className="w-full max-w-4xl">
					<AnimatePresence mode="wait">
						<motion.div
							key="analyzing"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
							className="gap-8 grid grid-cols-1 lg:grid-cols-[280px_1fr]"
						>
							{/* Left section */}
							<div className="space-y-1">
								<div className="mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									Analysis steps
								</div>
								{[
									{
										id: "connect",
										label: "Connecting to GitHub",
										done: displayPhase >= 1,
										active: displayPhase === 0,
									},
									{
										id: "repos",
										label: "Fetching repositories",
										done: displayPhase >= 2,
										active: displayPhase === 1,
									},
									{
										id: "languages",
										label: "Analyzing languages",
										done: displayPhase >= 3,
										active: displayPhase === 2,
									},
									{
										id: "tools",
										label: "Analyzing tools",
										done: displayPhase >= 4,
										active: displayPhase === 3,
									},
									{
										id: "history",
										label: "Reading contribution history",
										done: displayPhase >= 5,
										active: displayPhase === 4,
									},
									{
										id: "profile",
										label: "Completing profile",
										done: displayPhase >= 6,
										active: displayPhase === 5,
									},
								].map((p) => (
									<div key={p.id} className="flex items-start gap-3 py-2">
										<div
											className="relative flex flex-col items-center shrink-0"
											style={{ marginTop: 2 }}
										>
											<div
												className="flex justify-center items-center border-2 rounded-full w-5 h-5 transition-all duration-500"
												style={{
													borderColor:
														p.done || p.active
															? accentColor
															: "rgba(255,255,255,0.1)",
													backgroundColor: p.done ? accentColor : "transparent",
												}}
											>
												{p.done ? (
													<CheckCircle2 size={11} className="text-background" />
												) : (
													<Loader2
														size={11}
														style={{ color: accentColor }}
														className="animate-spin"
													/>
												)}
											</div>
										</div>
										<div className="pb-4">
											<div
												className="font-medium text-sm transition-colors duration-300"
												style={{
													color: p.active
														? "#e8edf8"
														: p.done
															? "#6b7a9d"
															: "#3a4a6a",
												}}
											>
												{p.label}
											</div>
										</div>
									</div>
								))}
								{displayPhase >= 6 && (
									<div className="pt-4">
										<motion.button
											initial={{ opacity: 0, y: 8 }}
											animate={{ opacity: 1, y: 0 }}
											onClick={() => navigate({ to: "/matches" })}
											className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm transition-all hover:shadow-xl bg-primary hover:bg-primary/90 text-primary-foreground hover:shadow-primary/25"
										>
											Enter dashboard
											<ArrowRight size={14} />
										</motion.button>
									</div>
								)}
							</div>
							{/* Right live panel */}
							<div className="space-y-4">
								<div className="mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									Live data
								</div>
								{error ? (
									<div className="bg-red-500/10 px-4 py-3 border border-red-500/30 rounded-xl text-red-300 text-sm">
										{error}
									</div>
								) : (
									<div className="max-h-[calc(100vh-280px)] overflow-y-auto scrollbar-hide">
										<DevLivePanel
											phase={panelPhase}
											analysis={profile ?? undefined}
										/>
									</div>
								)}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
