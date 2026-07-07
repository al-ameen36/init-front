import { useEffect, useState } from "react";

export function MatchRing({
	score,
	size = 44,
}: {
	score: number;
	size?: number;
}) {
	const r = (size - 6) / 2;
	const circ = 2 * Math.PI * r;
	const [animated, setAnimated] = useState(0);
	useEffect(() => {
		const t = setTimeout(() => setAnimated(score), 200);
		return () => clearTimeout(t);
	}, [score]);
	const offset = circ - (animated / 100) * circ;
	const color =
		score >= 90
			? "#5b6af0"
			: score >= 80
				? "#22d3ee"
				: score >= 70
					? "#a78bfa"
					: "#5a6a8a";
	return (
		<div
			className="relative flex justify-center items-center shrink-0"
			style={{ width: size, height: size }}
		>
			<svg
				width={size}
				height={size}
				className="-rotate-90"
				style={{ position: "absolute" }}
			>
				<title>Match Score Ring</title>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					stroke="rgba(255,255,255,0.06)"
					strokeWidth={3}
					fill="none"
				/>
				<circle
					cx={size / 2}
					cy={size / 2}
					r={r}
					stroke={color}
					strokeWidth={3}
					fill="none"
					strokeDasharray={circ}
					strokeDashoffset={offset}
					strokeLinecap="round"
					style={{
						transition: "stroke-dashoffset 0.9s cubic-bezier(0.16,1,0.3,1)",
					}}
				/>
			</svg>
			<span className="font-mono font-medium text-[10px]" style={{ color }}>
				{score}%
			</span>
		</div>
	);
}
