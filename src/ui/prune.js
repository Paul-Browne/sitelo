/**
 * Cut a sheet down to the rules a site can match.
 *
 * `ui.css` styles every component in the library, and a site uses a
 * handful of them. With `pruneCss` on, the plugin reads the classes off
 * the pages it has just written and hands them here, and what comes
 * back is the same sheet without the rules that could never apply: a
 * selector naming an `su-` class no page carries can never match, so
 * the rule it heads is dead weight.
 *
 * The classes come from the *output* rather than the imports, and that
 * is the more precise of the two. `button({ variant: 'soft' })` renders
 * `su-btn--soft` and a plain `button()` does not; an import cannot tell
 * them apart, and the HTML can. It is also the more honest one, since
 * `import * as ui` names everything and uses almost nothing.
 *
 * Only `su-` classes gate a rule. Everything else in a selector — an
 * element, an attribute, a pseudo-class — is left to the browser, and
 * a class inside `:not()` is not consulted at all, since the rule wants
 * it absent. A rule with no `su-` class is always kept, which is what
 * keeps the tokens on `:root`, the dark-mode blocks and the shared base
 * in every build.
 *
 * Internal: nothing here is exported from `sitelo/ui`.
 */

/**
 * At-rules whose block is more rules, to be pruned one by one. Anything
 * else with a block — `@keyframes`, `@font-face`, `@page` — is kept or
 * dropped whole.
 */
const NESTING = new Set(['media', 'supports', 'container', 'layer', 'scope', 'document'])

/**
 * Index of the `}` closing the block that opened just before `from`,
 * skipping braces inside strings and comments.
 *
 * @param {string} css
 * @param {number} from
 * @returns {number}
 */
function blockEnd(css, from) {
  let depth = 1

  for (let i = from; i < css.length; i++) {
    const char = css[i]

    if (char === '"' || char === "'") {
      i = stringEnd(css, i)
    } else if (char === '/' && css[i + 1] === '*') {
      i = css.indexOf('*/', i + 2) + 1
      if (i === 0) return css.length
    } else if (char === '{') {
      depth++
    } else if (char === '}' && --depth === 0) {
      return i
    }
  }

  return css.length
}

/**
 * Index of the quote closing the string that opens at `from`.
 *
 * @param {string} css
 * @param {number} from
 * @returns {number}
 */
function stringEnd(css, from) {
  const quote = css[from]

  for (let i = from + 1; i < css.length; i++) {
    if (css[i] === '\\') i++
    else if (css[i] === quote) return i
  }

  return css.length
}

/**
 * Split a sheet, or the inside of a nesting at-rule, into its rules.
 *
 * Every node carries `lead`: the whitespace and comments in front of it,
 * verbatim. Serialising the kept nodes back to back then reproduces the
 * original formatting for what survives, and a rule's comment goes with
 * it when it does not — which is what makes this safe to run on the
 * readable sheet as well as the minified one.
 *
 * @param {string} css
 * @param {number} from
 * @param {number} until
 * @returns {{ nodes: Node[], end: number, tail: string }}
 */
