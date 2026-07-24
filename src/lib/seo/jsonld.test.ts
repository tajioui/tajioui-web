import { describe, it, expect } from 'vitest';
import { blogPostingLd, personLd, orgLd, postUrl, SITE } from './jsonld';
import type { PostMeta } from '../content';

const meta: PostMeta = {
	slug: 's',
	title: 'T',
	date: '2026-07-24',
	description: 'D',
	tags: [],
	draft: false,
	readingMinutes: 3
};

describe('blogPostingLd', () => {
	it('references the existing person @id instead of inlining a person', () => {
		const ld = blogPostingLd(meta) as Record<string, unknown>;
		expect(ld['@type']).toBe('BlogPosting');
		expect(ld.author).toEqual({ '@id': SITE.personId });
	});
	it('sets canonical url from the slug', () => {
		const ld = blogPostingLd(meta) as Record<string, string>;
		expect(ld.url).toBe('https://tajioui.org/writing/s/');
	});
	it('omits dateModified when updated is absent', () => {
		expect('dateModified' in (blogPostingLd(meta) as object)).toBe(false);
	});
	it('emits dateModified when updated is present', () => {
		const ld = blogPostingLd({ ...meta, updated: '2026-08-01' }) as Record<string, string>;
		expect(ld.dateModified).toBe('2026-08-01');
	});
	it('names InfraMS as publisher for series pieces', () => {
		const ld = blogPostingLd({ ...meta, series: 'InfraMS Research' }) as Record<string, unknown>;
		expect(ld.publisher).toEqual({ '@id': SITE.orgId });
	});
	it('omits publisher when there is no series', () => {
		expect('publisher' in (blogPostingLd(meta) as object)).toBe(false);
	});
});

describe('personLd', () => {
	it('keeps the entity anchor id and wikidata sameAs', () => {
		const ld = personLd() as Record<string, unknown>;
		expect(ld['@id']).toBe(SITE.personId);
		expect(JSON.stringify(ld.sameAs)).toContain('wikidata.org/wiki/Q140638702');
	});
});

describe('orgLd', () => {
	it('is founded by the person entity', () => {
		const ld = orgLd() as Record<string, unknown>;
		expect(ld.founder).toEqual({ '@id': SITE.personId });
	});
});

describe('postUrl', () => {
	it('uses a trailing slash', () => {
		expect(postUrl('abc')).toBe('https://tajioui.org/writing/abc/');
	});
});
