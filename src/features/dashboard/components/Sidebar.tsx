import { Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	Compass,
	GitBranch,
	GitPullRequest,
	Settings,
	Terminal,
} from "lucide-react";
import type { NavId } from "#/features/dashboard/types";
import type { RepoItem } from "@/context/RepoContext";
import { useAuth } from "@/hooks/useAuth";

const NAV: {
	id: NavId;
	icon: React.ElementType;
	label: string;
	soon?: boolean;
}[] = [
	{ id: "matches", icon: Compass, label: "Matches" },
	{ id: "repos", icon: GitBranch, label: "Repositories" },
	{ id: "active", icon: GitPullRequest, label: "Active", soon: true },
	{ id: "skills", icon: BarChart3, label: "Skills" },
];

interface User {
	name: string;
	handle: string;
	avatar: string;
}

export function Sidebar({
	active,
	setActive,
	addedRepos,
}: {
	active: NavId;
	setActive: (v: NavId) => void;
	addedRepos: RepoItem[];
}) {
	const { user, signOut } = useAuth();

	const meta = (user?.user_metadata ?? {}) as Record<string, unknown>;
	const str = (v: unknown) => (typeof v === "string" ? v : "");
	const userData: User = user
		? {
				name: str(meta.full_name) || str(meta.name) || "User",
				handle:
					str(meta.github_username) || str(meta.preferred_username) || "github",
				avatar:
					str(meta.avatar_url) ||
					str(meta.picture) ||
					`https://github.com/${str(meta.github_username) || "user"}.png`,
			}
		: {
				name: "User",
				handle: "github",
				avatar: "",
			};

	const handleSignOut = async () => {
		await signOut();
	};

	return (
		<aside className="top-0 bottom-0 left-0 z-40 fixed flex flex-col bg-background border-border border-r w-[220px]">
			<div className="flex items-center px-5 py-5 border-border border-b">
				<img src="/logo512.png" alt="init.dev" className="h-7 w-auto" />
			</div>

			<nav className="flex-1 space-y-0.5 px-3 py-4">
				{NAV.map(({ id, icon: Icon, label, soon }) => (
					<Link
						to={`/${id}`}
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
						{soon && (
							<span className="bg-primary/12 ml-auto px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wide text-primary">
								soon
							</span>
						)}
						{id === "repos" && addedRepos.length > 0 && (
							<span className="bg-white/6 ml-auto px-1.5 py-0.5 rounded font-mono text-[10px] text-muted-foreground">
								{addedRepos.length}
							</span>
						)}
					</Link>
				))}
			</nav>

			<div className="space-y-0.5 px-3 pt-3 pb-4 border-border border-t">
				<button
					type="button"
					className="flex items-center gap-3 hover:bg-white/4 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:text-foreground text-sm transition-all"
				>
					<Settings size={16} />
					Settings
					<span className="bg-primary/12 ml-auto px-1.5 py-0.5 rounded font-mono text-[9px] uppercase tracking-wide text-primary">
						soon
					</span>
				</button>
				<button
					type="button"
					onClick={handleSignOut}
					className="flex items-center gap-3 hover:bg-white/4 px-3 py-2.5 rounded-lg w-full text-muted-foreground hover:text-foreground text-sm transition-all"
				>
					<ArrowRight size={16} className="rotate-180" />
					Sign out
				</button>
			</div>

			<div className="flex items-center gap-3 px-4 py-4 border-border border-t">
				{userData.avatar ? (
					<img
						src={userData.avatar}
						alt={userData.name}
						className="border border-border rounded-full w-8 h-8 object-cover shrink-0"
					/>
				) : (
					<div className="flex items-center justify-center bg-primary/10 border border-border rounded-full w-8 h-8 shrink-0">
						<Terminal size={12} className="text-primary" />
					</div>
				)}
				<div className="min-w-0">
					<div className="font-medium text-foreground text-xs truncate">
						{userData.name}
					</div>
					<div className="font-mono text-[10px] text-muted-foreground">
						@{userData.handle}
					</div>
				</div>
			</div>
		</aside>
	);
}
