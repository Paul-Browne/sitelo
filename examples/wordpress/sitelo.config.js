export default {
  // site: 'https://example.com',
  // Page HTML is rendered in parallel (p-limit). After the WP list rip
  // fills the in-memory cache, render is mostly CPU — 32–64 is plenty
  // for ~2k Speckyboy pages. Higher values burn RAM with little gain.
  renderConcurrency: 64,
  renderBatchSize: 128,
  // pagefind: true,  
}
