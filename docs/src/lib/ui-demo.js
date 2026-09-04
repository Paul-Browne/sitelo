import { div, table, tbody, td, th, thead, tr } from 'javascript-to-html'
import * as ui from 'sitelo/ui'

import { createCodeHelpers } from './code.js'
import { DEFAULT_LOCALE } from './i18n.js'

/**
 * The sitelo-ui stylesheet, for a UI page's `extraHead`.
 *
 * Inline, exactly as a reader would add it to their own page, which also
 * means the demos on this site are styled by the same bytes the docs
 * tell them to ship.
 */
export function uiStyles() {
  return [ui.styles()]
}

/*
 * Names the demo source can use bare. `default` is a reserved word and
 * cannot be a parameter, so it never reaches the evaluator.
 */
const SCOPE = Object.keys(ui).filter((name) => name !== 'default')
const VALUES = SCOPE.map((name) => ui[name])

/**
 * Run a demo snippet and return its HTML.
 *
 * The snippet is evaluated rather than paired with a hand-written copy,
 * so what a page renders and what it prints cannot drift apart. This is
 * build-time only and the source is authored in this repository — no
 * visitor input reaches it.
 *
 * @param {string} source - An expression, or statements ending in `return`.
 * @returns {string}
 */
function run(source) {
  const body = /(^|\n)\s*return\s/.test(source) ? source : `return (${source})`

  try {
    return new Function(...SCOPE, body)(...VALUES)
  } catch (error) {
    throw new Error(`Demo failed to render:\n${source}\n\n${error.message}`, {
      cause: error,
    })
  }
}

/**
 * Render a snippet without showing its source — for the small previews
 * on the section's landing page.
 *
 * @param {string} source
 * @returns {string}
 */
export function preview(source) {
  return run(String(source).trim())
}

/** Demo helpers bound to a locale. */
export function createUiDemo(lang = DEFAULT_LOCALE) {
  const { code, codeBlock } = createCodeHelpers(lang)

  /**
   * A live example above the code that produced it.
   *
   * @param {string} source
   * @param {object} [options]
   * @param {string} [options.label] - Corner label on the code block.
   * @param {'center' | 'start' | 'stretch'} [options.align]
   * @returns {string}
   */
  function demo(source, { label = '', align = 'center' } = {}) {
    const snippet = String(source).replace(/^\n+|\s+$/g, '')

    return div(
      { class: 'ui-demo' },
      div(
        {
          class: `ui-demo-preview ui-demo-preview--${align}`,
          // The demos are illustrations of the code below them; a screen
          // reader gets nothing from a second, unlabelled copy of every
          // control on the page.
          'data-pagefind-ignore': '',
        },
        run(snippet),
      ),
      codeBlock(label, snippet, 'javascript'),
    )
  }

  /**
   * Descriptions are prose, and prose in these tables mentions tags —
   * `<a>`, `<button>`. javascript-to-html passes children through
   * verbatim, so without this they would be parsed as markup and
   * silently disappear from the table.
   *
   * @param {unknown} value
   * @returns {unknown}
   */
  const escapeText = (value) =>
    typeof value === 'string'
      ? value
          .replaceAll('&', '&amp;')
          .replaceAll('<', '&lt;')
          .replaceAll('>', '&gt;')
      : value

  /**
   * An API table: name, type, default, description.
   *
   * @param {[string, string, string, string][]} rows
   * @param {object} [options]
   * @param {[string, string, string, string]} [options.headers]
   * @returns {string}
   */
  function propsTable(rows, { headers = ['Prop', 'Type', 'Default', 'Description'] } = {}) {
    return div(
      { class: 'docs-table-scroll' },
      table(
        { class: 'docs-table docs-table--wrap-last' },
        thead(tr(...headers.map((heading) => th(heading)))),
        tbody(
          ...rows.map(([name, type, fallback, description]) =>
            tr(
              td(code(name)),
              td(type ? code(type) : ''),
              td(fallback ? code(fallback) : '—'),
              td(escapeText(description)),
            ),
          ),
        ),
      ),
    )
  }

  return { demo, propsTable }
}

const en = createUiDemo(DEFAULT_LOCALE)

export const demo = en.demo
export const propsTable = en.propsTable
