import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { ProfileProvider } from "@/context/ProfileContext";
import { OnboardingView } from "@/features/onboarding/components/OnboardingView";

function OnboardingPage() {
	return (
		<RequireAuth>
			<ProfileProvider>
				<OnboardingView />
			</ProfileProvider>
		</RequireAuth>
	);
}

export const Route = createFileRoute("/onboarding")({
	component: OnboardingPage,
});
