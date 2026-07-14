import type { Session, UserIdentity } from "@supabase/supabase-js";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { syncBackendSession } from "@/lib/api";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/auth/callback")({
	component: AuthCallback,
});

async function waitForSession(maxWaitMs = 10000): Promise<Session | null> {
	const start = Date.now();

	while (Date.now() - start < maxWaitMs) {
		const {
			data: { session },
		} = await supabase.auth.getSession();

		if (session) {
			return session;
		}

		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	return null;
}

function AuthCallback() {
	const navigate = useNavigate();

	useEffect(() => {
		// Strip the OAuth result from the visible URL *synchronously*, before any
		// async work. Child effects run before the root safety-net effect, so this
		// guarantees the safety-net never observes a lingering #access_token (which
		// would hard-redirect in a loop). supabase-js already captured the tokens
		// from the URL at client init, so stripping here does not lose them.
		if (window.location.hash || window.location.search.includes("code=")) {
			window.history.replaceState({}, document.title, window.location.pathname);
		}

		const handleCallback = async () => {
			try {
				const session = await waitForSession();

				if (session) {
					// Mirror the access token into the backend's HttpOnly
					// `sb-access-token` cookie now, before navigating, so the SSE
					// stream authenticates on the very next page. (useAuth also
					// re-syncs on refresh, but it isn't mounted here.)
					await syncBackendSession(session.access_token);

					const user = session.user;

					const githubIdentity = user.identities?.find(
						(id: UserIdentity) => id.provider === "github",
					);

					if (githubIdentity) {
						const githubData = githubIdentity.identity_data || {};
						const username =
							githubData.preferred_username ||
							githubData.user_name ||
							githubData.name;

						if (username) {
							try {
								await supabase.auth.updateUser({
									data: { github_username: username },
								});
							} catch (error) {
								console.warn("Could not update github_username:", error);
							}
						}
					}

					const {
						data: { session: refreshedSession },
					} = await supabase.auth.getSession();
					if (!refreshedSession) {
						throw new Error("Session not available after refresh");
					}

					const currentUser = refreshedSession.user;
					const onboardingComplete =
						currentUser.user_metadata?.onboarding_complete;

					if (onboardingComplete) {
						navigate({ to: "/matches", replace: true });
					} else {
						navigate({ to: "/onboarding", replace: true });
					}
				} else {
					navigate({ to: "/signin", replace: true });
				}
			} catch (error) {
				console.error("Callback handling error:", error);
				navigate({ to: "/signin", replace: true });
			}
		};

		handleCallback();
	}, [navigate]);

	return (
		<div className="flex justify-center items-center bg-background min-h-screen">
			<div className="text-center">
				<div className="mx-auto mb-4 border-4 border-primary/30 border-t-primary rounded-full w-12 h-12 animate-spin" />
				<h2 className="mb-2 font-medium text-foreground text-lg">
					Completing GitHub authentication&hellip;
				</h2>
				<p className="text-muted-foreground text-sm">
					You'll be redirected automatically.
				</p>
			</div>
		</div>
	);
}
