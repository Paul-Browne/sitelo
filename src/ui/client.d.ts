/**
 * Optional browser runtime for sitelo-ui.
 *
 * Import it for its side effects — it wires the document-level
 * listeners on load — and call the named exports when you want to drive
 * the same behaviour yourself.
 *
 * ```js
 * import 'sitelo/ui/client'
 * ```
 */

/** Attach the document listeners. Called on load; safe to call again. */
export function init(): void

/** Apply a theme and remember it. `'system'` clears the override. */
export function setTheme(value: 'light' | 'dark' | 'system'): void

/** The theme in effect, resolving `prefers-color-scheme` when unset. */
export function getTheme(): 'light' | 'dark'

/** Flip between light and dark. */
export function toggleTheme(): void

export interface ToastOptions {
  color?: 'primary' | 'neutral' | 'success' | 'warning' | 'danger'
  /** Milliseconds before it disappears. `0` keeps it up. Default `4000`. */
  duration?: number
}

/**
 * Show a message in the region rendered by `toasts()`.
 * Returns `null` when that region is not on the page.
 */
export function toast(message: string, options?: ToastOptions): HTMLElement | null
