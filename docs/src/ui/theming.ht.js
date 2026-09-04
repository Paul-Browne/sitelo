import { h2, p } from 'javascript-to-html'
import { code, codeBlock } from '../lib/code.js'
import { uiLayout } from '../lib/layout.js'
import { demo, propsTable, uiHead } from '../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Theming',
    description:
      'Getting the stylesheet onto the page, and changing every colour, radius and font from one call.',
    activeHref: '/ui/theming',
    extraHead: uiHead(),
    children: [
      p(
        'Every component reads the same custom properties, so a theme is a set of overrides on ',
        code(':root'),
        ' — no build step, no configuration file, and no component that has to be told about it.',
      ),

      h2('Getting the styles in'),
      p(
        code('styles()'),
        ' returns a ',
        code('<style>'),
        ' element holding the whole sheet, minified — about 7 kB gzipped. It is the default because it cannot go missing from ',
        code('dist/'),
        ' and costs no extra request.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('My site'),
  styles(),
)`, 'javascript'),
      p(
        'If you would rather link it once and let the browser cache it across pages, import the CSS from a bundled entry file instead and Vite will emit it:',
      ),
      codeBlock('src/main.js', `import 'sitelo/ui/styles.css'`, 'javascript'),
      p(
        'Use one or the other, not both. ',
        code('stylesheet()'),
        ' returns the raw CSS as a string, for writing it somewhere yourself.',
      ),

      h2('Overriding tokens'),
      p(
        code('theme()'),
        ' writes the overrides. Keys are camelCase token names, palette objects, or literal custom properties — and it goes ',
        code('after'),
        ' ',
        code('styles()'),
        ', so it wins.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Scoped themes'),
      p(
        'A ',
        code('selector'),
        ' scopes the overrides to a subtree instead of the whole page. That is what the three panels below do — same components, three different palettes, one page.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'indigo'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'pink'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'round'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dark mode'),
      p(
        'Dark resolves from ',
        code('prefers-color-scheme'),
        ' on its own. An explicit ',
        code('data-theme'),
        ' or ',
        code('data-su-theme'),
        ' of ',
        code('light'),
        ' or ',
        code('dark'),
        ' on any ancestor overrides it — which is how the demos on this site follow the toggle in the top bar.',
      ),
      p(
        'Pass ',
        code('dark'),
        ' for overrides that should only apply there. It covers the attribute and the media query in one go.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('What there is to override'),
      p(
        'Five palettes of nine slots each, a spacing scale, type, radii, shadows and the surface colours. Every one is a custom property — open the stylesheet, or your browser’s inspector, and they are all on ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Naming'),
      p(
        'A camelCase key becomes a kebab-case property: ',
        code('radiusMd'),
        ' is ',
        code('--su-radius-md'),
        ', ',
        code('fontSans'),
        ' is ',
        code('--su-font-sans'),
        '. A nested object expands the same way — ',
        code('{ primary: { softFg: … } }'),
        ' sets ',
        code('--su-primary-soft-fg'),
        ' — and a key already starting with ',
        code('--'),
        ' is used exactly as written, which is the escape hatch for anything the mapping does not cover.',
      ),
      p(
        'A palette has nine slots: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' and ',
        code('ring'),
        '. Set only the ones you are changing.',
      ),

      h2('Contrast'),
      p(
        'The shipped palettes clear WCAG AA against the surfaces they sit on, in both themes, and there is a test in the repository that fails the build if that stops being true. A theme of your own is not covered by it — check your ',
        code('fg'),
        ' against your ',
        code('base'),
        ' before shipping.',
      ),

      h2('Props'),
      p(code('styles()'), ' and ', code('stylesheet()'), ':'),
      propsTable([
        ['minify', 'boolean', 'true', 'Strip comments and whitespace.'],
        ['nonce', 'string', '', 'CSP nonce for the emitted style element. styles() only.'],
      ]),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Scope the overrides to a subtree.'],
        ['dark', 'object', '', 'Overrides applied only in dark mode.'],
        ['nonce', 'string', '', 'CSP nonce.'],
      ]),
    ],
  })
