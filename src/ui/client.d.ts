/**
 * sitelo-ui's runtime, for calling yourself.
 *
 * Components wire themselves through inline imports in their own event
 * attributes, so none of them need this. It is here for the parts a
 * page drives rather than a click.
 *
 * ```js
 * import { toast, setTheme } from 'sitelo/ui/client'
 * ```
 */

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
