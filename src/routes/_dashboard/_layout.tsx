import { createFileRoute, Outlet } from "@tanstack/react-router";
import { Sidebar } from "#/features/dashboard/components/Sidebar";

export const Route = createFileRoute("/_dashboard/_layout")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div
			className="flex bg-background h-screen overflow-hidden text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			<Sidebar active={"matches"} setActive={() => {}} addedRepos={[]} />
			<main className="flex flex-col flex-1 ml-[220px] min-w-0 min-h-0">
				<Outlet />
			</main>
		</div>
	);
}
