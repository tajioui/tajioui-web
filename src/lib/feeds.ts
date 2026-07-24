import type { PostMeta } from './content';
import { SITE, postUrl } from './seo/jsonld';

function esc(value: string): string {
	return value
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;');
}

export function renderRss(posts: PostMeta[]): string {
	const items = posts
		.map(
			(post) => `    <item>
      <title>${esc(post.title)}</title>
      <link>${postUrl(post.slug)}</link>
      <guid isPermaLink="true">${postUrl(post.slug)}</guid>
      <description>${esc(post.description)}</description>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`
		)
		.join('\n');

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anis Tajioui</title>
    <link>${SITE.url}/</link>
    <description>Essays and reports by Anis Tajioui.</description>
    <language>en</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

export function renderSitemap(posts: PostMeta[]): string {
	const urls = [`${SITE.url}/`, `${SITE.url}/writing/`, ...posts.map((post) => postUrl(post.slug))];
	return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((url) => `  <url><loc>${url}</loc></url>`).join('\n')}
</urlset>`;
}
