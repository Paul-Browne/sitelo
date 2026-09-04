/**
 * sitelo-ui — optional browser runtime.
 *
 * Everything here is an enhancement of markup that already works
 * without it: tabs fall back to the panel the server marked active,
 * menus still open as `<details>`, dismiss buttons simply do nothing.
 * Load it only if you use one of those.
 *
 * ```js
 * // src/main.js
 * import 'sitelo/ui/client'
 * ```
 *
 * It listens on the document rather than binding per element, so
 * anything added to the page later works too.
 */

const THEME_KEY = 'sitelo-ui-theme'

/** Most toasts on screen at once; the oldest is dropped past this. */
const MAX_TOASTS = 5

/** @param {Element | null} node @returns {HTMLElement | null} */
function asElement(node) {
  return node instanceof HTMLElement ? node : null
}

/* ------------------------------------------------------------------ *
 * Tabs
 * ------------------------------------------------------------------ */

/**
 * @param {HTMLElement} root
 * @param {HTMLElement} tab
 */
function selectTab(root, tab) {
  const tabs = [...root.querySelectorAll('[role="tab"]')].filter(
    (candidate) => candidate.closest('[data-su-tabs]') === root,
  )

  for (const candidate of tabs) {
    const selected = candidate === tab
    const panel = document.getElementById(candidate.getAttribute('aria-controls') ?? '')

    candidate.setAttribute('aria-selected', String(selected))
    candidate.setAttribute('tabindex', selected ? '0' : '-1')

    if (panel) panel.hidden = !selected
  }
}

/**
 * Roving focus across a tablist: arrows move, Home and End jump.
 *
 * @param {KeyboardEvent} event
 */
function onTabKeydown(event) {
  const tab = asElement(/** @type {Element} */ (event.target)?.closest?.('[role="tab"]'))
  const root = tab?.closest('[data-su-tabs]')

  if (!tab || !(root instanceof HTMLElement)) return

  const tabs = [...root.querySelectorAll('[role="tab"]:not([disabled])')].filter(
    (candidate) => candidate.closest('[data-su-tabs]') === root,
  )

  const index = tabs.indexOf(tab)

  if (index < 0) return

  const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[event.key]
  let next

  if (step) next = tabs[(index + step + tabs.length) % tabs.length]
  else if (event.key === 'Home') next = tabs[0]
  else if (event.key === 'End') next = tabs[tabs.length - 1]

  if (!(next instanceof HTMLElement)) return

  event.preventDefault()
  selectTab(root, next)
  next.focus()
}

/* ------------------------------------------------------------------ *
 * Theme
 * ------------------------------------------------------------------ */

/**
 * Apply a theme and remember it.
 *
 * `'system'` clears the override, handing the decision back to
 * `prefers-color-scheme`.
 *
 * @param {'light' | 'dark' | 'system'} value
 */
export function setTheme(value) {
  const root = document.documentElement

  if (value === 'system') root.removeAttribute('data-su-theme')
  else root.setAttribute('data-su-theme', value)

  try {
    if (value === 'system') localStorage.removeItem(THEME_KEY)
    else localStorage.setItem(THEME_KEY, value)
  } catch {
    // Private browsing, or storage disabled. The theme still applies for
    // this page view, which is the part that matters.
  }

  for (const button of document.querySelectorAll('[data-su-theme-toggle]')) {
    button.setAttribute('aria-pressed', String(getTheme() === 'dark'))
  }
}

/**
 * The theme in effect right now, resolved rather than stored.
 * @returns {'light' | 'dark'}
 */
