import { a, button, code as rawCode, div, pre } from 'javascript-to-html'

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

export function inlineCode(text) {
  return code(text)
}

export function docLink(href, label) {
  return a({ href }, label)
}
