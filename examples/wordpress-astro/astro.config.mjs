import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://example.com',
  // Page HTML is rendered in parallel. Speckyboy ~2k posts — raise if the
  // machine can take it.
  build: {
    concurrency: 64,
  },
})
