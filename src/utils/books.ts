/**
 * Shared formatting helpers for the `books` collection.
 */

import type { Book } from "../types/books";

/**
 * How a book is labelled in the series reading order. `series_position` is 0
 * for the prequel, then 1, 2, ... in publication order.
 */
export function seriesLabel(book: Pick<Book, "series_position" | "is_prequel">) {
	if (book.is_prequel) return "Prequel";
	const position = book.series_position ?? 1;
	return `Book ${position}`;
}

/** Long-form position label, e.g. "The Final Strand, Book One". */
export function seriesLine(book: Pick<Book, "series" | "series_position" | "is_prequel">) {
	if (!book.series) return null;
	if (book.is_prequel) return `${book.series} · Prequel`;
	return `${book.series} · Book ${book.series_position ?? 1}`;
}

export function formatReleaseDate(date: Date | string | null | undefined) {
	if (!date) return null;
	const value = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(value.getTime())) return null;
	return value.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

export function releaseYear(date: Date | string | null | undefined) {
	if (!date) return null;
	const value = date instanceof Date ? date : new Date(date);
	if (Number.isNaN(value.getTime())) return null;
	return value.getFullYear();
}

/** `genres` is a plain comma-separated string in the schema. */
export function parseGenres(genres: string | null | undefined): string[] {
	if (!genres) return [];
	return genres
		.split(",")
		.map((genre) => genre.trim())
		.filter(Boolean);
}

/**
 * Renders a rating as filled/empty stars. Fractional ratings round to the
 * nearest half so 4.7 reads as five stars.
 */
export function starGlyphs(rating: number | null | undefined) {
	if (rating == null) return { filled: 0, total: 0 };
	const total = 5;
	const rounded = Math.round(rating * 2) / 2;
	const filled = Math.min(total, Math.ceil(rounded));
	return { filled, total };
}

export function bookHref(book: Pick<Book, "slug">) {
	return `/books/${book.slug}`;
}