import { createFileRoute } from "@tanstack/react-router";
import { RequireAuth } from "@/components/RequireAuth";
import { OnboardingView } from "@/features/onboarding/components/OnboardingView";

function OnboardingPage() {
	return (
		<RequireAuth>
			<OnboardingView />
		</RequireAuth>
	);
}

export const Route = createFileRoute("/onboarding")({
	component: OnboardingPage,
});
