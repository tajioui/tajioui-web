import adapter from '@sveltejs/adapter-static';
import { mdsvex } from 'mdsvex';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: ['.svelte', '.md'],
  preprocess: [mdsvex({ extensions: ['.md'] })],
  kit: {
    adapter: adapter({ pages: 'build', assets: 'build', precompress: false, strict: true }),
    prerender: { handleHttpError: 'fail' }
  }
};

export default config;
