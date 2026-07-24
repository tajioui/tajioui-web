<script lang="ts">
	import Aura from '$lib/components/Aura.svelte';
	import Seo from '$lib/components/Seo.svelte';
	import { personLd, orgLd, SITE } from '$lib/seo/jsonld';

	const year = new Date().getFullYear();
</script>

<Seo
	title="Anis Tajioui — Software Developer & Co-founder of InfraMS UG"
	description="Anis Tajioui is a German software developer and entrepreneur, co-founder and managing director of InfraMS UG in Hanau, and a Data Science & AI dual student at DHBW Mannheim with Zurich Insurance."
	canonical={`${SITE.url}/`}
	jsonld={[personLd(), orgLd()]}
/>

<Aura />

<main class="stack">
	<div class="eyebrow">Hanau, Germany</div>

	<h1>Anis<br /><span class="sur">Tajioui</span></h1>

	<div>
		<p class="role">
			<span class="thin">Software developer &amp; entrepreneur.</span> Co-founder of
			<b>InfraMS&nbsp;UG</b>.
		</p>
		<p class="loc">Data Science &amp; AI at DHBW Mannheim × Zurich Insurance.</p>
	</div>

	<p class="bio">
		I build systems, from AI and data pipelines to full-stack software. I co-founded
		<a href="https://inframs.de">InfraMS UG</a>, an IT-modernization company in Hanau, and study Data
		Science and Artificial Intelligence at DHBW Mannheim as a dual student with Zurich Insurance.
		Interested in turning messy real-world problems into things that quietly run themselves.
	</p>

	<div class="facts">
		<div class="fact"><div class="k">Company</div><div class="v">InfraMS&nbsp;UG</div></div>
		<div class="fact"><div class="k">Focus</div><div class="v">Data Science &amp; AI</div></div>
		<div class="fact"><div class="k">University</div><div class="v">DHBW Mannheim</div></div>
		<div class="fact"><div class="k">Languages</div><div class="v">DE · EN · AR · FR</div></div>
	</div>

	<div class="links">
		<a class="internal" href="/writing/">Writing</a>
		<a href="https://inframs.de">InfraMS</a>
		<a href="https://www.linkedin.com/in/anistji/">LinkedIn</a>
		<a href="https://github.com/tajioui">GitHub</a>
		<a href="https://www.wikidata.org/wiki/Q140638702">Wikidata</a>
	</div>

	<footer>© {year} Anis Tajioui</footer>
</main>

<style>
	main {
		position: relative;
		z-index: 2;
		width: 100%;
		max-width: 46rem;
		margin: 0 auto;
		padding: 8vh 6vw;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.stack > :global(*) {
		opacity: 0;
		transform: translateY(14px);
		animation: rise 0.9s cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
	}
	.stack > :global(*:nth-child(1)) {
		animation-delay: 0.05s;
	}
	.stack > :global(*:nth-child(2)) {
		animation-delay: 0.13s;
	}
	.stack > :global(*:nth-child(3)) {
		animation-delay: 0.21s;
	}
	.stack > :global(*:nth-child(4)) {
		animation-delay: 0.31s;
	}
	.stack > :global(*:nth-child(5)) {
		animation-delay: 0.41s;
	}
	.stack > :global(*:nth-child(6)) {
		animation-delay: 0.51s;
	}
	@keyframes rise {
		to {
			opacity: 1;
			transform: none;
		}
	}

	.eyebrow {
		font-size: 0.72rem;
		letter-spacing: 0.26em;
		text-transform: uppercase;
		color: var(--muted);
		font-weight: 500;
		margin-bottom: 1.4rem;
	}

	h1 {
		font-size: clamp(2.7rem, 8vw, 4.6rem);
		line-height: 1;
		letter-spacing: -0.035em;
		font-weight: 680;
		margin-bottom: 0.9rem;
	}
	h1 .sur {
		color: transparent;
		-webkit-text-stroke: 1px var(--muted);
	}

	.role {
		font-size: clamp(1.02rem, 2.3vw, 1.28rem);
		color: var(--ink);
		font-weight: 500;
		margin-bottom: 0.4rem;
	}
	.role .thin {
		color: var(--muted);
		font-weight: 400;
	}
	.role b {
		color: var(--brass);
		font-weight: 600;
	}
	.loc {
		font-family: Georgia, 'Times New Roman', serif;
		font-style: italic;
		font-size: 1rem;
		color: var(--muted);
		margin-bottom: 2.4rem;
	}

	.bio {
		font-size: 1.06rem;
		max-width: 40rem;
		color: var(--ink);
		margin-bottom: 2.6rem;
	}
	.bio a {
		color: var(--ink);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-color: var(--brass);
		text-decoration-thickness: 1px;
	}

	.facts {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(8.5rem, 1fr));
		gap: 1px;
		background: var(--line);
		border: 1px solid var(--line);
		border-radius: 14px;
		overflow: hidden;
		margin-bottom: 2.6rem;
	}
	.fact {
		background: var(--bg);
		padding: 1.05rem 1.15rem;
	}
	.fact .k {
		font-size: 0.64rem;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: var(--muted);
		margin-bottom: 0.35rem;
	}
	.fact .v {
		font-size: 0.97rem;
		font-weight: 550;
	}

	.links {
		display: flex;
		flex-wrap: wrap;
		gap: 0.6rem;
	}
	.links a {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.6rem 1.05rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 0.9rem;
		font-weight: 500;
		color: var(--ink);
		text-decoration: none;
		background: var(--card);
		transition:
			border-color 0.18s ease,
			color 0.18s ease,
			transform 0.18s ease;
	}
	.links a:hover {
		border-color: var(--brass);
		color: var(--brass);
		transform: translateY(-1px);
	}
	.links a::after {
		content: '↗';
		font-size: 0.78em;
		color: var(--faint);
		transition: color 0.18s ease;
	}
	.links a.internal::after {
		content: '→';
	}
	.links a:hover::after {
		color: var(--brass);
	}

	footer {
		margin-top: 3.4rem;
		font-size: 0.76rem;
		color: var(--faint);
		letter-spacing: 0.02em;
	}

	@media (prefers-reduced-motion: reduce) {
		.stack > :global(*) {
			opacity: 1;
			transform: none;
			animation: none;
		}
	}
</style>
