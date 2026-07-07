import { useNavigate } from "@tanstack/react-router";
import { ArrowRight, Github } from "lucide-react";
import { motion } from "motion/react";

export function CTA() {
	const navigate = useNavigate();
	return (
		<section className="px-6 py-24">
			<motion.div
				initial={{ opacity: 0, y: 24 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, margin: "-80px" }}
				transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
				className="relative bg-card mx-auto p-16 border border-border rounded-2xl max-w-3xl overflow-hidden text-center"
			>
				<div
					className="absolute inset-0 opacity-10"
					style={{
						background:
							"radial-gradient(ellipse at 50% 0%, #5b6af0, transparent 70%)",
					}}
				/>
				<div className="relative">
					<h2
						className="mb-5 font-normal text-foreground text-3xl md:text-4xl"
						style={{ fontFamily: "'DM Serif Display', serif" }}
					>
						Ready to make your first
						<br />
						<em className="text-primary">meaningful contribution?</em>
					</h2>
					<p className="mx-auto mb-8 max-w-md text-muted-foreground leading-relaxed">
						Connect your GitHub account and receive your first matched issue
						recommendations in under two minutes.
					</p>
					<button
						type="button"
						onClick={() => navigate({ to: "/signup" })}
						className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 hover:shadow-primary/30 hover:shadow-xl px-8 py-3.5 rounded-md font-medium text-primary-foreground transition-all"
					>
						<Github size={16} />
						Get Started Free
						<ArrowRight size={14} />
					</button>
				</div>
			</motion.div>
		</section>
	);
}
