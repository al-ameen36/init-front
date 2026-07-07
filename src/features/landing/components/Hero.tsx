import { useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	CheckCircle2,
	Clock,
	Github,
	Sparkles,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function Hero() {
	const [tick, setTick] = useState(0);
	const navigate = useNavigate();

	const lines = [
		{ text: "Analyzing 14 repositories…", done: true },
		{ text: "Detected TypeScript · React · Next.js", done: true },
		{ text: "Scanning 240 open issues…", done: tick >= 1 },
		{ text: "Matching against capability profile…", done: tick >= 2 },
		{ text: "Found 4 high-probability contributions", done: tick >= 3 },
	];

	useEffect(() => {
		const intervals = [800, 1600, 2400].map((ms, i) =>
			setTimeout(() => setTick(i + 1), ms),
		);
		return () => intervals.forEach(clearTimeout);
	}, []);

	return (
		<section className="relative flex flex-col justify-center items-center px-6 pt-40 pb-16 min-h-screen overflow-hidden">
			<div
				className="absolute inset-0 opacity-[0.03]"
				style={{
					backgroundImage: `linear-gradient(rgba(91,106,240,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,240,0.8) 1px, transparent 1px)`,
					backgroundSize: "60px 60px",
				}}
			/>
			<div
				className="top-1/3 left-1/2 absolute opacity-20 blur-[120px] rounded-full w-150 h-100 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
				style={{
					background: "radial-gradient(ellipse, #5b6af0, transparent 70%)",
				}}
			/>

			<motion.div
				initial={{ opacity: 0, y: 24 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
				className="relative max-w-4xl text-center"
			>
				<div className="inline-flex items-center gap-2 bg-primary/10 mb-8 px-3 py-1.5 border border-primary/30 rounded-full font-mono text-primary text-xs">
					<Sparkles size={11} />
					From zero to contribution
				</div>

				<h1
					className="mb-6 font-normal text-foreground text-5xl md:text-7xl leading-[1.05]"
					style={{ fontFamily: "'DM Serif Display', serif" }}
				>
					Contribute with confidence.
					<br />
					<em className="text-primary">From day one.</em>
				</h1>

				<p className="mx-auto mb-12 max-w-2xl font-light text-muted-foreground text-lg md:text-xl leading-relaxed">
					Choose a GitHub repository. Init finds the right issue, explains the
					code that matters, and gets you contributing faster.
				</p>

				<div className="flex sm:flex-row flex-col justify-center gap-3 mb-20">
					<button
						type="button"
						onClick={() => navigate({ to: "/signup" })}
						className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/25 px-6 py-3 rounded-md font-medium text-primary-foreground transition-all"
					>
						<Github size={16} />
						Get Started with GitHub
						<ArrowRight size={14} />
					</button>
					<button
						type="button"
						onClick={() => navigate({ to: "/dashboard" })}
						className="flex justify-center items-center gap-2 px-6 py-3 border border-border hover:border-white/15 rounded-md font-medium text-foreground/70 hover:text-foreground transition-all"
					>
						View Demo
					</button>
				</div>

				<motion.div
					initial={{ opacity: 0, y: 32 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					className="bg-card shadow-2xl shadow-black/50 mx-auto border border-border rounded-xl max-w-lg overflow-hidden text-left"
				>
					<div className="flex items-center gap-2 bg-muted/30 px-4 py-3 border-border border-b">
						<span className="bg-red-500/60 rounded-full w-2.5 h-2.5" />
						<span className="bg-amber-500/60 rounded-full w-2.5 h-2.5" />
						<span className="bg-emerald-500/60 rounded-full w-2.5 h-2.5" />
						<span className="ml-2 font-mono text-muted-foreground text-xs">
							compass analyze --user marasolis
						</span>
					</div>
					<div className="space-y-2.5 px-4 py-4">
						{lines.map((line, i) => (
							<div key={line.text} className="flex items-center gap-3">
								<span className="shrink-0">
									{line.done ? (
										<CheckCircle2 size={13} className="text-emerald-400" />
									) : (
										<Clock
											size={13}
											className="text-muted-foreground animate-pulse"
										/>
									)}
								</span>
								<span
									className="font-mono text-xs"
									style={{
										color: line.done
											? i === 4
												? "#22d3ee"
												: "#a0aec8"
											: "#3a4a6a",
									}}
								>
									{line.text}
								</span>
							</div>
						))}
					</div>
				</motion.div>
			</motion.div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1, duration: 0.6 }}
				className="relative gap-12 grid grid-cols-3 mt-16 text-center"
			>
				{[
					{ value: "12,840+", label: "Issues analyzed" },
					{ value: "94%", label: "Successful first PRs" },
					{ value: "< 4 days", label: "Avg. time to merge" },
				].map(({ value, label }) => (
					<div key={label}>
						<div className="mb-1 font-medium text-foreground text-2xl">
							{value}
						</div>
						<div className="font-mono text-muted-foreground text-xs">
							{label}
						</div>
					</div>
				))}
			</motion.div>
		</section>
	);
}
