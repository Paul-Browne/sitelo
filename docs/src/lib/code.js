import { a, button, code as rawCode, div, pre, span } from 'javascript-to-html'
import Prism from 'prismjs'
/*
 * Prism's core bundle already carries markup (and its `html` alias), css,
 * clike and javascript; these are the three grammars the snippets use that it
 * does not. Loading them here rather than in `main.js` is the whole point of
 * highlighting at build time — a grammar the visitor never needs costs them
 * nothing, because none of this reaches the browser.
 */
import 'prismjs/components/prism-bash.js'
import 'prismjs/components/prism-json.js'
import 'prismjs/components/prism-jsx.js'

import { DEFAULT_LOCALE, strings } from './i18n.js'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

/** Safe inline/block code — escapes HTML so `<html>` renders as text. */
export function code(...args) {
  if (
    args.length === 1 &&
    (typeof args[0] === 'string' || typeof args[0] === 'number')
  ) {
    return rawCode(escapeHtml(args[0]))
  }

  const [attrs, ...children] = args
  return rawCode(
    attrs,
    ...children.map((child) =>
      typeof child === 'string' || typeof child === 'number'
        ? escapeHtml(child)
        : child,
    ),
  )
}

/**
 * Tokenised HTML for a snippet, ready to drop into a <code>.
 *
 * Prism escapes `&` and `<` on its way through, so the result is safe to
 * insert as-is. A language it has no grammar for falls back to the plain
 * escaped source, which is what the browser used to render for those blocks —
 * a typo in a language name loses colour, never the snippet.
 */
function highlight(source, language) {
  const grammar = Prism.languages[language]
  if (!grammar) return escapeHtml(source)
  return Prism.highlight(String(source), grammar, language)
}

function jsxFileLabel(file) {
  return file
    .replace(/\.ht\.ts$/, '.ht.tsx')
    .replace(/\.ht\.js$/, '.ht.jsx')
    .replace(/\.html\.ts$/, '.html.tsx')
    .replace(/\.html\.js$/, '.html.jsx')
}

let codeTabsSeq = 0

/**
 * Code helpers bound to a locale. Only the controls are translated — the
 * snippets themselves come from `lib/snippets/` and are shared across locales.
 */
export function createCodeHelpers(lang = DEFAULT_LOCALE) {
  const t = strings(lang)

  const copyButton = (className) =>
    button(
      { class: className, type: 'button', 'aria-label': t.copyCode },
      t.copy,
    )

  function codeBlock(label, source, language = 'javascript') {
    return div(
      { class: 'code-glow' },
      pre(
        { class: `code language-${language}`, 'data-label': label },
        rawCode({ class: `language-${language}` }, highlight(source, language)),
      ),
      copyButton('code-copy'),
    )
  }

  function codePanel(label, source, language = 'javascript') {
    return div(
      { class: 'code-tabs-body' },
      pre(
        { class: `code language-${language}`, 'data-label': label },
        rawCode({ class: `language-${language}` }, highlight(source, language)),
      ),
      copyButton('code-copy'),
    )
  }

  /**
   * Three-way page markup tabs: template literal | ht.js (recommended) | JSX.
   * @param {{
   *   file?: string
   *   template: string
   *   ht: string
   *   jsx: string
   *   defaultTab?: 'template' | 'ht' | 'jsx'
   * }} options
   */
  function pageCodeTabs({
    file = 'src/index.ht.js',
    template,
    ht,
    jsx,
    defaultTab = 'ht',
  }) {
    const uid = `ct${++codeTabsSeq}`
    const tabs = [
      {
        id: 'template',
        label: t.templateLiteral,
        block: codePanel(file, template, 'javascript'),
      },
      {
        id: 'ht',
        label: 'ht.js',
        badge: t.recommended,
        block: codePanel(file, ht, 'javascript'),
      },
      {
        id: 'jsx',
        label: 'JSX',
        block: codePanel(jsxFileLabel(file), jsx, 'jsx'),
      },
    ]

    return div(
      { class: 'code-tabs code-glow', 'data-code-tabs': '' },
      div(
        { class: 'code-tabs-nav', role: 'tablist', 'aria-label': t.markupStyle },
        ...tabs.map(({ id, label, badge }) =>
          button(
            {
              class: `code-tabs-tab${id === defaultTab ? ' is-active' : ''}`,
              type: 'button',
              role: 'tab',
              id: `${uid}-${id}`,
              'aria-selected': id === defaultTab ? 'true' : 'false',
              'aria-controls': `${uid}-panel-${id}`,
              'data-tab': id,
            },
            label,
            badge ? span({ class: 'code-tabs-badge' }, badge) : '',
          ),
        ),
      ),
      div(
        { class: 'code-tabs-panels' },
        ...tabs.map(({ id, block }) =>
          div(
            {
              class: `code-tabs-panel${id === defaultTab ? ' is-active' : ''}`,
              role: 'tabpanel',
              id: `${uid}-panel-${id}`,
              'aria-labelledby': `${uid}-${id}`,
              'data-panel': id,
              hidden: id === defaultTab ? undefined : '',
            },
            block,
          ),
        ),
      ),
    )
  }

  return { code, codeBlock, pageCodeTabs, inlineCode: code, docLink }
}

export function docLink(href, label) {
  return a({ href }, label)
}

const en = createCodeHelpers(DEFAULT_LOCALE)

export const codeBlock = en.codeBlock
export const pageCodeTabs = en.pageCodeTabs
export const inlineCode = en.inlineCode
