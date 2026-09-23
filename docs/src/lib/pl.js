/**
 * Polish-bound layout, code and demo helpers.
 *
 * Pages under `src/pl/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'
import { createUiDemo } from './ui-demo.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('pl')

export const { landingLayout, pageLayout, docsLayout, uiLayout, examplesLayout } =
  createLayouts('pl')

export const { demo, propsTable, presetPreview } = createUiDemo('pl')
