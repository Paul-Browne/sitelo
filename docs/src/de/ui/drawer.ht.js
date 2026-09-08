import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Drawer',
    description:
      'Ein Panel, das von der Kante hereinkommt — dieselbe Popover-Mechanik wie ein Modal, andere Form.',
    activeHref: '/de/ui/drawer',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Drawer ist ein Panel über die volle Höhe, an einer Seite verankert. Wie ',
        code('modal()'),
        ' ist er ein ',
        code('popover'),
        ': ein Button mit passendem ',
        code('popovertarget'),
        ' öffnet ihn, und der Browser kümmert sich um Hintergrund, Klick nach außen und Escape.',
      ),
      p(
        'Auf einer statischen Website ist sein häufigster Job das Navigationsmenü am Telefon.',
      ),

      h2('Einfacher Drawer'),
      demo(`fragment(
  button({ popovertarget: 'drawer-basic' }, 'Drawer öffnen'),
  drawer({ id: 'drawer-basic', title: 'Einstellungen' },
    stack({ gap: 'md' },
      toggle({ label: 'Pagefind-Suche', checked: true }),
      toggle({ label: 'Bildoptimierung', checked: true }),
      toggle({ label: 'Server-Islands' }),
    ),
  ),
)`),

      h2('Seiten'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-start' }, 'Vom Anfang'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-end' }, 'Vom Ende'),
  ),
  drawer({ id: 'drawer-start', side: 'start', title: 'Anfang' },
    text({ variant: 'small', tone: 'muted' }, 'An der vorderen Kante verankert — links in einer Sprache, die von links nach rechts läuft.'),
  ),
  drawer({ id: 'drawer-end', title: 'Ende' },
    text({ variant: 'small', tone: 'muted' }, 'Der Standard: an der hinteren Kante verankert.'),
  ),
)`),

      h2('Breite'),
      p('Jede CSS-Länge. Sie ist auf 90 % des Viewports gedeckelt, sodass ein breiter Drawer auch auf ein Telefon passt.'),
      demo(`fragment(
  stack({ direction: 'row', gap: 'sm' },
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-narrow' }, 'Schmal'),
    button({ variant: 'outline', color: 'neutral', popovertarget: 'drawer-wide' }, 'Breit'),
  ),
  drawer({ id: 'drawer-narrow', width: '14rem', title: 'Schmal' },
    text({ variant: 'small', tone: 'muted' }, 'width: 14rem'),
  ),
  drawer({ id: 'drawer-wide', width: '34rem', title: 'Breit' },
    text({ variant: 'small', tone: 'muted' }, 'width: 34rem'),
  ),
)`),

      h2('Als Navigationsmenü'),
      p('Das Muster, das die meisten Websites wollen: ein Menü-Button in der Leiste, die Links in einem Drawer.'),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      iconButton({
        label: 'Navigation öffnen',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'drawer-nav',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'drawer-nav', title: 'Navigation' },
    navLink({ href: '#docs', current: true }, 'Doku'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Beispiele'),
    navLink({ href: '#about' }, 'Über'),
    divider({ spacing: 'sm' }),
    button({ block: true }, 'Loslegen'),
  ),
)`, { align: 'stretch' }),

      h2('Ein Filter-Panel'),
      demo(`fragment(
  button({ variant: 'soft', color: 'neutral', popovertarget: 'drawer-filters' }, 'Filter'),
  drawer({ id: 'drawer-filters', title: 'Filter', width: '22rem' },
    stack({ gap: 'lg' },
      choiceGroup({
        legend: 'Typ',
        name: 'drawer-type',
        value: 'guide',
        options: [
          { value: 'guide', label: 'Anleitungen' },
          { value: 'example', label: 'Beispiele' },
          { value: 'all', label: 'Alles' },
        ],
      }),
      choiceGroup({
        legend: 'Tags',
        name: 'drawer-tags',
        type: 'checkbox',
        value: ['routing'],
        options: ['routing', 'data', 'islands'],
      }),
      stack({ direction: 'row', gap: 'sm' },
        button({ variant: 'ghost', color: 'neutral', popovertarget: 'drawer-filters', popovertargetaction: 'hide' }, 'Abbrechen'),
        button('Anwenden'),
      ),
    ),
  ),
)`),

      h2('Props'),
      propsTable([
        ['id', 'string', '', 'Pflicht. Worauf das popovertarget eines Auslösers zeigt.'],
        ['title', 'Child', '', 'Überschrift und zugänglicher Name des Dialogs.'],
        ['side', "'start' | 'end'", "'end'", 'An welcher Kante er verankert ist.'],
        ['width', 'string', "'20rem'", 'Panelbreite, gedeckelt bei 90vw.'],
        ['closable', 'boolean', 'true', 'Das × in der Kopfzeile zeigen.'],
        ['closeLabel', 'string', "'Close'", 'Zugänglicher Name dieses Buttons.'],
      ]),
    ],
  })
