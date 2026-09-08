import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { AnalysisSteps } from "@/features/onboarding/components/AnalysisSteps";
import { DevLivePanel } from "@/features/onboarding/components/DevLivePanel";
import type { Phase } from "@/features/onboarding/components/data";
import { useOnboardingAnalysis } from "@/hooks/useOnboardingAnalysis";

const STEP_DWELL_MS = 700;

export function OnboardingView() {
	const navigate = useNavigate();
	const { profile, loading, phaseIndex, error } = useOnboardingAnalysis();
	const { setProfile } = useProfile();

	useEffect(() => {
		if (profile) setProfile(profile);
	}, [profile, setProfile]);

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
			className="flex flex-col bg-background h-screen overflow-hidden text-foreground"
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
					<img src="/logo512.png" alt="init.dev" className="h-7 w-auto" />
				</div>
				<div className="font-mono text-[11px] text-muted-foreground">
					{loading ? "Analyzing..." : "Ready"}
				</div>
			</div>

			<div className="flex flex-1 justify-center items-start min-h-0 px-6 py-12 overflow-y-auto">
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
							<div className="sticky top-0 space-y-1 self-start">
								<div className="mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
									Analysis steps
								</div>
								<AnalysisSteps displayPhase={displayPhase} />
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
									<DevLivePanel
										phase={panelPhase}
										analysis={profile ?? undefined}
									/>
								)}
							</div>
						</motion.div>
					</AnimatePresence>
				</div>
			</div>
		</div>
	);
}
