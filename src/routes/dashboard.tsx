import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { ActiveView } from "#/features/dashboard/components/ActiveView";
import { AddRepoModal } from "#/features/dashboard/components/AddRepo";
import { MatchesView } from "#/features/dashboard/components/MatchesView";
import { RepoAnalysisModal } from "#/features/dashboard/components/RepoAnalysis";
import { ReposView } from "#/features/dashboard/components/ReposView";
import { Sidebar } from "#/features/dashboard/components/Sidebar";
import { SkillsView } from "#/features/dashboard/components/SkillsView";
import type { AddedRepo, NavId } from "#/features/dashboard/types";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const [activeView, setActiveView] = useState<NavId>("matches");
	const [addedRepos, setAddedRepos] = useState<AddedRepo[]>([]);
	const [showAddModal, setShowAddModal] = useState(false);
	const [analyzingUrl, setAnalyzingUrl] = useState<string | null>(null);

	const handleAddRepo = (url: string) => {
		setShowAddModal(false);
		setAnalyzingUrl(url);
	};

	const handleAnalysisDone = (repo: AddedRepo) => {
		setAddedRepos((prev) => [...prev, repo]);
		setAnalyzingUrl(null);
		setActiveView("repos");
	};

	const views: Record<NavId, React.ReactNode> = {
		matches: <MatchesView addedRepos={addedRepos} />,
		repos: (
			<ReposView
				repos={addedRepos}
				onAdd={() => setShowAddModal(true)}
				onRemove={(id) => setAddedRepos((p) => p.filter((r) => r.id !== id))}
			/>
		),
		active: <ActiveView />,
		skills: <SkillsView />,
	};

	return (
		<div
			className="flex bg-background h-screen overflow-hidden text-foreground"
			style={{ fontFamily: "'Geist', sans-serif" }}
		>
			<Sidebar
				active={activeView}
				setActive={setActiveView}
				addedRepos={addedRepos}
			/>
			<main className="flex flex-col flex-1 ml-[220px] min-w-0 min-h-0">
				<AnimatePresence mode="wait">
					<motion.div
						key={activeView}
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={{ duration: 0.2, ease: "easeOut" }}
						className="flex flex-col h-full"
					>
						{views[activeView]}
					</motion.div>
				</AnimatePresence>
			</main>

			<AnimatePresence>
				{showAddModal && (
					<AddRepoModal
						onSubmit={handleAddRepo}
						onClose={() => setShowAddModal(false)}
					/>
				)}
				{analyzingUrl && (
					<RepoAnalysisModal
						url={analyzingUrl}
						onDone={handleAnalysisDone}
						onClose={() => setAnalyzingUrl(null)}
					/>
				)}
			</AnimatePresence>
		</div>
	);
}
