import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowLeft,
	GitCommit,
	Github,
	GitPullRequest,
	Lock,
	ShieldCheck,
	Star,
	Terminal,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const PERMISSIONS = [
	{
		icon: GitPullRequest,
		label: "Read pull requests and issues",
		detail: "To find matching opportunities",
	},
	{
		icon: Star,
		label: "Read repository metadata",
		detail: "Languages, stars, activity",
	},
	{
		icon: GitCommit,
		label: "Read contribution history",
		detail: "Commits, reviews, comments",
	},
];

export const Route = createFileRoute("/signup")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = useNavigate();
	const { signInWithGitHub, loading } = useAuth();
	const [authLoading, setAuthLoading] = useState(false);
	const [authError, setAuthError] = useState<string | null>(null);

	const handleConnect = async () => {
		setAuthLoading(true);
		setAuthError(null);
		try {
			await signInWithGitHub();
		} catch (error) {
			const msg =
				error instanceof Error ? error.message : "GitHub sign-in failed";
			console.error("GitHub auth failed:", error);
			setAuthError(msg);
			setAuthLoading(false);
		}
	};

	return (
		<div
			className="flex bg-background min-h-screen text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			{/* Left panel */}
			<div className="hidden relative lg:flex flex-col bg-card border-border border-r w-[460px] overflow-hidden shrink-0">
				<div
					className="absolute inset-0 opacity-[0.035]"
					style={{
						backgroundImage: `linear-gradient(rgba(91,106,240,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(91,106,240,0.9) 1px, transparent 1px)`,
						backgroundSize: "48px 48px",
					}}
				/>
				<div
					className="bottom-0 left-0 absolute w-full h-[360px] pointer-events-none"
					style={{
						background:
							"radial-gradient(ellipse at 30% 100%, rgba(91,106,240,0.18), transparent 65%)",
					}}
				/>

				<div className="relative flex flex-col flex-1 px-12 py-10">
					<div className="flex items-center gap-2.5 mb-16">
						<div className="flex justify-center items-center bg-primary rounded-md w-8 h-8">
							<Terminal size={14} className="text-white" />
						</div>
						<span className="font-mono font-medium text-foreground tracking-tight">
							init
						</span>
						<span className="font-mono text-[10px] text-muted-foreground">
							.dev
						</span>
					</div>

					<div className="flex flex-col flex-1 justify-center">
						<h1
							className="mb-6 font-normal text-foreground text-4xl leading-[1.1]"
							style={{ fontFamily: "'DM Serif Display', serif" }}
						>
							Your first merged PR
							<br />
							<em className="text-primary">starts here.</em>
						</h1>
						<p className="mb-12 max-w-xs text-muted-foreground text-sm leading-relaxed">
							Connect GitHub, pick a repo you want to contribute to, and init
							finds the open issues you're most likely to close.
						</p>

						<div className="space-y-4">
							{[
								{
									value: "94%",
									label: "of matched issues result in a merged PR",
								},
								{
									value: "< 4 days",
									label: "average time from first commit to merge",
								},
								{
									value: "12,840+",
									label: "issues analyzed across the ecosystem",
								},
							].map(({ value, label }) => (
								<div key={label} className="flex items-baseline gap-3">
									<span className="w-20 font-mono font-medium text-primary text-sm shrink-0">
										{value}
									</span>
									<span className="text-muted-foreground text-xs">{label}</span>
								</div>
							))}
						</div>
					</div>

					<div className="pt-8 border-border border-t">
						<p className="mb-3 text-foreground/60 text-sm italic leading-relaxed">
							"I'd been wanting to contribute to open source for two years. init
							got my first PR merged in five days."
						</p>
						<div className="flex items-center gap-2.5">
							<img
								src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&auto=format"
								alt="Daniel Kho"
								className="border border-border rounded-full w-7 h-7 object-cover"
							/>
							<div>
								<div className="font-medium text-foreground text-xs">
									Daniel Kho
								</div>
								<div className="font-mono text-[10px] text-muted-foreground">
									@danielkho · 3 PRs merged
								</div>
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
					{/* Mobile logo */}
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
						Create your account
					</h2>
					<p className="mb-8 text-muted-foreground text-sm">
						GitHub is the only sign-up method.{" "}
						<button
							type="button"
							onClick={() => navigate({ to: "/signin" })}
							className="text-primary hover:underline"
						>
							Already have an account?
						</button>
					</p>

					<button
						type="button"
						onClick={handleConnect}
						disabled={authLoading || loading}
						className="flex justify-center items-center gap-3 bg-foreground hover:bg-foreground/90 disabled:opacity-70 py-3.5 rounded-xl w-full font-medium text-background text-sm transition-all"
					>
						{authLoading || loading ? (
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
								Connecting to GitHub&hellip;
							</>
						) : (
							<>
								<Github size={17} />
								Continue with GitHub
							</>
						)}
					</button>
					{authError && (
						<p className="mt-2 text-[13px] text-red-400 text-center">
							{authError}
						</p>
					)}

					<div className="mt-8 border border-border rounded-xl overflow-hidden">
						<div className="flex items-center gap-2 bg-muted/20 px-4 py-3 border-border border-b">
							<Lock size={11} className="text-muted-foreground" />
							<span className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
								Permissions requested
							</span>
						</div>
						<div className="divide-y divide-border">
							{PERMISSIONS.map(({ icon: Icon, label, detail }) => (
								<div
									key={label}
									className="flex items-center gap-3.5 px-4 py-3"
								>
									<div className="flex justify-center items-center bg-primary/10 border border-primary/15 rounded-lg w-7 h-7 shrink-0">
										<Icon size={13} className="text-primary" />
									</div>
									<div>
										<div className="font-medium text-foreground text-xs">
											{label}
										</div>
										<div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
											{detail}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className="flex items-start gap-2.5 mt-4">
						<ShieldCheck
							size={13}
							className="mt-0.5 text-emerald-400 shrink-0"
						/>
						<p className="font-mono text-[11px] text-muted-foreground leading-relaxed">
							Read-only access only. We never write to your repositories or post
							comments on your behalf.
						</p>
					</div>

					<p className="mt-8 text-[11px] text-muted-foreground/50 text-center">
						By continuing you agree to our{" "}
						<a
							href="https://google.com/terms"
							className="hover:text-muted-foreground underline transition-colors"
						>
							Terms
						</a>{" "}
						and{" "}
						<a
							href="https://google.com/privacy"
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
