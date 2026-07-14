import type { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useAuth() {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	const navigate = useNavigate();

	useEffect(() => {
		supabase.auth.getSession().then(({ data: { session } }) => {
			setUser(session?.user ?? null);
			setLoading(false);
		});

		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange(
			(_event: string, session: Session | null) => {
				setUser(session?.user ?? null);
				setLoading(false);
			},
		);

		return () => subscription.unsubscribe();
	}, []);

	const signInWithGitHub = async () => {
		setLoading(true);
		try {
			const { error } = await supabase.auth.signInWithOAuth({
				provider: "github",
				options: {
					redirectTo: `${window.location.origin}/auth/callback`,
				},
			});
			if (error) throw error;
		} catch (error) {
			console.error("GitHub sign in error:", error);
			setLoading(false);
			throw error;
		}
	};

	const signOut = async () => {
		setUser(null);
		setLoading(false);
		navigate({ to: "/", replace: true });

		try {
			const { error } = await supabase.auth.signOut();
			if (error) throw error;
		} catch (error) {
			console.error("Sign out error:", error);
		}
	};

	return {
		user,
		loading,
		signInWithGitHub,
		signOut,
	};
}
