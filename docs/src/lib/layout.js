import {
  a,
  aside,
  body,
  button,
  details,
  div,
  h1,
  head,
  header,
  html,
  img,
  li,
  link,
  main,
  meta,
  nav,
  p,
  script,
  span,
  summary,
  sup,
  title,
  ul,
} from 'javascript-to-html'

import { createRequire } from 'node:module'

import {
  alert as uiAlert,
  appBar,
  appBarNav,
  appBarSpacer,
  button as uiButton,
  collapsible,
  footer as uiFooter,
  footerBottom,
  navLink,
  styles as uiStyles,
  visuallyHidden,
} from 'sitelo/ui'

import { uiDemoDefaults, uiTheme } from './ui-theme.js'

import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_FLAGS,
  LOCALE_NAMES,
  LOCALE_TAGS,
  OG_LOCALES,
  basePath,
  isTranslated,
  localePath,
  strings,
} from './i18n.js'
import { pageDates } from './last-modified.js'
import { docNav, exampleNav, hasUiSection, uiExtrasNav, uiNav } from './nav.js'
import { OG_IMAGE, SITE_NAME, SITE_URL, structuredData } from './seo.js'

const require = createRequire(import.meta.url)
const viteVersion = require('vite/package.json').version
const siteloVersion = require('../../../package.json').version

const viteBolt = `<svg class="badge-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2 3 14h7l-1 8 11-13h-8z"/></svg>`

/** Background behind the browser chrome, mirroring `--paper` in each theme. */
const THEME_COLORS = {
  dark: '#071410',
  light: '#eef3f0',
}

/**
 * Resolves the theme before the first paint, so a visitor who chose light
 * never sees a dark flash on the way in.
 *
 * Inline and blocking on purpose — anything deferred paints first. It always
 * resolves to a concrete `light` or `dark`, which is why the stylesheet needs
 * only one `[data-theme]` block rather than a matching media query. With
 * JavaScript off nothing runs, no attribute is set, and the site stays dark.
 */
const themeBootScript = `(function(){var s;try{s=localStorage.getItem('sitelo-theme')}catch(e){}var t=s==='light'||s==='dark'?s:window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.dataset.theme=t;var m=document.querySelector('meta[name="theme-color"]');if(m)m.setAttribute('content',t==='light'?'${THEME_COLORS.light}':'${THEME_COLORS.dark}')})()`

const GA_MEASUREMENT_ID = 'G-NSYEXEBN7C'

/** Where the visitor's answer to the cookie banner is kept. */
const CONSENT_KEY = 'sitelo-analytics-consent'

/**
 * Google Analytics, held back until the visitor accepts.
 *
 * Nothing reaches Google before that — gtag.js is injected by
 * `siteloLoadAnalytics`, which runs here only for someone who has already
 * accepted, and otherwise waits for the banner in `main.js` to call it.
 * Declining leaves the function defined and never called.
 *
 * Inline in <head> rather than deferred so a returning visitor's page view is
 * counted at the same point it would have been without the gate.
 */
