export type PostMeta = {
	slug: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
	draft: boolean;
	series?: string;
	seriesNo?: string;
	updated?: string;
	readingMinutes: number;
};

type RawMeta = Omit<PostMeta, 'slug' | 'readingMinutes'>;

function fail(file: string, field: string, why: string): never {
	throw new Error(`Invalid frontmatter in ${file}: field "${field}" ${why}`);
}

function asDateString(value: unknown): string | null {
	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
	}
	if (typeof value !== 'string') return null;
	const parsed = Date.parse(value);
	return Number.isNaN(parsed) ? null : value.slice(0, 10);
}

export function validateFrontmatter(raw: unknown, file: string): RawMeta {
	if (typeof raw !== 'object' || raw === null) fail(file, 'frontmatter', 'is missing');
	const m = raw as Record<string, unknown>;

	if (typeof m.title !== 'string' || m.title.trim() === '') {
		fail(file, 'title', 'is required and must be a non-empty string');
	}
	const date = asDateString(m.date);
	if (!date) fail(file, 'date', 'is required and must be a parseable YYYY-MM-DD date');
	if (typeof m.description !== 'string' || m.description.trim() === '') {
		fail(file, 'description', 'is required and must be a non-empty string');
	}

	let updated: string | undefined;
	if (m.updated !== undefined) {
		const u = asDateString(m.updated);
		if (!u) fail(file, 'updated', 'must be a parseable YYYY-MM-DD date when present');
		updated = u;
	}
	if (m.tags !== undefined && !Array.isArray(m.tags)) {
		fail(file, 'tags', 'must be an array of strings when present');
	}

	return {
		title: m.title.trim(),
		date,
		description: m.description.trim(),
		tags: Array.isArray(m.tags) ? m.tags.map(String) : [],
		draft: m.draft === true,
		series: typeof m.series === 'string' ? m.series : undefined,
		seriesNo: typeof m.seriesNo === 'string' ? m.seriesNo : undefined,
		updated
	};
}

export function readingMinutes(text: string): number {
	const words = text.trim().split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / 200));
}

export function isPublished(post: { draft: boolean }): boolean {
	return !post.draft;
}

export function sortPosts<T extends { date: string }>(posts: T[]): T[] {
	return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

type MarkdownModule = { metadata: unknown; default: unknown };

const modules = import.meta.glob<MarkdownModule>('/content/writing/*.md', { eager: true });
const sources = import.meta.glob<string>('/content/writing/*.md', {
	eager: true,
	query: '?raw',
	import: 'default'
});

function slugOf(path: string): string {
	const file = path.split('/').pop();
	if (!file) throw new Error(`Cannot derive slug from path: ${path}`);
	return file.replace(/\.md$/, '');
}

function buildAll(): { meta: PostMeta; component: unknown }[] {
	return Object.entries(modules).map(([path, mod]) => {
		const slug = slugOf(path);
		const meta = validateFrontmatter(mod.metadata, path);
		const body = (sources[path] ?? '').replace(/^---[\s\S]*?---/, '');
		return {
			meta: { ...meta, slug, readingMinutes: readingMinutes(body) },
			component: mod.default
		};
	});
}

export async function getAllPosts(): Promise<PostMeta[]> {
	return sortPosts(buildAll().map((entry) => entry.meta).filter(isPublished));
}

export async function getPost(slug: string): Promise<{ meta: PostMeta; component: unknown } | null> {
	const hit = buildAll().find((entry) => entry.meta.slug === slug && isPublished(entry.meta));
	return hit ?? null;
}
