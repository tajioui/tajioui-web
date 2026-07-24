# tajioui.org SvelteKit Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild tajioui.org as a static SvelteKit site that publishes long-form essays authored as markdown, without losing the existing design or entity/SEO markup.

**Architecture:** SvelteKit with `adapter-static`, every route prerendered. A single content module reads `content/writing/*.md` at build time, validates frontmatter, and feeds the index, article pages, RSS, and sitemap so they cannot drift. Each article emits `BlogPosting` JSON-LD that references the existing Person `@id` rather than duplicating it.

**Tech Stack:** SvelteKit 2.x, Svelte 5, mdsvex 0.12.x, adapter-static 3.x, Vitest 4.x, bun (package manager), GitHub Actions to GitHub Pages.

## Global Constraints

- Site is English only. No i18n.
- Existing design tokens are preserved verbatim: `--bg:#09090b`, `--ink:#f3f0ea`, `--muted:#8f8f99`, `--faint:#5a5a63`, brass `#c6982f`, madder `#c1443c`, indigo `#4d7fb3`. Light mode block preserved.
- Existing JSON-LD on `/` is ported verbatim, including `@id` `https://tajioui.org/#anis` and all `sameAs` entries.
- Prose style bans: no emoji, no em dashes, no decorative dot markers, no separator-heavy footers.
- Filename is the slug. No `slug` frontmatter field.
- Drafts are excluded from build output entirely, not merely hidden.
- Invalid frontmatter fails the build with a message naming the file and the field.
- `trailingSlash: 'always'`.
- `static/CNAME` must contain `tajioui.org` and survive every build.
- Commit identity: `Anis Tajioui <anis@tajioui.org>`.

---

### Task 1: Scaffold SvelteKit with static adapter and mdsvex

**Files:**
- Create: `package.json`, `svelte.config.js`, `vite.config.ts`, `tsconfig.json`, `src/app.html`, `src/routes/+layout.ts`, `src/routes/+page.svelte`, `.gitignore`, `static/.nojekyll`
- Move: `CNAME` to `static/CNAME`
- Preserve: existing `index.html` at repo root until Task 5 ports it, then delete

**Interfaces:**
- Produces: a buildable SvelteKit project. `bun run build` emits `build/` containing `index.html`, `.nojekyll`, `CNAME`.

- [ ] **Step 1: Save the current landing page for porting**

```bash
cd ~/exp/anis-web
cp index.html docs/legacy-index.html
```

- [ ] **Step 2: Create `package.json`**

```json
{
  "name": "tajioui-web",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig.json",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@sveltejs/adapter-static": "^3.0.10",
    "@sveltejs/kit": "^2.70.1",
    "@sveltejs/vite-plugin-svelte": "^5.0.3",
    "mdsvex": "^0.12.8",
    "svelte": "^5.56.7",
    "svelte-check": "^4.1.4",
    "typescript": "^5.7.3",
    "vite": "^6.0.11",
    "vitest": "^4.1.10"
  }
}
```

- [ ] **Step 3: Create `svelte.config.js`**

```js
import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [mdsvex({ extensions: ['.md'] })],
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', fallback: undefined, precompress: false, strict: true }),
    prerender: { entries: ['*'], handleHttpError: 'fail' },
    trailingSlash: 'always'
  }
};

export default config;
```

- [ ] **Step 4: Create `vite.config.ts`, `tsconfig.json`, `src/app.html`**

`vite.config.ts`:
```ts
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  test: { include: ['src/**/*.{test,spec}.{js,ts}'] }
});
```

`tsconfig.json`:
```json
{
  "extends": "./.svelte-kit/tsconfig.json",
  "compilerOptions": {
    "allowJs": true,
    "checkJs": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "sourceMap": true,
    "strict": true,
    "moduleResolution": "bundler"
  }
}
```

`src/app.html`:
```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%230a0a0c'/%3E%3Ctext x='50' y='68' font-family='Georgia,serif' font-size='54' fill='%23c6982f' text-anchor='middle'%3EA%3C/text%3E%3C/svg%3E" />
  <link rel="alternate" type="application/rss+xml" title="Anis Tajioui" href="/rss.xml" />
  %sveltekit.head%
</head>
<body data-sveltekit-preload-data="hover">
  <div style="display: contents">%sveltekit.body%</div>
</body>
</html>
```

