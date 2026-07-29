import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sidebar } from "#/features/dashboard/components/Sidebar";
import type { NavId } from "#/features/dashboard/types";
import { RequireAuth } from "@/components/RequireAuth";
import { ProfileProvider } from "@/context/ProfileContext";
import { RepoProvider, useRepos } from "@/context/RepoContext";

export const Route = createFileRoute("/_dashboard/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<RequireAuth>
			<ProfileProvider>
				<RepoProvider>
					<DashboardLayout />
				</RepoProvider>
			</ProfileProvider>
		</RequireAuth>
	);
}

function DashboardLayout() {
	const location = useLocation();
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
