import { a, button, code as rawCode, div, pre, span } from 'javascript-to-html'

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

export function codeBlock(label, source, language = 'javascript') {
  return div(
    { class: 'code-glow' },
    pre(
      { class: `code language-${language}`, 'data-label': label },
      code({ class: `language-${language}` }, source),
    ),
    button(
      { class: 'code-copy', type: 'button', 'aria-label': 'Copy code' },
      'Copy',
    ),
  )
}

function codePanel(label, source, language = 'javascript') {
  return div(
    { class: 'code-tabs-body' },
    pre(
      { class: `code language-${language}`, 'data-label': label },
      code({ class: `language-${language}` }, source),
    ),
    button(
      { class: 'code-copy', type: 'button', 'aria-label': 'Copy code' },
      'Copy',
    ),
  )
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
 * Three-way page markup tabs: template literal | ht.js (recommended) | JSX.
 * @param {{
 *   file?: string
 *   template: string
 *   ht: string
 *   jsx: string
 *   defaultTab?: 'template' | 'ht' | 'jsx'
 * }} options
 */
export function pageCodeTabs({
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
      label: 'Template literal',
      block: codePanel(file, template, 'javascript'),
    },
    {
      id: 'ht',
      label: 'ht.js',
      badge: 'recommended',
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
      { class: 'code-tabs-nav', role: 'tablist', 'aria-label': 'Markup style' },
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

export function inlineCode(text) {
  return code(text)
}

export function docLink(href, label) {
  return a({ href }, label)
}