const analyticsBootScript = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.siteloLoadAnalytics=function(){if(window.siteloAnalyticsLoaded)return;window.siteloAnalyticsLoaded=true;var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}';document.head.appendChild(s);gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}')};try{if(localStorage.getItem('${CONSENT_KEY}')==='granted')window.siteloLoadAnalytics()}catch(e){}`

const sunIcon = `<svg class="theme-icon theme-icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4.2"/><path d="M12 2.2v2.2M12 19.6v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.2 12h2.2M19.6 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"/></svg>`

const moonIcon = `<svg class="theme-icon theme-icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.8 13.1A8.6 8.6 0 1 1 10.9 3.2a6.9 6.9 0 0 0 9.9 9.9z"/></svg>`

/**
 * Theme toggle: an icon-only button in the desktop bar, an icon and a label
 * in the mobile menu, where every other row is labelled too.
 *
 * The server cannot know the visitor's theme, so the markup ships the label
 * for the dark default and `main.js` rewrites it once the theme is resolved.
 * The icon needs no such fix-up — CSS picks it straight off `data-theme`, so
 * it is already right on the first paint.
 */
function themeToggle(lang, variant = 'bar') {
  const t = strings(lang)
  const inList = variant === 'list'

  return button(
    {
      class: inList ? 'theme-toggle theme-toggle-row' : 'theme-toggle',
      type: 'button',
      'data-theme-toggle': '',
      ...(inList ? {} : { 'aria-label': t.themeToLight, title: t.themeToLight }),
    },
    sunIcon,
    moonIcon,
    inList ? span({ class: 'theme-toggle-label' }, t.themeToLight) : '',
  )
}

/**
 * Cookie consent.
 *
 * A small bar in the corner rather than a modal: it never covers the page, it
 * traps nothing, and ignoring it simply leaves analytics off. Ships `hidden`
 * and is revealed by `main.js`, which is the only side that can read the
 * stored answer — so a visitor who has already decided never sees it flash.
 */
function cookieBanner(lang) {
  const t = strings(lang)

  return uiAlert(
    {
      class: 'cookie-banner',
      color: 'neutral',
      variant: 'solid',
      // The banner is a notice, not an error, and nothing about it is
      // urgent — `alert()` reserves the assertive role for danger and
      // warning, which is the right call for a question a visitor may
      // ignore for as long as they like.
      icon: false,
      'data-cookie-banner': '',
      'aria-label': t.cookieLabel,
      hidden: true,
    },
    p({ class: 'cookie-banner-text' }, t.cookieText),
    div(
      { class: 'cookie-banner-actions' },
      uiButton(
        {
          variant: 'ghost',
          color: 'neutral',
          size: 'sm',
          'data-cookie-decline': '',
        },
        t.cookieDecline,
      ),
      uiButton(
        {
          variant: 'solid',
          color: 'primary',
          size: 'sm',
          'data-cookie-accept': '',
        },
        t.cookieAccept,
      ),
    ),
  )
}

function badge({ variant, href, label, name, value, icon, external = true }) {
  return a(
    {
      class: `badge ${variant}`,
      href,
      'aria-label': label,
      ...(external ? { rel: 'noopener', target: '_blank' } : {}),
    },
    span({ class: 'badge-name' }, icon ?? '', name),
    span({ class: 'badge-value' }, value),
  )
}

/** One row in the language switcher: flag + the language's own name. */
function languageOption(activeHref, locale, current) {
  return a(
    {
      class: current ? 'lang-option is-active' : 'lang-option',
      href: localePath(activeHref, locale),
      hreflang: LOCALE_TAGS[locale],
      lang: LOCALE_TAGS[locale],
      ...(current ? { 'aria-current': 'true' } : {}),
    },
    span({ class: 'lang-flag', 'aria-hidden': 'true' }, LOCALE_FLAGS[locale]),
    span({ class: 'lang-label' }, LOCALE_NAMES[locale]),
  )
}

/**
 * Language switcher, pointing at the same page in each locale.
 *
 * Rendered only for paths that exist in every locale, so a page without a
 * counterpart never offers a link to a missing translation.
 *
 * Two shapes: a `<details>` dropdown for the desktop bar, and a plain list for
 * inside the mobile menu — which is itself a `<details>`, and nesting one
 * dropdown in another to reach seven links is worse than just showing them.
 */
function languageSwitch(activeHref, lang, variant = 'dropdown') {
  if (activeHref == null || !isTranslated(activeHref)) return ''

  const t = strings(lang)
  const options = LOCALES.map((locale) =>
    languageOption(activeHref, locale, locale === lang),
  )

  if (variant === 'list') {
    return nav(
      { class: 'lang-list', 'aria-label': t.languageLabel },
      ...options,
    )
  }

  return details(
    { class: 'lang-switch' },
    summary(
      { class: 'lang-switch-toggle', 'aria-label': t.languageLabel },
      span({ class: 'lang-flag', 'aria-hidden': 'true' }, LOCALE_FLAGS[lang]),
      span({ class: 'lang-label' }, LOCALE_NAMES[lang]),
    ),
    nav(
      { class: 'lang-switch-panel', 'aria-label': t.languageLabel },
      ...options,
    ),
  )
}

function siteNav(activeHref = '/', lang = DEFAULT_LOCALE) {
  const t = strings(lang)
  const base = basePath(activeHref)

  const onDocs = base.startsWith('/docs')
  const onUi = base === '/ui' || base.startsWith('/ui/')
  const onExamples = base.startsWith('/examples')
  const onAbout = base === '/about'

  /*
   * `navLink()` rather than a bare `a`: it carries the padding, the
   * muted colour and the hover wash, and marks the current page with
   * `aria-current="page"` — which this site's own `.is-active` class
   * never did. The class is kept alongside it because the mobile panel
   * styles the active row differently from the bar.
   */
  const link_ = ({ current, href }, label) =>
    navLink(
      { ...(current ? { class: 'is-active' } : {}), current, href },
      label,
    )

  const links = [
    link_({ current: onDocs, href: localePath('/docs', lang) }, t.navDocs),
    hasUiSection(lang)
      ? link_({ current: onUi, href: localePath('/ui', lang) }, t.navUi)
      : '',
    link_(
      { current: onExamples, href: localePath('/examples', lang) },
      t.navExamples,
    ),
    link_({ current: onAbout, href: localePath('/about', lang) }, t.navAbout),
    navLink(
      { href: 'https://github.com/paul-browne/sitelo', rel: 'noopener' },
      'GitHub',
    ),
    navLink(
      { href: 'https://www.npmjs.com/package/sitelo', rel: 'noopener' },
      'npm',
    ),
  ]

  /*
   * `as: 'nav'` because this bar already sits inside `header.topbar`,
   * and `appBar()` renders a <header> by default — nesting one inside
   * the other would hand a screen reader two banner landmarks for one
   * bar.
   */
  return appBar(
    {
      as: 'nav',
      class: 'nav',
      href: localePath('/', lang),
      brand: img({
        class: 'nav-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '120',
        height: '34',
      }),
    },
    // The bar's own spacer, rather than an `auto` margin on the brand —
    // it is the same one line either way, and this one is the component's.
    appBarSpacer(),
    appBarNav(
      { class: 'nav-links' },
      ...links,
      languageSwitch(activeHref, lang),
      themeToggle(lang),
    ),
    details(
      { class: 'nav-menu' },
      summary({ class: 'nav-menu-toggle', 'aria-label': t.openMenu }, t.menu),
      div(
        { class: 'nav-menu-panel' },
        ...links,
        themeToggle(lang, 'list'),
        languageSwitch(activeHref, lang, 'list'),
      ),
    ),
  )
}

function siteFooter(lang = DEFAULT_LOCALE) {
  const t = strings(lang)

  /*
   * `footer()` from sitelo-ui rather than a bare <footer>: it already
   * carries the rule above it, the muted colour and the smaller type,
   * which is every declaration this site's own `.footer` used to make.
   * One column, because the docs footer is two stacked rows and not the
   * link grid the component defaults to.
   *
   * `footerBottom()` is deliberately not used — it adds a second
   * `border-top` for the row it separates, and with nothing above it
   * that reads as a double rule.
   */
  return uiFooter(
    { class: 'footer', columns: '1fr' },
    p(`© Paul Browne ${new Date().getFullYear()}`),
    p(
      { class: 'footer-meta' },
      badge({
        variant: 'badge-sitelo',
        href: 'https://github.com/paul-browne/sitelo',
        label: t.githubLabel(siteloVersion),
        name: 'sitelo',
        value: `v${siteloVersion}`,
      }),
      badge({
        variant: 'badge-license',
        href: '/license.txt',
        label: t.licenseLabel,
        name: 'license',
        value: 'MIT',
        external: false,
      }),
      badge({
        variant: 'badge-node',
        href: 'https://nodejs.org/docs/latest/api/',
        label: t.nodeLabel,
        name: 'node',
        value: '20.19+',
      }),
      badge({
        variant: 'badge-vite',
        href: 'https://vite.dev',
        label: t.viteLabel(viteVersion),
        name: 'vite',
        value: `v${viteVersion}`,
        icon: viteBolt,
      }),
    ),
  )
}

/**
 * Section sidebar.
 *
 * A `<details>` rather than a bare list. The component reference runs to
 * sixty-odd links, which on a phone pushed the article a full screen down;
 * closed it costs one row. The stylesheet forces it open from 861px up,
 * where the sidebar has a column of its own and nothing to gain by hiding.
 *
 * The summary names the page the visitor is on, since a closed nav leaves
 * them nothing else to place themselves by. It is the phone's label, and the
 * `<p>` above it the wide screen's — one of the two is always `display: none`,
 * which is what keeps a permanently open disclosure from offering a desktop
 * visitor a control that does nothing. Search sits outside the whole thing,
 * in reach on every screen.
 */
function sideNav({ label, items, activeHref }) {
  const current = items.find((item) => item.href === activeHref)

  return aside(
    { class: 'docs-sidebar', 'aria-label': label },
    div({ id: 'docs-search' }),
    p({ class: 'docs-sidebar-label' }, label),
    collapsible(
      {
        class: 'docs-sidebar-disclosure',
        trigger: [
          label,
          current ? span({ class: 'docs-sidebar-current' }, current.label) : '',
        ].join(''),
      },
      nav(
        { class: 'docs-side-nav' },
        // A `heading` entry groups the links that follow it; the UI sidebar
        // uses them to keep the component reference's sections.
        ...items.map((item) =>
          item.heading
            ? p({ class: 'docs-side-nav-heading' }, item.heading)
            : a(
                {
                  href: item.href,
                  ...(item.href === activeHref
                    ? { class: 'is-active', 'aria-current': 'page' }
                    : {}),
                },
                item.label,
                // `js` marks a component that wants the client runtime. The
                // title is what a mouse gets; the visually hidden text is
                // what a screen reader reads, since "js" on its own is
                // announced as a letter pair and explains nothing.
                item.js
                  ? sup(
                      { class: 'docs-side-nav-js', title: 'Needs JavaScript' },
                      'js',
                      visuallyHidden(' (needs JavaScript)'),
                    )
                  : '',
              ),
        ),
      ),
    ),
  )
}

/** `hreflang` alternates so search engines pair the two language versions. */
function alternateLinks(path) {
  if (path == null || !isTranslated(path)) return []

  return [
    ...LOCALES.map((locale) =>
      link({
        rel: 'alternate',
        hreflang: LOCALE_TAGS[locale],
        href: `${SITE_URL}${localePath(path, locale)}`,
      }),
    ),
    link({
      rel: 'alternate',
      hreflang: 'x-default',
      href: `${SITE_URL}${basePath(path)}`,
    }),
  ]
}

/**
 * Sections whose index page is named for the section rather than its own
 * heading in a breadcrumb trail — `/docs` is "Getting started" on the page
 * but "Docs" as a step on the way to `/docs/routing`.
 */
function sectionNames(lang) {
  const t = strings(lang)
  return {
    '/docs': t.navDocs,
    '/ui': t.navUi,
    '/examples': t.navExamples,
    '/ui-extras': 'UI extras',
  }
}

/**
 * The trail from the home page to `path`, for the `BreadcrumbList` in the
 * page's structured data.
 *
 * Each step is a page the visitor could reach: a section, then any parent
 * the sidebar lists (`/ui/theming` above its presets), then the page itself.
 * A prefix with no page behind it is skipped rather than linked.
 */
function breadcrumbs(path, heading, lang) {
  const base = basePath(path)
  const sections = sectionNames(lang)
  const labels = new Map(
    [...docNav(lang), ...uiNav(lang), ...exampleNav(lang), ...uiExtrasNav()]
      .filter((item) => item.href)
      .map((item) => [basePath(item.href), item.label]),
  )
  const crumb = (href, name) => ({ name, url: `${SITE_URL}${localePath(href, lang)}` })

  const trail = [crumb('/', SITE_NAME)]
  if (base === '/') return trail

  const segments = base.split('/').filter(Boolean)
  for (let depth = 1; depth < segments.length; depth++) {
    const prefix = `/${segments.slice(0, depth).join('/')}`
    const name = sections[prefix] ?? labels.get(prefix)
    if (name) trail.push(crumb(prefix, name))
  }

  trail.push(crumb(base, sections[base] ?? heading))
  return trail
}

/**
 * Where the plain-Markdown copy of a page lives, for the pages that have one:
 * the English guides and the about page. `/docs/routing` → `/docs/routing.md`,
 * mirroring the flat `docs/routing.html` beside it.
 *
 * The build reads this `<link>` back to decide which pages to convert — see
 * `docs/plugins/machine-readable.js` — so the head is the only list of them.
 */
function markdownHref(path, kind, lang) {
  if (path == null || lang !== DEFAULT_LOCALE) return undefined
  if (kind !== 'article' && kind !== 'about') return undefined
  return `${path}.md`
}

function pageShell({
  pageTitle,
  heading,
  description,
  bodyClass = '',
  kind,
  noindex = false,
  path,
  lang = DEFAULT_LOCALE,
  preload = [],
  extraHead = [],
  children,
}) {
  const t = strings(lang)
  const content = Array.isArray(children) ? children : [children]
  const pageDescription = description ?? t.defaultDescription
  const canonical = path != null ? `${SITE_URL}${path}` : undefined
  const isArticle = kind === 'article'
  const dates = path != null ? pageDates(path) : undefined
  const markdown = markdownHref(path, kind, lang)
  const otherLocales =
    path != null && isTranslated(path) ? LOCALES.filter((locale) => locale !== lang) : []

  return html(
    { lang: LOCALE_TAGS[lang] },
    head(
      meta({ charset: 'utf-8' }),
      meta({
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      }),
      meta({
        name: 'description',
        content: pageDescription,
      }),
      title(pageTitle),
      /*
       * The 404s, in every locale. The host serves the root one with a 404
       * status, which says as much; the locale copies are ordinary pages at
       * `/de/404` and friends, answered with a 200, and would otherwise be
       * indexed as ten soft 404s. The build also leaves anything marked
       * here out of the sitemap.
       */
      noindex ? meta({ name: 'robots', content: 'noindex' }) : '',
      link({ rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }),
      link({ rel: 'apple-touch-icon', href: '/icon-192.png' }),
      link({ rel: 'manifest', href: '/manifest.webmanifest' }),
      meta({ name: 'theme-color', content: THEME_COLORS.dark }),
      script(themeBootScript),
      canonical ? link({ rel: 'canonical', href: canonical }) : '',
      ...alternateLinks(path),
      markdown
        ? link({ rel: 'alternate', type: 'text/markdown', href: markdown })
        : '',
      meta({ property: 'og:site_name', content: SITE_NAME }),
      meta({ property: 'og:title', content: pageTitle }),
      meta({ property: 'og:description', content: pageDescription }),
      meta({ property: 'og:type', content: isArticle ? 'article' : 'website' }),
      meta({ property: 'og:locale', content: OG_LOCALES[lang] }),
      ...otherLocales.map((locale) =>
        meta({ property: 'og:locale:alternate', content: OG_LOCALES[locale] }),
      ),
      canonical ? meta({ property: 'og:url', content: canonical }) : '',
      meta({ property: 'og:image', content: OG_IMAGE.url }),
      meta({ property: 'og:image:type', content: OG_IMAGE.type }),
      meta({ property: 'og:image:width', content: String(OG_IMAGE.width) }),
      meta({ property: 'og:image:height', content: String(OG_IMAGE.height) }),
      meta({ property: 'og:image:alt', content: OG_IMAGE.alt }),
      ...(isArticle && dates
        ? [
            meta({ property: 'article:published_time', content: dates.published }),
            meta({ property: 'article:modified_time', content: dates.modified }),
          ]
        : []),
      meta({ name: 'twitter:card', content: 'summary_large_image' }),
      /*
       * Structured data for everything with an address. The 404s have none —
       * no canonical, nothing to describe — and are left without.
       */
      canonical && kind
        ? structuredData({
            kind,
            url: canonical,
            lang,
            title: pageTitle,
            heading,
            description: pageDescription,
            dates,
            crumbs: breadcrumbs(path, heading ?? pageTitle, lang),
          })
        : '',
      /*
       * The wordmark is above the fold on every page — the topbar on all of
       * them, the hero as well on the landing pages. Both `img`s resolve to
       * this one request, and the hint on the hero image alone does not reach
       * it: the topbar's copy comes first in the document, so that is the one
       * the preload scanner acts on. Stating it here settles the priority
       * before either element is parsed.
       */
      link({
        rel: 'preload',
        as: 'image',
        href: '/logo.svg',
        fetchpriority: 'high',
      }),
      /*
       * Body and heading type, which every page sets before anything else is
       * painted. Without these the browser cannot ask for a font until
       * styles.css has parsed; naming them here runs both alongside it. One
       * file per family covers every weight the site uses, so there is no
       * chance of pulling a face the page never sets — and `crossorigin` is
       * required even same-origin, since fonts are fetched in CORS mode and
       * a hint without it is simply fetched twice.
       */
      ...['source-sans-3-400-600-latin', 'sora-500-700-latin', 'ibm-plex-mono-400-latin'].map((f) =>
        link({
          rel: 'preload',
          as: 'font',
          type: 'font/woff2',
          href: `/fonts/${f}.woff2`,
          crossorigin: '',
        }),
      ),
      ...preload.map((p) => link({ rel: 'preload', ...p })),
      /*
       * sitelo-ui, on every page rather than only the ones documenting it.
       * The chrome around the article — the bar, the footer, the sidebar
       * disclosure, the tables, the cookie notice — is built from the
       * library now, so the sheet is no longer optional here.
       *
       * The order of these three is load-bearing. `ui.css` first, because
       * everything after it is an override of something it declares.
       * `uiTheme()` next, restating sitelo-ui's tokens in terms of this
       * site's palette. The docs sheet last: it declares `color-scheme` on
       * `:root` and its dark default is the one that has to survive.
       * `text-size-adjust` is declared on `:root` by both sheets at the
       * same `100%`, so their order does not matter.
       */
      uiStyles(),
      uiTheme(),
      ...extraHead,
      link({ rel: 'stylesheet', href: '/styles.css' }),
      script(analyticsBootScript),
    ),
    body(
      { class: bodyClass },
      div(
        { id: 'atmosphere', class: 'atmosphere', 'aria-hidden': 'true' },
        // Six drifting washes, coloured and animated entirely from the
        // stylesheet — see `.atmosphere` in styles.css.
        ...Array.from({ length: 6 }, () => span({ class: 'atmosphere-blob' })),
      ),
      ...content,
      cookieBanner(lang),
      script({ type: 'module', src: '/main.js' }),
    ),
  )
}

/** German spells out its umlauts when transliterating: ä → ae, ß → ss. */
/**
 * Letters a locale spells out before the accent fold below, because NFD
 * leaves them alone: they are single code points rather than a base letter
 * plus a combining mark, so the fold cannot see them. A locale with no
 * entry folds alone.
 */
const TRANSLITERATIONS = {
  de: [
    [/ä/g, 'ae'],
    [/ö/g, 'oe'],
    [/ü/g, 'ue'],
    [/ß/g, 'ss'],
  ],
  pl: [[/ł/g, 'l']],
  tr: [[/ı/g, 'i']],
}

/**
 * Locales whose headings are folded to unaccented ASCII.
 *
 * Deliberately excludes the non-Latin scripts: NFD decomposition would turn
 * Russian "й" into "и" and "ё" into "е", quietly changing the word.
 */
const FOLD_TO_ASCII = new Set([
  'en',
  'es',
  'fr',
  'de',
  'pt',
  'it',
  'pl',
  'tr',
  'id',
])

/**
 * Slugify a heading for use as an anchor id.
 *
 * Latin-script locales fold to ASCII, so a Spanish heading like "Optimización
 * de imágenes" slugs to `optimizacion-de-imagenes` rather than losing every
 * accented letter to a dash. Some letters are spelled out first, because the
 * fold cannot see them: German umlauts give `jsx-einschraenkungen` rather
 * than `jsx-einschrankungen`, Polish “ł” becomes a plain `l`
 * rather than surviving as itself, and Turkish dotless “ı” becomes `i`, so
 * “JSX kısıtlamaları” slugs to `jsx-kisitlamalari`. Turkish “İ” needs no
 * rule: `toLowerCase` leaves a combining dot the fold then removes.
 *
 * Russian and Chinese keep their own characters — HTML5 ids allow them, and
 * stripping to ASCII would leave every heading with an empty or colliding id.
 */
function slugify(text, lang) {
  let value = text.toLowerCase()

  for (const [pattern, replacement] of TRANSLITERATIONS[lang] ?? []) {
    value = value.replace(pattern, replacement)
  }

  if (FOLD_TO_ASCII.has(lang)) {
    value = value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  }

  return value
    .replace(/[^\p{L}\p{N}]+/gu, '-')
    .replace(/^-+|-+$/g, '')
}

/** Add ids to <h2> headings and collect them for a table of contents. */
function withHeadingAnchors(content, lang) {
  const headings = []

  const transformed = content.map((chunk) =>
    String(chunk).replace(/<h2>(.*?)<\/h2>/g, (match, inner) => {
      const text = inner.replace(/<[^>]*>/g, '')
      const slug = slugify(text, lang)
      headings.push({ slug, text })
      return `<h2 id="${slug}">${inner}</h2>`
    }),
  )

  return { transformed, headings }
}

function tableOfContents(headings, lang) {
  if (headings.length < 3) return ''

  const t = strings(lang)

  /*
   * A plain `ul` and not sitelo-ui's `list()`. The component is a
   * vertical, ruled, one-per-row list — an inbox, a settings pane — and
   * every declaration that makes it that (`padding: 1rem` on the item, a
   * rule under each one) is wrong for a wrapped row of short anchors.
   * Adopting it here would mean overriding the component in three places
   * to get back to what four lines of CSS already do.
   */
  return nav(
    { class: 'docs-toc', 'aria-label': t.tocLabel },
    p({ class: 'docs-toc-label' }, t.tocLabel),
    ul(...headings.map(({ slug, text }) => li(a({ href: `#${slug}` }, text)))),
  )
}