- [ ] **Step 5: Create `src/routes/+layout.ts` and a temporary `src/routes/+page.svelte`**

`src/routes/+layout.ts`:
```ts
export const prerender = true;
```

`src/routes/+page.svelte`:
```svelte
<h1>Anis Tajioui</h1>
```

- [ ] **Step 6: Create `.gitignore` and `static/.nojekyll`, move CNAME**

`.gitignore`:
```
node_modules
/build
/.svelte-kit
/package
.env
.env.*
!.env.example
.DS_Store
```

```bash
mkdir -p static
git mv CNAME static/CNAME
touch static/.nojekyll
```

- [ ] **Step 7: Install and build**

Run: `bun install && bun run build`
Expected: build succeeds, `build/index.html` exists, `build/CNAME` contains `tajioui.org`, `build/.nojekyll` exists.

```bash
test -f build/index.html && cat build/CNAME && test -f build/.nojekyll && echo OK
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "Scaffold SvelteKit with static adapter and mdsvex"
```

---

### Task 2: Content module with frontmatter validation

**Files:**
- Create: `src/lib/content.ts`, `src/lib/content.test.ts`
- Create: `content/writing/.gitkeep`

**Interfaces:**
- Produces:
  - `type PostMeta = { slug: string; title: string; date: string; description: string; tags: string[]; draft: boolean; series?: string; seriesNo?: string; updated?: string; readingMinutes: number }`
  - `validateFrontmatter(raw: unknown, file: string): Omit<PostMeta,'slug'|'readingMinutes'>` throws `Error` naming file and field
  - `readingMinutes(text: string): number`
  - `getAllPosts(): Promise<PostMeta[]>` reverse-chronological, drafts excluded
  - `getPost(slug: string): Promise<{ meta: PostMeta; component: unknown } | null>`

- [ ] **Step 1: Write the failing test**

`src/lib/content.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { validateFrontmatter, readingMinutes, sortPosts, isPublished } from './content';

const ok = { title: 'T', date: '2026-07-24', description: 'D' };

describe('validateFrontmatter', () => {
  it('accepts a valid record and applies defaults', () => {
    const r = validateFrontmatter(ok, 'a.md');
    expect(r.title).toBe('T');
    expect(r.tags).toEqual([]);
    expect(r.draft).toBe(false);
  });
  it('throws naming the file and the missing field', () => {
    expect(() => validateFrontmatter({ date: '2026-07-24', description: 'D' }, 'bad.md'))
      .toThrow(/bad\.md.*title/);
  });
  it('throws on unparseable date', () => {
    expect(() => validateFrontmatter({ ...ok, date: 'not-a-date' }, 'bad.md'))
      .toThrow(/bad\.md.*date/);
  });
  it('throws on empty description', () => {
    expect(() => validateFrontmatter({ ...ok, description: '  ' }, 'bad.md'))
      .toThrow(/bad\.md.*description/);
  });
});

describe('readingMinutes', () => {
  it('rounds up at 200 wpm', () => {
    expect(readingMinutes(new Array(200).fill('word').join(' '))).toBe(1);
    expect(readingMinutes(new Array(201).fill('word').join(' '))).toBe(2);
  });
  it('never returns zero', () => {
    expect(readingMinutes('hi')).toBe(1);
  });
});

describe('sortPosts', () => {
  it('sorts by date descending', () => {
    const a = { slug: 'a', date: '2026-01-01' } as never;
    const b = { slug: 'b', date: '2026-07-01' } as never;
    expect(sortPosts([a, b]).map((p: { slug: string }) => p.slug)).toEqual(['b', 'a']);
  });
});

describe('isPublished', () => {
  it('excludes drafts', () => {
    expect(isPublished({ draft: true } as never)).toBe(false);
    expect(isPublished({ draft: false } as never)).toBe(true);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test`
Expected: FAIL, cannot resolve `./content`.

- [ ] **Step 3: Write the implementation**

