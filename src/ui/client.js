/**
 * sitelo-ui's runtime, for calling yourself.
 *
 * Components no longer need this. Anything that wants a script renders
 * the import into its own event attribute — `onclick="import('/su/…')"`
 * — so dismissible alerts, menus and the theme toggle all work on a
 * page that imports nothing at all.
 *
 * What is left here is the handful of things a page drives rather than
 * a click: showing a toast, moving a progress bar as work lands or a
 * slider from a button, taking a flow to its next step, changing a
 * count, pressing a toggle, redrawing a grain, or setting the theme
 * from your own code.
 *
 * ```js
 * import { toast, setProgress, setTheme } from 'sitelo/ui/client'
 * ```
 *
 * Importing this bundles those modules into your entry. Reaching them
 * from an attribute instead — `import('/su/toast.js')` — costs nothing
 * until the interaction happens.
 */

export { get as getBadge, set as setBadge } from './runtime/badge.js'
export { get as getGrain, set as setGrain } from './runtime/grain.js'
export { get as getPressed, set as setPressed } from './runtime/pressed.js'
export { get as getProgress, set as setProgress } from './runtime/progress.js'
export { get as getSlider, set as setSlider } from './runtime/slider.js'
export { get as getStep, set as setStep } from './runtime/steps.js'
export { toast } from './runtime/toast.js'
export { get as getTheme, set as setTheme, toggle as toggleTheme } from './runtime/theme.js'
