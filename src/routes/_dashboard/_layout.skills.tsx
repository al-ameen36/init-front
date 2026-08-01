import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
	BarChart3,
	Code2,
	Flame,
	GitPullRequest,
	RefreshCw,
	TrendingUp,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { ReanalyzeModal } from "#/features/dashboard/components/ReanalyzeModal";
import { Topbar } from "#/features/dashboard/components/Topbar";
import { useProfile } from "@/context/ProfileContext";
import { fetchGithubStats } from "@/lib/api";

export const Route = createFileRoute("/_dashboard/_layout/skills")({
	component: RouteComponent,
});

function RouteComponent() {
	const { profile } = useProfile();
	const [reanalyzing, setReanalyzing] = useState(false);

	const username = profile?.username;

	const {
		data: stats,
		isLoading,
		isError,
	} = useQuery({
		queryKey: ["github-stats", username],
		queryFn: () => {
			if (!username) throw new Error("GitHub username is required");
			return fetchGithubStats(username);
		},
		enabled: !!username,
	});

	const activity = stats?.activity ?? [];
	const streak = stats?.streak ?? 0;

	// User's own tech stack (from onboarding), as a label -> usage-count map.
	// Tolerates both the new dict shape and the legacy string[] shape.
	const rawPackages = profile?.tech_stack?.packages;
	const techPackages: Record<string, number> = Array.isArray(rawPackages)
		? Object.fromEntries(rawPackages.map((p) => [p, 1]))
		: (rawPackages ?? {});
	const techEntries = Object.entries(techPackages).sort((a, b) => b[1] - a[1]);
	const maxTech = techEntries.length ? techEntries[0][1] : 1;

	// Fixed cap so the radar stays readable when a user has many packages.
	const RADAR_LIMIT = 8;
	const radarEntries = techEntries.slice(0, RADAR_LIMIT);
	const radarData = radarEntries.map(([name, count]) => ({
		skill: name,
		value: Math.round((count / maxTech) * 100),
	}));

	const subtitle = stats
		? `Derived from ${stats.repos} repositories and ${stats.merged_prs} pull requests`
		: "Connect your account to build a skill profile";

	return (
		<div className="flex flex-col h-full">
			<Topbar title="Skill Profile" subtitle={subtitle}>
				{username && (
					<button
						type="button"
						onClick={() => setReanalyzing(true)}
						disabled={reanalyzing}
						className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 hover:border-white/12 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
					>
						<RefreshCw size={11} />
						Re-analyze
					</button>
				)}
			</Topbar>
			<div className="flex-1 px-7 py-6 overflow-y-auto scrollbar-hide">
				<div className="gap-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] max-w-4xl">
					<div className="bg-card p-6 border border-border rounded-xl">
						<div className="flex items-center gap-2 mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<TrendingUp size={10} />
							Capability radar
						</div>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<RadarChart data={radarData}>
									<PolarGrid stroke="rgba(255,255,255,0.06)" />
									<PolarAngleAxis
										dataKey="skill"
										tick={{
											fill: "#5a6a8a",
											fontSize: 11,
											fontFamily: "JetBrains Mono",
										}}
									/>
									<Radar
										name="Skills"
										dataKey="value"
										stroke="#5b6af0"
										fill="#5b6af0"
										fillOpacity={0.15}
										strokeWidth={1.5}
									/>
									<Tooltip
										contentStyle={{
											background: "#0d1420",
											border: "1px solid rgba(255,255,255,0.08)",
											borderRadius: 8,
											fontSize: 11,
											fontFamily: "JetBrains Mono",
										}}
										labelStyle={{ color: "#e8edf8" }}
										itemStyle={{ color: "#5b6af0" }}
									/>
								</RadarChart>
							</ResponsiveContainer>
						</div>
					</div>

					<div className="flex flex-col max-h-[360px] bg-card p-6 border border-border rounded-xl">
						<div className="flex items-center gap-2 mb-4 font-mono text-[10px] text-muted-foreground uppercase tracking-widest shrink-0">
							<BarChart3 size={10} />
							Tech Stack
						</div>
						<div className="flex-1 min-h-0 space-y-2 overflow-y-auto scrollbar-hide">
							{techEntries.length === 0 ? (
								<p className="font-mono text-[11px] text-muted-foreground">
									{isLoading
										? "Loading…"
										: isError
											? "Couldn't load skills"
											: "No technologies detected"}
								</p>
							) : (
								techEntries.map(([name]) => (
									<div key={name} className="flex items-center py-0.5">
										<span className="font-mono text-[11px] text-foreground/90">
											{name}
										</span>
									</div>
								))
							)}
						</div>
					</div>

					<div className="lg:col-span-2 bg-card p-6 border border-border rounded-xl">
						<div className="flex items-center gap-2 mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<Flame size={10} />
							Contribution activity · last 28 days
						</div>
						<div className="flex items-end gap-1.5 h-16 overflow-hidden">
							{activity.length === 0
								? Array.from({ length: 28 }, (_, i) => `day-${i}`).map(
										(key) => (
											<div
												key={key}
												className="flex-1 rounded-sm min-h-[3px]"
												style={{
													backgroundColor: "rgba(255,255,255,0.05)",
												}}
											/>
										),
									)
								: activity
										.map((val, i) => ({ key: `day-${i}`, val, i }))
										.map(({ key, val, i }) => (
											<motion.div
												key={key}
												initial={{ height: 0 }}
												whileInView={{
													height: `${Math.min((val / 9) * 100, 100)}%`,
												}}
												viewport={{ once: true }}
												transition={{ delay: i * 0.025, duration: 0.5 }}
												className="flex-1 rounded-sm min-h-[3px]"
												style={{
													backgroundColor:
														val === 0
															? "rgba(255,255,255,0.05)"
															: val >= 7
																? "#5b6af0"
																: val >= 4
																	? "#5b6af0aa"
																	: "#5b6af055",
												}}
											/>
										))}
						</div>
						<div className="flex justify-between mt-2">
							<span className="font-mono text-[10px] text-muted-foreground/40">
								28 days ago
							</span>
							<span className="font-mono text-[10px] text-muted-foreground/40">
								today
							</span>
						</div>
					</div>

					<div className="gap-4 grid grid-cols-2 lg:col-span-2">
						{[
							{
								label: "Current streak",
								value: `${streak} days`,
								icon: Flame,
								color: "#f59e0b",
							},
							{
								label: "Total PRs merged",
								value: stats?.merged_prs ?? 0,
								icon: GitPullRequest,
								color: "#34d399",
							},
							{
								label: "Repositories",
								value: stats?.repos ?? 0,
								icon: Code2,
								color: "#5b6af0",
							},
							{
								label: "Match success rate",
								value: "--",
								icon: TrendingUp,
								color: "#22d3ee",
							},
						].map(({ label, value, icon: Icon, color }) => (
							<div
								key={label}
								className="flex items-center gap-4 bg-card p-5 border border-border rounded-xl"
							>
								<div
									className="flex justify-center items-center border border-border rounded-lg w-10 h-10 shrink-0"
									style={{ backgroundColor: `${color}12` }}
								>
									<Icon size={16} style={{ color }} />
								</div>
								<div>
									<div className="font-mono text-[10px] text-muted-foreground">
										{label}
									</div>
									<div className="mt-0.5 font-medium text-foreground text-xl">
										{value}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>

			<AnimatePresence>
				{reanalyzing && username && (
					<ReanalyzeModal
						username={username}
						onClose={() => setReanalyzing(false)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
