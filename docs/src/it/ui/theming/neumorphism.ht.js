import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Neumorfismo',
    description:
      'Soft UI: ogni componente in rilievo sulla pagina o premuto dentro di essa, solo con luce e ombra.',
    activeHref: '/it/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' è soft UI: ogni superficie è la pagina stessa, e un controllo si distingue solo per luce e ombra — in rilievo sulla pagina o premuto dentro di essa. Mantiene due cose a cui questo stile di solito rinuncia, un testo che supera WCAG AA e il contorno del focus, e segue la modalità scura come tutto il resto. Però ha bisogno che lo sfondo della pagina stessa sia ',
        code('var(--su-bg)'),
        ', perché l’effetto si regge sul fatto che i due siano dello stesso colore.',
      ),
      presetPreview('neumorphism'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork. Questo aggiunge una decima casella a ogni palette, ',
        code('glow'),
        ' — il colore in cui sfuma l’estremità di una barra di avanzamento o di uno switch — così un nuovo primario può portarsi il suo.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
