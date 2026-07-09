import {
	CheckCircle2,
	Code2,
	GitPullRequest,
	Star,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { DevResult } from "../types";
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

export function LivePanel({ result }: { result: DevResult | null }) {
	const repoCount = useCountUp(
		result?.repositories ?? 0,
		result?.repositories != null,
	);
	const mergedCount = useCountUp(
		result?.pull_requests?.merged ?? 0,
		result?.pull_requests != null,
	);

	const techEntries = Object.entries(result?.technologies ?? {}).sort(
		(a, b) => b[1] - a[1],
	);
	const maxTech = techEntries[0]?.[1] || 1;
	const topTech = techEntries.slice(0, 6);

	return (
		<div className="space-y-4">
			{/* Connected account */}
			<motion.div
				initial={{ opacity: 0, y: 6 }}
				animate={{ opacity: 1, y: 0 }}
				className="flex items-center gap-3 bg-card px-4 py-3 border border-border rounded-xl"
			>
				{result?.avatar_url ? (
					<img
						src={result.avatar_url}
						alt={result.name}
						className="border border-border rounded-lg w-8 h-8 object-cover"
					/>
				) : (
					<div className="flex justify-center items-center bg-white/8 border border-border rounded-lg w-8 h-8">
						<Terminal size={14} className="text-foreground" />
					</div>
				)}
				<div className="flex-1">
					<div className="font-medium text-foreground text-xs">
						{result?.name ?? result?.username ?? "Connecting to GitHub…"}
					</div>
					{result?.username && (
						<div className="font-mono text-[10px] text-muted-foreground">
							github.com/{result.username}
						</div>
					)}
				</div>
				{result?.username && (
					<CheckCircle2 size={14} className="text-emerald-400" />
				)}
			</motion.div>

			{/* Repositories */}
			{result?.repositories != null && (
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
					{result.languages?.length ? (
						<div className="flex flex-wrap gap-1.5 p-4">
							{result.languages.map((lang) => (
								<span
									key={lang}
									className="px-1.5 py-0.5 rounded font-mono text-[10px] text-foreground/70"
									style={{ background: "rgba(255,255,255,0.05)" }}
								>
									{lang}
								</span>
							))}
						</div>
					) : (
						<div className="px-4 py-2 font-mono text-[10px] text-muted-foreground/40">
							no language data
						</div>
					)}
				</motion.div>
			)}

			{/* Technologies */}
			{topTech.length > 0 && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="space-y-2 bg-card p-4 border border-border rounded-xl"
				>
					<div className="mb-3 font-mono text-[10px] text-muted-foreground">
						Detected technologies
					</div>
					{topTech.map(([name, count], i) => (
						<div key={name} className="space-y-1">
							<div className="flex justify-between">
								<span className="font-mono text-[11px] text-muted-foreground">
									{name}
								</span>
								<span
									className="font-mono text-[11px]"
									style={{ color: "#5b6af0" }}
								>
									{count}
								</span>
							</div>
							<AnimatedBar
								level={Math.round((count / maxTech) * 100)}
								color="#5b6af0"
								delay={i * 80}
							/>
						</div>
					))}
				</motion.div>
			)}

			{/* Contribution history */}
			{result?.pull_requests && (
				<motion.div
					initial={{ opacity: 0, y: 8 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
					className="gap-2 grid grid-cols-2"
				>
					<div className="bg-card p-3 border border-border rounded-xl text-center">
						<GitPullRequest
							size={13}
							style={{ color: "#5b6af0" }}
							className="mx-auto mb-1.5"
						/>
						<div className="font-medium text-foreground text-base">
							{(result.pull_requests.total ?? 0).toLocaleString()}
						</div>
						<div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
							Pull requests
						</div>
					</div>
					<div className="bg-card p-3 border border-border rounded-xl text-center">
						<Star
							size={13}
							style={{ color: "#34d399" }}
							className="mx-auto mb-1.5"
						/>
						<div className="font-medium text-foreground text-base">
							{mergedCount.toLocaleString()}
						</div>
						<div className="mt-0.5 font-mono text-[9px] text-muted-foreground">
							Merged
						</div>
					</div>
				</motion.div>
			)}
		</div>
	);
}
