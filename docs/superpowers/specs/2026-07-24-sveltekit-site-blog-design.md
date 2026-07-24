# tajioui.org: SvelteKit rebuild with an essay/report blog

Date: 2026-07-24
Status: approved design, ready for implementation planning

## Problem

tajioui.org is a single hand-written `index.html` served from GitHub Pages. It works as an
identity page and carries deliberate schema.org markup (Person, Organization) that anchors
Anis Tajioui as an entity for search engines and knowledge graphs. It has no way to publish
writing.

There is now writing to publish, starting with an InfraMS Research white paper
("Amplify, Don't Offload", a report on cognitive offloading and generative AI). Pasting long
essays into a single static file does not scale, and doing so would lose the per-article
metadata that makes writing discoverable.

## Goals

1. Rebuild the site as a SvelteKit application without losing the current design or the
   entity/SEO work already invested in it.
2. Add a system for publishing long-form essays and reports, authored as markdown in the repo.
3. Keep the site on the existing domain and hosting (GitHub Pages, `tajioui.org`) at zero cost.
4. Make every published essay reinforce the existing entity graph rather than float free of it.

## Non-goals (explicitly out of scope for this build)

- Browser-based CMS or admin UI
- Comments, reactions, or any user-generated content
- Client-side search
- Internationalisation (site stays English-only)
- Digital-garden features: backlinks, graph view, evolving notes
- Any server runtime, database, or dynamic rendering

These are all addable later; none is needed to publish essays.

## Chosen approach

SvelteKit with `@sveltejs/adapter-static`, prerendering every route to static HTML, deployed to
GitHub Pages by a GitHub Action. Markdown essays are rendered with **mdsvex**.

### Alternatives considered

**Velite (typed content layer) instead of mdsvex.** Content is validated against a Zod schema,
producing typed frontmatter and near-free SEO artifacts. Rejected as the primary choice because
it forbids Svelte components inside markdown and has a smaller ecosystem. The type-safety
benefit is recovered cheaply: this design adds explicit frontmatter validation at build time
(see "Content model"), which is the part that actually matters.

**Cloudflare Pages with SSR.** Would unlock view counts, webmentions, on-demand OG images, and
comments. Rejected: none of those are goals, and it would mean migrating hosting and DNS for a
site that is a set of essays. Revisit only if dynamic behaviour is genuinely wanted.

**mdsvex + adapter-static (chosen).** Mature and maintained, first-class in the SvelteKit
ecosystem, keeps the current domain and free hosting, and permits embedding interactive Svelte
components inside an essay when a piece calls for it.

## Architecture

Static site generation. There is no server at runtime; the build produces a directory of HTML,
CSS, JS, and assets that GitHub Pages serves.

```
content/writing/*.md          essays, authored by hand
        |
        |  read at build time by a content module
        v
src/lib/content.ts            loads + validates frontmatter, sorts, derives reading time
        |
        +--> /writing         index route: list of essays
        +--> /writing/[slug]  article route: one essay
        +--> /rss.xml         feed, prerendered
        +--> /sitemap.xml     sitemap, prerendered
        |
        v
   adapter-static  ->  build/  ->  GitHub Action  ->  GitHub Pages (tajioui.org)
```

### Routes

| Route | Purpose | Notes |
|---|---|---|
| `/` | Identity landing page | Port of the current `index.html`, same design and JSON-LD, plus a link into `/writing` |
| `/writing` | Essay index | Reverse-chronological: title, description, date, reading time |
| `/writing/[slug]` | One essay | Long-form reading layout, per-article JSON-LD |
| `/rss.xml` | Feed | Prerendered; full metadata, links to canonical URLs |
| `/sitemap.xml` | Sitemap | Prerendered; all public routes |
| `/404` | Not found | Styled to match the site |

`trailingSlash: 'always'` so GitHub Pages resolves nested routes to `index.html` correctly.

### Components

Each has one job and can be understood without reading the others.

- `src/lib/content.ts`: the single source of truth for essays. Uses `import.meta.glob` over
  `content/writing/*.md` at build time. Exports `getAllPosts()` and `getPost(slug)`. Validates
  frontmatter and throws a build-time error on bad input. Filters drafts in production.
- `src/lib/seo/jsonld.ts`: builds JSON-LD objects. Pure functions: input is post metadata or
  nothing, output is a serialisable object. No DOM or Svelte dependency, so it is directly
  testable.
- `src/lib/components/Seo.svelte`: renders `<title>`, meta description, canonical, Open Graph,
  Twitter card, and a JSON-LD script tag into `<svelte:head>`.
- `src/lib/components/Prose.svelte`: long-form typography wrapper for rendered markdown.
- `src/lib/components/Aura.svelte`: the existing animated background, extracted so the landing
  page can use it at full strength and article pages can reduce or omit it.
- `src/routes/writing/+page.ts` / `+page.svelte`: index data + view.
- `src/routes/writing/[slug]/+page.ts` / `+page.svelte`: article data + view.

## Content model

Essays live in `content/writing/<slug>.md`. The filename is the slug; there is no separate slug
field, which removes a class of mismatch bugs.

```markdown
---
title: "Amplify, Don't Offload"
date: 2026-07-24
description: "Cognitive offloading in the age of generative AI, and a working framework for staying sharp."
tags: ["ai", "research", "cognition"]
draft: false
series: "InfraMS Research"
seriesNo: "No. 2026/01"
---

Body in markdown.
```

