export function DifficultyBadge({ level }: { level: string }) {
	const colors: Record<string, string> = {
		Low: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
		Medium: "text-amber-400 bg-amber-400/10 border-amber-400/20",
		High: "text-red-400 bg-red-400/10 border-red-400/20",
	};
	return (
		<span
			className={`font-mono text-[10px] tracking-widest uppercase border px-2 py-0.5 rounded-sm ${colors[level] ?? ""}`}
		>
			{level}
		</span>
	);
}
