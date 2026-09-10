import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Hero',
    description:
      'Der Kopf einer Landing-Page: eine Schlagzeile, ein Satz, und was man damit tun soll.',
    activeHref: '/de/ui/hero',
    children: [
      p(
        'Ein Hero ist das Erste auf einer Marketing- oder Dokumentations-Startseite. Er rendert eine ',
        code('<section>'),
        ' mit einem ',
        code('<h1>'),
        ' darin — er ist also die Überschrift der Seite, kein dekoratives Banner, das zufällig groß ist.',
      ),

      h2('Einfacher Hero'),
      demo(`hero({
  level: 2,
  title: 'Statische Seiten, ohne das Framework',
  description: 'Schreibe Funktionen, die HTML zurückgeben. Bekomme eine vollständige Website.',
},
  button({ size: 'lg' }, 'Loslegen'),
  button({ size: 'lg', variant: 'outline', color: 'neutral' }, 'Doku lesen'),
)`, { align: 'stretch' }),

      h2('Mit Überzeile'),
      p('Eine kurze Zeile über dem Titel — eine Version, eine Kategorie, eine Ankündigung.'),
      demo(`hero({
  level: 2,
  eyebrow: 'sitelo 2.7',
  title: 'Jetzt mit Komponentenbibliothek',
  description: 'Siebzig Komponenten, kein Runtime, ein optionales Skript.',
},
  button({ size: 'lg', href: '/de/ui' }, 'Komponenten durchstöbern'),
)`, { align: 'stretch' }),

      h2('Linksbündig'),
      demo(`hero({
  level: 2,
  align: 'start',
  eyebrow: 'Open Source',
  title: 'Offen gebaut',
  description: 'MIT-lizenziert und klein genug, um es an einem Nachmittag zu lesen.',
},
  button({ href: 'https://github.com/paul-browne/sitelo' }, 'Auf GitHub ansehen'),
)`, { align: 'stretch' }),

      h2('Mit Medien'),
      p(
        code('media'),
        ' zu übergeben schaltet auf zwei Spalten um, sobald Platz dafür ist, und stapelt auf schmalem Bildschirm wieder zu einer. Das passt natürlich zu ',
        code('mockup()'),
        '.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Sieh es laufen',
  description: 'Jede Seite ist statisches HTML, sobald sie den Browser erreicht.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
      text({ variant: 'h5', as: 'div' }, 'Hallo Welt'),
      text({ variant: 'small', tone: 'muted' }, 'Zur Build-Zeit gerendert.'),
    ),
  ),
},
  button('Loslegen'),
)`, { align: 'stretch' }),

      h2('In einem Container'),
      p(
        'Ein Hero hat keine eigene Breitengrenze — setze ihn in einen ',
        code('container()'),
        ', damit er sich an allem anderen auf der Seite ausrichtet.',
      ),
      demo(`container({ size: 'md', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
  hero({
    level: 2,
    title: 'Eingefasst',
    description: 'Der Container setzt die Breite; der Hero setzt den Rhythmus.',
  }),
)`, { align: 'stretch' }),

      h2('Überschriftenebene'),
      p(
        'Der Titel ist standardmäßig das ',
        code('<h1>'),
        ' der Seite, was für eine Landing-Page richtig ist. Ein Hero mitten auf einer Seite ist nicht die Seitenüberschrift, also senke ihn mit ',
        code('level'),
        ' — jede Demo auf dieser Seite tut das, weil die Seite bereits ein eigenes h1 hat.',
      ),

      h2('Nur ein Titel'),
      p('Jeder Teil ist optional, und nichts Leeres wird gerendert.'),
      demo(`hero({ level: 2, title: 'Dokumentation' })`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['eyebrow', 'Child', '', 'Kleine Zeile in Großbuchstaben über dem Titel.'],
        ['title', 'Child', '', 'Wird als h1 der Seite gerendert.'],
        ['description', 'Child', '', 'Der Satz darunter.'],
        ['media', 'Child', '', 'Neben dem Text auf breitem Bildschirm, darüber auf schmalem.'],
        ['align', "'center' | 'start'", "'center'", 'Textausrichtung, wenn es keine Medien gibt.'],
        ['level', 'number', '1', 'Überschriftenebene des Titels. Für einen Hero mitten auf der Seite absenken.'],
        ['as', 'string', "'section'", 'Element, das gerendert wird.'],
      ]),
      p('Kinder werden zur Aktionsreihe unter der Beschreibung.'),
    ],
  })
