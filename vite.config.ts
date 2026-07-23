import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";

const config = defineConfig({
	resolve: { tsconfigPaths: true },
	server: {},
	plugins: [
		devtools(),
		nitro({ rollupConfig: { external: [/^@sentry\//] } }),
		tailwindcss(),
		tanstackStart(),
		viteReact(),
	],
	build: {
		chunkSizeWarningLimit: 600,
		rollupOptions: {
			output: {
				manualChunks(id) {
					if (
						id.includes("node_modules/recharts") ||
						id.includes("node_modules/victory-vendor")
					) {
						return "recharts";
					}
					if (
						id.includes("node_modules/motion") ||
						id.includes("node_modules/framer-motion")
					) {
						return "motion";
					}
				},
			},
		},
	},
});

export default config;
