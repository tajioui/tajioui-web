import { getAllPosts } from '$lib/content';
import { renderSitemap } from '$lib/feeds';

export const prerender = true;

export async function GET() {
	const body = renderSitemap(await getAllPosts());
	return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
