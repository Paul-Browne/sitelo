/**
 * sitelo-ui's runtime, for calling yourself.
 *
 * Components wire themselves through inline imports in their own event
 * attributes, so none of them need this. It is here for the parts a
 * page drives rather than a click.
 *
 * ```js
 * import { toast, setProgress, setTheme } from 'sitelo/ui/client'
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

export interface SetProgressOptions {
  /** What value counts as complete. Remembered for later calls. */
  max?: number
}

/**
 * Move a `progress()` bar, addressed by element or by `id`.
 *
 * `null` — or any value that is not a finite number — returns it to the
 * indeterminate animation. Returns `null` when there is no such bar on
 * the page.
 */
export function setProgress(
  target: Element | string,
  value?: number | null,
  options?: SetProgressOptions,
): Element | null

/** What a bar is showing, on its own scale; `null` when indeterminate. */
export function getProgress(target: Element | string): number | null

export interface SetBadgeOptions {
  /** Where a count turns into `max+`. Remembered for later calls. */
  max?: number
  /** The announced text, which is prose only the site can write. */
  label?: string
}

/**
 * Set the count on a `badge()`, addressed by element or by `id`.
 *
 * `null` empties it, which is how a badge disappears. Returns `null`
 * when there is no such badge on the page.
 */
export function setBadge(
  target: Element | string,
  content?: number | string | null,
  options?: SetBadgeOptions,
): Element | null

/**
 * Move a `slider()` to `value`, addressed by element or by `id`.
 *
 * The browser clamps to `min` and `max` and snaps to `step`, so the
 * number returned is where the slider landed rather than what it was
 * given. `input` and `change` follow, so anything listening to the
 * slider hears a move it did not cause. Returns `null` when there is no
 * such slider on the page.
 */
export function setSlider(target: Element | string, value: number): number | null

/** Where a slider stands; `null` when there is no such slider. */
export function getSlider(target: Element | string): number | null

/**
 * Go to slide `index` of a carousel, counting the slides as rendered.
 *
 * Returns the index applied, or `null` when there is no such carousel.
 * Where the browser draws the dots itself the scroll is all this does —
 * the browser marks the slide showing on its own.
 */
export function setSlide(target: Element | string, index: number): number | null

/** Which slide a carousel is showing, or `null` for no such carousel. */
export function getSlide(target: Element | string): number | null

/** The count a badge is showing; a clamped one reads back as `'99+'`. */
export function getBadge(target: Element | string): number | string | null

/**
 * Press a `toggleButton()`, or let go of it. Omit `on` to flip it.
 *
 * Inside a single-choice `toggleGroup()` this lets go of the siblings.
 * Returns the state it ended in, or `null` for no such button.
 */
export function setPressed(target: Element | string, on?: boolean): boolean | null

/**
 * Whether a toggle button is pressed. Given a `toggleGroup()` it answers
 * with the pressed buttons' values instead.
 */
export function getPressed(target: Element | string): boolean | string[] | null

/**
 * Mark step `index` of a `steps()` flow as the one in progress, moving
 * the ones before it to complete. Returns the index applied, or `null`
 * when there is no such flow.
 */
export function setStep(target: Element | string, index: number): number | null

/** The index of the step in progress, or the count once all are done. */
export function getStep(target: Element | string): number | null
