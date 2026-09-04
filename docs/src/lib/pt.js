/**
 * Portuguese-bound layout and code helpers.
 *
 * Pages under `src/pt/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('pt')

export const { landingLayout, pageLayout, docsLayout, uiLayout, examplesLayout } =
  createLayouts('pt')
