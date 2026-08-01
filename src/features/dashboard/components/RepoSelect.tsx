import { Check, ChevronDown, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { repoAnalysisState } from "#/lib/api";
import { useRepos } from "@/context/RepoContext";

export function RepoSelect() {
	const { repos, activeRepo, setActiveRepo } = useRepos();
	const [open, setOpen] = useState(false);
	const [switching, setSwitching] = useState<string | null>(null);
	const rootRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!open) return;
		const onPointerDown = (event: PointerEvent) => {
			if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
				setOpen(false);
			}
		};
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setOpen(false);
		};
		document.addEventListener("pointerdown", onPointerDown);
		document.addEventListener("keydown", onKeyDown);
		return () => {
			document.removeEventListener("pointerdown", onPointerDown);
			document.removeEventListener("keydown", onKeyDown);
		};
	}, [open]);

	if (repos.length === 0) return null;

	const select = async (full: string) => {
		if (full === activeRepo) {
			setOpen(false);
			return;
		}
		setSwitching(full);
		try {
			await setActiveRepo(full);
		} finally {
			setSwitching(null);
			setOpen(false);
		}
	};

	return (
		<div className="relative" ref={rootRef}>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className="flex items-center gap-1.5 px-3 py-1.5 border border-border/60 hover:border-white/12 rounded-lg font-mono text-[11px] text-primary transition-colors"
			>
				<ChevronDown
					size={11}
					className={`shrink-0 transition-transform ${
						open ? "rotate-180" : ""
					}`}
				/>
				<span className="max-w-40 truncate">{activeRepo}</span>
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.15 }}
						className="top-full right-0 z-50 absolute bg-popover shadow-2xl shadow-black/50 mt-1 p-1.5 border border-border rounded-xl w-72"
					>
						{repos.map((repo) => {
							const full = `${repo.owner}/${repo.name}`;
							const state = repoAnalysisState(repo);
							const isActive = full === activeRepo;
							return (
								<button
									type="button"
									key={repo.id}
									onClick={() => select(full)}
									disabled={switching !== null}
									className={`flex items-center gap-2 w-full text-left font-mono text-[11px] px-2.5 py-2 rounded-lg transition-colors disabled:opacity-50 ${
										isActive
											? "text-primary bg-primary/8"
											: "text-muted-foreground hover:text-foreground hover:bg-white/4"
									}`}
								>
									<span className="flex-1 min-w-0 truncate">
										<span className="text-muted-foreground/70">
											{repo.owner}/
										</span>
										{repo.name}
									</span>
									{state === "ready" && (
										<span className="shrink-0 px-1.5 py-0.5 rounded font-mono text-[9px] text-emerald-400">
											Ready
										</span>
									)}
									{state === "analyzing" && (
										<span className="flex items-center gap-1 shrink-0 font-mono text-[9px] text-amber-400">
											<Loader2
												size={9}
												className="animate-spin will-change-transform"
											/>
											Analyzing
										</span>
									)}
									{state === "error" && (
										<span className="shrink-0 font-mono text-[9px] text-red-400">
											Failed
										</span>
									)}
									{isActive && (
										<Check size={13} className="text-primary shrink-0" />
									)}
								</button>
							);
						})}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