export function getTheme() {
  const root = document.documentElement

  /*
   * The stylesheet honours both attributes, so this must too. Reading
   * only `data-su-theme` made the toggle disagree with what was on
   * screen on any site that sets `data-theme` itself.
   */
  for (const attribute of ['data-su-theme', 'data-theme']) {
    const value = root.getAttribute(attribute)

    if (value === 'light' || value === 'dark') return value
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

/** Flip between light and dark. */
export function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark')
}

/* ------------------------------------------------------------------ *
 * Toasts
 * ------------------------------------------------------------------ */

/**
 * Show a transient message in the region rendered by `toasts()`.
 *
 * @param {string} message
 * @param {object} [options]
 * @param {'primary' | 'neutral' | 'success' | 'warning' | 'danger'} [options.color]
 * @param {number} [options.duration] - Milliseconds; `0` keeps it up.
 * @returns {HTMLElement | null}
 */
export function toast(message, { color = 'neutral', duration = 4000 } = {}) {
  const region = document.getElementById('su-toasts')

  if (!region) return null

  const node = document.createElement('div')

  node.className = `su-alert su-alert--soft su-c-${color}`
  node.append(
    Object.assign(document.createElement('div'), {
      className: 'su-alert-content',
      textContent: message,
    }),
  )

  const dismiss = document.createElement('button')

  dismiss.type = 'button'
  dismiss.className = 'su-alert-dismiss'
  dismiss.setAttribute('data-su-dismiss', '')
  dismiss.setAttribute('aria-label', 'Dismiss')
  dismiss.innerHTML = '&times;'
  node.append(dismiss)

  region.append(node)

  // A flood of toasts would otherwise fill the screen with a stack
  // nobody can scroll — the region is fixed-position.
  while (region.children.length > MAX_TOASTS) region.firstElementChild?.remove()

  if (duration > 0) setTimeout(() => node.remove(), duration)

  return node
}

/* ------------------------------------------------------------------ *
 * Menus
 * ------------------------------------------------------------------ */

/**
 * Close whichever open menus this click should close.
 *
 * A click outside a menu closes it, and so does activating one of its
 * items — a menu that stays open after you have chosen something is the
 * bug this exists to prevent. Other clicks *inside* a menu are left
 * alone, so a menu can hold a form.
 *
 * @param {Element} target
 */
function closeMenus(target) {
  const item = target.closest('[role="menuitem"]')

  for (const open of document.querySelectorAll('details.su-menu[open]')) {
    if (!open.contains(target) || (item && open.contains(item))) {
      open.removeAttribute('open')
    }
  }
}

/* ------------------------------------------------------------------ *
 * Wiring
 * ------------------------------------------------------------------ */

let started = false

/** Attach the document-level listeners. Safe to call more than once. */
export function init() {
  if (started || typeof document === 'undefined') return

  started = true

  document.addEventListener('click', (event) => {
    const target = /** @type {Element | null} */ (event.target)

    if (!target || typeof target.closest !== 'function') return

    // First, and unconditionally: a click on a tab, a theme toggle or a
    // dismiss button is still a click outside an open menu, and the
    // early returns below used to skip this entirely.
    closeMenus(target)

    const tab = asElement(target.closest('[role="tab"]'))
    const tabsRoot = tab?.closest('[data-su-tabs]')

    if (tab && tabsRoot instanceof HTMLElement) {
      selectTab(tabsRoot, tab)
      return
    }

    if (target.closest('[data-su-theme-toggle]')) {
      toggleTheme()
      return
    }

    const dismiss = target.closest('[data-su-dismiss]')

    if (dismiss) {
      const owner = dismiss.getAttribute('data-su-dismiss')
      // Toasts are alerts, so one selector covers both.
      const node = owner ? document.getElementById(owner) : dismiss.closest('.su-alert')

      node?.remove()
    }
  })

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      const active = document.activeElement
      let restore = null

      for (const open of document.querySelectorAll('details.su-menu[open]')) {
        // Only the menu that held focus hands it back — closing a menu
        // elsewhere on the page should not move the caret.
        if (active && open.contains(active)) restore = open.querySelector('summary')

        open.removeAttribute('open')
      }

      asElement(restore)?.focus()

      return
    }

    onTabKeydown(event)
  })

  // Reflect the resolved theme on any toggle rendered by the server.
  for (const button of document.querySelectorAll('[data-su-theme-toggle]')) {
    button.setAttribute('aria-pressed', String(getTheme() === 'dark'))
  }
}

if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }
}