`src/lib/content.ts`:
```ts
export type PostMeta = {
  slug: string;
  title: string;
  date: string;
  description: string;
  tags: string[];
  draft: boolean;
  series?: string;
  seriesNo?: string;
  updated?: string;
  readingMinutes: number;
};

type RawMeta = Omit<PostMeta, 'slug' | 'readingMinutes'>;

function fail(file: string, field: string, why: string): never {
  throw new Error(`Invalid frontmatter in ${file}: field "${field}" ${why}`);
}

function asDateString(value: unknown): string | null {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? null : value.toISOString().slice(0, 10);
  if (typeof value !== 'string') return null;
  const t = Date.parse(value);
  return Number.isNaN(t) ? null : value.slice(0, 10);
}

export function validateFrontmatter(raw: unknown, file: string): RawMeta {
  if (typeof raw !== 'object' || raw === null) fail(file, 'frontmatter', 'is missing');
  const m = raw as Record<string, unknown>;

  if (typeof m.title !== 'string' || m.title.trim() === '') fail(file, 'title', 'is required and must be a non-empty string');
  const date = asDateString(m.date);
  if (!date) fail(file, 'date', 'is required and must be a parseable YYYY-MM-DD date');
  if (typeof m.description !== 'string' || m.description.trim() === '') fail(file, 'description', 'is required and must be a non-empty string');

  let updated: string | undefined;
  if (m.updated !== undefined) {
    const u = asDateString(m.updated);
    if (!u) fail(file, 'updated', 'must be a parseable YYYY-MM-DD date when present');
    updated = u;
  }
  if (m.tags !== undefined && !Array.isArray(m.tags)) fail(file, 'tags', 'must be an array of strings when present');

  return {
    title: m.title.trim(),
    date,
    description: m.description.trim(),
    tags: Array.isArray(m.tags) ? m.tags.map(String) : [],
    draft: m.draft === true,
    series: typeof m.series === 'string' ? m.series : undefined,
    seriesNo: typeof m.seriesNo === 'string' ? m.seriesNo : undefined,
    updated
  };
}

export function readingMinutes(text: string): number {
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function isPublished(p: Pick<PostMeta, 'draft'>): boolean {
  return !p.draft;
}

export function sortPosts<T extends { date: string }>(posts: T[]): T[] {
  return [...posts].sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

const modules = import.meta.glob('/content/writing/*.md', { eager: true }) as Record<
  string,
  { metadata: unknown; default: unknown }
>;
const sources = import.meta.glob('/content/writing/*.md', { eager: true, query: '?raw', import: 'default' }) as Record<string, string>;

function slugOf(path: string): string {
  return path.split('/').pop()!.replace(/\.md$/, '');
}

function buildAll(): { meta: PostMeta; component: unknown }[] {
  return Object.entries(modules).map(([path, mod]) => {
    const slug = slugOf(path);
    const meta = validateFrontmatter(mod.metadata, path);
    const body = (sources[path] ?? '').replace(/^---[\s\S]*?---/, '');
    return { meta: { ...meta, slug, readingMinutes: readingMinutes(body) }, component: mod.default };
  });
}

export async function getAllPosts(): Promise<PostMeta[]> {
  return sortPosts(buildAll().map((p) => p.meta).filter(isPublished));
}

export async function getPost(slug: string): Promise<{ meta: PostMeta; component: unknown } | null> {
  const hit = buildAll().find((p) => p.meta.slug === slug && isPublished(p.meta));
  return hit ?? null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test`
Expected: PASS, all content tests green.

- [ ] **Step 5: Commit**

```bash
mkdir -p content/writing && touch content/writing/.gitkeep
git add -A && git commit -m "Add content module with build-time frontmatter validation"
```

---

### Task 3: JSON-LD module

**Files:**
- Create: `src/lib/seo/jsonld.ts`, `src/lib/seo/jsonld.test.ts`

**Interfaces:**
- Consumes: `PostMeta` from `src/lib/content.ts`
- Produces:
  - `SITE = { url: 'https://tajioui.org', personId: 'https://tajioui.org/#anis', orgId: 'https://inframs.de/#org', name: 'Anis Tajioui' }`
  - `personLd(): object`, `orgLd(): object`, `blogPostingLd(meta: PostMeta): object`

- [ ] **Step 1: Write the failing test**

