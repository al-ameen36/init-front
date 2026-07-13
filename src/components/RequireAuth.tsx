import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && !user) {
			navigate({ to: "/signin", replace: true });
		}
	}, [loading, user, navigate]);

	if (loading) {
		return (
			<div className="flex justify-center items-center bg-background h-screen text-foreground">
				<Loader2
					size={28}
					className="text-primary animate-spin will-change-transform"
				/>
			</div>
		);
	}

	if (!user) return null;

	return <>{children}</>;
}
