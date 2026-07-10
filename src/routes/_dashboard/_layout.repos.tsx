import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
	AlertTriangle,
	ArrowUpRight,
	BookOpen,
	CheckCircle2,
	Clock,
	GitBranch,
	Loader2,
	Plus,
	Star,
	Trash2,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { AddRepoModal } from "#/features/dashboard/components/AddRepo";
import { Topbar } from "#/features/dashboard/components/Topbar";
import { LANG_COLOR } from "#/features/dashboard/data";
import { fetchRepoMeta } from "#/lib/api";
import { type RepoItem, useRepos } from "@/context/RepoContext";

export const Route = createFileRoute("/_dashboard/_layout/repos")({
	component: RouteComponent,
});

function timeAgo(iso: string | null): string {
	if (!iso) return "unknown";
	const diff = Date.now() - new Date(iso).getTime();
	const day = 86_400_000;
	if (diff < day) return "today";
	const days = Math.floor(diff / day);
	if (days < 30) return `${days}d ago`;
	const months = Math.floor(days / 30);
	if (months < 12) return `${months}mo ago`;
	return `${Math.floor(months / 12)}y ago`;
}

function RepoCard({
	repo,
	active,
	onActivate,
	onRequestRemove,
}: {
	repo: RepoItem;
	active: boolean;
	onActivate: () => void;
	onRequestRemove: () => void;
}) {
	const { data: meta, isError: error } = useQuery({
		queryKey: ["repoMeta", repo.owner, repo.name],
		queryFn: () => fetchRepoMeta(repo.owner, repo.name),
		staleTime: 5 * 60 * 1000,
	});

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className={`bg-card border rounded-xl overflow-hidden ${
				active ? "border-primary/50" : "border-border"
			}`}
		>
			<div className="flex items-start gap-4 p-5 border-border border-b">
				<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-xl w-10 h-10 shrink-0">
					<BookOpen size={16} className="text-primary" />
				</div>
				<div className="flex-1 min-w-0">
					<div className="flex items-center gap-2 mb-1">
						<span className="font-mono text-muted-foreground text-xs">
							{repo.owner}
						</span>
						<span className="font-mono text-muted-foreground/40 text-xs">
							/
						</span>
						<span className="font-medium text-foreground text-sm">
							{repo.name}
						</span>
						{active && (
							<span className="bg-primary/15 ml-auto px-2 py-0.5 rounded-full font-mono text-[10px] text-primary">
								Active
							</span>
						)}
					</div>
					<div className="flex items-center gap-4">
						{meta?.language && (
							<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
								<span
									className="inline-block rounded-full w-2 h-2"
									style={{
										backgroundColor: LANG_COLOR[meta.language] ?? "#a0aec8",
									}}
								/>
								{meta.language}
							</span>
						)}
						{meta && (
							<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
								<Star size={9} />
								{meta.stars.toLocaleString()}
							</span>
						)}
						{meta?.pushed_at && (
							<span className="flex items-center gap-1 font-mono text-[10px] text-muted-foreground">
								<Clock size={9} />
								{timeAgo(meta.pushed_at)}
							</span>
						)}
						{error && (
							<span className="font-mono text-[10px] text-amber-400">
								metadata unavailable
							</span>
						)}
					</div>
					{meta?.description && (
						<p className="mt-2 text-muted-foreground text-xs leading-relaxed line-clamp-2">
							{meta.description}
						</p>
					)}
				</div>
				<button
					type="button"
					onClick={onRequestRemove}
					className="p-1.5 text-muted-foreground/40 hover:text-red-400 transition-colors shrink-0"
					aria-label="Remove repository"
				>
					<Trash2 size={14} />
				</button>
			</div>

			<div className="grid grid-cols-4 divide-x divide-border">
				{[
					{
						label: "Open issues",
						value: meta ? meta.open_issues_count : "—",
					},
					{ label: "Stars", value: meta ? meta.stars.toLocaleString() : "—" },
					{
						label: "Language",
						value: meta?.language ?? "—",
						highlight: true,
					},
					{ label: "Topics", value: meta?.topics.length ?? "—" },
				].map(({ label, value, highlight }) => (
					<div key={label} className="px-4 py-3 text-center">
						<div className="mb-1 font-mono text-[10px] text-muted-foreground">
							{label}
						</div>
						<div
							className="font-medium text-xl truncate"
							style={{
								color: highlight ? "#5b6af0" : "#e8edf8",
							}}
						>
							{value}
						</div>
					</div>
				))}
			</div>

			<div className="flex items-center gap-2 px-5 py-3 border-border border-t">
				{active ? (
					<span className="flex items-center gap-1.5 font-mono text-[11px] text-primary">
						<CheckCircle2 size={12} />
						Matching issues against this repo
					</span>
				) : (
					<button
						type="button"
						onClick={onActivate}
						className="flex items-center gap-1.5 hover:bg-primary/10 px-3 py-1.5 border border-border hover:border-primary/40 rounded-lg font-mono text-[11px] text-muted-foreground hover:text-primary transition-colors"
					>
						Set as active
					</button>
				)}
				<Link
					to="/matches"
					onClick={onActivate}
					className="flex items-center gap-1.5 bg-primary hover:bg-primary/90 ml-auto px-3 py-1.5 rounded-lg font-medium text-primary-foreground text-[11px] transition-colors"
				>
					View issues <ArrowUpRight size={12} />
				</Link>
			</div>
		</motion.div>
	);
}

