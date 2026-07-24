import { getAllPosts } from '$lib/content';

export const prerender = true;

export async function load() {
	return { posts: await getAllPosts() };
}
