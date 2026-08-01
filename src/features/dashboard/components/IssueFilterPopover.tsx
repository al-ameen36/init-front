import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { IssueFilters } from "#/lib/api";
import { fetchIssueFilters, updateIssueFilters } from "#/lib/api";

const SORT_OPTIONS = ["Best match", "Newest", "Most active"];

export function IssueFilterPopover({ repo }: { repo: string }) {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["issue-filters"],
		queryFn: fetchIssueFilters,
	});
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [saving, setSaving] = useState(false);
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

	const labels = data?.exclude_labels ?? [];
	const excludeLinkedPrs = data?.exclude_linked_prs ?? true;
	const sort = data?.sort ?? "Best match";

	const save = async (
		next: IssueFilters,
		opts: { refetchIssues?: boolean } = {},
	) => {
		setSaving(true);
		// Apply optimistically so the UI updates immediately instead of waiting
		// for the round trip. The issues list is only refreshed once the backend
		// confirms, because filtering happens server-side. Sort changes are
		// client-side, so they skip the issues refetch.
		const prev = queryClient.getQueryData<IssueFilters>(["issue-filters"]) ?? {
			exclude_labels: labels,
			exclude_linked_prs: excludeLinkedPrs,
			sort,
		};
		queryClient.setQueryData(["issue-filters"], next);
		try {
			const saved = await updateIssueFilters(next);
			queryClient.setQueryData(["issue-filters"], saved);
			if (opts.refetchIssues) {
				void queryClient.invalidateQueries({ queryKey: ["issues", repo] });
			}
		} catch (err) {
			console.error("Failed to save issue filters:", err);
			queryClient.setQueryData(["issue-filters"], prev);
		} finally {
			setSaving(false);
		}
	};

	const addLabel = () => {
		const tag = input.trim();
		setInput("");
		if (!tag || labels.some((l) => l.toLowerCase() === tag.toLowerCase())) {
			return;
		}
		void save(
			{
				exclude_labels: [...labels, tag],
				exclude_linked_prs: excludeLinkedPrs,
				sort,
			},
			{ refetchIssues: true },
		);
	};

	const removeLabel = (label: string) => {
		void save(
			{
				exclude_labels: labels.filter((l) => l !== label),
				exclude_linked_prs: excludeLinkedPrs,
				sort,
			},
			{ refetchIssues: true },
		);
	};

	const toggleLinkedPrs = () => {
		void save(
			{
				exclude_labels: labels,
				exclude_linked_prs: !excludeLinkedPrs,
				sort,
			},
			{ refetchIssues: true },
		);
	};

	const changeSort = (nextSort: string) => {
		if (nextSort === sort) return;
		void save({
			exclude_labels: labels,
			exclude_linked_prs: excludeLinkedPrs,
			sort: nextSort,
		});
	};

	return (
		<div className="relative" ref={rootRef}>
			<button
				type="button"
				onClick={() => setOpen((p) => !p)}
				className={`flex items-center gap-1.5 px-3 py-1.5 border border-border/60 hover:border-white/12 rounded-lg font-mono text-[11px] transition-colors ${
					labels.length > 0
						? "text-primary border-primary/30 bg-primary/8"
						: "text-muted-foreground hover:text-foreground"
				}`}
			>
				<Filter size={11} />
				Filters
				{labels.length > 0 && (
					<span className="bg-primary/15 px-1.5 rounded text-primary">
						{labels.length}
					</span>
				)}
			</button>

			<AnimatePresence>
				{open && (
					<motion.div
						initial={{ opacity: 0, y: -4 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -4 }}
						transition={{ duration: 0.15 }}
						className="top-full right-0 z-50 absolute bg-popover shadow-2xl shadow-black/50 mt-1 p-3 border border-border rounded-xl w-72"
					>
						{isLoading ? (
							<div className="flex justify-center py-4">
								<Loader2
									size={14}
									className="text-primary animate-spin will-change-transform"
								/>
							</div>
						) : (
							<>
								<div className="flex items-center justify-between gap-2.5 mb-3">
									<span className="flex flex-col">
										<span className="font-mono text-[11px] text-foreground">
											Hide issues with an open PR
										</span>
										<span className="font-mono text-[10px] text-muted-foreground">
											Skips issues already linked to a pull request
										</span>
									</span>
									<button
										type="button"
										role="switch"
										aria-checked={excludeLinkedPrs}
										onClick={toggleLinkedPrs}
										disabled={saving}
										className={`relative shrink-0 w-8 h-[18px] rounded-full transition-colors disabled:opacity-40 ${
											excludeLinkedPrs
												? "bg-primary"
												: "bg-white/10 border border-border"
										}`}
									>
										<span
											className={`absolute top-0.5 left-0.5 w-[14px] h-[14px] rounded-full bg-white transition-transform ${
												excludeLinkedPrs ? "translate-x-3.5" : "translate-x-0"
											}`}
										/>
									</button>
								</div>
								<div className="mb-3 border-border border-t" />
								<div className="mb-1.5 font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
									Sort by
								</div>
								<div className="mb-3">
									{SORT_OPTIONS.map((o) => (
										<button
											type="button"
											key={o}
											onClick={() => changeSort(o)}
											disabled={saving}
											className={`w-full text-left font-mono text-[11px] px-2.5 py-1.5 rounded-md transition-colors disabled:opacity-40 ${
												sort === o
													? "text-primary bg-primary/8"
													: "text-muted-foreground hover:text-foreground hover:bg-white/4"
											}`}
										>
											{o}
										</button>
									))}
								</div>
								<div className="mb-3 border-border border-t" />
								<div className="mb-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
									Exclude labels
								</div>
								{labels.length > 0 && (
									<div className="flex flex-wrap gap-1.5 mb-3">
										{labels.map((label) => (
											<span
												key={label}
												className="flex items-center gap-1 bg-white/4 border border-border px-2 py-1 rounded-md font-mono text-[11px] text-muted-foreground"
											>
												{label}
												<button
													type="button"
													onClick={() => removeLabel(label)}
													disabled={saving}
													className="hover:text-foreground text-muted-foreground/60 transition-colors disabled:opacity-40"
													title="Remove filter"
												>
													<X size={10} />
												</button>
											</span>
										))}
									</div>
								)}

								{labels.length === 0 && (
									<div className="mb-3 font-mono text-[11px] text-muted-foreground">
										No labels excluded — all issues are shown.
									</div>
								)}

								<div className="flex items-center gap-2">
									<input
										value={input}
										onChange={(e) => setInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === "Enter") {
												e.preventDefault();
												addLabel();
											}
										}}
										placeholder="e.g. good first issue"
										className="bg-card border border-border outline-none focus:border-primary/40 px-2.5 py-1.5 rounded-md w-full font-mono placeholder:text-muted-foreground text-xs text-foreground"
									/>
									<button
										type="button"
										onClick={addLabel}
										disabled={saving || !input.trim()}
										className="hover:bg-white/6 p-2 rounded-md text-primary transition-colors disabled:opacity-40"
										title="Add filter"
									>
										<Plus size={14} />
									</button>
								</div>
							</>
						)}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
