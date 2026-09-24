/**
 * Turkish-bound layout, code and demo helpers.
 *
 * Pages under `src/tr/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'
import { createUiDemo } from './ui-demo.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('tr')

export const { landingLayout, pageLayout, docsLayout, uiLayout, examplesLayout } =
  createLayouts('tr')

export const { demo, propsTable, presetPreview, presetPreviewHead } = createUiDemo('tr')