`src/lib/seo/jsonld.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { blogPostingLd, personLd, SITE } from './jsonld';
import type { PostMeta } from '../content';

const meta: PostMeta = {
  slug: 's', title: 'T', date: '2026-07-24', description: 'D',
  tags: [], draft: false, readingMinutes: 3
};

describe('blogPostingLd', () => {
  it('references the existing person @id instead of inlining a person', () => {
    const ld = blogPostingLd(meta) as Record<string, unknown>;
    expect(ld['@type']).toBe('BlogPosting');
    expect(ld.author).toEqual({ '@id': SITE.personId });
  });
  it('sets canonical url from the slug', () => {
    const ld = blogPostingLd(meta) as Record<string, string>;
    expect(ld.url).toBe('https://tajioui.org/writing/s/');
  });
  it('omits dateModified when updated is absent', () => {
    expect('dateModified' in (blogPostingLd(meta) as object)).toBe(false);
  });
  it('emits dateModified when updated is present', () => {
    const ld = blogPostingLd({ ...meta, updated: '2026-08-01' }) as Record<string, string>;
    expect(ld.dateModified).toBe('2026-08-01');
  });
  it('names InfraMS as publisher for the research series', () => {
    const ld = blogPostingLd({ ...meta, series: 'InfraMS Research' }) as Record<string, unknown>;
    expect(ld.publisher).toEqual({ '@id': SITE.orgId });
  });
});

describe('personLd', () => {
  it('keeps the entity anchor id and wikidata sameAs', () => {
    const ld = personLd() as Record<string, unknown>;
    expect(ld['@id']).toBe(SITE.personId);
    expect(JSON.stringify(ld.sameAs)).toContain('wikidata.org/wiki/Q140638702');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test`
Expected: FAIL, cannot resolve `./jsonld`.

- [ ] **Step 3: Write the implementation**

`src/lib/seo/jsonld.ts`:
```ts
import type { PostMeta } from '../content';

export const SITE = {
  url: 'https://tajioui.org',
  personId: 'https://tajioui.org/#anis',
  orgId: 'https://inframs.de/#org',
  name: 'Anis Tajioui',
  description:
    'German software developer and entrepreneur, co-founder and managing director of InfraMS UG.'
} as const;

export function personLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': SITE.personId,
    name: 'Anis Tajioui',
    givenName: 'Anis',
    familyName: 'Tajioui',
    url: `${SITE.url}/`,
    image: `${SITE.url}/anis.jpg`,
    jobTitle: 'Co-founder & Managing Director',
    description: SITE.description,
    nationality: 'German',
    knowsLanguage: ['German', 'English', 'Arabic', 'French'],
    knowsAbout: ['Data Science', 'Artificial Intelligence', 'Machine Learning', 'IT Modernization', 'Software Engineering', 'Cloud Infrastructure'],
    alumniOf: {
      '@type': 'CollegeOrUniversity',
      name: 'Duale Hochschule Baden-Württemberg Mannheim',
      sameAs: 'https://www.wikidata.org/wiki/Q1262608'
    },
    worksFor: {
      '@type': 'Organization',
      name: 'InfraMS UG (haftungsbeschränkt)',
      url: 'https://inframs.de',
      sameAs: 'https://www.wikidata.org/wiki/Q140638754'
    },
    sameAs: [
      'https://www.wikidata.org/wiki/Q140638702',
      'https://www.linkedin.com/in/anistji/',
      'https://github.com/tajioui',
      'https://inframs.de'
    ]
  };
}

export function orgLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': SITE.orgId,
    name: 'InfraMS UG (haftungsbeschränkt)',
    alternateName: 'InfraMS',
    url: 'https://inframs.de',
    sameAs: 'https://www.wikidata.org/wiki/Q140638754',
    foundingDate: '2024',
    founder: { '@id': SITE.personId },
    location: { '@type': 'Place', address: { '@type': 'PostalAddress', addressLocality: 'Hanau', addressCountry: 'DE' } }
  };
}

export function postUrl(slug: string): string {
  return `${SITE.url}/writing/${slug}/`;
}

export function blogPostingLd(meta: PostMeta) {
  const ld: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${postUrl(meta.slug)}#article`,
    headline: meta.title,
    description: meta.description,
    url: postUrl(meta.slug),
    datePublished: meta.date,
    inLanguage: 'en',
    author: { '@id': SITE.personId },
    mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl(meta.slug) }
  };
  if (meta.updated) ld.dateModified = meta.updated;
  if (meta.tags.length) ld.keywords = meta.tags.join(', ');
  if (meta.series) ld.publisher = { '@id': SITE.orgId };
  return ld;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `bun run test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add -A && git commit -m "Add JSON-LD builders anchored to the existing person entity"
```

---

### Task 4: Design system and SEO head component

