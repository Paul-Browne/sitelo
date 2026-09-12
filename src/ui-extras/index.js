/**
 * sitelo-ui extras — the components that are not for everyone.
 *
 * `sitelo/ui` is the core: what most sites use, in one stylesheet.
 * This is the rest — textures, effects, the decorative and the fancy —
 * each with a sheet of its own, so a page pays only for the ones it
 * puts on screen. Every component here comes with a matching `*Styles()`
 * that goes in `head()` beside `styles()`:
 *
 * ```js
 * import { styles } from 'sitelo/ui'
 * import { grain, grainStyles } from 'sitelo/ui-extras'
 *
 * head(styles(), grainStyles())
 * ```
 *
 * The calling convention, the `su-` class prefix and the theme tokens
 * are the core's; an extra is a core component that happens to live in
 * a different file.
 */

import * as grain from './grain.js'

export * from './grain.js'

/** Every extra under one object, for `import extras from 'sitelo/ui-extras'`. */
export default {
  ...grain,
}