function ConfirmDeleteModal({
	repo,
	onConfirm,
	onCancel,
}: {
	repo: RepoItem | null;
	onConfirm: () => void;
	onCancel: () => void;
}) {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			className="z-50 fixed inset-0 flex justify-center items-center p-4"
			style={{ background: "rgba(7,11,18,0.8)", backdropFilter: "blur(8px)" }}
			onClick={onCancel}
		>
			<motion.div
				initial={{ opacity: 0, scale: 0.96, y: 12 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.96, y: 12 }}
				transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
				onClick={(e) => e.stopPropagation()}
				className="bg-card shadow-2xl shadow-black/60 p-6 border border-border rounded-2xl w-full max-w-md"
			>
				<div className="flex items-center gap-3 mb-4">
					<div className="flex justify-center items-center bg-red-500/10 border border-red-500/20 rounded-xl w-10 h-10 shrink-0">
						<AlertTriangle size={16} className="text-red-400" />
					</div>
					<div>
						<h3 className="font-medium text-foreground">Remove repository</h3>
						<p className="mt-0.5 font-mono text-[11px] text-muted-foreground">
							{repo ? `${repo.owner}/${repo.name}` : ""}
						</p>
					</div>
				</div>
				<p className="mb-5 text-muted-foreground text-sm leading-relaxed">
					This will stop matching issues from this repository against your
					profile. Your analysis history for it will be lost. This can't be
					undone.
				</p>
				<div className="flex gap-2">
					<button
						type="button"
						onClick={onCancel}
						className="flex-1 py-2.5 border border-border rounded-xl font-medium text-muted-foreground hover:text-foreground text-sm transition-colors"
					>
						Cancel
					</button>
					<button
						type="button"
						onClick={onConfirm}
						className="flex flex-1 justify-center items-center gap-2 bg-red-500 hover:bg-red-500/90 py-2.5 rounded-xl font-medium text-white text-sm transition-all"
					>
						<Trash2 size={13} />
						Remove
					</button>
				</div>
			</motion.div>
		</motion.div>
	);
}