**Files:**
- Create: `src/app.css`, `src/lib/components/Seo.svelte`, `src/lib/components/Aura.svelte`, `src/routes/+layout.svelte`

**Interfaces:**
- Produces: `Seo` accepting props `{ title: string; description: string; canonical: string; type?: 'website' | 'article'; jsonld?: unknown[] }`; `Aura` accepting `{ dim?: boolean }`; global CSS custom properties listed in Global Constraints.

- [ ] **Step 1: Create `src/app.css` with the existing token set**

```css
:root{
  --bg:#09090b; --ink:#f3f0ea; --muted:#8f8f99; --faint:#5a5a63;
  --line:rgba(255,255,255,.09); --card:rgba(255,255,255,.02);
  --brass:#c6982f; --madder:#c1443c; --indigo:#4d7fb3;
  --glow1:rgba(198,152,47,.20); --glow2:rgba(193,68,60,.16); --glow3:rgba(77,127,179,.12);
  --measure:65ch;
}
@media (prefers-color-scheme: light){
  :root{
    --bg:#f6f4ef; --ink:#17161a; --muted:#5f5e66; --faint:#9a988f;
    --line:rgba(0,0,0,.10); --card:rgba(0,0,0,.015);
    --brass:#9a6f16; --madder:#b23c34; --indigo:#3a6699;
    --glow1:rgba(198,152,47,.16); --glow2:rgba(193,68,60,.10); --glow3:rgba(77,127,179,.08);
  }
}
*{box-sizing:border-box;margin:0;padding:0}
html{-webkit-text-size-adjust:100%}
body{
  background:var(--bg); color:var(--ink);
  font-family:"Inter",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  font-feature-settings:"cv05","ss01","tnum";
  line-height:1.6; min-height:100svh; position:relative; overflow-x:hidden;
  -webkit-font-smoothing:antialiased;
}
a{color:inherit}
:focus-visible{outline:2px solid var(--brass); outline-offset:3px; border-radius:2px}
```

- [ ] **Step 2: Create `src/lib/components/Aura.svelte`**

```svelte
<script lang="ts">
  let { dim = false }: { dim?: boolean } = $props();
</script>

<div class="aura" class:dim aria-hidden="true"><i></i></div>
<div class="grain" aria-hidden="true"></div>

<style>
  .aura{position:fixed; inset:-30%; z-index:0; pointer-events:none; filter:blur(20px)}
  .aura.dim{opacity:.4}
  .aura::before,.aura::after{content:""; position:absolute; border-radius:50%; mix-blend-mode:screen; will-change:transform}
  .aura::before{width:60vmax; height:60vmax; left:-10vmax; top:-14vmax;
    background:radial-gradient(circle at center, var(--glow1), transparent 60%);
    animation:drift1 34s ease-in-out infinite alternate}
  .aura::after{width:52vmax; height:52vmax; right:-8vmax; bottom:-12vmax;
    background:radial-gradient(circle at center, var(--glow2), transparent 60%);
    animation:drift2 42s ease-in-out infinite alternate}
  .aura i{position:absolute; width:44vmax; height:44vmax; left:40%; top:30%; border-radius:50%;
    mix-blend-mode:screen; will-change:transform;
    background:radial-gradient(circle at center, var(--glow3), transparent 60%);
    animation:drift3 50s ease-in-out infinite alternate}
  @keyframes drift1{to{transform:translate3d(14vmax,10vmax,0) scale(1.15)}}
  @keyframes drift2{to{transform:translate3d(-12vmax,-8vmax,0) scale(1.1)}}
  @keyframes drift3{to{transform:translate3d(-16vmax,12vmax,0) scale(1.2)}}
  .grain{position:fixed; inset:0; z-index:1; pointer-events:none; opacity:.035;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")}
  @media (prefers-reduced-motion: reduce){ .aura::before,.aura::after,.aura i{animation:none} }
</style>
```

- [ ] **Step 3: Create `src/lib/components/Seo.svelte`**

```svelte
<script lang="ts">
  let {
    title, description, canonical, type = 'website', jsonld = []
  }: { title: string; description: string; canonical: string; type?: 'website' | 'article'; jsonld?: unknown[] } = $props();
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
  {#each jsonld as block}
    {@html `<script type="application/ld+json">${JSON.stringify(block)}<\/script>`}
  {/each}
</svelte:head>
```

