export default {
  site: 'https://example.com',
  // One /devices rip, then pure local grouping — safe to parallelize pages
  renderConcurrency: 32,
  renderBatchSize: 128,
  images: {
    remote: true,
    // Thousands of remote Elisa assets — keep sharp serial on macOS
    concurrency: 2,
    widths: [400, 800, 1200],
    prune: true,
    formats: ['avif', 'webp']
  },
}
