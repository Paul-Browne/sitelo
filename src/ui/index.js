/**
 * sitelo-ui — a component library for sitelo.
 *
 * Every component is a function that returns a string of HTML, in the
 * same style as the pages that use them, so a component call nests
 * inside a `javascript-to-html` tree with nothing in between. Nothing
 * ships to the browser unless you import `sitelo/ui/client`.
 *
 * ```js
 * import { html, head, body } from 'javascript-to-html'
 * import { styles, container, card, cardBody, button } from 'sitelo/ui'
 *
 * export default () => html({ lang: 'en' },
 *   head(styles()),
 *   body(
 *     container(
 *       card(cardBody('Hello'), button('Click me')),
 *     ),
 *   ),
 * )
 * ```
 *
 * The component names deliberately match the things they render, which
 * means a few of them (`button`, `input`, `table`, `link`, `code`,
 * `select`, `progress`) collide with javascript-to-html's element
 * functions. Import this module as a namespace when you need both:
 *
 * ```js
 * import * as ui from 'sitelo/ui'
 * ```
 */

import * as dataDisplay from './data-display.js'
import * as feedback from './feedback.js'
import * as inputs from './inputs.js'
import * as layout from './layout.js'
import * as navigation from './navigation.js'
import * as overlays from './overlays.js'
import * as sections from './sections.js'
import * as styleApi from './styles.js'
import * as typography from './typography.js'

export * from './data-display.js'
export * from './feedback.js'
export * from './inputs.js'
export * from './layout.js'
export * from './navigation.js'
export * from './overlays.js'
export * from './sections.js'
export * from './styles.js'
export * from './typography.js'

/** Every component under one object, for `import ui from 'sitelo/ui'`. */
export default {
  ...styleApi,
  ...layout,
  ...typography,
  ...inputs,
  ...dataDisplay,
  ...feedback,
  ...navigation,
  ...overlays,
  ...sections,
}