- [ ] **Step 4: Create `src/routes/+layout.svelte`**

```svelte
<script lang="ts">
  import '../app.css';
  let { children } = $props();
</script>

{@render children()}
```

- [ ] **Step 5: Verify the build still succeeds**

Run: `bun run build`
Expected: build succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Add design tokens, Aura background, and SEO head component"
```

---

### Task 5: Port the landing page

**Files:**
- Create: `src/routes/+page.svelte` (replace the temporary one)
- Delete: root `index.html`
- Reference: `docs/legacy-index.html`

**Interfaces:**
- Consumes: `Aura`, `Seo`, `personLd`, `orgLd`

- [ ] **Step 1: Write `src/routes/+page.svelte`**

Port the markup from `docs/legacy-index.html` verbatim in structure and copy: eyebrow "Hanau, Germany", `h1` with `Anis` and stroked `Tajioui`, role line, `loc` line, bio paragraph, the four-cell facts grid, the links row. Add one new link to `/writing/` in the links row. Keep the staggered rise-in animation and the `sur` text-stroke treatment. Use `Aura` (full strength). Use `Seo` with `jsonld={[personLd(), orgLd()]}`.

```svelte
<script lang="ts">
  import Aura from '$lib/components/Aura.svelte';
  import Seo from '$lib/components/Seo.svelte';
  import { personLd, orgLd, SITE } from '$lib/seo/jsonld';
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
    <p class="role"><span class="thin">Software developer &amp; entrepreneur.</span> Co-founder of <b>InfraMS&nbsp;UG</b>.</p>
    <p class="loc">Data Science &amp; AI at DHBW Mannheim × Zurich Insurance.</p>
  </div>
  <p class="bio">
    I build systems, from AI and data pipelines to full-stack software. I co-founded
    <a href="https://inframs.de">InfraMS UG</a>, an IT-modernization company in Hanau, and study
    Data Science and Artificial Intelligence at DHBW Mannheim as a dual student with Zurich Insurance.
    Interested in turning messy real-world problems into things that quietly run themselves.
  </p>
  <div class="facts">
    <div class="fact"><div class="k">Company</div><div class="v">InfraMS&nbsp;UG</div></div>
    <div class="fact"><div class="k">Focus</div><div class="v">Data Science &amp; AI</div></div>
    <div class="fact"><div class="k">University</div><div class="v">DHBW Mannheim</div></div>
    <div class="fact"><div class="k">Languages</div><div class="v">DE · EN · AR · FR</div></div>
  </div>
  <div class="links">
    <a href="/writing/" data-internal>Writing</a>
    <a href="https://inframs.de">InfraMS</a>
    <a href="https://www.linkedin.com/in/anistji/">LinkedIn</a>
    <a href="https://github.com/tajioui">GitHub</a>
    <a href="https://www.wikidata.org/wiki/Q140638702">Wikidata</a>
  </div>
  <footer>© {new Date().getFullYear()} Anis Tajioui</footer>
</main>
```

Styles are ported from `docs/legacy-index.html` lines 123 to 167 (`main`, `.stack`, `.eyebrow`, `h1`, `.sur`, `.role`, `.loc`, `.bio`, `.facts`, `.fact`, `.links`, `footer`, reduced-motion block), scoped into this component, plus:

```css
  main{position:relative; z-index:2; width:100%; max-width:46rem; margin:0 auto; padding:8vh 6vw}
  .links a[data-internal]::after{content:"→"}
```

- [ ] **Step 2: Delete the legacy root page and build**

```bash
git rm -q index.html
bun run build
```
Expected: build succeeds. `/writing/` link will 404 until Task 6; prerender `handleHttpError: 'fail'` will catch it, so temporarily the link may be added in Task 6 instead if the build fails here. If the build fails on the unresolved `/writing/` link, remove that one link, commit, and re-add it in Task 6 Step 6.

- [ ] **Step 3: Verify visually**

Run: `bun run preview` and open the printed URL. Confirm the landing page matches the previous design: aura drifting, brass accents, facts grid, links row.

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Port landing page to SvelteKit, preserving design and entity markup"
```

---

### Task 6: Writing index and article routes

**Files:**
- Create: `src/lib/components/Prose.svelte`, `src/routes/writing/+page.ts`, `src/routes/writing/+page.svelte`, `src/routes/writing/[slug]/+page.ts`, `src/routes/writing/[slug]/+page.svelte`, `src/routes/+error.svelte`