function RouteComponent() {
	const { repos, activeRepo, addRepo, removeRepo, setActiveRepo, loading } =
		useRepos();
	const [showAdd, setShowAdd] = useState(false);
	const [deleteTarget, setDeleteTarget] = useState<RepoItem | null>(null);
	const [toast, setToast] = useState<{
		status: "loading" | "success";
		message: string;
	} | null>(null);
	const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
		undefined,
	);

	const notify = (
		status: "loading" | "success",
		message: string,
		autoHide = true,
	) => {
		setToast({ status, message });
		if (autoHide) {
			clearTimeout(toastTimer.current);
			toastTimer.current = setTimeout(() => setToast(null), 2800);
		}
	};

	useEffect(() => {
		return () => clearTimeout(toastTimer.current);
	}, []);

	const handleAdd = async (url: string) => {
		setShowAdd(false);
		notify("loading", "Adding repository & starting analysis…");
		await addRepo(url);
		notify("success", "Repository added — issues will be matched on Matches");
	};

	const handleActivate = async (full: string) => {
		notify("loading", `Analyzing ${full}…`);
		await setActiveRepo(full);
		notify("success", `Now matching ${full} to your profile`);
	};

	const confirmRemove = async () => {
		if (!deleteTarget) return;
		const full = `${deleteTarget.owner}/${deleteTarget.name}`;
		await removeRepo(full);
		setDeleteTarget(null);
		notify("success", `Removed ${full}`);
	};

	return (
		<div className="flex flex-col h-full">
			<Topbar
				title="Repositories"
				subtitle={`${repos.length} repo${repos.length !== 1 ? "s" : ""} added · issues matched against your profile`}
			>
				<button
					type="button"
					onClick={() => setShowAdd(true)}
					className="flex items-center gap-2 bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg font-medium text-primary-foreground text-sm transition-colors"
				>
					<Plus size={14} />
					Add repository
				</button>
			</Topbar>

			<div className="flex-1 px-7 py-6 overflow-y-auto scrollbar-hide">
				{loading ? (
					<div className="flex flex-col justify-center items-center gap-3 py-20 h-full text-center">
						<Loader2 size={22} className="text-primary animate-spin" />
						<p className="font-mono text-[11px] text-muted-foreground">
							Loading repositories…
						</p>
					</div>
				) : repos.length === 0 ? (
					<div className="flex flex-col justify-center items-center gap-4 py-20 h-full text-center">
						<div className="flex justify-center items-center bg-primary/10 border border-primary/20 rounded-2xl w-16 h-16">
							<GitBranch size={24} className="text-primary" />
						</div>
						<div>
							<div className="mb-1 font-medium text-foreground text-base">
								No repositories added yet
							</div>
							<p className="max-w-xs text-muted-foreground text-sm leading-relaxed">
								Add a GitHub repository you want to contribute to. We'll analyze
								its tech stack, complexity, and open issues — then match them to
								your skills.
							</p>
						</div>
						<button
							type="button"
							onClick={() => setShowAdd(true)}
							className="flex items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/20 px-6 py-3 rounded-xl font-medium text-primary-foreground text-sm transition-all"
						>
							<Plus size={14} />
							Add your first repository
						</button>
					</div>
				) : (
					<div className="space-y-4 max-w-3xl">
						<AnimatePresence initial={false}>
							{repos.map((repo) => (
								<RepoCard
									key={repo.id}
									repo={repo}
									active={activeRepo === `${repo.owner}/${repo.name}`}
									onActivate={() =>
										handleActivate(`${repo.owner}/${repo.name}`)
									}
									onRequestRemove={() => setDeleteTarget(repo)}
								/>
							))}
						</AnimatePresence>

						<button
							type="button"
							onClick={() => setShowAdd(true)}
							className="flex justify-center items-center gap-2 hover:bg-primary/5 py-4 border border-border hover:border-primary/40 border-dashed rounded-xl w-full font-medium text-muted-foreground hover:text-primary text-sm transition-all"
						>
							<Plus size={14} />
							Add another repository
						</button>
					</div>
				)}
			</div>

			{/* Analysis feedback toast */}
			<AnimatePresence>
				{toast && (
					<motion.div
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 16 }}
						transition={{ duration: 0.2 }}
						className="right-6 bottom-6 z-50 fixed flex items-center gap-2.5 bg-card shadow-2xl shadow-black/60 px-4 py-3 border border-border rounded-xl"
					>
						{toast.status === "loading" ? (
							<Loader2 size={15} className="text-primary animate-spin" />
						) : (
							<CheckCircle2 size={15} className="text-emerald-400" />
						)}
						<span className="font-mono text-[11px] text-foreground">
							{toast.message}
						</span>
					</motion.div>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{showAdd && (
					<AddRepoModal
						onSubmit={handleAdd}
						onClose={() => setShowAdd(false)}
					/>
				)}
			</AnimatePresence>

			<AnimatePresence>
				{deleteTarget && (
					<ConfirmDeleteModal
						repo={deleteTarget}
						onConfirm={confirmRemove}
						onCancel={() => setDeleteTarget(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
