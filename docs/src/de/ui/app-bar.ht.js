import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'App-Bar',
    description:
      'Die Leiste am oberen Rand einer Website: die Marke auf der einen Seite, Navigation und Aktionen auf der anderen.',
    activeHref: '/de/ui/app-bar',
    children: [
      p(
        'Eine App-Bar ist ein ',
        code('<header>'),
        ' mit einer Reihe darin. Die Teile sind getrennt, damit du sie anordnen kannst: ',
        code('appBarNav()'),
        ' für Links, ',
        code('appBarSpacer()'),
        ', um alles Folgende ans andere Ende zu schieben, und ',
        code('appBarActions()'),
        ' für die Buttons am Schluss.',
      ),

      h2('Einfache App-Bar'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Anmelden'),
  ),
)`, { align: 'stretch' }),

      h2('Mit Navigation'),
      p(
        code('navLink()'),
        ' ist der Linkstil für eine Leiste; ',
        code('current'),
        ' markiert die aktive Seite nicht nur farblich, sondern auch mit ',
        code('aria-current'),
        '.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Doku'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Beispiele'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Loslegen'),
  ),
)`, { align: 'stretch' }),

      h2('Eine Marke mit Zeichen'),
      p(
        'Die Marke nimmt beliebiges Markup und verlinkt auf ',
        code('/'),
        ', sofern ',
        code('href'),
        ' nichts anderes sagt.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Sticky und verwischt'),
      p(
        code('sticky'),
        ' heftet die Leiste an den oberen Rand des Scroll-Containers; ',
        code('blur'),
        ' macht sie durchscheinend, sodass Inhalt darunter durchläuft. Beides wird hier in einer scrollenden Box gezeigt, nicht auf der Seite selbst.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Scroll mich — Absatz ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Beim Scrollen aus dem Weg'),
      p(
        code("sticky: 'auto'"),
        ' hält die Leiste angeheftet, schiebt sie aber weg, solange die Seite nach unten scrollt, und holt sie zurück, sobald sie nach oben scrollt oder den Anfang erreicht. Sie bleibt sichtbar, solange der Tastaturfokus in ihr liegt oder ein Menü in ihr offen ist.',
      ),
      p(
        'In Chromium ist das reines CSS, ',
        code('@container scroll-state(scrolled)'),
        ', und es wird nichts geladen. Andere Browser laden beim Seitenaufruf ein kleines Modul, das stattdessen das Scrollen beobachtet. Die Leiste folgt der Seite; in einer eigenen scrollenden Box wie dieser hier braucht die Box zusätzlich ',
        code('container-type: scroll-state'),
        '.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; container-type: scroll-state; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: 'auto', blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'auto')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 12 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Nach unten scrollen, dann zurück — Absatz ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Mit einem Drawer auf kleinen Bildschirmen'),
      p(
        'Das übliche Muster: Links in der Leiste am Desktop, ein Button, der am Telefon einen ',
        code('drawer()'),
        ' öffnet. Der Drawer ist ein <dialog>, den der Button per command öffnet — kein Skript nötig.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Navigation öffnen',
        variant: 'ghost',
        color: 'neutral',
        commandfor: 'app-bar-drawer', command: 'show-modal',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navigation' },
    navLink({ href: '#docs' }, 'Doku'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Beispiele'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Inhalt des Marken-Links am Anfang.'],
        ['href', 'string', "'/'", 'Wohin die Marke verlinkt.'],
        ['sticky', "boolean | 'auto'", 'false', "Heftet die Leiste beim Scrollen nach oben. 'auto' blendet sie zusätzlich beim Herunterscrollen aus."],
        ['blur', 'boolean', 'false', 'Durchscheinender Hintergrund mit Backdrop-Blur.'],
        ['as', 'string', "'header'", 'Element, das gerendert wird.'],
      ]),
      p('Die Teile:'),
      propsTable([
        ['appBarNav', '', '', 'Ein nav-Element, das die Links hält.'],
        ['appBarSpacer', '', '', 'Flexible Lücke; alles danach rückt ans andere Ende.'],
        ['appBarActions', '', '', 'Button-Gruppe am Ende.'],
        ['navLink', 'href, current, color', '', 'Ein Link im Leistenstil; current markiert die aktive Seite.'],
      ], { headers: ['Teil', 'Props', 'Standard', 'Beschreibung'] }),
    ],
  })
