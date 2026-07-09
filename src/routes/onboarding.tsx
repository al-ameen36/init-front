import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Loader2, Terminal } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { LivePanel } from "#/features/onboarding/components/LivePanel";
import type { DevResult, PhaseId } from "#/features/onboarding/types";
import { SERVER_URL, startDeveloperAnalysis } from "#/lib/api";

const DEMO_USER = "yyx990803";

const PHASES: {
	id: PhaseId;
	label: string;
	detail: string;
}[] = [
	{
		id: "profile",
		label: "Building profile",
		detail: "Reading GitHub account",
	},
	{
		id: "repositories",
		label: "Fetching repositories",
		detail: "Reading repositories",
	},
	{
		id: "languages",
		label: "Analyzing languages",
		detail: "Detecting languages",
	},
	{
		id: "technologies",
		label: "Detecting technologies",
		detail: "Scanning dependency manifests",
	},
	{
		id: "pull_requests",
		label: "Reading contribution history",
		detail: "Counting pull requests",
	},
	{ id: "done", label: "Profile ready", detail: "Analysis complete" },
];

const STEPS: PhaseId[] = [
	"profile",
	"repositories",
	"languages",
	"technologies",
	"pull_requests",
];

function ingest(raw: Record<string, unknown>): DevResult {
	const payload = (raw.data as Record<string, unknown>) ?? raw;
	const data = { ...payload } as DevResult;
	if (payload.count != null) data.repositories = payload.count as number;
	if (payload.packages != null) {
		data.technologies = payload.packages as Record<string, number>;
	}
	if (payload.total != null || payload.merged != null) {
		data.pull_requests = {
			total: (payload.total as number) ?? 0,
			merged: (payload.merged as number) ?? 0,
		};
	}
	return data;
}

export const Route = createFileRoute("/onboarding")({
	component: RouteComponent,
});

function RouteComponent() {
	const [phaseIndex, setPhaseIndex] = useState(0);
	const [result, setResult] = useState<DevResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const started = useRef(false);
	const finished = useRef(false);

	useEffect(() => {
		if (started.current) return;
		started.current = true;

		const run = async () => {
			try {
				const { job_id } = await startDeveloperAnalysis(DEMO_USER);
				const es = new EventSource(`${SERVER_URL}/developer/events/${job_id}`);

				for (const step of STEPS) {
					es.addEventListener(step, (e) => {
						const parsed = JSON.parse((e as MessageEvent).data) as Record<
							string,
							unknown
						>;
						const data = ingest(parsed);
						setResult((prev) => ({ ...prev, ...data }));
						setPhaseIndex((i) =>
							Math.max(
								i,
								PHASES.findIndex((p) => p.id === step),
							),
						);
					});
				}

				es.addEventListener("completed", (e) => {
					finished.current = true;
					const parsed = JSON.parse((e as MessageEvent).data) as Record<
						string,
						unknown
					>;
					const payload = (parsed.data as Record<string, unknown>) ?? parsed;
					setResult(payload as DevResult);
					setPhaseIndex(PHASES.findIndex((p) => p.id === "done"));
					es.close();
				});

				es.addEventListener("error", (e) => {
					if (finished.current) return;
					es.close();
					let message = "Analysis failed or connection lost.";
					try {
						const d = JSON.parse((e as MessageEvent).data) as {
							message?: string;
							data?: { message?: string };
						};
						const detail = d.message ?? d.data?.message;
						if (detail) message = detail;
					} catch {}
					setError(message);
				});
			} catch (err) {
				setError(
					err instanceof Error ? err.message : "Failed to start analysis",
				);
			}
		};

		void run();
	}, []);

	const current = PHASES[phaseIndex];
	const isDone = current.id === "done";

	return (
		<div
			className="flex flex-col bg-background min-h-screen text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			{/* Progress bar */}
			<div className="bg-border h-0.5">
				<motion.div
					className="bg-primary h-full"
					animate={{ width: `${(phaseIndex / (PHASES.length - 1)) * 100}%` }}
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
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
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
													<CheckCircle2 size={10} className="text-background" />
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
								{isDone ? "Your profile" : "Live data"}
							</div>
							{error ? (
								<div className="bg-red-500/10 px-4 py-3 border border-red-500/30 rounded-xl text-red-300 text-sm">
									{error}
								</div>
							) : (
								<div className="max-h-[calc(100vh-260px)] overflow-y-auto scrollbar-hide">
									<LivePanel result={result} />
								</div>
							)}
						</div>
					</motion.div>
				</div>
			</div>
		</div>
	);
}