function pageNav(items, activeHref, lang) {
  const index = items.findIndex((item) => item.href === activeHref)
  if (index === -1) return ''

  const previous = index > 0 ? items[index - 1] : null
  const next = index < items.length - 1 ? items[index + 1] : null
  if (!previous && !next) return ''

  const t = strings(lang)

  const pageNavLink = (item, direction) =>
    a(
      { class: `docs-pagenav-link docs-pagenav-${direction}`, href: item.href },
      span(
        { class: 'docs-pagenav-direction' },
        direction === 'prev' ? t.previous : t.next,
      ),
      span({ class: 'docs-pagenav-label' }, item.label),
    )

  return nav(
    { class: 'docs-pagenav', 'aria-label': t.pagenavLabel },
    previous ? pageNavLink(previous, 'prev') : span(),
    next ? pageNavLink(next, 'next') : span(),
  )
}

function guideLayout({
  title: heading,
  // Overrides the composed `<heading> · <suffix>`, for the page whose
  // heading is already the section's name.
  pageTitle,
  description,
  activeHref,
  sidebarLabel,
  sidebarItems,
  titleSuffix,
  lang,
  extraHead,
  children,
}) {
  const content = Array.isArray(children) ? children : [children]
  const { transformed, headings } = withHeadingAnchors(content, lang)
  // Group headings are labels, not destinations, so prev/next skips them.
  const pages = sidebarItems.filter((item) => item.href)

  return pageShell({
    pageTitle: pageTitle ?? `${heading} · ${titleSuffix}`,
    heading,
    description,
    bodyClass: 'page-docs',
    kind: 'article',
    path: activeHref,
    lang,
    extraHead,
    /*
     * Only these pages render #docs-search, and only they should pay for it.
     * main.js cannot ask for the search UI until it has run, which is after
     * the document is parsed — naming the two files here hands them to the
     * preload scanner instead, so they load beside main.js rather than behind
     * it. A build with no index 404s them; that costs a dev two console lines
     * and the page nothing, since main.js already collapses the empty mount.
     */
    preload: [
      { as: 'style', href: '/pagefind/pagefind-ui.css' },
      { as: 'script', href: '/pagefind/pagefind-ui.js' },
    ],
    children: [
      header(
        { class: 'topbar' },
        div({ class: 'topbar-inner' }, siteNav(activeHref, lang)),
      ),
      div(
        { class: 'docs-shell' },
        sideNav({
          label: sidebarLabel,
          items: sidebarItems,
          activeHref,
        }),
        main(
          { class: 'docs-main', 'data-pagefind-body': '' },
          h1(heading),
          tableOfContents(headings, lang),
          ...transformed,
          pageNav(pages, activeHref, lang),
        ),
      ),
      siteFooter(lang),
    ],
  })
}

