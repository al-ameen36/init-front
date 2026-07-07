import { ArrowRight, Link, X } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export function AddRepoModal({
	onSubmit,
	onClose,
}: {
	onSubmit: (url: string) => void;
	onClose: () => void;
}) {
	const [url, setUrl] = useState("");
	const valid =
		url.includes("github.com/") && url.split("/").filter(Boolean).length >= 3;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="z-50 fixed inset-0 flex justify-center items-center p-4"
			style={{ background: "rgba(7,11,18,0.8)", backdropFilter: "blur(8px)" }}
			onClick={onClose}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.96, y: 12 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.96, y: 12 }}
				transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
				onClick={(e) => e.stopPropagation()}
				className="bg-card shadow-2xl shadow-black/60 p-6 border border-border rounded-2xl w-full max-w-md"
			>
				<div className="flex justify-between items-center mb-5">
					<div>
						<h3 className="font-medium text-foreground">Add a repository</h3>
						<p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
							Paste a GitHub URL to analyze
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						className="p-1 text-muted-foreground hover:text-foreground transition-colors"
					>
						<X size={16} />
					</button>
				</div>

				<div className="flex items-center gap-2 bg-muted/20 mb-2 px-3 py-3 border border-border focus-within:border-primary/40 rounded-xl transition-colors">
					<Link size={14} className="text-muted-foreground shrink-0" />
					<input
						value={url}
						onChange={(e) => setUrl(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && valid && onSubmit(url)}
						placeholder="https://github.com/owner/repo"
						className="flex-1 bg-transparent outline-none font-mono text-foreground placeholder:text-muted-foreground text-sm"
					/>
				</div>

				<p className="mb-5 font-mono text-[10px] text-muted-foreground">
					We'll analyze the tech stack, open issues, and
					contributor-friendliness — then match issues to your skill profile.
				</p>

				<div className="flex gap-2">
					<button
						type="button"
						onClick={onClose}
						className="flex-1 py-2.5 border border-border rounded-xl font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={() => valid && onSubmit(url)}
						disabled={!valid}
						className="flex flex-1 justify-center items-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-40 py-2.5 rounded-xl font-medium text-primary-foreground text-sm transition-all"
					>
						Analyze <ArrowRight size={13} />
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}
