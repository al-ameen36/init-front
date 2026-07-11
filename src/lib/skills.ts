import type { DeveloperProfile } from "@/features/onboarding/components/data";

const NOISE_WORDS = new Set([
	"start",
	"core",
	"js",
	"ts",
	"cli",
	"plugin",
	"api",
	"sdk",
	"ui",
	"utils",
	"lib",
	"app",
	"the",
	"server",
	"client",
]);

const GENERIC_FRAMEWORKS = new Set([
	"react",
	"vue",
	"svelte",
	"angular",
	"solid",
	"node",
	"next",
	"nuxt",
	"astro",
	"preact",
	"ember",
]);

// Curated overrides for reliable display + matching of common packages.
const ALIASES: Record<string, string> = {
	"@tanstack/react-router": "Tanstack Router",
	"@tanstack-start/react-router": "Tanstack Router",
	"@tanstack/react-query": "Tanstack Query",
	"@tanstack/query": "Tanstack Query",
	"@tanstack/start": "Tanstack Start",
	react: "React",
	"react-dom": "React",
	next: "Next.js",
	"next.js": "Next.js",
	vue: "Vue",
	nuxt: "Nuxt",
	svelte: "Svelte",
	angular: "Angular",
	express: "Express",
	tailwindcss: "Tailwind CSS",
	typescript: "TypeScript",
	javascript: "JavaScript",
	graphql: "GraphQL",
	node: "Node.js",
	nodejs: "Node.js",
};

export function normalizeTech(raw: string): string {
	const key = raw.trim().toLowerCase();
	if (!key) return raw.trim();
	if (ALIASES[key]) return ALIASES[key];

	let scope: string | null = null;
	let name = key;
	if (key.startsWith("@")) {
		const [s, n] = key.slice(1).split("/", 2);
		scope = s ?? null;
		name = n ?? "";
	}

	const split = (s: string) => s.split(/[-_./\s]/).filter(Boolean);
	let words = split(name).filter((w) => !NOISE_WORDS.has(w));

	const labelWords: string[] = [];
	if (scope) {
		labelWords.push(scope);
		// A brand scope already implies the framework, so drop a leading
		// generic framework word from the name for a cleaner label.
		if (words.length && GENERIC_FRAMEWORKS.has(words[0])) {
			words = words.slice(1);
		}
	}
	labelWords.push(...words);

	if (!labelWords.length) return raw.trim();
	return labelWords
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

// Lowercase matching tokens derived from the raw value (keeps generic
// frameworks like "react" so skills still match their ecosystem).
export function techTokens(raw: string): Set<string> {
	const tokens = new Set<string>();
	const cleaned = raw.trim().toLowerCase().replace(/@/g, "");
	for (const w of cleaned.split(/[-_./\s]/)) {
		if (w && !NOISE_WORDS.has(w)) tokens.add(w);
	}
	return tokens;
}

export function developerTechTokens(profile: DeveloperProfile): Set<string> {
	const set = new Set<string>();
	for (const pkg of Object.keys(profile.tech_stack?.packages ?? {})) {
		for (const t of techTokens(pkg)) set.add(t);
	}
	for (const lang of profile.primary_languages ?? []) {
		for (const t of techTokens(lang)) set.add(t);
	}
	return set;
}

// True when every token of the required skill is present in the developer's
// known tech. Subset matching keeps it accurate for compound skills
// (e.g. "React Router" requires both "react" and "router").
export function hasSkill(skill: string, profile: DeveloperProfile): boolean {
	const need = techTokens(skill);
	if (need.size === 0) return false;
	const have = developerTechTokens(profile);
	for (const t of need) {
		if (!have.has(t)) return false;
	}
	return true;
}
