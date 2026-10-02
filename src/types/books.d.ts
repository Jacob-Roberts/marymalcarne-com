/**
 * Books collection types.
 *
 * The `books` collection lives in the database, not in `seed/seed.json`, so it
 * is managed through the EmDash MCP server. That cuts both ways for types:
 *
 *  - If the local dev database has the collection, `astro check` regenerates a
 *    `Book` interface into `emdash-env.d.ts`.
 *  - If the local database is empty or reset and seeds from `seed/seed.json`,
 *    that generated interface disappears.
 *
 * These declarations cover the second case, so pages type-check either way.
 * The two `books` keys merge without conflict because the shapes agree.
 *
 * If `books` is ever added to the seed, delete this file.
 */

import type {
	BylineSummary,
	ContentBylineCredit,
	PortableTextBlock,
	TaxonomyTerm,
} from "emdash";

/** One of the `buy_links` json entries: a format label and its Amazon URL. */
export interface BuyLink {
	format: string;
	url: string;
}

export interface BookMediaField {
	id: string;
	src?: string;
	alt?: string;
	width?: number;
	height?: number;
	filename?: string;
	mimeType?: string;
	blurhash?: string;
	dominantColor?: string;
	focalX?: number;
	focalY?: number;
	provider?: string;
	previewUrl?: string;
	meta?: Record<string, unknown>;
}

export interface Book {
	/** Database ULID -- use for API calls that need the real ID. */
	id: string;
	slug: string | null;
	status: string;

	title: string;
	subtitle?: string | null;
	hook?: string | null;
	cover?: BookMediaField | null;
	series?: string | null;
	/** 0 for a prequel, then 1, 2, ... in reading order. */
	series_position?: number | null;
	/** Stored as 0/1; coerce with `Boolean()`. */
	is_prequel?: number | boolean | null;
	excerpt?: string | null;
	synopsis?: PortableTextBlock[];
	genres?: string | null;
	rating?: number | null;
	review_count?: number | null;
	page_count?: number | null;
	publisher?: string | null;
	reading_age?: string | null;
	release_date?: Date | null;
	amazon_url?: string | null;
	buy_links?: BuyLink[] | null;

	createdAt: Date;
	updatedAt: Date;
	publishedAt: Date | null;
	byline?: BylineSummary | null;
	bylines?: ContentBylineCredit[];
	terms?: Record<string, TaxonomyTerm[]>;
}

declare module "emdash" {
	interface EmDashCollections {
		books: Book;
	}
}