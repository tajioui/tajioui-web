<script lang="ts">
	import { page } from '$app/state';
</script>

<svelte:head>
	<title>{page.status} — Anis Tajioui</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<main>
	<p class="code">{page.status}</p>
	<h1>{page.error?.message ?? 'Something went wrong'}</h1>
	<a href="/">Back to tajioui.org</a>
</main>

<style>
	main {
		max-width: 46rem;
		margin: 0 auto;
		padding: 8vh 6vw;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.code {
		font-size: 0.72rem;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--brass);
		margin-bottom: 1rem;
	}
	h1 {
		font-size: clamp(1.8rem, 5vw, 2.6rem);
		line-height: 1.1;
		letter-spacing: -0.03em;
		font-weight: 680;
		margin-bottom: 2rem;
	}
	a {
		color: var(--muted);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: var(--brass);
		width: fit-content;
	}
	a:hover {
		color: var(--brass);
	}
</style>
