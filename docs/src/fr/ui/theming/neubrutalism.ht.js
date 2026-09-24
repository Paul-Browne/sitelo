import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Néo-brutalisme',
    description:
      'Couleurs franches, traits d’encre épais et ombres dures : chaque composant cerné, et enfoncé dans sa propre ombre quand on appuie.',
    activeHref: '/fr/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' est de la couleur franche et de l’encre épaisse : chaque surface est cernée, et tout ce qui se détache de la page projette une ombre dure, sans flou. Un appui enfonce le contrôle dans sa propre ombre, et un interrupteur activé y reste. Les remplissages doux sont des pastels vifs portant un texte sombre, les pleins restent assez sombres pour porter un libellé blanc, et en mode sombre l’encre devient crème, car une ombre noire ne se verrait pas sur une page sombre.',
      ),
      presetPreview('neubrutalism'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Peignez aussi la page avec ',
        code('var(--su-bg)'),
        ' : elle prend alors le crème du préréglage, sur lequel les surfaces blanches se détachent.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Vos propres couleurs'),
      p(
        code('theme()'),
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork. Celui-ci ajoute deux jetons à lui : ',
        code('--su-nb-ink'),
        ', la couleur de chaque trait et de chaque ombre, et ',
        code('--su-nb-lift'),
        ', la distance à laquelle un contrôle en relief se tient de la page — et donc celle dont un appui le déplace.',
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