**Interfaces:**
- Consumes: `getAllPosts()`, `getPost(slug)`, `blogPostingLd`, `postUrl`, `Seo`, `Aura`
- Produces: routes `/writing/` and `/writing/[slug]/`

- [ ] **Step 1: Create `src/routes/writing/+page.ts` and `+page.svelte`**

`+page.ts`:
```ts
import { getAllPosts } from '$lib/content';
export const prerender = true;
export async function load() {
  return { posts: await getAllPosts() };
}
```

`+page.svelte`: renders an `h1` "Writing", an intro line, then a list. Each item links to `/writing/{slug}/` and shows series label (when present), title, description, date formatted `DD.MM.YYYY`, and `{readingMinutes} min read`. When `posts.length === 0`, render the text "Nothing published yet." Use `Seo` with title "Writing — Anis Tajioui", canonical `${SITE.url}/writing/`.

- [ ] **Step 2: Create `src/lib/components/Prose.svelte`**

A wrapper that styles rendered markdown: `max-width: var(--measure)`, headings with clear hierarchy, `blockquote` styled as a pull-quote with a left brass rule, `code`/`pre` blocks, tables with top and bottom rules, `figure`/`figcaption`, and links underlined with brass. Uses `:global()` selectors since the markdown is injected.

- [ ] **Step 3: Create `src/routes/writing/[slug]/+page.ts`**

```ts
import { error } from '@sveltejs/kit';
import { getAllPosts, getPost } from '$lib/content';

export const prerender = true;

export async function entries() {
  return (await getAllPosts()).map((p) => ({ slug: p.slug }));
}

export async function load({ params }) {
  const post = await getPost(params.slug);
  if (!post) error(404, 'Not found');
  return { meta: post.meta, component: post.component };
}
```

- [ ] **Step 4: Create `src/routes/writing/[slug]/+page.svelte`**

Renders `Aura` with `dim`, a back link to `/writing/`, an article header (series label, `h1` title, date, reading time), then `<Prose>` wrapping `<svelte:component this={data.component} />`. `Seo` receives `type="article"`, canonical `postUrl(meta.slug)`, and `jsonld={[blogPostingLd(meta)]}`.

- [ ] **Step 5: Create `src/routes/+error.svelte`**

Renders the status and message, styled with the same tokens, plus a link back to `/`.

- [ ] **Step 6: Build and verify**

Run: `bun run build`
Expected: succeeds. With no content files yet, `/writing/` prerenders with the empty state.

- [ ] **Step 7: Commit**

```bash
git add -A && git commit -m "Add writing index, article route, prose styles, and error page"
```

---

### Task 7: RSS feed and sitemap

**Files:**
- Create: `src/routes/rss.xml/+server.ts`, `src/routes/sitemap.xml/+server.ts`, `src/lib/feeds.test.ts`, `src/lib/feeds.ts`

**Interfaces:**
- Produces: `renderRss(posts: PostMeta[]): string`, `renderSitemap(posts: PostMeta[]): string` in `src/lib/feeds.ts`; routes `/rss.xml` and `/sitemap.xml`

- [ ] **Step 1: Write the failing test**

`src/lib/feeds.test.ts`:
```ts
import { describe, it, expect } from 'vitest';
import { renderRss, renderSitemap } from './feeds';
import type { PostMeta } from './content';

const post: PostMeta = { slug: 'a', title: 'A & B', date: '2026-07-24', description: 'D', tags: [], draft: false, readingMinutes: 2 };

describe('renderRss', () => {
  it('includes published posts and escapes XML', () => {
    const xml = renderRss([post]);
    expect(xml).toContain('https://tajioui.org/writing/a/');
    expect(xml).toContain('A &amp; B');
    expect(xml.startsWith('<?xml')).toBe(true);
  });
});

describe('renderSitemap', () => {
  it('lists home, writing index, and each post', () => {
    const xml = renderSitemap([post]);
    expect(xml).toContain('<loc>https://tajioui.org/</loc>');
    expect(xml).toContain('<loc>https://tajioui.org/writing/</loc>');
    expect(xml).toContain('<loc>https://tajioui.org/writing/a/</loc>');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `bun run test`
Expected: FAIL, cannot resolve `./feeds`.

- [ ] **Step 3: Implement `src/lib/feeds.ts`**

```ts
import type { PostMeta } from './content';
import { SITE, postUrl } from './seo/jsonld';

