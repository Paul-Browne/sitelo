import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://example.com',
  // Speckyboy has ~2k posts — raise concurrency for a full rip
  build: {
    concurrency: 16,
  },
})
