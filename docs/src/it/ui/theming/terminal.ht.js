import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Terminale',
    description:
      'Una console di sistema: un solo font monospaziato su nero, pannelli a filo sottile, etichette in maiuscolo grassetto e un accento ciano, con la selezione in negativo.',
    activeHref: '/it/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' è una console di sistema: un solo font monospaziato su uno sfondo nero, pannelli a filo sottile con l’intestazione separata da una riga, e ogni etichetta — un pulsante, la didascalia di un campo, una scheda, l’intestazione di una colonna — in maiuscolo, quasi sempre in grassetto. Il ciano è l’accento: i titoli grandi, i titoli dei pannelli, il pulsante pieno e il focus. Una selezione — una riga di tabella sotto il puntatore, un segmento premuto, una scheda a pillola scelta, il numero della pagina corrente, la voce di menu sotto il puntatore — è stampata in negativo, scura sul ciano, come un terminale evidenzia una riga. Le palette di successo, avviso e pericolo sono i suoi colori di stato, verde, giallo e rosso, e un pulsante a contorno o un tag è disegnato nel suo colore, bordo e testo insieme. Niente è arrotondato tranne un radio, e niente proietta ombre. La modalità scura è l’aspetto originale; quella chiara mantiene ogni linea, ogni maiuscola e ogni angolo vivo e li stampa in nero su un quasi bianco.',
      ),
      presetPreview('terminal'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        'Componi anche la pagina con esso — lo sfondo, il colore del testo e il font — e i componenti ci si posano come sopra. Il preset usa JetBrains Mono, IBM Plex Mono o Source Code Pro se la pagina ne carica uno, altrimenti il font monospaziato di sistema; non scarica nulla.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork: qui l’accento diventa ambra, come un vecchio monitor a fosfori, anche nelle linee con cui è disegnato. Tre token sono del preset stesso: ',
        code('--su-tm-tracking'),
        ', la spaziatura tra le maiuscole di un’etichetta; ',
        code('--su-tm-track'),
        ', la guida in cui scorre una barra di avanzamento o un cursore; e ',
        code('--su-tm-field'),
        ', la linea attorno a un campo, che in modalità scura è lo stesso grigio tenue dei pannelli: alzala se vuoi bordi dei campi più marcati.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
