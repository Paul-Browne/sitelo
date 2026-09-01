import abb from './lib/abb.js'
import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-bash'

Prism.highlightAll()

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const THEME_KEY = 'sitelo-theme'

/** Keep in step with `CONSENT_KEY` in lib/layout.js. */
const CONSENT_KEY = 'sitelo-analytics-consent'

/**
 * Held at module scope on purpose: a MediaQueryList that nothing references
 * can be collected along with its listeners, which would silently stop the
 * site following the OS.
 */
const prefersLight = window.matchMedia('(prefers-color-scheme: light)')

/**
 * Copy-button feedback in the page's language — the server renders the resting
 * label, this covers the states that only exist after a click.
 */
const COPY_LABELS = {
  en: { copy: 'Copy', copied: 'Copied', failed: 'Failed' },
  es: { copy: 'Copiar', copied: 'Copiado', failed: 'Error' },
  fr: { copy: 'Copier', copied: 'Copié', failed: 'Échec' },
  de: { copy: 'Kopieren', copied: 'Kopiert', failed: 'Fehler' },
  ru: { copy: 'Копировать', copied: 'Скопировано', failed: 'Ошибка' },
  zh: { copy: '复制', copied: '已复制', failed: '失败' },
  pt: { copy: 'Copiar', copied: 'Copiado', failed: 'Erro' },
}

/**
 * Theme-toggle labels. The server renders the dark-theme wording because it
 * cannot know which theme will resolve; `applyTheme` corrects it on load and
 * on every flip. Keep these in step with `themeToLight` / `themeToDark` in
 * lib/i18n.js.
 */
const THEME_LABELS = {
  en: { toLight: 'Switch to light theme', toDark: 'Switch to dark theme' },
  es: { toLight: 'Cambiar al tema claro', toDark: 'Cambiar al tema oscuro' },
  fr: { toLight: 'Passer au th\u00e8me clair', toDark: 'Passer au th\u00e8me sombre' },
  de: {
    toLight: 'Zum hellen Design wechseln',
    toDark: 'Zum dunklen Design wechseln',
  },
  ru: {
    toLight: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430 \u0441\u0432\u0435\u0442\u043b\u0443\u044e \u0442\u0435\u043c\u0443',
    toDark: '\u041f\u0435\u0440\u0435\u043a\u043b\u044e\u0447\u0438\u0442\u044c \u043d\u0430 \u0442\u0451\u043c\u043d\u0443\u044e \u0442\u0435\u043c\u0443',
  },
  zh: { toLight: '\u5207\u6362\u5230\u6d45\u8272\u4e3b\u9898', toDark: '\u5207\u6362\u5230\u6df1\u8272\u4e3b\u9898' },
  pt: {
    toLight: 'Mudar para o tema claro',
    toDark: 'Mudar para o tema escuro',
  },
}

// `lang` may be a full tag (pt-PT, zh-Hans); the labels are keyed by subtag.
const langSubtag = document.documentElement.lang.split('-')[0]
const copyLabels = COPY_LABELS[langSubtag] ?? COPY_LABELS.en
const themeLabels = THEME_LABELS[langSubtag] ?? THEME_LABELS.en

/**
 * Blob palettes for the drifting background, one per theme. The backdrop
 * itself is read from `--paper` so it can never drift out of step with the
 * stylesheet; only the blobs are listed here.
 */
const ATMOSPHERE = {
  dark: {
    colors: ['#1a9a5c', '#0a1c16', '#04100c', '#0a3d55', '#145c45', '#020805'],
    opacity: 0.9,
    saturate: 1.05,
    // Grain reads far stronger over paper than over near-black.
    grainOpacity: 0.28,
  },
  light: {
    colors: ['#b6e6cd', '#e4f2eb', '#eef3f0', '#cde3f1', '#d6efe1', '#ffffff'],
    opacity: 0.85,
    saturate: 1,
    grainOpacity: 0.14,
  },
}

function paintAtmosphere(theme) {
  const palette = ATMOSPHERE[theme] ?? ATMOSPHERE.dark

  abb({
    element: '#atmosphere',
    background: paperColor(),
    colors: palette.colors,
    speed: reduceMotion ? 0 : 0.45,
    opacity: palette.opacity,
    saturate: palette.saturate,
    blur: 48,
    grain: {
      strength: 1.2,
      opacity: palette.grainOpacity,
      blur: 0,
    },
  })
}

const buttons = document.querySelectorAll('[data-copy]')

for (const button of buttons) {
  button.addEventListener('click', async () => {
    const value = button.getAttribute('data-copy') ?? ''
    try {
      await navigator.clipboard.writeText(value)
      const previous = button.textContent
      button.textContent = copyLabels.copied
      button.classList.add('is-copied')
      window.setTimeout(() => {
        button.textContent = previous
        button.classList.remove('is-copied')
      }, 1400)
    } catch {
      button.textContent = copyLabels.failed
      window.setTimeout(() => {
        button.textContent = copyLabels.copy
      }, 1400)
    }
  })
}

