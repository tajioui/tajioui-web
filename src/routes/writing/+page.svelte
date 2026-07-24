<script lang="ts">
	import Aura from '$lib/components/Aura.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { SITE } from '$lib/seo/jsonld';

	let { data } = $props();

	function formatDate(iso: string): string {
		const [y, m, d] = iso.split('-');
		return `${d}.${m}.${y}`;
	}
</script>

<Seo
	title="Writing — Anis Tajioui"
	description="Essays and reports by Anis Tajioui on artificial intelligence, data, and building software."
	canonical={`${SITE.url}/writing/`}
/>

<Aura dim />

<main>
	<a class="back" href="/">Anis Tajioui</a>

	<header>
		<h1>Writing</h1>
		<p class="intro">Essays and reports. Occasional, considered, and written to be useful.</p>
	</header>

	{#if data.posts.length === 0}
		<p class="empty">Nothing published yet.</p>
	{:else}
		<ul class="list">
			{#each data.posts as post (post.slug)}
				<li>
					<a href="/writing/{post.slug}/">
						{#if post.series}
							<span class="series">
								{post.series}{#if post.seriesNo}&nbsp;&middot;&nbsp;{post.seriesNo}{/if}
							</span>
						{/if}
						<h2>{post.title}</h2>
						<p class="desc">{post.description}</p>
						<p class="meta">
							<time datetime={post.date}>{formatDate(post.date)}</time>
							<span class="sep">/</span>
							{post.readingMinutes} min read
						</p>
					</a>
				</li>
			{/each}
		</ul>
	{/if}

	<footer>© {new Date().getFullYear()} Anis Tajioui</footer>
</main>

<style>
	main {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 46rem;
		margin: 0 auto;
		padding: 7vh 6vw 12vh;
		min-height: 100svh;
	}

	.back {
		display: inline-block;
		font-size: 0.72rem;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--muted);
		text-decoration: none;
		margin-bottom: 3.2rem;
		transition: color 0.18s ease;
	}
	.back:hover {
		color: var(--brass);
	}

	h1 {
		font-size: clamp(2.2rem, 6vw, 3.2rem);
		line-height: 1.05;
		letter-spacing: -0.03em;
		font-weight: 680;
	}
	.intro {
		color: var(--muted);
		margin-top: 0.7rem;
		font-family: Georgia, 'Times New Roman', serif;
		font-style: italic;
		font-size: 1.02rem;
	}

	.list {
		list-style: none;
		margin: 3.4rem 0 0;
		padding: 0;
	}
	.list li {
		border-top: 1px solid var(--line);
	}
	.list li:last-child {
		border-bottom: 1px solid var(--line);
	}
	.list a {
		display: block;
		padding: 1.9rem 0;
		text-decoration: none;
		transition: opacity 0.18s ease;
	}
	.list a:hover h2 {
		color: var(--brass);
	}

	.series {
		display: block;
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--brass);
		font-weight: 620;
		margin-bottom: 0.55rem;
	}

	.list h2 {
		font-size: 1.42rem;
		line-height: 1.2;
		letter-spacing: -0.015em;
		font-weight: 640;
		transition: color 0.18s ease;
	}

	.desc {
		color: var(--muted);
		margin-top: 0.45rem;
		max-width: 42rem;
	}

	.meta {
		margin-top: 0.8rem;
		font-size: 0.78rem;
		color: var(--faint);
		letter-spacing: 0.02em;
	}
	.sep {
		padding: 0 0.45rem;
		color: var(--line);
	}

	.empty {
		margin-top: 3rem;
		color: var(--muted);
	}

	footer {
		margin-top: 4.5rem;
		font-size: 0.76rem;
		color: var(--faint);
	}
</style>
