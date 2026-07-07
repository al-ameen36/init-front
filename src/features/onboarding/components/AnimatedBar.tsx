import { useEffect, useState } from "react";

export function AnimatedBar({
	level,
	color,
	delay = 0,
}: {
	level: number;
	color: string;
	delay?: number;
}) {
	const [width, setWidth] = useState(0);
	useEffect(() => {
		const t = setTimeout(() => setWidth(level), delay + 200);
		return () => clearTimeout(t);
	}, [level, delay]);
	return (
		<div className="bg-white/5 rounded-full h-1 overflow-hidden">
			<div
				className="rounded-full h-full"
				style={{
					width: `${width}%`,
					backgroundColor: color,
					transition: `width 0.8s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
				}}
			/>
		</div>
	);
}
