import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Chip',
    description:
      'Ein kompaktes Etikett — ein Tag, ein Status, ein Filter, eine Zahl.',
    activeHref: '/de/ui/chip',
    extraHead: uiHead(),
    children: [
      p(
        'Chips sind kleine Metadaten: die Tags eines Blogbeitrags, der Status eines Builds, die Kategorien einer Seite. Sie sind standardmäßig inline, eine Reihe davon will also einen ',
        code('stack'),
        ' mit ',
        code('wrap'),
        '.',
      ),

      h2('Einfacher Chip'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip('statisch'),
  chip('vite'),
  chip('ohne-runtime'),
)`),

      h2('Farben'),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'primary' }, 'primary'),
  chip({ color: 'neutral' }, 'neutral'),
  chip({ color: 'success' }, 'success'),
  chip({ color: 'warning' }, 'warning'),
  chip({ color: 'danger' }, 'danger'),
)`),

      h2('Varianten'),
      demo(`stack({ gap: 'sm' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'soft', color: 'primary' }, 'soft'),
    chip({ variant: 'soft', color: 'success' }, 'soft'),
    chip({ variant: 'soft', color: 'danger' }, 'soft'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'outline', color: 'primary' }, 'outline'),
    chip({ variant: 'outline', color: 'success' }, 'outline'),
    chip({ variant: 'outline', color: 'danger' }, 'outline'),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    chip({ variant: 'solid', color: 'primary' }, 'solid'),
    chip({ variant: 'solid', color: 'success' }, 'solid'),
    chip({ variant: 'solid', color: 'danger' }, 'solid'),
  ),
)`, { align: 'start' }),

      h2('Größen'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  chip({ size: 'sm' }, 'klein'),
  chip({ size: 'md' }, 'mittel'),
  chip({ size: 'lg' }, 'groß'),
)`),

      h2('Statuspunkt'),
      p(
        'Ein Punkt davor macht aus einem Chip einen Status. Farbe allein trägt keine Bedeutung, also behalte das Wort.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ color: 'success', dot: true }, 'Build erfolgreich'),
  chip({ color: 'warning', dot: true }, 'In der Warteschlange'),
  chip({ color: 'danger', dot: true }, 'Fehlgeschlagen'),
  chip({ color: 'neutral', dot: true }, 'Übersprungen'),
)`),

      h2('Links'),
      p(
        'Gib einem Chip ein ',
        code('href'),
        ', und er rendert einen Anker — die übliche Form für eine Tag-Liste, in der jedes Tag eine Seite ist.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ href: '/de/docs/routing', color: 'primary' }, 'routing'),
  chip({ href: '/de/docs/data', color: 'primary' }, 'daten'),
  chip({ href: '/de/docs/islands', color: 'primary' }, 'islands'),
)`),

      h2('Als Button'),
      p(
        code('as'),
        ' wechselt das Element — für einen Filter, der umschaltet statt zu navigieren.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  chip({ as: 'button', variant: 'solid', color: 'primary', 'aria-pressed': 'true' }, 'Alle'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Anleitungen'),
  chip({ as: 'button', variant: 'outline', color: 'neutral', 'aria-pressed': 'false' }, 'Beispiele'),
)`),

      h2('In einer Tabelle'),
      demo(`table({
  striped: true,
  columns: [
    { key: 'page', header: 'Seite' },
    { header: 'Status', align: 'end', render: (row) =>
      chip({ size: 'sm', dot: true, color: row.ok ? 'success' : 'danger' }, row.ok ? 'ok' : 'fehlgeschlagen') },
  ],
  rows: [
    { page: '/', ok: true },
    { page: '/docs', ok: true },
    { page: '/blog/[slug]', ok: false },
  ],
})`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Aus welcher Palette geschöpft wird.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Wie viel Gewicht der Chip trägt.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Innenabstand und Textgröße.'],
        ['href', 'string', '', 'Rendert einen Anker.'],
        ['dot', 'boolean', 'false', 'Setzt einen Statuspunkt vor das Label.'],
        ['as', 'string', "'span'", 'Element, das ohne href gerendert wird.'],
      ]),
    ],
  })