for (const button of document.querySelectorAll('.code-copy')) {
  button.addEventListener('click', async () => {
    const source = button
      .closest('.code-glow')
      ?.querySelector('.code code')?.textContent
    if (!source) return
    try {
      await navigator.clipboard.writeText(source)
      button.textContent = copyLabels.copied
      button.classList.add('is-copied')
      window.setTimeout(() => {
        button.textContent = copyLabels.copy
        button.classList.remove('is-copied')
      }, 1400)
    } catch {
      button.textContent = copyLabels.failed
      window.setTimeout(() => {
        button.textContent = copyLabels.copy
      }, 1400)
    }
  })
}

for (const root of document.querySelectorAll('[data-code-tabs]')) {
  const tabs = [...root.querySelectorAll('[data-tab]')]
  const panels = [...root.querySelectorAll('[data-panel]')]

  for (const tab of tabs) {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('data-tab')
      for (const other of tabs) {
        const active = other === tab
        other.classList.toggle('is-active', active)
        other.setAttribute('aria-selected', active ? 'true' : 'false')
      }
      for (const panel of panels) {
        const active = panel.getAttribute('data-panel') === id
        panel.classList.toggle('is-active', active)
        if (active) panel.removeAttribute('hidden')
        else panel.setAttribute('hidden', '')
      }
    })
  }
}

initTheme()
startHeroTypewriter()
initDocsSearch()
closeMenusOnOutsideClick()
initCookieConsent()

/** Whatever `--paper` currently resolves to, in the theme now applied. */
function paperColor() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--paper')
    .trim()
}

/** The visitor's explicit choice, or null while they are following the OS. */
function storedTheme() {
  try {
    const value = localStorage.getItem(THEME_KEY)
    return value === 'light' || value === 'dark' ? value : null
  } catch {
    return null
  }
}

/**
 * Light/dark toggle.
 *
 * The inline script in <head> has already resolved and applied a theme by the
 * time this runs — all that is left is the parts that can wait for the first
 * paint: the button labels, the background palette, and the listeners.
 *
 * Until the button is pressed there is nothing in storage and the site simply
 * follows the OS, including when the OS flips while the page is open. The
 * first press is what pins the choice.
 */
function initTheme() {
  const toggles = document.querySelectorAll('[data-theme-toggle]')

  const current = () =>
    document.documentElement.dataset.theme === 'light' ? 'light' : 'dark'

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme

    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', paperColor())

    const label = theme === 'dark' ? themeLabels.toLight : themeLabels.toDark
    for (const toggle of toggles) {
      // The menu variant is labelled by its own text; the bar variant, which
      // is icon-only, by its aria-label.
      const text = toggle.querySelector('.theme-toggle-label')
      if (text) {
        text.textContent = label
      } else {
        toggle.setAttribute('aria-label', label)
        toggle.setAttribute('title', label)
      }
    }

    paintAtmosphere(theme)
  }

  for (const toggle of toggles) {
    toggle.addEventListener('click', () => {
      const next = current() === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_KEY, next)
      } catch {
        // Private browsing or blocked storage — the flip still works, it
        // just will not survive the next page load.
      }
      applyTheme(next)
    })
  }

  prefersLight.addEventListener('change', (event) => {
    if (storedTheme()) return
    applyTheme(event.matches ? 'light' : 'dark')
  })

  applyTheme(current())
}

/** The visitor's answer, or null while they have not given one. */
function storedConsent() {
  try {
    const value = localStorage.getItem(CONSENT_KEY)
    return value === 'granted' || value === 'denied' ? value : null
  } catch {
    return null
  }
}

/**
 * Cookie banner.
 *
 * The markup ships hidden, so someone who has already answered never sees it
 * flash on the way in. Only a fresh visitor gets it, and only once — either
 * button is an answer, and both are remembered.
 *
 * Accepting is what loads gtag.js: the head script left `siteloLoadAnalytics`
 * ready but uncalled, and nothing has reached Google before this point.
 * Declining stores that and calls nothing.
 *
 * With storage blocked there is nowhere to record an answer, so the banner
 * would return on every page. Better to leave it off entirely and keep
 * analytics off with it, which is the answer the visitor has not given.
 */
function initCookieConsent() {
  const banner = document.querySelector('[data-cookie-banner]')
  if (!banner || !storageWorks() || storedConsent()) return

  banner.hidden = false
  // Force a layout pass so the reveal animates from the hidden state rather
  // than being collapsed into it.
  void banner.offsetHeight
  banner.classList.add('is-visible')

  function decide(value) {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {
      // Checked already; if it fails now the banner still goes away for the
      // rest of this page and analytics stay off.
    }

    if (value === 'granted') window.siteloLoadAnalytics?.()

    // Taken out of the layout once it has faded. A timer rather than
    // `transitionend`, which does not fire everywhere and would strand the
    // banner in the DOM; `pointer-events` in the stylesheet covers the gap in
    // between either way.
    banner.classList.remove('is-visible')
    window.setTimeout(
      () => {
        banner.hidden = true
      },
      reduceMotion ? 0 : 260,
    )
  }

  banner
    .querySelector('[data-cookie-accept]')
    ?.addEventListener('click', () => decide('granted'))
  banner
    .querySelector('[data-cookie-decline]')
    ?.addEventListener('click', () => decide('denied'))
}

