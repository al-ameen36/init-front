import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
	throw new Error("Missing Supabase environment variables");
}

const SESSION_COOKIE = "sb-init-auth";

// Store the Supabase session in a cookie instead of localStorage so it is
// portable across tabs and survives reloads. NOTE: this cookie is readable by
// client JS — httpOnly is not possible here because supabase-js must read it in
// the browser to issue authenticated requests and refresh tokens. The
// security-critical token the backend reads is the separate HttpOnly
// `sb-access-token` cookie set by the API.
const memory = new Map<string, string>();
const isBrowser = typeof document !== "undefined";

const cookieStorage = {
	getItem: (key: string): string | null => {
		if (isBrowser) return Cookies.get(key) ?? null;
		return memory.get(key) ?? null;
	},
	setItem: (key: string, value: string): void => {
		if (isBrowser) {
			Cookies.set(key, value, {
				path: "/",
				sameSite: "lax",
				secure: window.location.protocol === "https:",
				expires: 30,
			});
		} else {
			memory.set(key, value);
		}
	},
	removeItem: (key: string): void => {
		if (isBrowser) Cookies.remove(key, { path: "/" });
		else memory.delete(key);
	},
};

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
	auth: {
		storage: cookieStorage,
		storageKey: SESSION_COOKIE,
		persistSession: true,
		autoRefreshToken: true,
		detectSessionInUrl: true,
	},
});
