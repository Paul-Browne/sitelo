import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Una console di sistema: un solo carattere monospaziato sul nero, pannelli a filo sottile, etichette in maiuscolo grassetto e un accento ciano, con tutto ciò che è selezionato in negativo.',
    activeHref: '/it/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' è una console di sistema: un solo carattere monospaziato su uno sfondo nero, pannelli a filo sottile con l’intestazione separata da una riga, e ogni etichetta — un pulsante, la didascalia di un campo, una scheda, l’intestazione di una colonna — in maiuscolo grassetto e spaziato. Il ciano è l’accento: titoli, titoli dei pannelli, il pulsante pieno, il focus e tutto ciò che è selezionato, stampato in negativo, scuro sul ciano, come un terminale evidenzia una riga. Le altre palette sono i suoi colori di stato, verde, giallo e rosso, e un pulsante a contorno o un tag è disegnato nel suo colore, bordo e testo insieme. Niente è arrotondato e niente proietta ombre. La modalità scura è l’aspetto originale; quella chiara mantiene ogni linea, ogni maiuscola e ogni angolo vivo e li stampa in nero su un quasi bianco.',
      ),
      presetPreview('terminal'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
      p(
        'Componi anche la pagina con esso — lo sfondo, il colore del testo e il carattere — e i componenti ci si posano come sopra. Il preset usa JetBrains Mono, IBM Plex Mono o Source Code Pro se la pagina ne carica uno, altrimenti il monospaziato di sistema; non scarica nulla.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork: qui l’accento diventa un ambra da fosfori. Due token sono del preset stesso: ',
        code('--su-tm-tracking'),
        ', la spaziatura di un’etichetta in maiuscolo, e ',
        code('--su-tm-track'),
        ', la guida in cui scorre una barra di avanzamento o un cursore.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
