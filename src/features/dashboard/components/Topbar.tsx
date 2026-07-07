import { Bell } from "lucide-react";

export function Topbar({
	title,
	subtitle,
	children,
}: {
	title: string;
	subtitle?: string;
	children?: React.ReactNode;
}) {
	return (
		<div className="flex items-center gap-4 px-7 py-4 border-border border-b">
			<div className="flex-1">
				<h1 className="font-medium text-foreground text-base">{title}</h1>
				{subtitle && (
					<p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
						{subtitle}
					</p>
				)}
			</div>
			{children}
			<button
				type="button"
				className="relative hover:bg-white/4 p-2 rounded-lg text-muted-foreground hover:text-foreground transition-colors"
			>
				<Bell size={16} />
				<span className="top-1.5 right-1.5 absolute bg-primary rounded-full w-1.5 h-1.5" />
			</button>
		</div>
	);
}
