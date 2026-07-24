<script lang="ts">
	let { children } = $props();
</script>

<div class="prose">
	{@render children()}
</div>

<style>
	.prose {
		max-width: var(--measure);
		font-size: 1.06rem;
		line-height: 1.75;
	}

	.prose :global(p) {
		margin: 1.1rem 0;
	}

	.prose :global(h2) {
		font-size: 1.5rem;
		line-height: 1.2;
		letter-spacing: -0.015em;
		font-weight: 640;
		margin: 3rem 0 0.6rem;
	}
	.prose :global(h3) {
		font-size: 1.16rem;
		font-weight: 620;
		margin: 2rem 0 0.3rem;
	}

	.prose :global(a) {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: var(--brass);
		text-decoration-thickness: 1px;
	}
	.prose :global(a:hover) {
		color: var(--brass);
	}

	.prose :global(strong) {
		font-weight: 620;
	}

	.prose :global(blockquote) {
		margin: 2rem 0;
		padding: 0.2rem 0 0.2rem 1.4rem;
		border-left: 2px solid var(--brass);
		font-family: Georgia, 'Times New Roman', serif;
		font-style: italic;
		font-size: 1.28rem;
		line-height: 1.4;
		color: var(--ink);
	}
	.prose :global(blockquote p) {
		margin: 0;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 1.1rem 0;
		padding-left: 1.3rem;
	}
	.prose :global(li) {
		margin: 0.45rem 0;
	}
	.prose :global(li::marker) {
		color: var(--brass);
	}

	.prose :global(hr) {
		border: 0;
		border-top: 1px solid var(--line);
		margin: 3rem 0;
	}

	.prose :global(code) {
		font-family: ui-monospace, 'SF Mono', SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 0.88em;
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 4px;
		padding: 0.1em 0.35em;
	}
	.prose :global(pre) {
		background: var(--card);
		border: 1px solid var(--line);
		border-radius: 10px;
		padding: 1rem 1.1rem;
		overflow-x: auto;
		margin: 1.4rem 0;
	}
	.prose :global(pre code) {
		background: none;
		border: 0;
		padding: 0;
		font-size: 0.86rem;
		line-height: 1.6;
	}

	.prose :global(.table-wrap) {
		overflow-x: auto;
		margin: 1.6rem 0;
	}
	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.93rem;
		line-height: 1.45;
		border-top: 1px solid var(--ink);
		border-bottom: 1px solid var(--ink);
	}
	.prose :global(th) {
		text-align: left;
		font-size: 0.68rem;
		letter-spacing: 0.09em;
		text-transform: uppercase;
		color: var(--muted);
		font-weight: 640;
		padding: 0.7rem 0.9rem 0.7rem 0;
		border-bottom: 1px solid var(--line);
		vertical-align: bottom;
	}
	.prose :global(td) {
		padding: 0.75rem 0.9rem 0.75rem 0;
		border-bottom: 1px solid var(--line);
		vertical-align: top;
	}
	.prose :global(tbody tr:last-child td) {
		border-bottom: none;
	}

	.prose :global(figure) {
		margin: 1.8rem 0;
	}
	.prose :global(figcaption) {
		font-size: 0.82rem;
		color: var(--muted);
		margin-top: 0.5rem;
	}
	.prose :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 8px;
	}
</style>
