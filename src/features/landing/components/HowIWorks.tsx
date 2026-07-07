import { motion } from "motion/react";
import { STEPS } from "../data";

export function HowItWorks() {
	return (
		<section className="mx-auto px-6 py-24 max-w-6xl">
			<div className="mb-16">
				<div className="mb-3 font-mono text-muted-foreground text-xs uppercase tracking-widest">
					Process
				</div>
				<h2
					className="font-normal text-foreground text-3xl md:text-4xl"
					style={{ fontFamily: "'DM Serif Display', serif" }}
				>
					From "I want to contribute"
					<br />
					<em className="text-primary">to merged pull request</em>
				</h2>
			</div>
			<div className="gap-px grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 bg-border">
				{STEPS.map((step, i) => (
					<motion.div
						key={step.number}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-60px" }}
						transition={{
							delay: i * 0.1,
							duration: 0.5,
							ease: [0.16, 1, 0.3, 1],
						}}
						className="group bg-background hover:bg-card p-8 transition-colors duration-300"
					>
						<div className="mb-6">
							<span className="font-mono text-[11px] text-muted-foreground/50 tracking-widest">
								{step.number}
							</span>
						</div>
						<div className="flex justify-center items-center bg-primary/10 group-hover:bg-primary/15 mb-5 border border-primary/20 rounded-lg w-10 h-10 transition-colors">
							<step.icon size={18} className="text-primary" />
						</div>
						<h3 className="mb-3 font-medium text-foreground text-base">
							{step.title}
						</h3>
						<p className="text-muted-foreground text-sm leading-relaxed">
							{step.body}
						</p>
					</motion.div>
				))}
			</div>
		</section>
	);
}
