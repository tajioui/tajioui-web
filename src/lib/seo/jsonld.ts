import type { PostMeta } from '../content';

export const SITE = {
	url: 'https://tajioui.org',
	personId: 'https://tajioui.org/#anis',
	orgId: 'https://inframs.de/#org',
	name: 'Anis Tajioui',
	description:
		'German software developer and entrepreneur, co-founder and managing director of InfraMS UG.'
} as const;

export function personLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Person',
		'@id': SITE.personId,
		name: 'Anis Tajioui',
		givenName: 'Anis',
		familyName: 'Tajioui',
		url: `${SITE.url}/`,
		image: `${SITE.url}/anis.jpg`,
		jobTitle: 'Co-founder & Managing Director',
		description: SITE.description,
		nationality: 'German',
		knowsLanguage: ['German', 'English', 'Arabic', 'French'],
		knowsAbout: [
			'Data Science',
			'Artificial Intelligence',
			'Machine Learning',
			'IT Modernization',
			'Software Engineering',
			'Cloud Infrastructure'
		],
		alumniOf: {
			'@type': 'CollegeOrUniversity',
			name: 'Duale Hochschule Baden-Württemberg Mannheim',
			sameAs: 'https://www.wikidata.org/wiki/Q1262608'
		},
		worksFor: {
			'@type': 'Organization',
			name: 'InfraMS UG (haftungsbeschränkt)',
			url: 'https://inframs.de',
			sameAs: 'https://www.wikidata.org/wiki/Q140638754'
		},
		sameAs: [
			'https://www.wikidata.org/wiki/Q140638702',
			'https://www.linkedin.com/in/anistji/',
			'https://github.com/tajioui',
			'https://inframs.de'
		]
	};
}

export function orgLd() {
	return {
		'@context': 'https://schema.org',
		'@type': 'Organization',
		'@id': SITE.orgId,
		name: 'InfraMS UG (haftungsbeschränkt)',
		alternateName: 'InfraMS',
		url: 'https://inframs.de',
		sameAs: 'https://www.wikidata.org/wiki/Q140638754',
		foundingDate: '2024',
		founder: { '@id': SITE.personId },
		location: {
			'@type': 'Place',
			address: { '@type': 'PostalAddress', addressLocality: 'Hanau', addressCountry: 'DE' }
		}
	};
}

export function postUrl(slug: string): string {
	return `${SITE.url}/writing/${slug}/`;
}

export function blogPostingLd(meta: PostMeta) {
	const ld: Record<string, unknown> = {
		'@context': 'https://schema.org',
		'@type': 'BlogPosting',
		'@id': `${postUrl(meta.slug)}#article`,
		headline: meta.title,
		description: meta.description,
		url: postUrl(meta.slug),
		datePublished: meta.date,
		inLanguage: 'en',
		author: { '@id': SITE.personId },
		mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl(meta.slug) }
	};
	if (meta.updated) ld.dateModified = meta.updated;
	if (meta.tags.length) ld.keywords = meta.tags.join(', ');
	if (meta.series) ld.publisher = { '@id': SITE.orgId };
	return ld;
}
