/**
 * sitelo-ui's runtime, for calling yourself.
 *
 * Components no longer need this. Anything that wants a script renders
 * the import into its own event attribute — `onclick="import('/su/…')"`
 * — so tabs, dismissible alerts, menus and the theme toggle all work on
 * a page that imports nothing at all.
 *
 * What is left here is the handful of things a page drives rather than
 * a click: showing a toast, or setting the theme from your own code.
 *
 * ```js
 * import { toast, setTheme } from 'sitelo/ui/client'
 * ```
 *
 * Importing this bundles those modules into your entry. Reaching them
 * from an attribute instead — `import('/su/toast.js')` — costs nothing
 * until the interaction happens.
 */

export { toast } from './runtime/toast.js'
export { get as getTheme, set as setTheme, toggle as toggleTheme } from './runtime/theme.js'
