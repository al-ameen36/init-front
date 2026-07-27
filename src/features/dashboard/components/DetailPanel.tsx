import {
	AlertCircle,
	ArrowRight,
	Check,
	Circle,
	Clipboard,
	ClipboardCheck,
	Code2,
	ExternalLink,
	FileCode,
	ListChecks,
	RefreshCw,
	Wrench,
	X,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import type { DeveloperProfile } from "@/features/onboarding/components/data";
import { hasSkill } from "@/lib/skills";
import { MatchRing } from "../../../components/MatchRing";
import type { AnalyzeIssueResponse, Issue } from "../types";

export function DetailPanel({
	issue,
	basicIssue,
	isAnalyzing,
	onClose,
	onRetry,
	profile,
}: {
	issue: AnalyzeIssueResponse | null;
	basicIssue: Issue | null;
	isAnalyzing: boolean;
	onClose: () => void;
	onRetry?: () => void;
	profile: DeveloperProfile;
}) {
	const isError = basicIssue?.analysisStatus === "error";
	const repo = issue?.repo ?? basicIssue?.repo ?? "unknown";
	const title = issue?.title ?? basicIssue?.title ?? "Loading…";
	const language = issue?.language ?? "Unknown";
	const matchScore = issue?.matchScore;
	const difficulty = issue?.guide?.difficulty;
	const comments = issue?.guide?.comments ?? 0;
	const opened = issue?.guide?.opened ?? "—";
	const summary = isError
		? "—"
		: (issue?.guide?.summary ?? "Analysis in progress…");
	const relevantFiles = issue?.guide?.relevant_files ?? [];
	const investigationPath = issue?.guide?.investigation_path ?? [];
	const requiredSkills = issue?.guide?.required_skills ?? [];
	const issueUrl = basicIssue?.url ?? null;
	const [copied, setCopied] = useState(false);

	const fileUrl = (file: string) =>
		`https://github.com/${repo}/blob/HEAD/${file}`;

	const buildCopyText = () => {
		const lines: string[] = [];
		lines.push(`${repo}`);
		lines.push(`${title}`);
		lines.push("");
		if (matchScore !== undefined) lines.push(`Match Score: ${matchScore}`);
		lines.push("");
		if (difficulty) lines.push(`Difficulty: ${difficulty}`);
		lines.push(`Comments: ${comments}`);
		lines.push(`Opened: ${opened}`);
		lines.push("");
		lines.push("Summary");
		lines.push(summary || "—");
		lines.push("");
		lines.push("Skills needed");
		lines.push(requiredSkills.length > 0 ? requiredSkills.join(", ") : "—");
		lines.push("");
		lines.push("Relevant files");
		if (relevantFiles.length > 0) {
			for (const file of relevantFiles) lines.push(`- ${file}`);
		} else {
			lines.push("—");
		}
		lines.push("");
		lines.push("Investigation path");
		if (investigationPath.length > 0) {
			for (let i = 0; i < investigationPath.length; i++)
				lines.push(`${i + 1}. ${investigationPath[i]}`);
		} else {
			lines.push("—");
		}
		lines.push("");
		if (issueUrl) lines.push(`GitHub: ${issueUrl}`);
		return lines.join("\n");
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(buildCopyText());
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch {
			// silent fail
		}
	};

	return (
		<motion.div
			key={basicIssue?.number ?? "loading"}
			initial={{ x: 20 }}
			animate={{ x: 0 }}
			exit={{ x: 20 }}
			transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
			className="relative flex flex-col h-full overflow-hidden"
		>
			<div className="relative z-30 flex items-start gap-3 px-6 py-4 border-border border-b">
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1 font-mono text-[10px] text-muted-foreground">
						<a
							href={`https://github.com/${repo}`}
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-foreground transition-colors"
						>
							{repo}
						</a>
						<span className="px-1.5 py-0.5 border border-border/50 rounded text-[9px]">
							{language}
						</span>
					</div>
					<h2 className="font-medium text-foreground text-sm leading-snug">
						{title}
					</h2>
				</div>
				<button
					type="button"
					onClick={handleCopy}
					className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
					title="Copy content"
				>
					{copied ? (
						<ClipboardCheck size={15} className="text-emerald-400" />
					) : (
						<Clipboard size={15} />
					)}
				</button>
				<button
					type="button"
					onClick={onClose}
					className="hover:bg-white/5 p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors shrink-0"
				>
					<X size={15} />
				</button>
			</div>

			<div className="flex-1 space-y-6 px-6 py-5 overflow-y-auto scrollbar-hide">
				<div className="flex items-center gap-3 mb-4">
					<MatchRing score={matchScore} size={52} />
					<div>
						<div className="font-medium text-foreground text-sm">
							Match Score
						</div>
						<div className="mt-0.5 font-mono text-[10px] text-muted-foreground">
							{isAnalyzing
								? "Analyzing…"
								: matchScore !== undefined && matchScore >= 90
									? "Excellent fit"
									: matchScore !== undefined && matchScore >= 80
										? "Strong fit"
										: matchScore !== undefined && matchScore > 0
											? "Good fit"
											: "—"}
						</div>
					</div>
				</div>

				<div className="gap-2 grid grid-cols-3">
					{[
						{
							label: "Difficulty",
							value: isAnalyzing ? "—" : (difficulty ?? "—"),
							color: isAnalyzing
								? "#a0aec8"
								: difficulty === "Low"
									? "#34d399"
									: difficulty === "Medium"
										? "#fbbf24"
										: difficulty === "High"
											? "#f87171"
											: "#a0aec8",
						},
						{
							label: "Comments",
							value: `${comments}`,
							color: "#a0aec8",
						},
						{
							label: "Opened",
							value: opened,
							color: "#a0aec8",
						},
					].map(({ label, value, color }) => (
						<div
							key={label}
							className="bg-muted/30 p-3 border border-border rounded-lg text-center"
						>
							<div className="mb-1 font-mono text-[10px] text-muted-foreground">
								{label}
							</div>
							<div className="font-medium text-sm" style={{ color }}>
								{value}
							</div>
						</div>
					))}
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<Zap size={9} />
						Summary
					</div>
					<p className="text-foreground/75 text-xs leading-relaxed">
						{summary}
					</p>
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<Wrench size={9} />
						Skills needed
					</div>
					{requiredSkills.length > 0 ? (
						<div className="flex flex-wrap gap-1.5">
							{requiredSkills.map((skill) => {
								const have = hasSkill(skill, profile);
								return (
									<div
										key={skill}
										className={`flex items-center gap-1.5 px-2 py-1 rounded-md border text-[11px] ${
											have
												? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
												: "border-border bg-muted/20 text-muted-foreground"
										}`}
									>
										{have ? (
											<Check size={11} className="text-emerald-400 shrink-0" />
										) : (
											<Circle
												size={11}
												className="text-muted-foreground/50 shrink-0"
											/>
										)}
										{skill}
									</div>
								);
							})}
						</div>
					) : isAnalyzing ? (
						<div className="text-muted-foreground text-xs">Loading…</div>
					) : isError ? (
						<div className="text-muted-foreground text-xs">—</div>
					) : (
						<div className="text-muted-foreground text-xs">
							No skills identified
						</div>
					)}
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<FileCode size={9} />
						Relevant files
					</div>
					<div className="space-y-1.5">
						{relevantFiles.length > 0 ? (
							relevantFiles.map((file) => (
								<a
									key={file}
									href={fileUrl(file)}
									target="_blank"
									rel="noopener noreferrer"
									className="group flex items-center gap-2.5 bg-muted/20 px-3 py-2 border border-border/60 hover:border-white/12 rounded-md transition-colors cursor-pointer"
								>
									<Code2 size={11} className="text-muted-foreground shrink-0" />
									<span className="flex-1 font-mono text-[11px] text-foreground/65 group-hover:text-foreground truncate transition-colors">
										{file}
									</span>
									<ExternalLink
										size={9}
										className="text-muted-foreground/30 group-hover:text-muted-foreground transition-colors shrink-0"
									/>
								</a>
							))
						) : isAnalyzing ? (
							<div className="text-muted-foreground text-xs">Loading…</div>
						) : isError ? (
							<div className="text-muted-foreground text-xs">—</div>
						) : (
							<div className="text-muted-foreground text-xs">
								No files identified
							</div>
						)}
					</div>
				</div>

				<div>
					<div className="flex items-center gap-1.5 mb-2.5 font-mono text-[10px] text-muted-foreground uppercase tracking-widest">
						<ListChecks size={9} />
						Investigation path
					</div>
					<div className="space-y-2.5">
						{investigationPath.length > 0 ? (
							investigationPath.map((step, i) => (
								<div key={step} className="flex gap-3">
									<div className="flex justify-center items-center bg-muted/40 mt-0.5 border border-border rounded-full w-4 h-4 shrink-0">
										<span className="font-mono text-[8px] text-muted-foreground">
											{i + 1}
										</span>
									</div>
									<p className="text-foreground/70 text-xs leading-relaxed">
										{step}
									</p>
								</div>
							))
						) : isAnalyzing ? (
							<div className="text-muted-foreground text-xs">
								Generating investigation path…
							</div>
						) : isError ? (
							<div className="text-muted-foreground text-xs">—</div>
						) : (
							<div className="text-muted-foreground text-xs">
								No investigation path available
							</div>
						)}
					</div>
				</div>
			</div>

			<div className="space-y-2 px-6 py-4 border-border border-t">
				<a
					href={issueUrl ?? undefined}
					target="_blank"
					rel="noopener noreferrer"
					className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 py-2.5 rounded-lg w-full font-medium text-primary-foreground text-sm transition-all"
				>
					Open on GitHub <ArrowRight size={13} />
				</a>
			</div>

			{isError && (
				<div className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-background/80 backdrop-blur-sm px-6">
					<div className="text-center space-y-4 max-w-sm">
						<AlertCircle
							size={48}
							className="text-destructive/60 mx-auto shrink-0"
						/>
						<div className="space-y-1">
							<h3 className="font-medium text-foreground text-base">
								Analysis failed
							</h3>
							<p className="text-muted-foreground text-sm">
								Unable to analyze this issue. The repository might be private,
								rate limited, or temporarily unavailable.
							</p>
						</div>
						{onRetry && (
							<button
								type="button"
								onClick={onRetry}
								className="flex items-center gap-2 mx-auto bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-lg font-medium text-sm transition-colors"
							>
								<RefreshCw size={14} />
								Retry analysis
							</button>
						)}
						<a
							href={issueUrl ?? undefined}
							target="_blank"
							rel="noopener noreferrer"
							className="flex justify-center items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 py-2.5 rounded-lg w-full font-medium text-primary-foreground text-sm transition-all"
						>
							Open on GitHub <ArrowRight size={13} />
						</a>
					</div>
				</div>
			)}
		</motion.div>
	);
}
