import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Oś czasu',
    description:
      'Wpisy po kolei, wzdłuż linii — lista zmian, historia wydań, strona „o nas”.',
    activeHref: '/pl/ui/timeline',
    children: [
      p(
        'Oś czasu to lista uporządkowana z linią wzdłuż boku. Zbuduj ją z ',
        code('items'),
        ' albo z dzieci ',
        code('timelineItem()'),
        ', gdy wpisy nie są na tyle jednorodne, by pochodzić z tablicy.',
      ),

      h2('Podstawowa oś czasu'),
      demo(`timeline({
  items: [
    { time: 'Marzec 2026', title: 'Biblioteka komponentów', description: 'sitelo-ui przychodzi z dziewięćdziesięcioma komponentami.' },
    { time: 'Styczeń 2026', title: 'Wyspy serwerowe', description: 'Statyczne strony z obszarami renderowanymi w chwili żądania.' },
    { time: 'Październik 2025', title: 'Pierwsze wydanie', description: 'Routing oparty na plikach i polecenie budowania.' },
  ],
})`, { align: 'stretch' }),

      h2('Kolorowe znaczniki'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Wdrożenie udane', description: 'Opublikowano 204 strony.', color: 'success' },
    { time: '12:03', title: 'Lighthouse zaliczony', description: 'Wszystkie progi spełnione.', color: 'success' },
    { time: '12:01', title: 'Ostrzeżenie ze sprawdzania odnośników', description: 'Jeden zewnętrzny odnośnik przekroczył limit czasu.', color: 'warning' },
    { time: '12:00', title: 'Build wystartował', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Z ikonami'),
      demo(`timeline(
  timelineItem({
    time: 'Przed chwilą',
    title: 'Opublikowane',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: '2 minuty temu',
    title: 'Budowanie',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Bogate wpisy'),
      p('Dzieci wpisu trafiają pod jego opis.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Sekcje strony', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Utrzymanie', description: 'Podbicia zależności i poprawka w sprawdzaniu odnośników.' }),
)`, { align: 'stretch' }),

      h2('Z danych'),
      p(
        'Typowy kształt na witrynie statycznej: plik z listą zmian wczytany przez ',
        code('data()'),
        ' i zmapowany wprost na elementy.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Sekcje strony' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Utrzymanie' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Wyspy serwerowe' },
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

      h2('Oś czasu czy kroki?'),
      p(
        'Oś czasu zapisuje, co się wydarzyło, od najnowszego albo najstarszego, i nie ma bieżącej pozycji. ',
        code('steps()'),
        ' pokazuje postęp w przebiegu, z jednym krokiem w toku i resztą przed nim albo za nim.',
      ),

      h2('Propsy'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Obiekty z propsami timelineItem poniżej.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Kiedy to się stało — data, wersja, godzina.'],
        ['title', 'Child', '', 'Co się stało.'],
        ['description', 'Child', '', 'Szczegół pod spodem.'],
        ['icon', 'Child', '', 'Znaczniki wewnątrz znacznika osi.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Kolor znacznika.'],
      ]),
      p('Dzieci wpisu renderują się pod jego opisem.'),
    ],
  })
