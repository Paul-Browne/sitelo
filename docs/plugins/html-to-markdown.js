/**
 * The docs' rendered HTML, back to Markdown, for the copies the build writes
 * beside each English page and gathers into `llms-full.txt`.
 *
 * Not a general converter. It reads the markup this site's own layout and
 * javascript-to-html produce — well-formed, every element closed, the demos
 * marked `data-pagefind-ignore` — and nothing else needs to survive it. What
 * an answer engine wants from a page is the prose, the code and the tables,
 * so that is what comes through: the live previews, the copy buttons, the
 * table of contents and the prev/next links stay behind.
 */

const VOID = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta',
  'source', 'track', 'wbr',
])

/** Elements whose content is not markup. */
const RAW_TEXT = new Set(['script', 'style', 'textarea'])

/**
 * Never content: chrome, controls and drawings. A demo's form controls are
 * already inside a skipped preview; these catch the few that are not.
 */
const SKIP = new Set([
  'button', 'dialog', 'iframe', 'input', 'label', 'nav', 'noscript', 'option',
  'output', 'script', 'select', 'style', 'svg', 'template', 'textarea', 'video',
])

const BLOCK = new Set([
  'address', 'article', 'aside', 'blockquote', 'details', 'div', 'dl', 'fieldset',
  'figcaption', 'figure', 'footer', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header',
  'hr', 'li', 'main', 'ol', 'p', 'picture', 'pre', 'section', 'summary', 'table',
  'ul',
])

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', times: '×',
  hellip: '…', mdash: '—', ndash: '–', rarr: '→', larr: '←', copy: '©',
}

function decode(text) {
  return text.replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (match, entity) => {
    if (entity[0] === '#') {
      const code = entity[1] === 'x' || entity[1] === 'X'
        ? parseInt(entity.slice(2), 16)
        : parseInt(entity.slice(1), 10)
      return String.fromCodePoint(code)
    }
    return ENTITIES[entity.toLowerCase()] ?? match
  })
}

/**
 * @typedef {{ tag: string, attrs: Record<string, string>, children: Node[] }} Element
 * @typedef {Element | string} Node
 */

const TAG =
  /<!--[\s\S]*?-->|<!doctype[^>]*>|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*(\/?)>/gi
const ATTR = /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g

/**
 * A tree of the fragment. Attribute values are matched whole, quotes and
 * all, because this site's do contain `>` — a description quoting
 * `<details>` is written into its attribute as is.
 *
 * @param {string} html
 * @returns {Element}
 */
function parse(html) {
  /** @type {Element} */
  const root = { tag: '#root', attrs: {}, children: [] }
  const stack = [root]
  let last = 0

  TAG.lastIndex = 0
  for (let match; (match = TAG.exec(html)); ) {
    const parent = stack[stack.length - 1]
    if (match.index > last) parent.children.push(decode(html.slice(last, match.index)))
    last = TAG.lastIndex

    const [, closing, opening, rawAttrs = '', selfClosing] = match

    if (closing) {
      const tag = closing.toLowerCase()
      const at = stack.findLastIndex((node) => node.tag === tag)
      if (at > 0) stack.length = at
      continue
    }
    if (!opening) continue

    const tag = opening.toLowerCase()
    /** @type {Record<string, string>} */
    const attrs = {}
    for (const [, name, double, single, bare] of rawAttrs.matchAll(ATTR)) {
      attrs[name.toLowerCase()] = decode(double ?? single ?? bare ?? '')
    }

    /** @type {Element} */
    const element = { tag, attrs, children: [] }
    parent.children.push(element)

    if (RAW_TEXT.has(tag)) {
      const end = html.toLowerCase().indexOf(`</${tag}`, last)
      const stop = end === -1 ? html.length : end
      element.children.push(html.slice(last, stop))
      TAG.lastIndex = last = html.indexOf('>', stop) + 1 || html.length
    } else if (!selfClosing && !VOID.has(tag)) {
      stack.push(element)
    }
  }

  if (last < html.length) stack[stack.length - 1].children.push(decode(html.slice(last)))
  return root
}

const classes = (node) => (node.attrs.class ?? '').split(/\s+/)

/** Everything a node says, tags and all stripped, whitespace as written. */
function textOf(node) {
  if (typeof node === 'string') return node
  if (node.tag === 'br') return '\n'
  return node.children.map(textOf).join('')
}

