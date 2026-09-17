// @ts-check
import { defineConfig } from 'astro/config';

const base = process.env.BASE_PATH || '/';

export default defineConfig({
  output: 'static',
  site: 'https://shaury04.github.io',
  base,
  trailingSlash: 'always',
});
