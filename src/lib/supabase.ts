import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
	throw new Error("Missing Supabase environment variables");
}

// Canonical Supabase SSR browser client. It stores the session in cookies
// (document.cookie) under the project's default name (`sb-<ref>-auth-token`),
// detects the OAuth result from the URL automatically, and handles PKCE. We do
// not use a custom js-cookie storage adapter — that deviated from the supported
// path and caused auth bugs. The security-critical token sent to the FastAPI
// backend lives in a separate HttpOnly `sb-access-token` cookie (see
// syncBackendSession in lib/api.ts).
export const supabase = createBrowserClient(
	supabaseUrl,
	supabasePublishableKey,
);
