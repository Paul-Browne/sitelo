import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Cronologia',
    description:
      'Voci in ordine, lungo una linea — un changelog, uno storico dei rilasci, una pagina “chi siamo”.',
    activeHref: '/it/ui/timeline',
    children: [
      p(
        'Una cronologia è un elenco ordinato con una riga lungo il fianco. Costruiscila da ',
        code('items'),
        ', oppure da figli ',
        code('timelineItem()'),
        ' quando le voci non sono abbastanza uniformi da venire da un array.',
      ),

      h2('Cronologia di base'),
      demo(`timeline({
  items: [
    { time: 'Marzo 2026', title: 'Libreria di componenti', description: 'sitelo-ui arriva con novanta componenti.' },
    { time: 'Gennaio 2026', title: 'Island server', description: 'Pagine statiche con regioni renderizzate al momento della richiesta.' },
    { time: 'Ottobre 2025', title: 'Primo rilascio', description: 'Routing basato sui file e un comando di build.' },
  ],
})`, { align: 'stretch' }),

      h2('Marcatori colorati'),
      demo(`timeline({
  items: [
    { time: '12:04', title: 'Deploy riuscito', description: '204 pagine pubblicate.', color: 'success' },
    { time: '12:03', title: 'Lighthouse superato', description: 'Tutte le soglie rispettate.', color: 'success' },
    { time: '12:01', title: 'Avviso dal controllo dei link', description: 'Un link esterno è andato in timeout.', color: 'warning' },
    { time: '12:00', title: 'Build avviata', color: 'neutral' },
  ],
})`, { align: 'stretch' }),

      h2('Con icone'),
      demo(`timeline(
  timelineItem({
    time: 'Proprio ora',
    title: 'Pubblicato',
    color: 'success',
    icon: icon('check', { 'stroke-width': 3.4 }),
  }),
  timelineItem({
    time: '2 minuti fa',
    title: 'In costruzione',
    color: 'primary',
  }),
)`, { align: 'stretch' }),

      h2('Voci ricche'),
      p('I figli di una voce finiscono sotto la sua descrizione.'),
      demo(`timeline(
  timelineItem({ time: 'v2.7.0', title: 'Sezioni di pagina', color: 'primary' },
    stack({ direction: 'row', gap: 'xs', wrap: true, style: 'margin-top: 0.5rem' },
      chip({ size: 'sm' }, 'hero'),
      chip({ size: 'sm' }, 'footer'),
      chip({ size: 'sm' }, 'stat'),
      chip({ size: 'sm' }, 'steps'),
      chip({ size: 'sm' }, 'timeline'),
      chip({ size: 'sm' }, 'mockup'),
    ),
  ),
  timelineItem({ time: 'v2.6.3', title: 'Manutenzione', description: 'Aggiornamenti di dipendenze e una correzione al controllo dei link.' }),
)`, { align: 'stretch' }),

      h2('Dai dati'),
      p(
        'La forma consueta su un sito statico: un file di changelog caricato da ',
        code('data()'),
        ', mappato direttamente sugli elementi.',
      ),
      demo(`return (() => {
  const releases = [
    { version: '2.7.0', date: '2026-03-01', summary: 'Sezioni di pagina' },
    { version: '2.6.3', date: '2026-02-14', summary: 'Manutenzione' },
    { version: '2.6.0', date: '2026-01-20', summary: 'Island server' },
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

      h2('Cronologia o passaggi?'),
      p(
        'Una cronologia registra quello che è successo, dal più recente o dal più vecchio, e non ha una posizione corrente. ',
        code('steps()'),
        ' mostra l’avanzamento in un percorso, con un passaggio in corso e gli altri davanti o dietro.',
      ),

      h2('Props'),
      p(code('timeline()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Oggetti con le props di timelineItem qui sotto.'],
      ]),
      p(code('timelineItem()'), ':'),
      propsTable([
        ['time', 'Child', '', 'Quando è successo — una data, una versione, un orario.'],
        ['title', 'Child', '', 'Che cosa è successo.'],
        ['description', 'Child', '', 'Il dettaglio sotto.'],
        ['icon', 'Child', '', 'Markup dentro al marcatore.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Colore del marcatore.'],
      ]),
      p('I figli di una voce vengono renderizzati sotto la sua descrizione.'),
    ],
  })
