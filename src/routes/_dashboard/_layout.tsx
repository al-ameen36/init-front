import { createFileRoute, Outlet, useLocation, useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Sidebar } from "#/features/dashboard/components/Sidebar";
import type { NavId } from "#/features/dashboard/types";
import { useAuth } from "@/hooks/useAuth";
import { useRepos } from "@/context/RepoContext";

export const Route = createFileRoute("/_dashboard/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	const location = useLocation();
	const navigate = useNavigate();
	const { user, loading: authLoading } = useAuth();
	const [active, setActive] = useState<NavId>(() => {
		const seg = location.pathname.split("/")[1] as NavId;
		return ["matches", "repos", "active", "skills"].includes(seg)
			? seg
			: "matches";
	});
	const { repos } = useRepos();

	useEffect(() => {
		const seg = location.pathname.split("/")[1] as NavId;
		if (seg) setActive(seg);
	}, [location.pathname]);

	// Gate the whole dashboard behind auth. `authLoading` stays true until the
	// async session lookup resolves, so we show a loader on first paint (and on
	// SSR) and only redirect once we know there's no session — avoiding a flash
	// of protected content or a hydration mismatch.
	useEffect(() => {
		if (!authLoading && !user) {
			navigate({ to: "/signin", replace: true });
		}
	}, [authLoading, user, navigate]);

	if (authLoading) {
		return (
			<div className="flex justify-center items-center bg-background h-screen text-foreground">
				<Loader2 size={28} className="text-primary animate-spin will-change-transform" />
			</div>
		);
	}

	if (!user) return null;

	return (
		<div
			className="flex bg-background h-screen overflow-hidden text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			<Sidebar active={active} setActive={setActive} addedRepos={repos} />
			<main className="flex flex-col flex-1 ml-[220px] min-w-0 min-h-0">
				<Outlet />
			</main>
		</div>
	);
}
