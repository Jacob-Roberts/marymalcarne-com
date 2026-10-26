import cloudflare from "@astrojs/cloudflare";
import { cacheCloudflare } from "@astrojs/cloudflare/cache";
import react from "@astrojs/react";
import { d1, r2, kvCache } from "@emdash-cms/cloudflare";
import { defineConfig, fontProviders } from "astro/config";
import emdash from "emdash/astro";
import { emdashSmtp } from "emdash-smtp";

export default defineConfig({
	output: "server",
	adapter: cloudflare(),
	cache: {
		provider: cacheCloudflare(),
	},
	image: {
		layout: "constrained",
		responsiveStyles: true,
	},
	integrations: [
		react(),
		emdash({
			database: d1({ binding: "DB", session: "auto" }),
			storage: r2({ binding: "MEDIA" }),
			// Optional: cache D1 query results in a KV namespace to cut D1 reads
			// for cache misses and signed-in editors. Enable only after creating
			// the namespace and binding it (see wrangler.jsonc instructions):
			// objectCache: kvCache({ binding: "CACHE" }),
			toolbar: "client",
			plugins: [emdashSmtp()],
		}),
	],
	routeRules: {
		// Long-lived edge cache for mostly-static public pages. EmDash
		// invalidates these by tag when content changes in the admin.
		"/": { maxAge: 3600, swr: 86400, tags: ["posts", "pages", "books", "links", "all"] },
		"/posts": { maxAge: 1800, swr: 86400, tags: ["posts", "all"] },
		"/posts/[slug]": { maxAge: 3600, swr: 86400, tags: ["posts", "all"] },
		"/pages/[slug]": { maxAge: 3600, swr: 86400, tags: ["pages", "all"] },
		"/category/[slug]": { maxAge: 1800, swr: 86400, tags: ["posts", "all"] },
		"/tag/[slug]": { maxAge: 1800, swr: 86400, tags: ["posts", "all"] },
		"/books": { maxAge: 3600, swr: 86400, tags: ["books", "all"] },
		"/books/[slug]": { maxAge: 3600, swr: 86400, tags: ["books", "all"] },
		"/rss.xml": { maxAge: 3600, swr: 86400, tags: ["posts", "all"] },
		"/sitemap.xml": { maxAge: 3600, swr: 86400, tags: ["posts", "pages", "books", "all"] },
		"/sitemap-[collection].xml": { maxAge: 3600, swr: 86400, tags: ["posts", "pages", "books", "all"] },
	},
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