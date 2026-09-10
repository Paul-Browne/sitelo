import { br, div, em, fragment, span, strong } from 'javascript-to-html'
import * as ui from 'sitelo/ui'

import { createCodeHelpers } from './code.js'
import { DEFAULT_LOCALE } from './i18n.js'

/*
 * A few plain elements the demos need for scaffolding — a wrapper to
 * scroll inside, a fragment when a demo has two roots (a trigger and
 * the modal it opens). Only names that do not collide with a component
 * are here; `table` and `link`, for instance, stay the sitelo-ui ones.
 */
const ELEMENTS = { br, div, em, fragment, span, strong }

/*
 * Names the demo source can use bare. `default` is a reserved word and
 * cannot be a parameter, so it never reaches the evaluator.
 */
const SCOPE = [
  ...Object.keys(ui).filter((name) => name !== 'default'),
  ...Object.keys(ELEMENTS),
]
const VALUES = SCOPE.map((name) => ui[name] ?? ELEMENTS[name])

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

/**
 * Column headings for {@link createUiDemo}'s props table.
 *
 * A page whose table is not a list of props — the parts of a card, the
 * arguments to `toast()` — passes its own headings instead.
 */
const TABLE_HEADERS = {
  en: ['Prop', 'Type', 'Default', 'Description'],
  es: ['Prop', 'Tipo', 'Por defecto', 'Descripción'],
  fr: ['Prop', 'Type', 'Défaut', 'Description'],
  de: ['Prop', 'Typ', 'Standard', 'Beschreibung'],
  ru: ['Проп', 'Тип', 'По умолчанию', 'Описание'],
  zh: ['属性', '类型', '默认值', '说明'],
  pt: ['Prop', 'Tipo', 'Predefinição', 'Descrição'],
}

/** Demo helpers bound to a locale. */
export function createUiDemo(lang = DEFAULT_LOCALE) {
  const { code, codeBlock } = createCodeHelpers(lang)
  const defaultHeaders = TABLE_HEADERS[lang] ?? TABLE_HEADERS[DEFAULT_LOCALE]

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
   * `table()` from sitelo/ui, which brings the frame — the rule, the
   * radius and the horizontal scroll the widest of these needs on a
   * phone — and its `columns` API, which puts the `code()` wrapping of
   * a cell next to the heading it belongs under rather than three rows
   * away in a `map`. The `docs-table` classes stay on top of it for the
   * two things this site does differently: uppercase monospace headings,
   * and a last column that wraps while the rest do not.
   *
   * @param {[string, string, string, string][]} rows
   * @param {object} [options]
   * @param {[string, string, string, string]} [options.headers]
   * @returns {string}
   */
  function propsTable(rows, { headers = defaultHeaders } = {}) {
    return ui.table({
      class: 'docs-table docs-table--wrap-last',
      columns: [
        { header: headers[0], render: (row) => code(row.name) },
        { header: headers[1], render: (row) => (row.type ? code(row.type) : '') },
        {
          header: headers[2],
          render: (row) => (row.fallback ? code(row.fallback) : '—'),
        },
        { header: headers[3], render: (row) => escapeText(row.description) },
      ],
      rows: rows.map(([name, type, fallback, description]) => ({
        name,
        type,
        fallback,
        description,
      })),
    })
  }

  return { demo, propsTable }
}

const en = createUiDemo(DEFAULT_LOCALE)

export const demo = en.demo
export const propsTable = en.propsTable
