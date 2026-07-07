import {
	BarChart3,
	Code2,
	Flame,
	GitPullRequest,
	TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import {
	PolarAngleAxis,
	PolarGrid,
	Radar,
	RadarChart,
	ResponsiveContainer,
	Tooltip,
} from "recharts";
import { SkillBar } from "../../../components/SkillBar";
import { ACTIVITY, SKILL_RADAR, USER } from "../data";
import { Topbar } from "./Topbar";

export function SkillsView() {
	return (
		<div className="flex flex-col h-full">
			<Topbar
				title="Skill Profile"
				subtitle="Derived from 34 repositories and 127 pull requests"
			/>
			<div className="flex-1 px-7 py-6 overflow-y-auto scrollbar-hide">
				<div className="gap-6 grid grid-cols-1 lg:grid-cols-[1fr_300px] max-w-4xl">
					<div className="bg-card p-6 border border-border rounded-xl">
						<div className="flex items-center gap-2 mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<TrendingUp size={10} />
							Capability radar
						</div>
						<div className="h-64">
							<ResponsiveContainer width="100%" height="100%">
								<RadarChart data={SKILL_RADAR}>
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

					<div className="space-y-4 bg-card p-6 border border-border rounded-xl">
						<div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<BarChart3 size={10} />
							Proficiency
						</div>
						{SKILL_RADAR.map((s, i) => (
							<SkillBar
								key={s.skill}
								name={s.skill}
								level={s.value}
								delay={i * 80}
							/>
						))}
					</div>

					<div className="lg:col-span-2 bg-card p-6 border border-border rounded-xl">
						<div className="flex items-center gap-2 mb-5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
							<Flame size={10} />
							Contribution activity · last 28 days
						</div>
						<div className="flex items-end gap-1.5 h-16">
							{ACTIVITY.map((val, i) => (
								<motion.div
									key={val}
									initial={{ height: 0 }}
									whileInView={{ height: `${(val / 9) * 100}%` }}
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
								value: `${USER.streak} days`,
								icon: Flame,
								color: "#f59e0b",
							},
							{
								label: "Total PRs merged",
								value: 114,
								icon: GitPullRequest,
								color: "#34d399",
							},
							{
								label: "Repositories",
								value: USER.repos,
								icon: Code2,
								color: "#5b6af0",
							},
							{
								label: "Match success rate",
								value: "94%",
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
		</div>
	);
}
