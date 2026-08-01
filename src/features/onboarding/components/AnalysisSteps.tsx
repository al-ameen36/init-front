import { CheckCircle2, Loader2 } from "lucide-react";

const STEPS = [
	{ id: "connect", label: "Connecting to GitHub" },
	{ id: "repos", label: "Fetching repositories" },
	{ id: "languages", label: "Analyzing languages" },
	{ id: "tools", label: "Analyzing tools" },
	{ id: "history", label: "Reading contribution history" },
	{ id: "profile", label: "Completing profile" },
];

export function AnalysisSteps({
	displayPhase,
	accentColor = "#5b6af0",
}: {
	displayPhase: number;
	accentColor?: string;
}) {
	return (
		<div className="space-y-1">
			{STEPS.map((step, i) => {
				const done = displayPhase >= i + 1;
				const active = displayPhase === i;
				return (
					<div key={step.id} className="flex items-start gap-3 py-2">
						<div
							className="relative flex flex-col items-center shrink-0"
							style={{ marginTop: 2 }}
						>
							<div
								className="flex justify-center items-center border-2 rounded-full w-5 h-5 transition-all duration-500"
								style={{
									borderColor:
										done || active ? accentColor : "rgba(255,255,255,0.1)",
									backgroundColor: done ? accentColor : "transparent",
								}}
							>
								{done ? (
									<CheckCircle2 size={11} className="text-background" />
								) : (
									<Loader2
										size={11}
										style={{ color: accentColor }}
										className="animate-spin will-change-transform"
									/>
								)}
							</div>
						</div>
						<div className="pb-4">
							<div
								className="font-medium text-sm transition-colors duration-300"
								style={{
									color: active ? "#e8edf8" : done ? "#6b7a9d" : "#3a4a6a",
								}}
							>
								{step.label}
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
}
