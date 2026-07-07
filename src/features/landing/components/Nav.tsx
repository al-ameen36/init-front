import { useNavigate } from "@tanstack/react-router";
import { Github, Terminal } from "lucide-react";
import { useEffect, useState } from "react";

export function Nav() {
	const [scrolled, setScrolled] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const h = () => setScrolled(window.scrollY > 20);
		window.addEventListener("scroll", h);
		return () => window.removeEventListener("scroll", h);
	}, []);

	return (
		<nav
			className="top-0 right-0 left-0 z-50 fixed flex justify-between items-center px-8 py-4 transition-all duration-300"
			style={{
				background: scrolled ? "rgba(7,11,18,0.85)" : "transparent",
				backdropFilter: scrolled ? "blur(12px)" : "none",
				borderBottom: scrolled
					? "1px solid rgba(255,255,255,0.06)"
					: "1px solid transparent",
			}}
		>
			<div className="flex items-center gap-2 w-54">
				<div className="flex justify-center items-center bg-primary rounded-md w-7 h-7">
					<Terminal size={13} className="text-white" />
				</div>
				<span className="font-mono font-medium text-foreground">init</span>
				<span className="font-mono text-[10px] text-muted-foreground">
					.dev
				</span>
			</div>
			<div className="hidden md:flex items-center gap-8">
				{["How it works", "Dashboard", "Repositories"].map((label) => (
					<a
						key={label}
						href="www.google.com"
						className="text-muted-foreground hover:text-foreground text-sm transition-colors"
					>
						{label}
					</a>
				))}
			</div>
			<div className="flex items-center gap-2">
				<button
					type="button"
					onClick={() => navigate({ to: "/signin" })}
					className="px-4 py-2 rounded-md font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
				>
					Sign in
				</button>
				<button
					type="button"
					onClick={() => navigate({ to: "/signup" })}
					className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2 rounded-md font-medium text-primary-foreground text-sm transition-colors"
				>
					<Github size={14} />
					Get started
				</button>
			</div>
		</nav>
	);
}