/** Layouts bound to a locale. */
export function createLayouts(lang = DEFAULT_LOCALE) {
  const t = strings(lang)

  function landingLayout({ children, pageTitle, description }) {
    const content = Array.isArray(children) ? children : [children]
    const activeHref = localePath('/', lang)

    return pageShell({
      pageTitle,
      description,
      bodyClass: 'page-landing',
      kind: 'home',
      path: activeHref,
      lang,
      children: [
        header(
          { class: 'topbar' },
          div({ class: 'topbar-inner' }, siteNav(activeHref, lang)),
        ),
        /*
         * The hero and the sections below it are separate blocks, but they
         * still need one `main` around them: the other two layouts each have
         * theirs, and without it the landing pages are the only ones with no
         * landmark for a screen reader to skip the nav with.
         */
        main(...content),
        siteFooter(lang),
      ],
    })
  }

  /*
   * The about page, and the 404s with `noindex`. The title carries the site's
   * name because the heading alone does not: a result or a tab reading
   * "About", with nothing to say about what, is no use to anyone.
   */
  function pageLayout({ title: heading, description, activeHref, noindex = false, children }) {
    const content = Array.isArray(children) ? children : [children]

    return pageShell({
      pageTitle: `${heading} · ${SITE_NAME}`,
      heading,
      description,
      bodyClass: 'page-content',
      kind: noindex ? undefined : 'about',
      noindex,
      path: activeHref,
      lang,
      children: [
        header(
          { class: 'topbar' },
          div({ class: 'topbar-inner' }, siteNav(activeHref, lang)),
        ),
        main({ class: 'content-main' }, h1(heading), ...content),
        siteFooter(lang),
      ],
    })
  }

  function docsLayout(args) {
    return guideLayout({
      ...args,
      lang,
      sidebarLabel: t.sidebarDocs,
      sidebarItems: docNav(lang),
      titleSuffix: t.titleSuffixDocs,
    })
  }

  function uiLayout({ extraHead = [], ...args }) {
    return guideLayout({
      ...args,
      /*
       * The component pages, and only they, put sitelo-ui's own tokens
       * back inside the demo previews — see `uiDemoDefaults`. Every other
       * page renders the library in this site's colours, which is the
       * whole point of the theme; a reference that did the same would be
       * documenting the docs rather than the library.
       */
      extraHead: [uiDemoDefaults(), ...extraHead],
      lang,
      sidebarLabel: t.sidebarUi,
      sidebarItems: uiNav(lang),
      titleSuffix: t.titleSuffixUi,
    })
  }

  /*
   * `/ui-extras` is `/ui` with a different sidebar: the same shell, the
   * same demo tokens, and the same chrome — which is the locale's, since
   * the bar and footer around an untranslated page are still in the
   * visitor's language. The section itself is English only, so the
   * sidebar labels and the title suffix are not looked up.
   */
  function uiExtrasLayout({ extraHead = [], ...args }) {
    return guideLayout({
      ...args,
      extraHead: [uiDemoDefaults(), ...extraHead],
      lang,
      sidebarLabel: 'Extras',
      sidebarItems: uiExtrasNav(),
      titleSuffix: 'sitelo UI extras',
    })
  }

  function examplesLayout(args) {
    return guideLayout({
      ...args,
      lang,
      sidebarLabel: t.sidebarExamples,
      sidebarItems: exampleNav(lang),
      titleSuffix: t.titleSuffixExamples,
    })
  }

  return { landingLayout, pageLayout, docsLayout, uiLayout, uiExtrasLayout, examplesLayout }
}

const en = createLayouts(DEFAULT_LOCALE)

export const landingLayout = en.landingLayout
export const pageLayout = en.pageLayout
export const docsLayout = en.docsLayout
export const uiLayout = en.uiLayout
export const uiExtrasLayout = en.uiExtrasLayout
export const examplesLayout = en.examplesLayout
