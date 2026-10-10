import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Cianografia',
    description:
      'Un disegno tecnico: linee sottili, angoli vivi e crocini di registro, etichette in maiuscolo monospaziato, e inchiostro con un solo blu da cianografia.',
    activeHref: '/it/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' è un disegno tecnico: linee sottili su un foglio quasi nero, angoli vivi e un crocino di registro — una piccola croce — su ogni angolo di una card, di una finestra di dialogo e di una fila di statistiche. Tutto ciò che nomina o aziona qualcosa — un pulsante, l’etichetta di un campo, una scheda, un tag, l’intestazione di una colonna, un link nella barra — è composto in un font monospaziato, in maiuscole spaziate, mentre i titoli e il testo corrente restano in un bastoni, composto stretto. Una linea continua è un bordo e una tratteggiata divide ciò che c’è dentro, come un disegno segna uno spigolo nascosto: le righe di una tabella, un divisore, il tratto verso un passo ancora da fare. Si limita a pochi colori. Il pulsante pieno, una casella spuntata, una barra piena e tutto ciò che è scelto sono inchiostro, stampato in negativo; un solo blu da cianografia segna il focus e il tag sopra un titolo; successo, avviso e pericolo tengono i loro per ciò che dicono. Niente proietta ombre. La modalità scura è l’aspetto originale; quella chiara conserva ogni linea e ogni crocino e lo stampa a inchiostro su carta bianca.',
      ),
      presetPreview('blueprint'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Dipingi la pagina con ',
        code('var(--su-bp-backdrop)'),
        ' per avere lo sfondo del preset con una griglia tenue tracciata sopra, oppure semplicemente con ',
        code('var(--su-bg)'),
        '. Il preset usa Geist o Inter, e Geist Mono, JetBrains Mono o IBM Plex Mono, se la pagina li carica, altrimenti i font di sistema; non scarica nulla.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork. La palette primaria è l’inchiostro — il pulsante pieno, una casella spuntata, una barra piena, tutto ciò che è scelto —, quindi ',
        code('primary'),
        ' ricolora tutto in una volta. Gli altri token sono del preset stesso: ',
        code('--su-bp-accent'),
        ', il blu che disegna il focus e segna un titolo; ',
        code('--su-bp-mark'),
        ', i crocini di registro, che ',
        code('transparent'),
        ' toglie; ',
        code('--su-bp-field'),
        ', la linea attorno a un campo; ',
        code('--su-bp-track'),
        ', la guida in cui scorre una barra di avanzamento; ',
        code('--su-bp-grid'),
        ' e ',
        code('--su-bp-cell'),
        ', le linee dello sfondo e la dimensione dei suoi quadretti; e ',
        code('--su-bp-tracking'),
        ', la spaziatura tra le maiuscole di un’etichetta. Qui il blu diventa un arancione da segnaletica, e i crocini con lui.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
