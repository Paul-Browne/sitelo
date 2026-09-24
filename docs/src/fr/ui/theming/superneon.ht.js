import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Violet presque noir, filets fins et lumière néon : des boutons pilule sombres au contour lumineux, et des titres éclairés par le haut.',
    activeHref: '/fr/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' est un violet presque noir, aux filets fins, avec une lumière qui vient de l’intérieur. Un bouton plein est une pilule sombre, éclairée le long de ses bords intérieurs et cerclée d’un dégradé qui rayonne au-delà de son contour ; les grands titres passent du clair au lavande, et tout ce qui est choisi ou activé prend un halo. La lueur n’est jamais que décorative : chaque libellé repose toujours sur une couleur unie qui respecte WCAG AA. Le mode sombre est le rendu d’origine ; le mode clair garde les pilules sombres et la lueur, et les pose sur une page lavande pâle.',
      ),
      presetPreview('superneon'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Peignez la page avec ',
        code('var(--su-sn-backdrop)'),
        ' pour avoir le fond du préréglage avec une lumière violette qui tombe du haut, ou simplement avec ',
        code('var(--su-bg)'),
        '. Les titres utilisent Geist si la page la charge, et la police système sinon : le préréglage ne télécharge rien.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Vos propres couleurs'),
      p(
        code('theme()'),
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork. Celui-ci donne à chaque palette deux emplacements de plus, ',
        code('glow'),
        ' et ',
        code('glowEnd'),
        ' : les deux extrémités du dégradé dans lequel sont tracés son contour et son halo. Rien ne se lit sur une lueur, alors elles peuvent être aussi vives que vous voulez.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
