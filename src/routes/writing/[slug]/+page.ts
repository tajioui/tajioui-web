import { error } from '@sveltejs/kit';
import { getAllPosts, getPost } from '$lib/content';

export const prerender = true;

export async function entries() {
	const posts = await getAllPosts();
	return posts.map((post) => ({ slug: post.slug }));
}

export async function load({ params }) {
	const post = await getPost(params.slug);
	if (!post) error(404, 'Not found');
	return { meta: post.meta, component: post.component };
}
