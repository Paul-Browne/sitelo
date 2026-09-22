import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Figura',
    description:
      'Un’immagine e la sua didascalia, come un’unica figura — con lo spazio tenuto prima che l’immagine arrivi.',
    activeHref: '/it/ui/figure',
    children: [
      p(
        'Un ',
        code('<figure>'),
        ' lega una didascalia a ciò che descrive, cosa che un paragrafo sotto un’immagine non fa. Passa ',
        code('src'),
        ' per il caso comune, oppure dei figli per qualunque altra cosa valga la pena accompagnare con una didascalia.',
      ),

      h2('Figura di base'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'Il logotipo di sitelo',
  caption: 'Il logotipo, come compare nella barra in alto.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Con proporzioni tenute'),
      p(
        code('ratio'),
        ' avvolge l’immagine in un ',
        code('aspectRatio()'),
        ', così la didascalia non salta mai più in basso quando l’immagine si carica.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Dare una didascalia ad altro'),
      p('Senza ', code('src'), ', i figli sono il contenuto della figura.'),
      demo(`figure({ caption: 'Tabella 1 — output di una build predefinita.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'File' }, { key: 'size', header: 'Dimensione', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Codice con una didascalia'),
      p(
        'Nota la prop ',
        code('text'),
        ' su ',
        code('code()'),
        ': in questa libreria i figli vengono renderizzati come HTML ovunque, quindi un esempio che contiene tag ha bisogno di essere sfuggito, altrimenti il browser lo costruisce invece di mostrarlo.',
      ),
      demo(`figure({ caption: 'Una pagina sitelo per intero.' },
  code({ text: 'export default () => "<h1>Ciao</h1>"' }),
)`, { align: 'stretch' }),

      h2('Testo alternativo'),
      p(
        'L’attributo ',
        code('alt'),
        ' viene sempre scritto, vuoto se non dai nulla — un’immagine senza alcun ',
        code('alt'),
        ' viene annunciata con il nome del file, che è peggio del silenzio. Una didascalia non è un sostituto: la didascalia la leggono tutti, l’alt descrive l’immagine a chi non può vederla.',
      ),
      p(
        'Quando la didascalia dice già tutto quello che dice l’immagine, ',
        code("alt: ''"),
        ' è la risposta giusta.',
      ),

      h2('Nella prosa'),
      p(
        'Le figure che escono da un renderer Markdown sono già stilizzate da ',
        code('prose()'),
        '. Questo componente è per le figure che costruisci tu.',
      ),

      h2('Props'),
      propsTable([
        ['src', 'string', '', 'Sorgente dell’immagine. Omettila e usa i figli.'],
        ['alt', 'string', "''", 'Testo alternativo. Sempre scritto, anche se vuoto.'],
        ['caption', 'Child', '', 'Il figcaption.'],
        ['ratio', 'string', '', 'Tiene lo spazio prima che l’immagine si carichi.'],
      ]),
    ],
  })
