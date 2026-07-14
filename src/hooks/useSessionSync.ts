import { useEffect } from "react";
import { clearBackendSession, syncBackendSession } from "@/lib/api";
import { supabase } from "@/lib/supabase";

// Owns the backend HttpOnly `sb-access-token` cookie sync. Mounted exactly once
// via <SessionSync />, so the cookie is set on login/refresh and cleared on
// logout regardless of which route is active — without duplicating POSTs from
// every component that calls useAuth().
export function useSessionSync() {
	useEffect(() => {
		supabase.auth.getSession().then(async ({ data: { session } }) => {
			if (session) {
				await syncBackendSession(session.access_token);
			}
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			async (event: string, session: { access_token: string } | null) => {
				if (session && event !== "SIGNED_OUT") {
					await syncBackendSession(session.access_token);
				} else if (event === "SIGNED_OUT") {
					await clearBackendSession();
				}
			},
		);

		return () => subscription.unsubscribe();
	}, []);
}