function esc(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export function renderRss(posts: PostMeta[]): string {
  const items = posts.map((p) => `    <item>
      <title>${esc(p.title)}</title>
      <link>${postUrl(p.slug)}</link>
      <guid isPermaLink="true">${postUrl(p.slug)}</guid>
      <description>${esc(p.description)}</description>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
    </item>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Anis Tajioui</title>
    <link>${SITE.url}/</link>
    <description>Essays and reports by Anis Tajioui.</description>
    <language>en</language>
    <atom:link href="${SITE.url}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;
}

export function renderSitemap(posts: PostMeta[]): string {
  const urls = [`${SITE.url}/`, `${SITE.url}/writing/`, ...posts.map((p) => postUrl(p.slug))];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${u}</loc></url>`).join('\n')}
</urlset>`;
}
```

- [ ] **Step 4: Create the two server routes**

`src/routes/rss.xml/+server.ts`:
```ts
import { getAllPosts } from '$lib/content';
import { renderRss } from '$lib/feeds';
export const prerender = true;
export async function GET() {
  return new Response(renderRss(await getAllPosts()), { headers: { 'Content-Type': 'application/xml' } });
}
```

`src/routes/sitemap.xml/+server.ts` mirrors it with `renderSitemap`.

- [ ] **Step 5: Run tests and build**

Run: `bun run test && bun run build`
Expected: tests PASS, build emits `build/rss.xml` and `build/sitemap.xml`.

- [ ] **Step 6: Commit**

```bash
git add -A && git commit -m "Add RSS feed and sitemap generated from the content module"
```

---

### Task 8: Migrate the white paper

**Files:**
- Create: `content/writing/amplify-dont-offload.md`

- [ ] **Step 1: Write the essay file**

Frontmatter:
```yaml
---
title: "Amplify, Don't Offload"
date: 2026-07-24
description: "Cognitive offloading in the age of generative AI, and a working framework for staying sharp."
tags: ["ai", "cognition", "research"]
series: "InfraMS Research"
seriesNo: "No. 2026/01"
draft: false
---
```

Body: the full report text, sections 1 through 9 plus References, as plain markdown. Tables become markdown tables. No emoji, no em dashes.

- [ ] **Step 2: Build and verify the article renders**

Run: `bun run build`
Expected: `build/writing/amplify-dont-offload/index.html` exists.

```bash
grep -q 'BlogPosting' build/writing/amplify-dont-offload/index.html && grep -q 'tajioui.org/#anis' build/writing/amplify-dont-offload/index.html && echo "SCHEMA OK"
grep -q 'amplify-dont-offload' build/rss.xml && echo "RSS OK"
```

- [ ] **Step 3: Commit**

```bash
git add -A && git commit -m "Publish first essay: Amplify, Don't Offload"
```

---

### Task 9: GitHub Pages deployment workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Modify: `README.md`

- [ ] **Step 1: Create the workflow**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
      - run: bun install --frozen-lockfile
      - run: bun run test
      - run: bun run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: build
  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Rewrite `README.md`**

Document: what the site is, how to run it (`bun install`, `bun run dev`), how to publish an essay (create `content/writing/<slug>.md` with the required frontmatter, commit, push to `main`), and the one manual step: set Pages source to "GitHub Actions" in repository settings.

- [ ] **Step 3: Verify the full pipeline locally**

Run: `bun run test && bun run build`
Expected: both succeed.

```bash
test -f build/CNAME && test -f build/.nojekyll && test -f build/rss.xml && test -f build/sitemap.xml && echo "ARTIFACTS OK"
```

- [ ] **Step 4: Commit**

```bash
git add -A && git commit -m "Add GitHub Pages deployment workflow and update README"
```

---

## Verification before merge

1. `bun run test` passes.
2. `bun run build` succeeds with no prerender errors.
3. `bun run preview`: landing page matches the previous design, `/writing/` lists the essay, the article reads correctly.
4. `build/CNAME` contains `tajioui.org`.
5. Article HTML contains `BlogPosting` and the `@id` `https://tajioui.org/#anis`.
6. After merging to `main` and the first Action run, set repository Pages source to "GitHub Actions".
