export default {
  site: 'https://weeknight-kitchen.example',
  linkCheck: 'error',

  // Resize and convert every <img>, including the recipe photos from the API
  images: {
    remote: true,
  },

  // Index the recipe pages for search
  pagefind: true,

  // `sitelo lighthouse` audits a sample of the built site
  lighthouse: {
    include: ['index.html', 'recipes/**', 'cuisines/**'],
    sample: 2,
    // Performance still prints, but depends on the machine running the
    // audit, so only the other three fail the command
    thresholds: {
      accessibility: 100,
      'best-practices': 100,
      seo: 100,
    },
  },
}
