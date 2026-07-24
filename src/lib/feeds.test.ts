import { describe, it, expect } from 'vitest';
import { renderRss, renderSitemap } from './feeds';
import type { PostMeta } from './content';

const post: PostMeta = {
	slug: 'a',
	title: 'A & B',
	date: '2026-07-24',
	description: 'D',
	tags: [],
	draft: false,
	readingMinutes: 2
};

describe('renderRss', () => {
	it('includes published posts and escapes XML', () => {
		const xml = renderRss([post]);
		expect(xml).toContain('https://tajioui.org/writing/a/');
		expect(xml).toContain('A &amp; B');
		expect(xml.startsWith('<?xml')).toBe(true);
	});
	it('declares itself as the feed url', () => {
		expect(renderRss([])).toContain('https://tajioui.org/rss.xml');
	});
});

describe('renderSitemap', () => {
	it('lists home, writing index, and each post', () => {
		const xml = renderSitemap([post]);
		expect(xml).toContain('<loc>https://tajioui.org/</loc>');
		expect(xml).toContain('<loc>https://tajioui.org/writing/</loc>');
		expect(xml).toContain('<loc>https://tajioui.org/writing/a/</loc>');
	});
	it('uses the sitemaps.org namespace', () => {
		expect(renderSitemap([])).toContain('http://www.sitemaps.org/schemas/sitemap/0.9');
	});
});
