import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "motion/react";

export function DoneScreen({ onEnter }: { onEnter: () => void }) {
	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.97 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
			className="space-y-6 text-center"
		>
			<div className="relative mx-auto w-20 h-20">
				<svg className="absolute inset-0 -rotate-90" width="80" height="80">
					<title>Done Ring</title>
					<circle
						cx="40"
						cy="40"
						r="34"
						stroke="rgba(255,255,255,0.05)"
						strokeWidth="3"
						fill="none"
					/>
					<motion.circle
						cx="40"
						cy="40"
						r="34"
						stroke="#5b6af0"
						strokeWidth="3"
						fill="none"
						strokeDasharray={2 * Math.PI * 34}
						initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
						animate={{ strokeDashoffset: 0 }}
						transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
						strokeLinecap="round"
					/>
				</svg>
				<div className="absolute inset-0 flex justify-center items-center">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{
							type: "spring",
							stiffness: 400,
							damping: 20,
							delay: 0.7,
						}}
					>
						<CheckCircle2 size={28} className="text-primary" />
					</motion.div>
				</div>
			</div>

			<div>
				<motion.h2
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.5, duration: 0.5 }}
					className="mb-2 font-normal text-foreground text-2xl"
					style={{ fontFamily: "'DM Serif Display', serif" }}
				>
					Your profile is ready.
				</motion.h2>
				<motion.p
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.7 }}
					className="text-muted-foreground text-sm"
				>
					We found 8 high-probability matches. Now pick a repo to contribute to.
				</motion.p>
			</div>

			<motion.div
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.9, duration: 0.4 }}
				className="flex justify-center gap-3"
			>
				{[
					{ label: "34 repos", sub: "analyzed" },
					{ label: "8 matches", sub: "found" },
					{ label: "6 skills", sub: "detected" },
				].map(({ label, sub }) => (
					<div
						key={label}
						className="bg-card px-4 py-2.5 border border-border rounded-xl min-w-[90px] text-center"
					>
						<div className="font-medium text-foreground text-sm">{label}</div>
						<div className="font-mono text-[10px] text-muted-foreground">
							{sub}
						</div>
					</div>
				))}
			</motion.div>

			<motion.button
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 1.1, duration: 0.4 }}
				onClick={onEnter}
				className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-primary/25 hover:shadow-xl px-8 py-3.5 rounded-xl font-medium text-primary-foreground text-sm transition-all"
			>
				Go to dashboard
				<ArrowRight size={14} />
			</motion.button>
		</motion.div>
	);
}
