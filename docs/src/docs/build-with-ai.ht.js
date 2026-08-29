import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { docsLayout } from '../lib/layout.js'
import { buildWithAiSnippets } from '../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('en')

export default () =>
  docsLayout({
    title: 'Build with AI',
    description:
      'Give coding agents up-to-date sitelo knowledge with llms.txt, project rules, and practical tips.',
    activeHref: '/docs/build-with-ai',
    children: [
      p(
        'AI editors and coding agents often guess wrong about sitelo — they reach for React, Next, or Astro patterns that don’t apply. This guide shows how to point them at current sitelo docs and keep generated code on-model.',
      ),
      h2('llms.txt'),
      p(
        'sitelo publishes a machine-readable summary of the framework at ',
        a({ href: '/llms.txt' }, 'sitelo.dev/llms.txt'),
        '. Many agents can fetch a URL; ask yours to read that file (and the human docs) before writing sitelo code.',
      ),
      ul(
        { class: 'docs-list' },
        li(a({ href: '/llms.txt' }, 'https://sitelo.dev/llms.txt'), ' — compact API and conventions'),
        li(a({ href: '/docs' }, 'https://sitelo.dev/docs'), ' — full guides'),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub README'),
          ' — mental model and feature overview',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — ',
          code('javascript-to-html'),
          ' docs (recommended for writing HTML in JS)',
        ),
      ),
      p(
        'Unlike a docs MCP server, ',
        code('llms.txt'),
        ' needs no install — paste the URL into the chat, add it to project rules, or let the agent fetch it.',
      ),
      h2('Project rules'),
      p(
        'If your tool supports persistent instructions (',
        code('AGENTS.md'),
        ', Cursor rules, Copilot instructions, …), add a short sitelo rule so every session starts with the right mental model. The ',
        a({ href: '/examples/basic' }, 'basic example'),
        ' includes an ',
        code('AGENTS.md'),
        ' you can copy:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Create ',
        code('.cursor/rules/sitelo.mdc'),
        ' in your project (or paste the same text into Cursor’s project rules UI):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Tips for AI-assisted sitelo work'),
      ul(
        { class: 'docs-list' },
        li(
          'Start from a template — ask the agent to scaffold from ',
          a({ href: '/examples/basic' }, 'examples/basic'),
          ' or ',
          a({ href: '/examples/wordpress' }, 'examples/wordpress'),
          ' instead of inventing a framework.',
        ),
        li(
          'Prefer ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') for markup — tag functions that return HTML strings, without a templating engine or React. Point agents at ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' so they don’t invent JSX component trees.',
        ),
        li(
          'Pages are functions that return HTML — ',
          code('export default () => `<html>…</html>`'),
          ' or compose with ',
          code('javascript-to-html'),
          '. JSX is fine when it compiles to strings; a React runtime is not required.',
        ),
        li(
          'Use sitelo’s CLI — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — not ',
          code('vite'),
          ' directly, unless you know you need a custom Vite config.',
        ),
        li(
          'Verify APIs against ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — especially ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ', and ',
          a({ href: '/docs/islands' }, 'server islands'),
          '.',
        ),
        li(
          'Zero JS by default — only link a ',
          code('<script>'),
          ' when the page needs client code; unreferenced modules stay server-only.',
        ),
        li(
          'Review and run — always ',
          code('sitelo build'),
          ' (or the dev server) after the agent edits pages; treat generated markup as a draft.',
        ),
      ),
      p(
        a({ href: '/docs' }, 'Getting started'),
        ' · ',
        a({ href: '/examples/basic' }, 'Basic example'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
