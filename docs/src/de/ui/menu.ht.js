import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Menü',
    description:
      'Ein Dropdown auf Basis von <details>, das ganz ohne Skript auf- und zugeht.',
    activeHref: '/de/ui/menu',
    children: [
      p(
        'Ein Menü ist ein ',
        code('<details>'),
        ' mit einem gestalteten Panel. Das ist eine bewusste Entscheidung gegen die Popover-API: ein Popover lebt in der obersten Ebene und lässt sich ohne Anchor Positioning nicht an seinem Auslöser ausrichten — und das gibt es noch nicht überall. Ein ',
        code('<details>'),
        ' positioniert sich heute schon richtig und braucht nichts Geladenes.',
      ),
      p(
        'Der Auslöser ist genau dieses ',
        code('<summary>'),
        ', gestaltet wie ein Button — du übergibst Label und Button-Props also an ',
        code('menu()'),
        ', statt einen fertig gerenderten ',
        code('button()'),
        ' hineinzureichen. Ein summary ist bereits interaktiv, und ein Button darin schachtelt zwei Bedienelemente ineinander, wo es nur eine Aktion gibt: ungültiges Markup und zwei Tab-Stopps für eine Sache.',
      ),
      p(
        'Schließen bei Klick nach außen und mit Escape kommt aus einem ',
        code('ontoggle'),
        '-Handler, der beides beim ersten Öffnen eines Menüs importiert — und erst dann. Kommt dieses Modul nie an, geht ein Menü über sein eigenes summary trotzdem auf und zu.',
      ),

      h2('Einfaches Menü'),
      demo(`menu({ trigger: 'Aktionen' },
  menuItem({ href: '#edit' }, 'Bearbeiten'),
  menuItem({ href: '#duplicate' }, 'Duplizieren'),
  menuSeparator(),
  menuItem({ href: '#delete' }, 'Löschen'),
)`),

      h2('Ausrichtung'),
      p(
        'Ein Menü klappt an der vorderen Kante seines Auslösers auf. ',
        code("align: 'end'"),
        ' dreht das um — genau das braucht ein Menü nahe am rechten Rand einer Leiste.',
      ),
      demo(`stack({ direction: 'row', gap: 'xl', justify: 'space-between', style: 'width: 100%' },
  menu({ trigger: 'Vorn ausgerichtet', variant: 'soft' },
    menuItem({ href: '#a' }, 'Erstes'),
    menuItem({ href: '#b' }, 'Zweites'),
  ),
  menu({ trigger: 'Hinten ausgerichtet', variant: 'soft', align: 'end' },
    menuItem({ href: '#c' }, 'Erstes'),
    menuItem({ href: '#d' }, 'Zweites'),
  ),
)`, { align: 'stretch' }),

      h2('Icon-Auslöser'),
      p(
        'Ein Icon ohne ',
        code('trigger'),
        '-Text braucht ein ',
        code('label'),
        ' — daraus wird der zugängliche Name, den das Icon nicht liefern kann.',
      ),
      demo(`stack({ direction: 'row', gap: 'md' },
  menu({
    align: 'end',
    label: 'Weitere Aktionen',
    variant: 'ghost',
    icon: icon('more-horizontal'),
  },
    menuItem({ href: '#rename' }, 'Umbenennen'),
    menuItem({ href: '#move' }, 'Verschieben'),
    menuSeparator(),
    menuItem({ href: '#archive' }, 'Archivieren'),
  ),
)`),

      h2('Einträge mit Icons'),
      demo(`menu({ trigger: 'Datei' },
  menuItem({
    href: '#new',
    icon: icon('plus'),
  }, 'Neue Seite'),
  menuItem({
    href: '#open',
    icon: icon('folder'),
  }, 'Öffnen…'),
  menuSeparator(),
  menuItem({
    href: '#build',
    icon: icon('zap'),
  }, 'Website bauen'),
)`),

      h2('Buttons statt Links'),
      p(
        'Ein Eintrag ohne ',
        code('href'),
        ' rendert einen ',
        code('<button>'),
        ' — für eine Aktion, die auf der Seite passiert, statt einer Navigation.',
      ),
      demo(`menu({ trigger: 'Exportieren', variant: 'soft', color: 'primary' },
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Als JSON exportiert.',{color:'success'}))" }, 'Als JSON'),
  menuItem({ onclick: "import('/su/toast.js').then(m=>m.toast('Als CSV exportiert.',{color:'success'}))" }, 'Als CSV'),
)`),
      // The demo above raises toasts; this is the region they land in.
      // Fixed-position, so it renders here but appears in the corner.
      preview('toasts()'),

      h2('In einer App-Bar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    menu({
      align: 'end',
      label: 'Mehr',
      variant: 'ghost',
      icon: icon('more-horizontal'),
    },
      menuItem({ href: '/de/docs' }, 'Doku'),
      menuItem({ href: '/de/examples' }, 'Beispiele'),
      menuSeparator(),
      menuItem({ href: 'https://github.com/paul-browne/sitelo' }, 'GitHub'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Barrierefreiheit'),
      p(
        'Das Panel ist ein ',
        code('role="menu"'),
        ', dessen Einträge ',
        code('role="menuitem"'),
        ' sind, und das summary trägt ',
        code('aria-haspopup'),
        '. Ein ',
        code('<details>'),
        ' ist kein natives Menü-Widget, das hier ist also eine vernünftige Annäherung und keine perfekte — für eine schlichte Linkliste ist ein ',
        code('nav'),
        ' im details genauso gültig und verspricht weniger.',
      ),

      h2('Props'),
      p(code('menu()'), ' — die Auslöser-Props sind die des Buttons:'),
      propsTable([
        ['trigger', 'Child', '', 'Sichtbares Label. Übergib Text, keinen gerenderten button().'],
        ['icon', 'Child', '', 'Markup vor dem Label, oder allein für einen reinen Icon-Auslöser.'],
        ['label', 'string', '', 'Zugänglicher Name. Pflicht, wenn es ein Icon und keinen trigger-Text gibt.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'outline'", 'Gestaltung des Auslösers.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Aus welcher Palette der Auslöser schöpft.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Größe des Auslösers.'],
        ['align', "'start' | 'end'", "'start'", 'An welcher Kante des Auslösers das Panel ausgerichtet wird.'],
        ['triggerClass', 'string', '', 'Zusätzliche Klassen für den Auslöser statt für das umschließende details.'],
      ]),
      p(code('menuItem()'), ':'),
      propsTable([
        ['href', 'string', '', 'Rendert einen Anker; ohne ihn einen Button.'],
        ['icon', 'Child', '', 'Markup vor dem Label.'],
        ['as', 'string', "'button'", 'Element, das ohne href gerendert wird.'],
      ]),
      p(code('menuSeparator()'), ' nimmt keine Props — es ist die Haarlinie zwischen Gruppen von Einträgen.'),
    ],
  })
