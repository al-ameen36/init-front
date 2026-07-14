import { useSessionSync } from "@/hooks/useSessionSync";

// Mounts the session sync for the lifetime of the app (see useSessionSync) so
// the backend HttpOnly `sb-access-token` cookie stays in sync with the Supabase
// session. Renders nothing.
export function SessionSync() {
	useSessionSync();
	return null;
}
