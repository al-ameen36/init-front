import { useEffect, useRef, useState } from "react";

export function SkillBar({
	name,
	level,
	delay = 0,
}: {
	name: string;
	level: number;
	delay?: number;
}) {
	const [width, setWidth] = useState(0);
	const ref = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const obs = new IntersectionObserver(
			([e]) => {
				if (e.isIntersecting) setTimeout(() => setWidth(level), delay);
			},
			{ threshold: 0.1 },
		);
		if (ref.current) obs.observe(ref.current);
		return () => obs.disconnect();
	}, [level, delay]);
	const color =
		level >= 80
			? "#5b6af0"
			: level >= 60
				? "#22d3ee"
				: level >= 40
					? "#a78bfa"
					: "#5a6a8a";
	return (
		<div ref={ref} className="space-y-1">
			<div className="flex justify-between">
				<span className="font-mono text-[11px] text-muted-foreground">
					{name}
				</span>
				<span className="font-mono text-[11px]" style={{ color }}>
					{level}
				</span>
			</div>
			<div className="bg-white/5 rounded-full h-0.5 overflow-hidden">
				<div
					className="rounded-full h-full"
					style={{
						width: `${width}%`,
						backgroundColor: color,
						transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
					}}
				/>
			</div>
		</div>
	);
}
