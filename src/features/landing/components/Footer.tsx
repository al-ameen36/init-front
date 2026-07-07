import { Terminal } from "lucide-react";

export function Footer() {
	return (
		<footer className="px-8 py-8 border-border border-t">
			<div className="flex justify-between items-center mx-auto max-w-6xl">
				<div className="flex items-center gap-2">
					<div className="flex justify-center items-center bg-primary/20 rounded-md w-6 h-6">
						<Terminal size={11} className="text-primary" />
					</div>
					<span className="font-mono text-muted-foreground text-sm">
						init.dev
					</span>
				</div>
				<div className="font-mono text-muted-foreground/40 text-xs">
					Find your perfect contribution.
				</div>
			</div>
		</footer>
	);
}
