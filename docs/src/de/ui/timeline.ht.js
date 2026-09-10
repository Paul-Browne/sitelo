import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Timeline',
    description:
      'Einträge der Reihe nach, an einer Linie entlang — ein Changelog, eine Release-Historie, eine Über-Seite.',
    activeHref: '/de/ui/timeline',
    children: [
      p(
        'Eine Timeline ist eine geordnete Liste mit einer Linie an der Seite. Bau sie aus ',
        code('items'),
        ' oder aus ',
        code('timelineItem()'),
        '-Kindern, wenn die Einträge nicht gleichförmig genug sind, um aus einem Array zu kommen.',
      ),

      h2('Einfache Timeline'),
      demo(`timeline({
  items: [
    { time: 'März 2026', title: 'Komponentenbibliothek', description: 'sitelo-ui kommt mit neunzig Komponenten.' },
    { time: 'Januar 2026', title: 'Server-Islands', description: 'Statische Seiten mit Bereichen, die zur Anfragezeit gerendert werden.' },
    { time: 'Oktober 2025', title: 'Erstes Release', description: 'Dateibasiertes Routing und ein Build-Befehl.' },
  ],
})`, { align: 'stretch' }),

      h2('Farbige Marker'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Deployment erfolgreich', description: '204 Seiten veröffentlicht.', color: 'success' },
    { time: '12:03', title: 'Lighthouse bestanden', description: 'Alle Schwellen erreicht.', color: 'success' },
    { time: '12:01', title: 'Linkprüfung mit Warnung', description: 'Ein externer Link lief in einen Timeout.', color: 'warning' },
    { time: '12:00', title: 'Build gestartet', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Mit Icons'),
      demo(`timeline(
  timelineItem({
    time: 'Gerade eben',
    title: 'Veröffentlicht',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: 'Vor 2 Minuten',
    title: 'Baut',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Reiche Einträge'),
      p('Kinder eines Eintrags landen unter seiner Beschreibung.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Seitenabschnitte', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Wartung', description: 'Abhängigkeiten angehoben und ein Fix im Link-Checker.' }),
)`, { align: 'stretch' }),

      h2('Aus Daten'),
      p(
        'Die übliche Form auf einer statischen Website: eine Changelog-Datei, von ',
        code('data()'),
        ' geladen und direkt auf Einträge abgebildet.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Seitenabschnitte' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Wartung' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Server-Islands' },
  ]

  return timeline({
    items: releases.map((release) => ({
      time: release.date,
      title: 'v' + release.version,
      description: release.summary,
      color: 'primary',
    })),
  })
})()`, { align: 'stretch' }),

      h2('Timeline oder Schritte?'),
      p(
        'Eine Timeline hält fest, was passiert ist — neueste oder älteste zuerst — und hat keine aktuelle Position. ',
        code('steps()'),
        ' zeigt den Fortschritt durch einen Ablauf, mit einem laufenden Schritt und dem Rest davor oder dahinter.',
      ),

      h2('Props'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Objekte mit den timelineItem-Props von unten.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Wann es passiert ist — ein Datum, eine Version, eine Uhrzeit.'],
        ['title', 'Child', '', 'Was passiert ist.'],
        ['description', 'Child', '', 'Das Detail darunter.'],
        ['icon', 'Child', '', 'Markup im Marker.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Farbe des Markers.'],
      ]),
      p('Kinder eines Eintrags werden unter seiner Beschreibung gerendert.'),
    ],
  })
