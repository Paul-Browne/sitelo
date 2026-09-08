/**
 * French-bound layout, code and demo helpers.
 *
 * Pages under `src/fr/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'
import { createUiDemo } from './ui-demo.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('fr')

export const { landingLayout, pageLayout, docsLayout, uiLayout, examplesLayout } =
  createLayouts('fr')

export const { demo, propsTable } = createUiDemo('fr')
