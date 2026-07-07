import {
	CheckCircle2,
	Code2,
	GitCommit,
	GitPullRequest,
	MessageSquare,
	Sparkles,
	Star,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { DEV_MATCHES, DEV_REPOS, DEV_SKILLS } from "../data";
import type { PhaseId } from "../types";
import { AnimatedBar } from "./AnimatedBar";

function useCountUp(target: number, active: boolean, duration = 1200) {
	const [value, setValue] = useState(0);
	const ref = useRef<ReturnType<typeof setInterval> | null>(null);
	useEffect(() => {
		if (!active) return;
		const steps = 40;
		const inc = target / steps;
		let cur = 0;
		ref.current = setInterval(() => {
			cur = Math.min(cur + inc, target);
			setValue(Math.round(cur));
			if (cur >= target && ref.current) clearInterval(ref.current);
		}, duration / steps);
		return () => {
			if (ref.current) clearInterval(ref.current);
		};
	}, [active, target, duration]);
	return value;
}

export function LivePanel({ phase }: { phase: PhaseId }) {
	const after = (...ids: PhaseId[]) => ids.includes(phase) || phase === "done";

	const repoCount = useCountUp(
		34,
		after("repos", "languages", "history", "profile", "matching"),
		1200,
	);
	const prCount = useCountUp(
		127,
		after("history", "profile", "matching"),
		1100,
	);
	const commitCount = useCountUp(
		843,
		after("history", "profile", "matching"),
		1200,
	);
	const issueCount = useCountUp(12840, after("matching"), 1600);

	return (
		<div className="space-y-4">
			{/* Connected account */}
			<motion.div
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center gap-3 bg-card px-4 py-3 border border-border rounded-xl"
			>
				<div className="flex justify-center items-center bg-white/8 border border-border rounded-lg w-8 h-8">
					<svg
						height="18"
						width="18"
						viewBox="0 0 16 16"
						fill="currentColor"
						className="text-foreground"
					>
						<title>Gtihub</title>
						<path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
					</svg>
				</div>
				<div className="flex-1">
					<div className="font-medium text-foreground text-xs">marasolis</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						github.com/marasolis
					</div>
				</div>
				<CheckCircle2 size={14} className="text-emerald-400" />
			</motion.div>

			{/* Repositories */}
			<AnimatePresence>
				{after("repos", "languages", "history", "profile", "matching") && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="bg-card border border-border rounded-xl overflow-hidden"
					>
						<div className="flex items-center gap-2 bg-muted/20 px-4 py-2.5 border-border border-b">
							<Code2 size={11} className="text-muted-foreground" />
							<span className="font-mono text-[10px] text-muted-foreground">
								<span className="font-medium text-foreground">{repoCount}</span>{" "}
								repositories found
							</span>
						</div>
						<div className="divide-y divide-border/50">
							{DEV_REPOS.map((r, i) => (
								<motion.div
									key={r.name}
									initial={{ opacity: 0, x: -4 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.1, duration: 0.25 }}
									className="flex items-center gap-3 px-4 py-2.5"
								>
									<span className="flex-1 font-mono text-foreground/70 text-xs">
										{r.name}
									</span>
									<span
										className="px-1.5 py-0.5 rounded font-mono text-[10px]"
										style={{ color: "#3178c6", background: "#3178c615" }}
									>
										{r.lang}
									</span>
									<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground/50">
										<Star size={9} />
										{r.stars}
									</span>
								</motion.div>
							))}
							<div className="px-4 py-2">
								<span className="font-mono text-[10px] text-muted-foreground/40">
									+ 29 more
								</span>
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Languages */}
			<AnimatePresence>
				{after("languages", "history", "profile", "matching") && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="space-y-2 bg-card p-4 border border-border rounded-xl"
					>
						<div className="mb-3 font-mono text-[10px] text-muted-foreground">
							Detected frameworks
						</div>
						{[
							{ name: "TypeScript", count: "91 files" },
							{ name: "React", count: "28 components" },
							{ name: "Next.js", count: "12 pages" },
							{ name: "Node.js", count: "6 services" },
						].map((l, i) => (
							<motion.div
								key={l.name}
								initial={{ opacity: 0, x: -4 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: i * 0.08 }}
								className="flex items-center gap-2"
							>
								<CheckCircle2 size={11} className="text-emerald-400 shrink-0" />
								<span className="flex-1 font-medium text-foreground text-xs">
									{l.name}
								</span>
								<span className="font-mono text-[10px] text-muted-foreground">
									{l.count}
								</span>
							</motion.div>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* History stats */}
			<AnimatePresence>
				{after("history", "profile", "matching") && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="gap-2 grid grid-cols-3"
					>
						{[
							{
								icon: GitPullRequest,
								label: "Pull requests",
								value: prCount,
								color: "#5b6af0",
							},
							{
								icon: GitCommit,
								label: "Commits",
								value: commitCount,
								color: "#22d3ee",
							},
							{
								icon: MessageSquare,
								label: "Reviews",
								value: 241,
								color: "#a78bfa",
							},
						].map(({ icon: Icon, label, value, color }) => (
							<div
								key={label}
								className="bg-card p-3 border border-border rounded-xl text-center"
							>
								<Icon size={13} style={{ color }} className="mx-auto mb-1.5" />
								<div className="font-medium text-foreground text-base">
									{value.toLocaleString()}
								</div>
								<div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
									{label}
								</div>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Capability profile */}
			<AnimatePresence>
				{after("profile", "matching") && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="space-y-3 bg-card p-4 border border-border rounded-xl"
					>
						<div className="font-mono text-[10px] text-muted-foreground">
							Capability profile
						</div>
						{DEV_SKILLS.map((s, i) => (
							<div key={s.name} className="space-y-1">
								<div className="flex justify-between">
									<span className="font-mono text-[11px] text-muted-foreground">
										{s.name}
									</span>
									<span
										className="font-mono text-[11px]"
										style={{ color: s.level > 50 ? s.color : "#5a6a8a" }}
									>
										{s.level}
									</span>
								</div>
								<AnimatedBar level={s.level} color={s.color} delay={i * 80} />
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>

			{/* Matching */}
			<AnimatePresence>
				{after("matching") && (
					<motion.div
						initial={{ opacity: 0, y: 8 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
						className="bg-card border border-border rounded-xl overflow-hidden"
					>
						<div className="flex items-center gap-2 bg-muted/20 px-4 py-2.5 border-border border-b">
							<Sparkles size={11} className="text-primary" />
							<span className="font-mono text-[10px] text-muted-foreground">
								Scanning{" "}
								<span className="text-foreground">
									{issueCount.toLocaleString()}
								</span>{" "}
								issues…
							</span>
						</div>
						<div className="divide-y divide-border/50">
							{DEV_MATCHES.map((m, i) => (
								<motion.div
									key={m.repo}
									initial={{ opacity: 0, x: -4 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{ delay: i * 0.2 + 0.4 }}
									className="flex items-center gap-3 px-4 py-2.5"
								>
									<div className="flex justify-center items-center bg-primary/10 border border-primary/30 rounded-full w-6 h-6 shrink-0">
										<span className="font-mono text-[9px] text-primary">
											{m.score}
										</span>
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-mono text-[10px] text-muted-foreground">
											{m.repo}
										</div>
										<div className="text-foreground/70 text-xs truncate">
											{m.title}
										</div>
									</div>
								</motion.div>
							))}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
