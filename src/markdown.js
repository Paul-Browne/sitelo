/**
 * A built page's HTML, back to Markdown, for the copies `llms: true` writes
 * beside each page and gathers into `llms-full.txt`. The docs site's own
 * machine-readable plugin uses it too.
 *
 * Not a general converter. It reads what a build emits — markup from
 * template literals, javascript-to-html and sitelo-ui, well-formed and
 * every element closed — and only what a reader of the page needs has to
 * survive it. What an answer engine wants from a page is the prose, the
 * code and the tables, so that is what comes through: navigation, forms,
 * buttons, drawings, and anything marked `data-pagefind-ignore` or
 * `aria-hidden="true"` stay behind.
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
      let at = stack.length - 1
      while (at > 0 && stack[at].tag !== tag) at -= 1
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
 * @param {{ pageUrl: string }} context
 */
function createRenderer({ pageUrl }) {
  /*
   * Against the page's own URL, the way the browser reads them. The copy
   * lives at a different address (`/blog/hello.md` for `/blog/hello/`),
   * so a relative link left as written would point somewhere else.
   */
  const absolute = (href) => {
    // One with a scheme already (`https:`, `mailto:`) stays as written.
    if (!href || /^[a-z][a-z\d+.-]*:/i.test(href)) return href
    try {
      return new URL(href, pageUrl).href
    } catch {
      return href
    }
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
   * A tab's name. A nested element after its own text — a badge — is set
   * in parentheses: `ht.js<span>recommended</span>` is "ht.js
   * (recommended)".
   *
   * @param {Element} tab
   */
  function tabLabel(tab) {
    let label = ''
    for (const child of tab.children) {
      if (typeof child === 'string') {
        label += child
        continue
      }
      if (isSkipped(child)) continue
      const text = textOf(child).trim()
      if (text) label += label.trim() ? ` (${text})` : text
    }
    return label.replace(/\s+/g, ' ').trim()
  }

  /**
   * An ARIA tab set: `role="tablist"` buttons for `role="tabpanel"`
   * panels, such as the docs' template / ht.js / JSX code tabs. Every panel
   * is kept, each named by its tab, since a reader who writes JSX wants
   * the JSX one and a hidden panel is no less content. The tab strip
   * itself is a control and goes.
   *
   * @param {Element} node
   */
  function tabSet(node, depth) {
    const tabs = new Map()
    /** @type {Element[]} */
    const panels = []

    const walk = (current) => {
      if (typeof current === 'string') return
      if (current.attrs.role === 'tab') tabs.set(current.attrs['aria-controls'], tabLabel(current))
      if (current.attrs.role === 'tabpanel') panels.push(current)
      current.children.forEach(walk)
    }
    walk(node)

    return panels
      .map((panel) => {
        const label = tabs.get(panel.attrs.id)
        /** @type {Element | undefined} */
        let pre
        const find = (current) => {
          if (pre || typeof current === 'string') return
          if (current.tag === 'pre') pre = current
          else current.children.forEach(find)
        }
        find(panel)

        // A code sample's tab joins the label above its fence; any other
        // panel is headed by its tab's name.
        if (pre) return codeBlock(pre, label)
        const body = blocks(panel.children, depth)
        return [label ? `**${label}**` : '', body].filter(Boolean).join('\n\n')
      })
      .filter(Boolean)
      .join('\n\n')
  }

  /** @param {Element} node */
  const isTabSet = (node) =>
    node.children.some((child) => typeof child !== 'string' && child.attrs.role === 'tablist')

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

    if (isTabSet(node)) return tabSet(node, depth)

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

/** A page's chrome, when there is no `<main>` to say what is content. */
const CHROME = new Set(['header', 'footer', 'aside', 'nav'])

/**
 * The element `tag` and everything in it, cut out of `html`, or undefined
 * when the page has none.
 *
 * @param {string} html
 * @param {string} tag
 */
function slice(html, tag) {
  const start = html.search(new RegExp(`<${tag}[\\s>]`, 'i'))
  const end = html.toLowerCase().lastIndexOf(`</${tag}>`)
  if (start === -1 || end === -1 || end < start) return undefined
  return html.slice(start, end + tag.length + 3)
}

/**
 * The page's content as Markdown: its `<main>`, or failing that its
 * `<body>` without the header, footer, sidebar and navigation around it.
 *
 * @param {string} html a whole rendered page
 * @param {{ pageUrl: string, siteUrl?: string }} context the page's own
 *   absolute URL, which every relative link and image resolves against.
 *   (`siteUrl` is accepted and unused: a root-relative link resolves
 *   against the page's origin, as the browser's does.)
 * @returns {string | undefined} undefined when the page has neither
 */
export function pageToMarkdown(html, context) {
  const main = slice(html, 'main')
  const body = main ? undefined : slice(html, 'body')
  if (!main && !body) return undefined

  const root = parse(/** @type {string} */ (main ?? body))
  let nodes = root.children

  if (body) {
    const element = nodes.find((node) => typeof node !== 'string' && node.tag === 'body')
    nodes = (typeof element === 'object' ? element.children : nodes).filter(
      (node) => typeof node === 'string' || !CHROME.has(node.tag),
    )
  }

  const markdown = createRenderer(context)(nodes)
  return `${markdown.replace(/\n{3,}/g, '\n\n').trim()}\n`
}

/**
 * @typedef {{
 *   title?: string,
 *   description?: string,
 *   noindex: boolean,
 *   canonical?: string,
 *   modified?: string,
 *   published?: string,
 * }} PageInfo
 */

/**
 * What a page's head says about it, as far as the sitemap and the llms
 * files need: its `<title>` and description, whether it asks not to be
 * indexed, its canonical URL, and when it was published and last changed
 * (`article:published_time` / `article:modified_time`). Read with the same
 * parser as the content, so an attribute value with a `>` in it is no
 * trouble and attribute order does not matter.
 *
 * @param {string} html a whole rendered page
 * @returns {PageInfo}
 */
export function pageInfo(html) {
  const end = html.search(/<\/head>|<body[\s>]/i)
  const root = parse(end === -1 ? html : html.slice(0, end))

  /** @type {PageInfo} */
  const info = { noindex: false }
  /** Keep the first of each, as a browser does. */
  const first = (key, value) => {
    if (value && info[key] === undefined) info[key] = value
  }

  const walk = (node) => {
    if (typeof node === 'string') return
    if (node.tag === 'title') first('title', textOf(node).replace(/\s+/g, ' ').trim())
    if (node.tag === 'link' && /(?:^|\s)canonical(?:\s|$)/i.test(node.attrs.rel ?? '')) {
      first('canonical', (node.attrs.href ?? '').trim())
    }
    if (node.tag === 'meta') {
      const name = (node.attrs.name ?? '').toLowerCase()
      const property = (node.attrs.property ?? '').toLowerCase()
      // One line, as the llms files quote it after a link or a `>`.
      const content = (node.attrs.content ?? '').replace(/\s+/g, ' ').trim()
      if (name === 'description') first('description', content)
      if (name === 'robots' && /\bnoindex\b/i.test(content)) info.noindex = true
      if (property === 'article:modified_time') first('modified', content)
      if (property === 'article:published_time') first('published', content)
    }
    node.children.forEach(walk)
  }
  walk(root)

  return info
}
