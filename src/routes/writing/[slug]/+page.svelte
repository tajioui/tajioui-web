<script lang="ts">
	import Aura from '$lib/components/Aura.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import Prose from '$lib/components/Prose.svelte';
	import { blogPostingLd, postUrl } from '$lib/seo/jsonld';
	import type { Component } from 'svelte';

	let { data } = $props();

	const Body = $derived(data.component as Component);

	function formatDate(iso: string): string {
		const [y, m, d] = iso.split('-');
		return `${d}.${m}.${y}`;
	}
</script>

<Seo
	title={`${data.meta.title} — Anis Tajioui`}
	description={data.meta.description}
	canonical={postUrl(data.meta.slug)}
	type="article"
	jsonld={[blogPostingLd(data.meta)]}
/>

<Aura dim />

<main>
	<a class="back" href="/writing/">Writing</a>

	<article>
		<header>
			{#if data.meta.series}
				<p class="series">
					{data.meta.series}{#if data.meta.seriesNo}&nbsp;&middot;&nbsp;{data.meta
							.seriesNo}{/if}
				</p>
			{/if}
			<h1>{data.meta.title}</h1>
			<p class="lede">{data.meta.description}</p>
			<p class="meta">
				<time datetime={data.meta.date}>{formatDate(data.meta.date)}</time>
				<span class="sep">/</span>
				{data.meta.readingMinutes} min read
				{#if data.meta.updated}
					<span class="sep">/</span> updated {formatDate(data.meta.updated)}
				{/if}
			</p>
		</header>

		<Prose>
			<Body />
		</Prose>
	</article>

	<footer>
		<a href="/writing/">More writing</a>
		<span>© {new Date().getFullYear()} Anis Tajioui</span>
	</footer>
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

	header {
		margin-bottom: 3.2rem;
	}

	.series {
		font-size: 0.66rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--brass);
		font-weight: 620;
		margin-bottom: 0.8rem;
	}

	h1 {
		font-size: clamp(2.1rem, 5.6vw, 3.1rem);
		line-height: 1.06;
		letter-spacing: -0.03em;
		font-weight: 680;
	}

	.lede {
		font-family: Georgia, 'Times New Roman', serif;
		font-style: italic;
		font-size: 1.16rem;
		line-height: 1.45;
		color: var(--muted);
		margin-top: 1rem;
		max-width: 38rem;
	}

	.meta {
		margin-top: 1.6rem;
		padding-top: 1.1rem;
		border-top: 1px solid var(--line);
		font-size: 0.78rem;
		color: var(--faint);
		letter-spacing: 0.02em;
	}
	.sep {
		padding: 0 0.45rem;
		color: var(--line);
	}

	footer {
		margin-top: 5rem;
		padding-top: 1.4rem;
		border-top: 1px solid var(--line);
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1rem;
		font-size: 0.78rem;
		color: var(--faint);
	}
	footer a {
		color: var(--muted);
		text-decoration: none;
	}
	footer a:hover {
		color: var(--brass);
	}
</style>
