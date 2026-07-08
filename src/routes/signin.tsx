import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	CheckCircle2,
	Github,
	GitPullRequest,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const RECENT = [
	{ repo: "vercel/swr", action: "Issue matched", score: 96, timeAgo: "2h ago" },
	{
		repo: "shadcn-ui/ui",
		action: "Bookmark added",
		score: 91,
		timeAgo: "1d ago",
	},
	{
		repo: "radix-ui/primitives",
		action: "PR opened",
		score: null,
		timeAgo: "3d ago",
	},
];

export const Route = createFileRoute("/signin")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	const handleConnect = () => {
		setLoading(true);
		setTimeout(() => navigate({ to: "/matches" }), 1200);
	};

	return (
		<div
			className="flex bg-background min-h-screen text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			{/* Left panel */}
			<div className="hidden relative lg:flex flex-col bg-card border-border border-r w-[440px] overflow-hidden shrink-0">
				<div
					className="absolute inset-0 opacity-[0.035]"
					style={{
						backgroundImage: `linear-gradient(rgba(91,106,240,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,240,0.9) 1px, transparent 1px)`,
						backgroundSize: "48px 48px",
					}}
				/>
				<div
					className="top-0 right-0 absolute w-full h-[360px] pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse at 80% 0%, rgba(91,106,240,0.15), transparent 65%)",
					}}
				/>

				<div className="relative flex flex-col flex-1 px-10 py-10">
					<div className="flex items-center gap-2.5 mb-16">
						<div className="flex justify-center items-center bg-primary rounded-md w-8 h-8">
							<Terminal size={14} className="text-white" />
						</div>
						<span className="font-mono font-medium text-foreground">init</span>
						<span className="font-mono text-[10px] text-muted-foreground">
							.dev
						</span>
					</div>

					<div className="flex flex-col flex-1 justify-center">
						<h1
							className="mb-6 font-normal text-foreground text-4xl leading-[1.1]"
							style={{ fontFamily: "'DM Serif Display', serif" }}
						>
							Welcome
							<br />
							<em className="text-primary">back.</em>
						</h1>
						<p className="mb-10 max-w-xs text-muted-foreground text-sm leading-relaxed">
							Sign in to see your latest matches, check active pull requests,
							and keep your streak going.
						</p>

						<div className="space-y-1">
							<div className="mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
								Recent activity
							</div>
							{RECENT.map(({ repo, action, score, timeAgo }, i) => (
								<motion.div
									key={repo}
									initial={{ opacity: 0, x: -8 }}
									animate={{ opacity: 1, x: 0 }}
									transition={{
										delay: 0.15 + i * 0.08,
										duration: 0.4,
										ease: [0.16, 1, 0.3, 1],
									}}
									className="flex items-center gap-3 py-2.5 border-border/40 border-b"
								>
									<div className="flex justify-center items-center bg-muted/40 border border-border rounded-md w-6 h-6 shrink-0">
										{score ? (
											<span className="font-mono text-[9px] text-primary">
												{score}
											</span>
										) : (
											<GitPullRequest size={10} className="text-emerald-400" />
										)}
									</div>
									<div className="flex-1 min-w-0">
										<div className="font-mono text-[10px] text-muted-foreground">
											{repo}
										</div>
										<div className="text-foreground/70 text-xs">{action}</div>
									</div>
									<span className="font-mono text-[10px] text-muted-foreground/40 shrink-0">
										{timeAgo}
									</span>
								</motion.div>
							))}
						</div>
					</div>

					<div className="flex items-center gap-3 bg-muted/10 px-4 py-3.5 border border-border rounded-xl">
						<div className="flex justify-center items-center bg-amber-400/10 border border-amber-400/20 rounded-lg w-9 h-9 shrink-0">
							<span className="text-sm">🔥</span>
						</div>
						<div>
							<div className="font-medium text-foreground text-xs">
								12-day streak
							</div>
							<div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
								Sign in to keep it going
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Right panel */}
			<div className="relative flex flex-1 justify-center items-center px-6 py-12">
				<button
					type="button"
					onClick={() => navigate({ to: "/" })}
					className="top-6 left-6 absolute flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-sm transition-colors"
				>
					<ArrowLeft size={14} />
					Back
				</button>

				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
					className="w-full max-w-sm"
				>
					<div className="lg:hidden flex items-center gap-2 mb-10">
						<div className="flex justify-center items-center bg-primary rounded-md w-7 h-7">
							<Terminal size={13} className="text-white" />
						</div>
						<span className="font-mono font-medium text-foreground">init</span>
						<span className="font-mono text-[10px] text-muted-foreground">
							.dev
						</span>
					</div>

					<h2
						className="mb-2 font-normal text-foreground text-2xl"
						style={{ fontFamily: "'DM Serif Display', serif" }}
					>
						Sign in
					</h2>
					<p className="mb-8 text-muted-foreground text-sm">
						Use your GitHub account to continue.{" "}
						<button
							type="button"
							onClick={() => navigate({ to: "/signup" })}
							className="text-primary hover:underline"
						>
							New here?
						</button>
					</p>

					<button
						type="button"
						onClick={handleConnect}
						disabled={loading}
						className="flex justify-center items-center gap-3 bg-foreground hover:bg-foreground/90 disabled:opacity-70 py-3.5 rounded-xl w-full font-medium text-background text-sm transition-all"
					>
						{loading ? (
							<>
								<motion.div
									animate={{ rotate: 360 }}
									transition={{
										repeat: Infinity,
										duration: 0.8,
										ease: "linear",
									}}
									className="border-2 border-background/30 border-t-background rounded-full w-4 h-4"
								/>
								Connecting…
							</>
						) : (
							<>
								<Github size={17} />
								Continue with GitHub
							</>
						)}
					</button>

					<div className="flex items-center gap-3 my-8">
						<div className="flex-1 bg-border h-px" />
						<span className="font-mono text-[10px] text-muted-foreground">
							no password required
						</span>
						<div className="flex-1 bg-border h-px" />
					</div>

					<div className="space-y-3">
						<div className="mb-3 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							Why GitHub only?
						</div>
						{[
							"Your contribution history lives on GitHub — we read it directly to build your profile.",
							"No password to remember or rotate. GitHub handles authentication.",
							"We never store credentials. Auth is delegated entirely to GitHub OAuth.",
						].map((line) => (
							<div key={line} className="flex items-start gap-2.5">
								<CheckCircle2
									size={13}
									className="mt-0.5 text-emerald-400 shrink-0"
								/>
								<p className="text-muted-foreground text-xs leading-relaxed">
									{line}
								</p>
							</div>
						))}
					</div>

					<p className="mt-10 text-[11px] text-muted-foreground/50 text-center">
						By continuing you agree to our{" "}
						<a
							href="www.google.com/terms"
							className="hover:text-muted-foreground underline transition-colors"
						>
							Terms
						</a>{" "}
						and{" "}
						<a
							href="www.google.com/privacy"
							className="hover:text-muted-foreground underline transition-colors"
						>
							Privacy Policy
						</a>
						.
					</p>
				</motion.div>
			</div>
		</div>
	);
}