Field rules, enforced at build time:

| Field | Type | Required | Rule |
|---|---|---|---|
| `title` | string | yes | non-empty |
| `date` | date | yes | `YYYY-MM-DD`, parseable |
| `description` | string | yes | non-empty; used for meta description, index, RSS |
| `tags` | string[] | no | defaults to `[]` |
| `draft` | boolean | no | defaults to `false`; drafts excluded from build output, index, RSS, sitemap |
| `series` | string | no | e.g. `InfraMS Research` |
| `seriesNo` | string | no | e.g. `No. 2026/01` |
| `updated` | date | no | if present, emitted as `dateModified` |

Invalid frontmatter fails the build with a message naming the file and the field. A broken
essay must not silently ship as a blank page.

Reading time is derived, not authored: word count / 200 wpm, rounded up.

### Migration of existing content

The white paper is ported to `content/writing/amplify-dont-offload.md` with `series:
"InfraMS Research"` and `seriesNo: "No. 2026/01"`. Its references section is plain markdown.

## Design

The existing visual identity is kept and extended, not replaced.

- Palette: dark default (`--bg:#09090b`, `--ink:#f3f0ea`) with the light-mode block already
  present; brass `#c6982f`, madder `#c1443c`, indigo `#4d7fb3` accents.
- Type: Inter for UI and body, Georgia italic for the accent/serif line.
- Landing page: unchanged in feel, including the drifting aura, grain, and staggered rise-in.
- Article pages: reading-first. Measure ~65ch. Aura reduced or removed so it does not compete
  with body text. Clear heading hierarchy, styled blockquotes for pull-quotes, a references
  block, and figure/caption support.
- `prefers-reduced-motion` continues to disable animation, as it does today.

Deliberately avoided, per the author's stated preference and the existing commit history
("drop pulsing dot + footer separators"): decorative dot markers, separator-heavy footers,
emoji, and em dashes in prose.

## SEO and entity graph

This is the part that distinguishes the build, and it is why the site exists in its current form.

- The landing page keeps its `Person` and `Organization` JSON-LD unchanged, including the
  `@id` `https://tajioui.org/#anis` and `sameAs` links to Wikidata, LinkedIn, GitHub, InfraMS.
- Every article emits `BlogPosting` JSON-LD whose `author` is a reference to that same
  `@id` rather than a duplicated inline person. Each essay therefore attaches to the existing
  entity instead of creating a parallel one.
- `publisher` is the InfraMS organization node for pieces in the InfraMS Research series.
- Per-page canonical URL, Open Graph, and Twitter card tags.
- `rss.xml` and `sitemap.xml` generated from the same content module, so they cannot drift from
  what is actually published.

## Error handling

- Invalid or missing frontmatter: build fails loudly, naming file and field.
- Unknown slug at `/writing/[slug]`: SvelteKit `error(404)`, rendered by the styled 404 page.
- Empty essay list: `/writing` renders an explicit empty state rather than a bare page.
- Draft posts: excluded from the production build entirely, so an unfinished piece cannot be
  reached by guessing its URL.

## Testing

Vitest for unit tests, covering the logic that can silently corrupt output:

- `content.ts`: sorts by date descending; excludes drafts; computes reading time; throws on
  missing `title`, missing `date`, unparseable `date`, missing `description`.
- `jsonld.ts`: `BlogPosting` references the person `@id` rather than inlining a duplicate
  person; required fields present; `dateModified` emitted only when `updated` is set.
- RSS and sitemap: contain every non-draft post and no draft post.

Manual verification before merge: `npm run build && npm run preview`, then confirm the landing
page renders as before, an article renders, and `/rss.xml` and `/sitemap.xml` are valid. Rich
Results Test on the built article HTML to confirm the schema parses.

## Deployment

- `.github/workflows/deploy.yml`: on push to `main`, install, build, upload the static output,
  deploy to GitHub Pages.
- `static/CNAME` contains `tajioui.org` so the custom domain survives every deploy.
- `.nojekyll` is emitted so GitHub Pages does not run Jekyll over the output.

One manual step is required by the repository owner and cannot be done from this machine:
in the GitHub repository settings, set Pages source to "GitHub Actions" instead of branch-based
deployment. Until that flip, the Action will build successfully but the live site will still be
served from the old branch output.

## Risks

- **Custom domain loss.** If `CNAME` is not emitted into the build output, GitHub Pages drops the
  custom domain on deploy. Mitigated by placing it in `static/` and verifying it exists in the
  build output before the first deploy.
- **SEO regression.** The current page ranks as an entity anchor. Mitigated by porting the JSON-LD
  verbatim, keeping the same canonical URL for `/`, and not changing the landing page's copy or
  structure.
- **Pages settings not flipped.** Deploy appears to succeed while the live site is unchanged.
  Called out above as an explicit manual step and to be verified after the first deploy.

## Success criteria

1. `tajioui.org` serves the SvelteKit build, visually equivalent to the current landing page.
2. The white paper is readable at `tajioui.org/writing/amplify-dont-offload/`.
3. Adding an essay is: write a markdown file, commit, push. Nothing else.
4. Article HTML contains `BlogPosting` JSON-LD referencing the existing person `@id`.
5. `/rss.xml` and `/sitemap.xml` list all published essays and no drafts.
6. Unit tests pass; production build succeeds with no unresolved links.
