# tajioui.org

Personal site and writing of Anis Tajioui, software developer and co-founder of
[InfraMS UG](https://inframs.de). SvelteKit, fully prerendered to static files, served from
GitHub Pages.

The site carries schema.org `Person` and `Organization` structured data
(Wikidata Q140638702 / Q140638754) as the canonical entity anchor. Every published essay
attaches to that same entity rather than creating a parallel one.

## Local development

```bash
bun install
bun run dev
```

Other commands:

```bash
bun run test     # unit tests
bun run build    # production build into build/
bun run preview  # serve the production build locally
bun run check    # type check
```

## Publishing an essay

1. Create `content/writing/<slug>.md`. The filename becomes the URL: `content/writing/foo.md`
   is published at `https://tajioui.org/writing/foo/`.

2. Add frontmatter:

```yaml
---
title: 'Title of the piece'
date: 2026-07-24
description: 'One sentence used for the index, the meta description, and RSS.'
tags: ['ai', 'research']
series: 'InfraMS Research' # optional
seriesNo: 'No. 2026/01' # optional
draft: false # optional, defaults to false
updated: 2026-08-01 # optional
---
```

3. Write the body in markdown. Svelte components can be embedded when a piece needs something
   interactive.

4. Commit and push to `main`. The site rebuilds and deploys automatically.

`title`, `date`, and `description` are required. A missing or malformed field fails the build
with a message naming the file and the field, so a broken essay never ships as a blank page.

Posts with `draft: true` are excluded from the build entirely. They produce no page, and appear
in neither the index, the RSS feed, nor the sitemap.

## How it fits together

- `content/writing/*.md` holds the essays.
- `src/lib/content.ts` reads and validates them at build time. It is the single source of truth,
  so the index, article pages, RSS feed, and sitemap cannot drift apart.
- `src/lib/seo/jsonld.ts` builds the structured data. Each article emits `BlogPosting` schema
  whose author references the existing Person entity (`https://tajioui.org/#anis`) rather than
  duplicating it.
- `src/lib/feeds.ts` renders `/rss.xml` and `/sitemap.xml`.

## Deployment

Pushing to `main` triggers `.github/workflows/deploy.yml`, which runs the tests, builds, and
publishes `build/` to GitHub Pages.

DNS is managed at Cloudflare and points at GitHub Pages. `static/CNAME` holds the custom domain
and is copied into every build, so the domain survives each deploy.

### Pages configuration

The workflow sets `enablement: true` on `actions/configure-pages`, so it switches the Pages
source to GitHub Actions on the first run. If that step is ever rejected by permissions, set the
source manually in the repository settings under Pages, then re-run the workflow.
