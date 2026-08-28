/**
 * Russian-bound layout and code helpers.
 *
 * Pages under `src/ru/` import from here instead of `./layout.js` and
 * `./code.js`, which stay bound to English.
 */
import { createCodeHelpers } from './code.js'
import { createLayouts } from './layout.js'

export const { code, codeBlock, pageCodeTabs } = createCodeHelpers('ru')

export const { landingLayout, pageLayout, docsLayout, examplesLayout } =
  createLayouts('ru')
