import cloudflare from "@astrojs/cloudflare";
import react from "@astrojs/react";
import { d1, r2 } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import { emdashSmtp } from "emdash-smtp";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
      storage: r2({ binding: "MEDIA" }),
			plugins: [emdashSmtp()],
		}),
	],
	fonts: [
		{
			provider: fontProviders.google(),
			name: "Lora",
			cssVariable: "--font-body",
			weights: [400, 500, 600, 700],
			fallbacks: ["serif"],
		},
		{
			// Loaded into --font-heading directly, so the @layer base default of
			// `--font-heading: var(--font-body)` in tokens.css is overridden without
			// needing a theme.css rule.
			provider: fontProviders.google(),
			name: "Fraunces",
			cssVariable: "--font-heading",
			weights: [400, 500, 600, 700],
			fallbacks: ["serif"],
		},
	],
	devToolbar: { enabled: false },
});