function isSkipped(node) {
  return (
    SKIP.has(node.tag) ||
    'data-pagefind-ignore' in node.attrs ||
    node.attrs['aria-hidden'] === 'true' ||
    node.attrs.role === 'tablist'
  )
}

const isBlock = (node) => typeof node !== 'string' && BLOCK.has(node.tag)

/** Inline code, with a fence long enough for any backticks inside it. */
function inlineCode(text) {
  const value = text.replace(/\s+/g, ' ')
  if (!value.trim()) return ''
  const longest = Math.max(0, ...[...value.matchAll(/`+/g)].map(([run]) => run.length))
  const fence = '`'.repeat(longest + 1)
  const pad = value.startsWith('`') || value.endsWith('`') ? ' ' : ''
  return `${fence}${pad}${value}${pad}${fence}`
}

/**
 * @param {{ pageUrl: string, siteUrl: string }} context
 */
function createRenderer({ pageUrl, siteUrl }) {
  const absolute = (href) => {
    if (!href) return href
    if (href.startsWith('#')) return `${pageUrl}${href}`
    if (href.startsWith('/')) return `${siteUrl}${href}`
    return href
  }

  /** @param {Node} node */
  function inline(node) {
    if (typeof node === 'string') return node.replace(/\s+/g, ' ')
    if (isSkipped(node)) return ''

    const inner = () => node.children.map(inline).join('')

    switch (node.tag) {
      case 'br':
        return '\n'
      case 'code':
      case 'kbd':
        return inlineCode(textOf(node))
      case 'strong':
      case 'b': {
        const text = inner().trim()
        return text ? `**${text}**` : ''
      }
      case 'em':
      case 'i': {
        const text = inner().trim()
        return text ? `*${text}*` : ''
      }
      case 'del':
      case 's':
        return `~~${inner().trim()}~~`
      case 'a': {
        const text = inner().trim()
        const href = absolute(node.attrs.href)
        return text && href ? `[${text}](${href})` : text
      }
      case 'img': {
        const src = absolute(node.attrs.src)
        return src ? `![${node.attrs.alt ?? ''}](${src})` : ''
      }
      default:
        return inner()
    }
  }

  /** A run of inline nodes as one paragraph, whitespace collapsed. */
  const paragraph = (nodes) =>
    nodes
      .map(inline)
      .join('')
      .replace(/[ \t]+/g, ' ')
      .replace(/ ?\n ?/g, '\n')
      .trim()

  function codeBlock(pre, caption = '') {
    const code = pre.children.find((child) => typeof child !== 'string' && child.tag === 'code')
    const language =
      [...classes(pre), ...(code ? classes(code) : [])]
        .find((name) => name.startsWith('language-'))
        ?.slice('language-'.length) ?? ''
    const body = textOf(code ?? pre).replace(/^\n+|\s+$/g, '')
    const longest = Math.max(2, ...[...body.matchAll(/^`{3,}/gm)].map(([run]) => run.length))
    const fence = '`'.repeat(longest + 1)
    const label = [pre.attrs['data-label'], caption].filter(Boolean).join(' — ')

    return [label ? inlineCode(label) : '', `${fence}${language}\n${body}\n${fence}`]
      .filter(Boolean)
      .join('\n\n')
  }

  /**
   * The template / ht.js / JSX tabs. Every panel is kept, each named by its
   * tab, since a reader who writes JSX wants the JSX one — the tab strip
   * itself is a control and goes.
   */
  function codeTabs(node) {
    const tabs = new Map()
    const panels = []

    const walk = (current) => {
      if (typeof current === 'string') return
      if (current.attrs.role === 'tab') {
        const label = current.children
          .map((child) =>
            typeof child !== 'string' && classes(child).includes('code-tabs-badge')
              ? ` (${textOf(child).trim()})`
              : textOf(child),
          )
          .join('')
          .trim()
        tabs.set(current.attrs['aria-controls'], label)
      }
      if (current.attrs.role === 'tabpanel') panels.push(current)
      current.children.forEach(walk)
    }
    walk(node)

    return panels
      .map((panel) => {
        let pre
        const find = (current) => {
          if (pre || typeof current === 'string') return
          if (current.tag === 'pre') pre = current
          else current.children.forEach(find)
        }
        find(panel)
        return pre ? codeBlock(pre, tabs.get(panel.attrs.id)) : ''
      })
      .filter(Boolean)
      .join('\n\n')
  }

  function list(node, depth) {
    const ordered = node.tag === 'ol'
    const items = node.children.filter((child) => typeof child !== 'string' && child.tag === 'li')
    const indent = '  '.repeat(depth)

    return items
      .map((item, index) => {
        const marker = ordered ? `${index + 1}.` : '-'
        const body = blocks(item.children, depth + 1)
        const [first = '', ...rest] = body.split('\n')
        return [`${indent}${marker} ${first}`, ...rest.map((line) => (line ? `${indent}  ${line}` : line))]
          .join('\n')
      })
      .join('\n')
  }

  function table(node) {
    /** @type {Element[]} */
    const rows = []
    let caption = ''
    const walk = (current) => {
      if (typeof current === 'string') return
      if (current.tag === 'tr') rows.push(current)
      else if (current.tag === 'caption') caption = paragraph(current.children)
      else current.children.forEach(walk)
    }
    walk(node)
    if (rows.length === 0) return ''

    const cells = rows.map((row) =>
      row.children
        .filter((cell) => typeof cell !== 'string' && (cell.tag === 'td' || cell.tag === 'th'))
        .map((cell) => paragraph(/** @type {Element} */ (cell).children).replace(/\n/g, ' ').replace(/\|/g, '\\|')),
    )
    const width = Math.max(...cells.map((row) => row.length))
    const line = (row) => `| ${Array.from({ length: width }, (_, i) => row[i] ?? '').join(' | ')} |`

    return [
      caption,
      [line(cells[0]), line(Array(width).fill('---')), ...cells.slice(1).map(line)].join('\n'),
    ]
      .filter(Boolean)
      .join('\n\n')
  }

  /** @param {Element} node */
  function block(node, depth) {
    if (isSkipped(node)) return ''

    const heading = /^h([1-6])$/.exec(node.tag)
    if (heading) {
      const text = paragraph(node.children).replace(/\n/g, ' ')
      return text ? `${'#'.repeat(Number(heading[1]))} ${text}` : ''
    }

    if (classes(node).includes('code-tabs')) return codeTabs(node)

    switch (node.tag) {
      case 'p':
      case 'figcaption':
        return paragraph(node.children)
      case 'summary': {
        const text = paragraph(node.children)
        return text ? `**${text}**` : ''
      }
      case 'pre':
        return codeBlock(node)
      case 'ul':
      case 'ol':
        return list(node, depth)
      case 'table':
        return table(node)
      case 'hr':
        return '---'
      case 'blockquote':
        return blocks(node.children, depth)
          .split('\n')
          .map((line) => (line ? `> ${line}` : '>'))
          .join('\n')
      default:
        return blocks(node.children, depth)
    }
  }

  /**
   * A mixed run of children: each block on its own, and the inline content
   * between them gathered into paragraphs — a `<div>` holding a sentence and
   * a list comes out as a paragraph and a list.
   *
   * @param {Node[]} children
   */
  function blocks(children, depth = 0) {
    const out = []
    let run = []
    const flush = () => {
      const text = paragraph(run)
      if (text) out.push(text)
      run = []
    }

    for (const child of children) {
      if (isBlock(child)) {
        flush()
        const text = block(/** @type {Element} */ (child), depth)
        if (text) out.push(text)
      } else {
        run.push(child)
      }
    }
    flush()

    return out.join('\n\n')
  }

  return blocks
}

/**
 * The page's `<main>` as Markdown.
 *
 * @param {string} html a whole rendered page
 * @param {{ pageUrl: string, siteUrl: string }} context absolute URLs for
 *   the links: in-page anchors resolve against `pageUrl`, root-relative ones
 *   against `siteUrl`
 * @returns {string | undefined} undefined when the page has no `<main>`
 */
export function pageToMarkdown(html, context) {
  const start = html.search(/<main[\s>]/)
  const end = html.lastIndexOf('</main>')
  if (start === -1 || end === -1) return undefined

  const markdown = createRenderer(context)(parse(html.slice(start, end + '</main>'.length)).children)
  return `${markdown.replace(/\n{3,}/g, '\n\n').trim()}\n`
}