function parse(css, from = 0, until = css.length) {
  /** @type {Node[]} */
  const nodes = []
  let i = from

  while (i < until) {
    const leadStart = i

    // Whitespace and comments in front of the next rule.
    while (i < until) {
      if (/\s/.test(css[i])) i++
      else if (css[i] === '/' && css[i + 1] === '*') {
        const close = css.indexOf('*/', i + 2)

        i = close === -1 ? until : close + 2
      } else break
    }

    const lead = css.slice(leadStart, i)

    if (i >= until || css[i] === '}') return { nodes, end: i, tail: lead }

    // The prelude: up to the `{` or `;` at depth zero.
    const preludeStart = i
    let depth = 0

    for (; i < until; i++) {
      const char = css[i]

      if (char === '"' || char === "'") i = stringEnd(css, i)
      else if (char === '(') depth++
      else if (char === ')') depth--
      else if (depth === 0 && (char === '{' || char === ';')) break
    }

    const prelude = css.slice(preludeStart, i)

    if (i >= until || css[i] === ';') {
      nodes.push({ kind: 'statement', lead, text: `${prelude};` })
      i++
      continue
    }

    const bodyStart = i + 1
    const bodyEnd = blockEnd(css, bodyStart)
    const atName = prelude.startsWith('@') ? prelude.slice(1).split(/[\s({]/, 1)[0] : null

    if (atName && NESTING.has(atName)) {
      const inner = parse(css, bodyStart, bodyEnd)

      nodes.push({ kind: 'nest', lead, prelude, children: inner.nodes, tail: inner.tail })
    } else if (atName) {
      nodes.push({ kind: 'block', lead, prelude, name: atName, body: css.slice(bodyStart, bodyEnd) })
    } else {
      nodes.push({ kind: 'rule', lead, prelude, body: css.slice(bodyStart, bodyEnd) })
    }

    i = bodyEnd + 1
  }

  return { nodes, end: i, tail: '' }
}

/**
 * @typedef {{ kind: 'statement', lead: string, text: string }
 *   | { kind: 'rule', lead: string, prelude: string, body: string }
 *   | { kind: 'block', lead: string, prelude: string, name: string, body: string }
 *   | { kind: 'nest', lead: string, prelude: string, children: Node[], tail: string }} Node
 */

/**
 * The selectors of a prelude, split on the commas at depth zero.
 *
 * @param {string} prelude
 * @returns {string[]}
 */
function selectors(prelude) {
  const found = []
  let depth = 0
  let start = 0

  for (let i = 0; i < prelude.length; i++) {
    const char = prelude[i]

    if (char === '"' || char === "'") i = stringEnd(prelude, i)
    else if (char === '(' || char === '[') depth++
    else if (char === ')' || char === ']') depth--
    else if (char === ',' && depth === 0) {
      found.push(prelude.slice(start, i))
      start = i + 1
    }
  }

  found.push(prelude.slice(start))

  return found
}

/**
 * Whether a selector can match on a site that has the given classes.
 *
 * A functional pseudo-class is read for what it asks: `:not(…)` asks
 * for nothing to be present, so its argument is skipped; `:has(…)`,
 * `:is(…)` and the rest match when any one of their arguments can, so
 * the selector is dead only once every argument is. Outside those, each
 * `su-` class has to be present.
 *
 * @param {string} selector
 * @param {(className: string) => boolean} has
 * @returns {boolean}
 */
function canMatch(selector, has) {
  let plain = ''

  for (let i = 0; i < selector.length; i++) {
    // An attribute selector or a string can say `.su-` without meaning it.
    if (selector[i] === '[') i = selector.indexOf(']', i)
    if (selector[i] === '"' || selector[i] === "'") i = stringEnd(selector, i)
    if (i === -1) break

    const match = /^:([\w-]+)\(/.exec(selector.slice(i))

    if (!match) {
      plain += selector[i]
      continue
    }

    const open = i + match[0].length
    let depth = 1
    let close = open

    for (; close < selector.length && depth; close++) {
      if (selector[close] === '(') depth++
      else if (selector[close] === ')') depth--
    }

    const inner = selector.slice(open, close - 1)

    i = close - 1

    if (match[1] === 'not') continue
    if (!selectors(inner).some((argument) => canMatch(argument, has))) return false
  }

  for (const [, className] of plain.matchAll(/\.(su-[\w-]+)/g)) {
    if (!has(className)) return false
  }

  return true
}

/**
 * The nodes that can still match, with selector lists trimmed to the
 * selectors that can. A nesting at-rule with nothing left inside goes
 * too.
 *
 * @param {Node[]} nodes
 * @param {(className: string) => boolean} has
 * @returns {Node[]}
 */
function keep(nodes, has) {
  const kept = []

  for (const node of nodes) {
    if (node.kind === 'rule') {
      const all = selectors(node.prelude)
      const live = all.filter((selector) => canMatch(selector, has))

      if (!live.length) continue

      if (live.length === all.length) {
        kept.push(node)
        continue
      }

      /*
       * Rejoin with the separator the sheet used — `,\n` in the readable
       * one, `,` in the minified — and keep the space before the brace.
       */
      const separator = /,\s*/.exec(node.prelude)?.[0] ?? ','
      const trailing = /\s*$/.exec(node.prelude)?.[0] ?? ''

      kept.push({
        ...node,
        prelude: live.map((selector) => selector.trim()).join(separator) + trailing,
      })
    } else if (node.kind === 'nest') {
      const children = keep(node.children, has)

      if (children.length) kept.push({ ...node, children })
    } else {
      kept.push(node)
    }
  }

  return kept
}

/**
 * @param {Node[]} nodes
 * @param {(node: Node) => boolean} [include]
 * @returns {string}
 */
function serialize(nodes, include = () => true) {
  let out = ''

  for (const node of nodes) {
    if (!include(node)) continue

    out += node.lead

    if (node.kind === 'statement') out += node.text
    else if (node.kind === 'nest') out += `${node.prelude}{${serialize(node.children, include)}${node.tail}}`
    else out += `${node.prelude}{${node.body}}`
  }

  return out
}

/**
 * Every `@keyframes` in the tree, at any depth, as `[name, node]`.
 *
 * @param {Node[]} nodes
 * @returns {Node[]}
 */
function keyframes(nodes) {
  const found = []

  for (const node of nodes) {
    if (node.kind === 'block' && node.name === 'keyframes') found.push(node)
    else if (node.kind === 'nest') found.push(...keyframes(node.children))
  }

  return found
}

/**
 * The sheet, less every rule that cannot match.
 *
 * `has` answers whether a class is somewhere on the site. A `@keyframes`
 * is kept while a surviving declaration still names it, so a spinner's
 * animation leaves with the spinner.
 *
 * @param {string} css
 * @param {(className: string) => boolean} has
 * @returns {string}
 */
export function pruneCss(css, has) {
  const { nodes, tail } = parse(css)
  const kept = keep(nodes, has)
  const animations = keyframes(kept)
  const dead = new Set()

  if (animations.length) {
    const rest = serialize(kept, (node) => !animations.includes(node))

    for (const node of animations) {
      const name = node.prelude.replace(/^@keyframes\s+/, '').trim()

      if (!new RegExp(`(?<![\\w-])${name}(?![\\w-])`).test(rest)) dead.add(node)
    }
  }

  return serialize(kept, (node) => !dead.has(node)) + tail
}

/** A class token: `su-` at a word boundary, then the rest of the name. */
const TOKEN = /\bsu-[a-z0-9-]*/g

/**
 * Every `su-` token in a file, as a predicate over class names.
 *
 * A scan rather than a parse, and of `.js` as well as `.html`, because
 * a class does not have to be in a `class` attribute to end up on the
 * page: the toast runtime builds `su-alert su-c-${color}` in a string,
 * the steps runtime swaps `su-step--${state}` on a click. Anything that
 * looks like one of our classes counts, wherever it sits — a code sample
 * in the docs keeps a rule the page never draws, which is the cheap
 * side to err on.
 *
 * A token ending in `-` is one of those template prefixes, cut off where
 * the expression began, and it stands for every class that starts with
 * it: `su-c-` keeps the whole palette, and a bare `su-` keeps the sheet.
 *
 * @param {Iterable<string>} sources - file contents to scan
 * @param {Iterable<string>} [keep] - class names to treat as present; a
 *   trailing `*` makes one a prefix
 * @returns {(className: string) => boolean}
 */
export function classesIn(sources, keep = []) {
  const exact = new Set()
  const prefixes = new Set()

  const add = (token, prefix) => {
    if (prefix) prefixes.add(token)
    else exact.add(token)
  }

  for (const source of sources) {
    for (const [token] of source.matchAll(TOKEN)) add(token, token.endsWith('-'))
  }

  for (const entry of keep) {
    if (entry.endsWith('*')) add(entry.slice(0, -1), true)
    else add(entry, false)
  }

  const starts = [...prefixes]

  return (className) => exact.has(className) || starts.some((prefix) => className.startsWith(prefix))
}
