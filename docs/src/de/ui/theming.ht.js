import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Theming',
    description:
      'Das Stylesheet auf die Seite bringen und jede Farbe, jeden Radius und jede Schrift aus einem einzigen Aufruf ändern.',
    activeHref: '/de/ui/theming',
    extraHead: uiHead(),
    children: [
      p(
        'Jede Komponente liest dieselben Custom Properties, ein Theme ist also nur ein Satz Überschreibungen auf ',
        code(':root'),
        ' — kein Build-Schritt, keine Konfigurationsdatei und keine Komponente, der man davon erzählen müsste.',
      ),

      h2('Die Styles hineinbekommen'),
      p(
        code('styles()'),
        ' gibt ein ',
        code('<style>'),
        '-Element mit dem gesamten Stylesheet zurück, minifiziert — rund 7 kB gzipped. Das ist der Standard, weil es in ',
        code('dist/'),
        ' nicht fehlen kann und keine zusätzliche Anfrage kostet.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Meine Website'),
  styles(),
)`, 'javascript'),
      p(
        'Wenn du es lieber einmal verlinkst und den Browser es seitenübergreifend cachen lässt, importiere das CSS aus einer gebündelten Einstiegsdatei — Vite gibt es dann aus:',
      ),
      codeBlock('src/main.js', `import 'sitelo/ui/styles.css'`, 'javascript'),
      p(
        'Nimm das eine oder das andere, nicht beides. ',
        code('stylesheet()'),
        ' gibt das rohe CSS als String zurück, um es selbst irgendwohin zu schreiben.',
      ),

      h2('Tokens überschreiben'),
      p(
        code('theme()'),
        ' schreibt die Überschreibungen. Schlüssel sind Token-Namen in camelCase, Paletten-Objekte oder wörtliche Custom Properties — und es kommt ',
        code('nach'),
        ' ',
        code('styles()'),
        ', gewinnt also.',
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
      h2('Eingegrenzte Themes'),
      p(
        'Ein ',
        code('selector'),
        ' grenzt die Überschreibungen auf einen Teilbaum statt auf die ganze Seite ein. Genau das tun die drei Panels unten — dieselben Komponenten, drei verschiedene Paletten, eine Seite.',
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
        text({ variant: 'caption', tone: 'muted' }, 'rund'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Dunkelmodus'),
      p(
        'Dunkel löst sich von selbst über ',
        code('prefers-color-scheme'),
        ' auf. Ein explizites ',
        code('data-theme'),
        ' oder ',
        code('data-su-theme'),
        ' mit ',
        code('light'),
        ' oder ',
        code('dark'),
        ' an irgendeinem Vorfahren übersteuert das — so folgen die Demos auf dieser Website dem Umschalter in der oberen Leiste.',
      ),
      p(
        'Übergib ',
        code('dark'),
        ' für Überschreibungen, die nur dort gelten sollen. Das deckt Attribut und Media Query in einem Rutsch ab.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Was es zu überschreiben gibt'),
      p(
        'Fünf Paletten mit je neun Plätzen, eine Abstandsskala, Typografie, Radien, Schatten und die Flächenfarben. Jedes davon ist eine Custom Property — öffne das Stylesheet oder den Inspektor deines Browsers, sie stehen alle auf ',
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

      h2('Benennung'),
      p(
        'Ein camelCase-Schlüssel wird zu einer kebab-case-Property: ',
        code('radiusMd'),
        ' ist ',
        code('--su-radius-md'),
        ', ',
        code('fontSans'),
        ' ist ',
        code('--su-font-sans'),
        '. Ein verschachteltes Objekt entfaltet sich genauso — ',
        code('{ primary: { softFg: … } }'),
        ' setzt ',
        code('--su-primary-soft-fg'),
        ' —, und ein Schlüssel, der bereits mit ',
        code('--'),
        ' beginnt, wird exakt so verwendet, wie er dasteht: die Notluke für alles, was die Abbildung nicht abdeckt.',
      ),
      p(
        'Eine Palette hat neun Plätze: ',
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
        ' und ',
        code('ring'),
        '. Setze nur die, die du änderst.',
      ),

      h2('Kontrast'),
      p(
        'Die mitgelieferten Paletten erfüllen WCAG AA gegen die Flächen, auf denen sie sitzen, in beiden Themes, und ein Test im Repository lässt den Build scheitern, sobald das nicht mehr stimmt. Ein eigenes Theme deckt er nicht ab — prüfe dein ',
        code('fg'),
        ' gegen dein ',
        code('base'),
        ', bevor du es ausspielst.',
      ),

      h2('Props'),
      p(code('styles()'), ' und ', code('stylesheet()'), ':'),
      propsTable([
        ['minify', 'boolean', 'true', 'Kommentare und Leerraum entfernen.'],
        ['nonce', 'string', '', 'CSP-Nonce für das erzeugte style-Element. Nur bei styles().'],
      ]),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Grenzt die Überschreibungen auf einen Teilbaum ein.'],
        ['dark', 'object', '', 'Überschreibungen, die nur im Dunkelmodus gelten.'],
        ['nonce', 'string', '', 'CSP-Nonce.'],
      ]),
    ],
  })
