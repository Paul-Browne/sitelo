import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Viola quasi nero, bordi sottilissimi e luce al neon: pulsanti a pillola scuri con un bordo che brilla, e titoli illuminati dall’alto.',
    activeHref: '/it/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' è viola quasi nero, con bordi sottilissimi e una luce che viene da dentro. Un pulsante pieno è una pillola scura, illuminata lungo i bordi interni e cerchiata da un gradiente che brilla oltre il suo contorno; i titoli grandi sfumano dal chiaro al lavanda, e tutto ciò che è scelto o acceso prende un alone. Il bagliore è sempre solo decorazione, quindi ogni etichetta resta su un colore piatto che rispetta WCAG AA. La modalità scura è l’aspetto originale; quella chiara tiene le pillole scure e il bagliore e li posa su una pagina lavanda pallido.',
      ),
      presetPreview('superneon'),

      h2('Come usarlo'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Il mio sito'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Colora la pagina con ',
        code('var(--su-sn-backdrop)'),
        ' per avere lo sfondo del preset con una luce viola che cade dall’alto, oppure semplicemente con ',
        code('var(--su-bg)'),
        '. I titoli usano Geist se la pagina lo carica, e il font di sistema altrimenti: il preset non scarica nulla.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('I tuoi colori'),
      p(
        code('theme()'),
        ' continua a funzionare sopra, quindi un preset è un punto di partenza e non un fork. Questo dà a ogni palette due posti in più, ',
        code('glow'),
        ' e ',
        code('glowEnd'),
        ': i due estremi del gradiente con cui sono disegnati il suo bordo e il suo alone. Su un bagliore non si legge nulla, quindi possono essere vivaci quanto vuoi.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
