import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Liste',
    description:
      'Zeilen mit Inhalt und wahlweise etwas an beiden Enden — die Form, aus der die meisten Einstellungsseiten und Feeds gebaut sind.',
    activeHref: '/de/ui/list',
    extraHead: uiHead(),
    children: [
      p(
        'Eine Liste ist eine umrandete Fläche aus Zeilen. Jede Zeile hat einen Titel, eine optionale Beschreibung und Plätze am Anfang und am Ende für einen Avatar, ein Icon oder ein Bedienelement.',
      ),

      h2('Einfache Liste'),
      demo(`list(
  listItem({ title: 'Routing', description: 'src/about.ht.js wird zu /about' }),
  listItem({ title: 'Daten laden', description: 'data() läuft einmal, zur Build-Zeit' }),
  listItem({ title: 'Assets', description: 'Gebündelt wird nur, worauf dein HTML verweist' }),
)`, { align: 'stretch' }),

      h2('Plätze am Anfang und am Ende'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: '3 Commits nach main gepusht',
    end: chip({ size: 'sm', color: 'neutral' }, 'vor 2 Std.'),
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Hat einen Pull Request eröffnet',
    end: chip({ size: 'sm', color: 'success', dot: true }, 'offen'),
  }),
)`, { align: 'stretch' }),

      h2('Zeilen, die verlinken'),
      p(
        'Eine Zeile mit ',
        code('href'),
        ' setzt den Anker in das ',
        code('<li>'),
        ' statt darum herum, sodass die Liste eine gültige Liste bleibt. Setz nicht zusätzlich einen Button in die Zeile — interaktiver Inhalt darf nicht in einem Link stecken.',
      ),
      demo(`list(
  listItem({ title: 'Erste Schritte', description: 'Installation und erste Seite', href: '/de/docs' }),
  listItem({ title: 'Routing', description: 'Dateibasiert, mit dynamischen Segmenten', href: '/de/docs/routing' }),
  listItem({ title: 'Deployment', description: 'Netlify, Vercel, Pages, Amplify', href: '/de/docs/deployment' }),
)`, { align: 'stretch' }),

      h2('Zeilen mit Bedienelementen'),
      p(
        'Wenn eine Zeile einen Schalter oder Button trägt, lass die Zeile selbst unverlinkt und mach das Bedienelement zum interaktiven Teil.',
      ),
      demo(`list(
  listItem({
    title: 'Pagefind-Suche',
    description: 'Indexiert am Ende des Builds jede Seite',
    end: toggle({ 'aria-label': 'Pagefind-Suche', checked: true }),
  }),
  listItem({
    title: 'Bildoptimierung',
    description: 'Skaliert und konvertiert Bilder. Braucht sharp.',
    end: toggle({ 'aria-label': 'Bildoptimierung', checked: true }),
  }),
  listItem({
    title: 'Server-Islands',
    description: 'Rendert markierte Bereiche zur Anfragezeit',
    end: toggle({ 'aria-label': 'Server-Islands' }),
  }),
)`, { align: 'stretch' }),

      h2('Schmucklos'),
      p(
        code('plain'),
        ' lässt Rahmen und Hintergrund weg — für eine Liste, die in einer Karte oder Seitenleiste sitzt, die schon eine eigene Fläche hat.',
      ),
      demo(`card(
  cardHeader({ title: 'Letzte Builds' }),
  cardBody(
    list({ plain: true },
      listItem({ title: '94a837a', description: 'main · vor 4 Minuten', end: chip({ size: 'sm', color: 'success', dot: true }, 'erfolgreich') }),
      listItem({ title: 'dcfaaae', description: 'main · vor 2 Stunden', end: chip({ size: 'sm', color: 'success', dot: true }, 'erfolgreich') }),
      listItem({ title: 'a46a461', description: 'main · gestern', end: chip({ size: 'sm', color: 'danger', dot: true }, 'fehlgeschlagen') }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Freie Zeilen'),
      p(
        'Ohne ',
        code('title'),
        ' oder ',
        code('description'),
        ' rendert eine Zeile genau die Kinder, die sie bekommt — für ein Layout, das die zweizeilige Form nicht abdeckt.',
      ),
      demo(`list(
  listItem(
    stack({ direction: 'row', gap: 'md', align: 'center', justify: 'space-between', style: 'width: 100%' },
      stack({ gap: 'none' },
        text({ variant: 'small' }, 'Eigene Zeile'),
        text({ variant: 'caption', tone: 'muted' }, 'Innen alles, was du willst'),
      ),
      button({ size: 'sm', variant: 'soft' }, 'Aktion'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Aus Daten'),
      demo(`return (() => {
  const locales = [
    { code: 'en', name: 'English', pages: 24 },
    { code: 'es', name: 'Español', pages: 24 },
    { code: 'zh', name: '简体中文', pages: 24 },
  ]

  return list(
    locales.map((locale) =>
      listItem({
        start: avatar({ name: locale.code, size: 'sm', color: 'neutral', square: true }),
        title: locale.name,
        description: locale.pages + ' Seiten',
        end: chip({ size: 'sm', color: 'neutral' }, locale.code),
      }),
    ),
  )
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('list()'), ':'),
      propsTable([
        ['plain', 'boolean', 'false', 'Rahmen und Hintergrund weglassen.'],
        ['as', 'string', "'ul'", 'Element, das gerendert wird, z. B. ol.'],
      ]),
      p(code('listItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'Die Hauptzeile der Zeile.'],
        ['description', 'Child', '', 'Eine gedämpfte zweite Zeile.'],
        ['start', 'Child', '', 'Platz vorn — ein Avatar oder Icon.'],
        ['end', 'Child', '', 'Platz hinten — ein Chip, ein Bedienelement, ein Zeitstempel.'],
        ['href', 'string', '', 'Macht die Zeile zum Link, mit dem Anker im li.'],
        ['interactive', 'boolean', 'false', 'Hover-Hervorhebung, ohne sie zum Link zu machen.'],
      ]),
    ],
  })
