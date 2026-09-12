/**
 * Spanish-bound layout, code and demo helpers.
 *
 * Pages under `src/es/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'
import { createUiDemo } from './ui-demo.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('es')

export const { landingLayout, pageLayout, docsLayout, uiLayout, examplesLayout } =
  createLayouts('es')

export const { demo, propsTable, grainSandbox, grainSandboxHead } = createUiDemo('es')
