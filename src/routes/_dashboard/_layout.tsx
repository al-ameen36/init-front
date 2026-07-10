import { createFileRoute, Outlet } from "@tanstack/react-router";
import { useState } from "react";
import { Sidebar } from "#/features/dashboard/components/Sidebar";
import type { NavId } from "#/features/dashboard/types";
import { useRepos } from "@/context/RepoContext";

export const Route = createFileRoute("/_dashboard/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	const [active, setActive] = useState<NavId>("matches");
	const { repos } = useRepos();
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
