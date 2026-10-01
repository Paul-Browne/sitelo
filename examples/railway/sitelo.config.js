/*
 * `site` turns on sitemap.xml. Railway exposes the service's public
 * domain to the build, so a deploy gets a correct sitemap with nothing
 * to set; SITE_URL wins when you move to a custom domain.
 */
const domain = process.env.RAILWAY_PUBLIC_DOMAIN

export default {
  site: process.env.SITE_URL ?? (domain ? `https://${domain}` : undefined),
}