/**
 * Can an answer actually be remembered? Private modes sometimes say no.
 *
 * Probes a throwaway key, never the real one — writing and clearing
 * `CONSENT_KEY` to test it would erase the very answer this is asking about.
 */
function storageWorks() {
  const probe = 'sitelo-storage-probe'
  try {
    localStorage.setItem(probe, '1')
    localStorage.removeItem(probe)
    return true
  } catch {
    return false
  }
}

/**
 * The nav and language menus are plain <details>, which stay open until
 * toggled again. Close them on an outside click or Escape, the way a
 * dropdown is expected to behave.
 */
function closeMenusOnOutsideClick() {
  const menus = () => document.querySelectorAll('details.nav-menu[open], details.lang-switch[open]')

  document.addEventListener('click', (event) => {
    for (const menu of menus()) {
      if (!menu.contains(event.target)) menu.open = false
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return
    for (const menu of menus()) {
      menu.open = false
      menu.querySelector('summary')?.focus()
    }
  })
}

/*
 * The site builds with `cleanUrls: false`, so pagefind indexes `docs.html`
 * rather than `docs/index.html` and reports that file path as the result
 * URL. Strip the extension back to the extensionless URL every link, the
 * canonical tag and the sitemap already use.
 */
const prettyResultUrl = (url) => url.replace(/\.html(?=$|[?#])/, '')

/**
 * Pagefind search — indexes live under `/pagefind/`.
 * Production: written into `docs/dist` by `docs:build`.
 * Dev: the same bundle is synced to `docs/public/pagefind` so Vite can
 * serve it (re-run `npm run docs:build` or `docs:index` after content changes).
 */
async function initDocsSearch() {
  const mount = document.querySelector('#docs-search')
  if (!mount) return

  /*
   * The mount reserves the input's height so the sidebar does not jump when
   * the UI lands. Nothing will land if there is no index — the usual case in
   * dev — so collapse it again rather than leave a gap above the nav.
   */
  const releaseSpace = () => mount.classList.add('is-unavailable')

  /*
   * Both assets are requested straight away rather than behind a HEAD probe
   * for the index. The probe cost a whole round trip before either could
   * start — a third link in the chain from the document — and told us nothing
   * the script's own `onerror` does not. Where there is no index this now
   * 404s twice instead of once, which costs a dev nothing.
   */
  const style = document.createElement('link')
  style.rel = 'stylesheet'
  style.href = '/pagefind/pagefind-ui.css'
  document.head.appendChild(style)

  const loaded = await new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = '/pagefind/pagefind-ui.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
  if (!loaded) return releaseSpace()

  new window.PagefindUI({
    element: '#docs-search',
    showSubResults: true,
    showImages: false,
    processResult: (result) => {
      result.url = prettyResultUrl(result.url)
      for (const sub of result.sub_results ?? []) {
        sub.url = prettyResultUrl(sub.url)
      }
      return result
    },
  })

  const input = mount.querySelector('input')
  if (input) {
    input.setAttribute('spellcheck', 'false')
    input.setAttribute('autocorrect', 'off')
    input.setAttribute('autocomplete', 'off')
  }
}

function startHeroTypewriter() {
  const el = document.querySelector('.hero-typed')
  if (!el) return

  const phrases = (el.getAttribute('data-phrases') ?? '')
    .split('|')
    .map((p) => p.trim())
    .filter(Boolean)

  if (phrases.length < 2) return

  if (reduceMotion) {
    el.textContent = phrases[0]
    return
  }

  const typeMs = 75
  const deleteMs = 38
  const holdMs = 2500
  const gapMs = 320

  let index = 0
  el.textContent = phrases[0]
  el.classList.add('is-typing')

  const wait = (ms) => new Promise((resolve) => window.setTimeout(resolve, ms))

  async function deleteText() {
    while (el.textContent.length > 0) {
      el.textContent = el.textContent.slice(0, -1)
      await wait(deleteMs)
    }
  }

  async function typeText(text) {
    for (let i = 1; i <= text.length; i += 1) {
      el.textContent = text.slice(0, i)
      await wait(typeMs)
    }
  }

  async function loop() {
    while (true) {
      await wait(holdMs)
      await deleteText()
      await wait(gapMs)
      index = (index + 1) % phrases.length
      await typeText(phrases[index])
    }
  }

  loop()
}
