import { useAuth } from "@/hooks/useAuth";
import { useDeveloperAnalysis } from "@/hooks/useDeveloperAnalysis";

export type { DeveloperProfile } from "@/features/onboarding/components/data";

/** Runs the developer GitHub analysis once, on mount, for the signed-in user. */
export function useOnboardingAnalysis() {
	const { user } = useAuth();
	const username =
		(user?.user_metadata?.github_username as string | undefined) ||
		(user?.user_metadata?.preferred_username as string | undefined);
	return useDeveloperAnalysis(username ?? null);
}
