import { TanStackDevtools } from "@tanstack/react-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { useEffect, useState } from "react";
import appCss from "#/styles/index.css?url";
import { SessionSync } from "@/components/SessionSync";
import { ProfileProvider } from "@/context/ProfileContext";
import { RepoProvider } from "@/context/RepoContext";

function NotFound() {
	return (
		<div className="flex h-screen items-center justify-center bg-background text-foreground">
			<div className="text-center space-y-4">
				<h1 className="font-mono text-6xl font-bold">404</h1>
				<p className="text-muted-foreground text-lg">Page not found</p>
				<a
					href="/"
					className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
				>
					Go home
				</a>
			</div>
		</div>
	);
}

export const Route = createRootRoute({
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			{
				title: "init.dev",
			},
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/x-icon",
				href: "/favicon.ico",
			},
		],
	}),
	shellComponent: RootDocument,
	notFoundComponent: NotFound,
});

function RootDocument({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		// Safety net: if Supabase returns an OAuth result (token or error) on any
		// route other than the callback (e.g. a misconfigured redirect URL), push
		// it into /auth/callback so the session is processed and the URL cleaned.
		const hash = window.location.hash;
		// Only redirect if we don't already have a session. Once the session
		// cookie exists the callback has (or is about to) process the result, so
		// redirecting again would loop.
		const hasSession = document.cookie.includes("sb-");
		if (
			!hasSession &&
			(hash.includes("access_token") || hash.includes("error=")) &&
			window.location.pathname !== "/auth/callback"
		) {
			window.location.replace(`/auth/callback${hash}`);
		}
	}, []);

	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						// Cache across SPA navigation; a full page refresh resets
						// the in-memory cache, so data is always fresh on reload.
						staleTime: 5 * 60 * 1000,
						gcTime: 10 * 60 * 1000,
						refetchOnWindowFocus: false,
						retry: 1,
					},
				},
			}),
	);

	return (
		<html lang="en">
			<head>
				<HeadContent />
			</head>
			<body>
				<QueryClientProvider client={queryClient}>
					<SessionSync />
					<ProfileProvider>
						<RepoProvider>{children}</RepoProvider>
					</ProfileProvider>
				</QueryClientProvider>
				<TanStackDevtools
					config={{
						position: "bottom-right",
					}}
					plugins={[
						{
							name: "Tanstack Router",
							render: <TanStackRouterDevtoolsPanel />,
						},
					]}
				/>
				<Scripts />
			</body>
		</html>
	);
}
