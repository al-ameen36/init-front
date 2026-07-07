import { useNavigate } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	Compass,
	GitBranch,
	GitPullRequest,
	Settings,
	Terminal,
} from "lucide-react";
import { USER } from "../data";
import type { AddedRepo, NavId } from "../types";

const NAV: { id: NavId; icon: React.ElementType; label: string }[] = [
	{ id: "matches", icon: Compass, label: "Matches" },
	{ id: "repos", icon: GitBranch, label: "Repositories" },
	{ id: "active", icon: GitPullRequest, label: "Active" },
	{ id: "skills", icon: BarChart3, label: "Skills" },
];

export function Sidebar({
	active,
	setActive,
	addedRepos,
}: {
	active: NavId;
	setActive: (v: NavId) => void;
	addedRepos: AddedRepo[];
}) {
	const navigate = useNavigate();
	return (
		<aside className="top-0 bottom-0 left-0 z-40 fixed flex flex-col bg-background border-border border-r w-[220px]">
			<div className="flex items-center gap-2 px-5 py-5 border-border border-b">
				<div className="flex justify-center items-center bg-primary rounded-md w-7 h-7 shrink-0">
					<Terminal size={13} className="text-white" />
				</div>
				<span className="font-mono font-medium text-foreground">init</span>
				<span className="font-mono text-[10px] text-muted-foreground">
					.dev
				</span>
			</div>

			<nav className="flex-1 space-y-0.5 px-3 py-4">
				{NAV.map(({ id, icon: Icon, label }) => (
					<button
						type="button"
						key={id}
						onClick={() => setActive(id)}
						className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
							active === id
								? "bg-primary/12 text-primary"
								: "text-muted-foreground hover:text-foreground hover:bg-white/4"
						}`}
					>
						<Icon size={16} />
						{label}
						{id === "repos" && addedRepos.length > 0 && (
							<span className="bg-white/6 ml-auto px-1.5 py-0.5 rounded font-mono text-[10px] text-muted-foreground">
								{addedRepos.length}
							</span>
						)}
					</button>
				))}
			</nav>

			<div className="space-y-0.5 px-3 pt-3 pb-4 border-border border-t">
				<button
					type="button"
					className="flex items-center gap-3 hover:bg-white/4 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:text-foreground text-sm transition-all"
				>
					<Settings size={16} />
					Settings
				</button>
				<button
					type="button"
					onClick={() => navigate({ to: "/" })}
					className="flex items-center gap-3 hover:bg-white/4 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:text-foreground text-sm transition-all"
				>
					<ArrowRight size={16} className="rotate-180" />
					Sign out
				</button>
			</div>

			<div className="flex items-center gap-3 px-4 py-4 border-border border-t">
				<img
					src={USER.avatar}
					alt={USER.name}
					className="border border-border rounded-full w-8 h-8 object-cover shrink-0"
				/>
				<div className="min-w-0">
					<div className="font-medium text-foreground text-xs truncate">
						{USER.name}
					</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						@{USER.handle}
					</div>
				</div>
			</div>
		</aside>
	);
}
