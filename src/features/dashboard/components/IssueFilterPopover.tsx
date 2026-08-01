import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Filter, Loader2, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { fetchIssueFilters, updateIssueFilters } from "#/lib/api";

export function IssueFilterPopover({ repo }: { repo: string }) {
	const queryClient = useQueryClient();
	const { data, isLoading } = useQuery({
		queryKey: ["issue-filters"],
		queryFn: fetchIssueFilters,
	});
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState("");
	const [saving, setSaving] = useState(false);

	const labels = data?.exclude_labels ?? [];

	const save = async (next: string[]) => {
		setSaving(true);
		try {
			const saved = await updateIssueFilters(next);
			queryClient.setQueryData(["issue-filters"], saved);
			void queryClient.invalidateQueries({ queryKey: ["issues", repo] });
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
		void save([...labels, tag]);
	};

	const removeLabel = (label: string) => {
		void save(labels.filter((l) => l !== label));
	};

	return (
		<div className="relative">
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
						<div className="mb-2 font-mono text-[10px] text-muted-foreground uppercase tracking-wide">
							Exclude labels
						</div>

						{isLoading ? (
							<div className="flex justify-center py-4">
								<Loader2
									size={14}
									className="text-primary animate-spin will-change-transform"
								/>
							</div>
						) : (
							<>
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
