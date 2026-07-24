import { describe, it, expect } from 'vitest';
import { validateFrontmatter, readingMinutes, sortPosts, isPublished } from './content';

const ok = { title: 'T', date: '2026-07-24', description: 'D' };

describe('validateFrontmatter', () => {
	it('accepts a valid record and applies defaults', () => {
		const r = validateFrontmatter(ok, 'a.md');
		expect(r.title).toBe('T');
		expect(r.tags).toEqual([]);
		expect(r.draft).toBe(false);
	});
	it('throws naming the file and the missing field', () => {
		expect(() => validateFrontmatter({ date: '2026-07-24', description: 'D' }, 'bad.md')).toThrow(
			/bad\.md.*title/
		);
	});
	it('throws on unparseable date', () => {
		expect(() => validateFrontmatter({ ...ok, date: 'not-a-date' }, 'bad.md')).toThrow(
			/bad\.md.*date/
		);
	});
	it('throws on empty description', () => {
		expect(() => validateFrontmatter({ ...ok, description: '  ' }, 'bad.md')).toThrow(
			/bad\.md.*description/
		);
	});
	it('accepts a Date object for date', () => {
		const r = validateFrontmatter({ ...ok, date: new Date('2026-07-24') }, 'a.md');
		expect(r.date).toBe('2026-07-24');
	});
});

describe('readingMinutes', () => {
	it('rounds up at 200 wpm', () => {
		expect(readingMinutes(new Array(200).fill('word').join(' '))).toBe(1);
		expect(readingMinutes(new Array(201).fill('word').join(' '))).toBe(2);
	});
	it('never returns zero', () => {
		expect(readingMinutes('hi')).toBe(1);
	});
});

describe('sortPosts', () => {
	it('sorts by date descending', () => {
		const a = { slug: 'a', date: '2026-01-01' };
		const b = { slug: 'b', date: '2026-07-01' };
		expect(sortPosts([a, b]).map((p) => p.slug)).toEqual(['b', 'a']);
	});
});

describe('isPublished', () => {
	it('excludes drafts', () => {
		expect(isPublished({ draft: true })).toBe(false);
		expect(isPublished({ draft: false })).toBe(true);
	});
});
