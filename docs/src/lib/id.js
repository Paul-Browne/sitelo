/**
 * Indonesian-bound layout, code and demo helpers.
 *
 * Pages under `src/id/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'
import { createUiDemo } from './ui-demo.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('id')

export const { landingLayout, pageLayout, docsLayout, uiLayout, examplesLayout } =
  createLayouts('id')

export const { demo, propsTable, presetPreview } = createUiDemo('id')
