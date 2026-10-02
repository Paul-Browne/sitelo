import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Un solo carattere monospaziato su uno sfondo blu notte, sul modello di Advent of Code: azioni tra parentesi quadre, link verdi e un bagliore su ciò che è acceso.',
    activeHref: '/it/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' è un solo carattere monospaziato su uno sfondo blu notte, composto come Advent of Code: testo grigio, link verdi che si illuminano al passaggio del mouse, bianco per ciò che conta e un bagliore del proprio colore sulle poche cose accese. Un’azione è una parola tra parentesi quadre, ',
        code('[Salva]'),
        '; una casella di controllo è ',
        code('[ ]'),
        ' finché non diventa ',
        code('[X]'),
        ', e un titolo di secondo livello è delimitato come ',
        code('--- Titolo ---'),
        '. Niente è arrotondato e niente galleggia su un’ombra morbida: un bordo è una linea, e una card in rilievo ha una doppia linea. La modalità scura è l’aspetto originale; quella chiara mantiene il carattere, le parentesi e gli angoli vivi e li stampa in blu notte su carta chiara, senza il bagliore.',
      ),
      presetPreview('terminal'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Componi anche la pagina con esso — lo sfondo, il grigio e il carattere — e i componenti ci si posano come sopra. Il preset usa Source Code Pro se la pagina la carica, altrimenti il monospaziato di sistema; non scarica nulla.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork. Il bagliore è disegnato nel colore del testo su cui si trova, quindi una palette che cambi si illumina del suo nuovo colore: qui il primario diventa ambra, come un terminale più vecchio. Il successo è l’oro di una stella, come il modello segna un enigma risolto; se preferisci, dagli un verde allo stesso modo. Due token sono del preset stesso: ',
        code('--su-tm-bright'),
        ', il bianco dei titoli e di tutto ciò che è scelto, e ',
        code('--su-tm-glow'),
        ', l’ombra delle cose accese, che in modalità chiara è ',
        code('none'),
        '.',
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
