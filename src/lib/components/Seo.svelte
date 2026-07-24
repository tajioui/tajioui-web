<script lang="ts">
	let {
		title,
		description,
		canonical,
		type = 'website',
		jsonld = []
	}: {
		title: string;
		description: string;
		canonical: string;
		type?: 'website' | 'article';
		jsonld?: unknown[];
	} = $props();
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={canonical} />
	<meta property="og:type" content={type === 'article' ? 'article' : 'profile'} />
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={canonical} />
	<meta property="og:image" content="https://tajioui.org/anis.jpg" />
	<meta name="twitter:card" content="summary_large_image" />
	{#each jsonld as block, i (i)}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html `<script type="application/ld+json">${JSON.stringify(block)}</` + `script>`}
	{/each}
</svelte:head>
