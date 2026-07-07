import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { CTA } from "#/features/landing/components/CTA";
import { DashboardPreview } from "#/features/landing/components/DashboardPreview";
import { Footer } from "#/features/landing/components/Footer";
import { Hero } from "#/features/landing/components/Hero";
import { HowItWorks } from "#/features/landing/components/HowIWorks";
import { IssueDetail } from "#/features/landing/components/IssueDetail";
import { Nav } from "#/features/landing/components/Nav";
import type { ISSUES } from "#/features/landing/data";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
	const [selectedIssue, setSelectedIssue] = useState<(typeof ISSUES)[0] | null>(
		null,
	);

	return (
		<div
			className="bg-background min-h-screen overflow-x-hidden text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			<Nav />
			<Hero />
			<HowItWorks />
			<DashboardPreview onSelectIssue={setSelectedIssue} />
			<CTA />
			<Footer />
			<AnimatePresence>
				{selectedIssue && (
					<IssueDetail
						issue={selectedIssue}
						onClose={() => setSelectedIssue(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
