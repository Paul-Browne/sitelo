import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Neobrutalismo',
    description:
      'Colori piatti, linee d’inchiostro spesse e ombre nette: ogni componente con il suo contorno, e spinto dentro la propria ombra quando lo premi.',
    activeHref: '/it/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' è colore piatto e inchiostro spesso: ogni superficie ha un contorno, e tutto ciò che si stacca dalla pagina proietta un’ombra netta, senza sfocatura. Premere un controllo lo spinge dentro la sua stessa ombra, e un interruttore acceso resta lì. I riempimenti tenui sono pastelli vivaci con testo scuro sopra, quelli pieni restano abbastanza scuri da reggere un’etichetta bianca, e in modalità scura l’inchiostro diventa crema, perché un’ombra nera su una pagina scura non si vedrebbe.',
      ),
      presetPreview('neubrutalism'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Colora anche la pagina con ',
        code('var(--su-bg)'),
        ': prenderà il crema del preset, e le superfici bianche ci risalteranno sopra.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork. Questo aggiunge due token suoi: ',
        code('--su-nb-ink'),
        ', il colore con cui sono disegnate tutte le linee e le ombre, e ',
        code('--su-nb-lift'),
        ', quanto un controllo in rilievo si stacca dalla pagina, e quindi di quanto lo sposta una pressione.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
