import { useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, RefreshCw, X } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useProfile } from "@/context/ProfileContext";
import { AnalysisSteps } from "@/features/onboarding/components/AnalysisSteps";
import { DevLivePanel } from "@/features/onboarding/components/DevLivePanel";
import type { Phase } from "@/features/onboarding/components/data";
import { useDeveloperAnalysis } from "@/hooks/useDeveloperAnalysis";

const STEP_DWELL_MS = 700;
const ACCENT = "#5b6af0";

export function ReanalyzeModal({
	username,
	onClose,
}: {
	username: string;
	onClose: () => void;
}) {
	const { setProfile } = useProfile();
	const queryClient = useQueryClient();
	const { profile, loading, phaseIndex, error } = useDeveloperAnalysis(
		username,
		0,
	);
	const done = !loading && !error;

	const [displayPhase, setDisplayPhase] = useState(0);
	useEffect(() => {
		if (displayPhase >= phaseIndex) return;
		const t = setTimeout(
			() => setDisplayPhase(displayPhase + 1),
			STEP_DWELL_MS,
		);
		return () => clearTimeout(t);
	}, [displayPhase, phaseIndex]);

	// Commit the fresh profile and refresh GitHub stats once analysis completes.
	const committed = useRef(false);
	useEffect(() => {
		if (done && profile && !committed.current) {
			committed.current = true;
			setProfile(profile);
			void queryClient.invalidateQueries({
				queryKey: ["github-stats", username],
			});
		}
	}, [done, profile, username, setProfile, queryClient]);

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

	const progress = (displayPhase / 6) * 100;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="z-50 fixed inset-0 flex justify-center items-center p-4"
			style={{ background: "rgba(7,11,18,0.8)", backdropFilter: "blur(8px)" }}
			onClick={onClose}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.96, y: 12 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.96, y: 12 }}
				transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
				onClick={(e) => e.stopPropagation()}
				className="bg-card shadow-2xl shadow-black/60 border border-border rounded-2xl w-full max-w-3xl overflow-hidden"
			>
				<div className="bg-border h-0.5">
					<motion.div
						className="h-full"
						style={{ backgroundColor: ACCENT }}
						animate={{ width: `${progress}%` }}
						transition={{ duration: 0.6, ease: "easeOut" }}
					/>
				</div>

				<div className="flex items-center justify-between px-6 py-4 border-border border-b">
					<div className="flex items-center gap-2.5">
						<RefreshCw
							size={13}
							className={`text-primary ${loading ? "animate-spin will-change-transform" : ""}`}
						/>
						<span className="font-medium text-foreground text-sm">
							Re-analyzing GitHub profile
						</span>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1.5 text-muted-foreground/40 hover:text-foreground transition-colors"
						aria-label="Close"
					>
						<X size={14} />
					</button>
				</div>

				<div className="gap-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
					<div>
						<div className="mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							Analysis steps
						</div>
						<AnalysisSteps displayPhase={displayPhase} />
					</div>
					<div className="space-y-4">
						<div className="mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
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
				</div>

				{done && (
					<div className="flex justify-end px-6 pb-6">
						<button
							type="button"
							onClick={onClose}
							className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg font-medium text-primary-foreground text-sm transition-colors"
						>
							<CheckCircle2 size={13} />
							Done
						</button>
					</div>
				)}
			</motion.div>
		</motion.div>
	);
}
