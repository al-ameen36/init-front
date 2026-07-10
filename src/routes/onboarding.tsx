import { createFileRoute } from "@tanstack/react-router";
import { OnboardingView } from "@/features/onboarding/components/OnboardingView";

export const Route = createFileRoute("/onboarding")({
	component: OnboardingView,
});
