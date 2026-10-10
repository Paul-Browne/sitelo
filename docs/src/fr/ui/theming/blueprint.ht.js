import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Plan',
    description:
      'Un dessin technique : traits fins, angles vifs et croix de repérage, libellés en capitales à chasse fixe, et de l’encre avec un seul bleu de plan.',
    activeHref: '/fr/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' est un dessin technique : des traits fins sur une feuille presque noire, des angles vifs et une croix de repérage à chaque coin d’une carte, d’une boîte de dialogue et d’une rangée de statistiques. Tout ce qui nomme ou actionne quelque chose — un bouton, le libellé d’un champ, un onglet, une étiquette, un en-tête de colonne, un lien de la barre — est composé dans une police à chasse fixe, en capitales espacées, tandis que les titres et le texte courant restent dans une linéale, composée serrée. Un trait plein est une arête et un trait tireté divise ce qu’il y a dedans, comme un plan marque une arête cachée : les lignes d’un tableau, un séparateur, le tronçon vers une étape encore à venir. Il s’en tient à peu de couleurs. Le bouton plein, une case cochée, une barre remplie et tout ce qui est choisi sont à l’encre, imprimés en inverse ; un seul bleu de plan marque le focus et l’étiquette au-dessus d’un titre ; succès, avertissement et danger gardent les leurs pour ce qu’ils disent. Rien ne projette d’ombre. Le mode sombre est l’apparence d’origine ; le mode clair garde chaque trait et chaque croix et l’imprime à l’encre sur papier blanc.',
      ),
      presetPreview('blueprint'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Peignez la page avec ',
        code('var(--su-bp-backdrop)'),
        ' pour le fond du préréglage, avec une grille discrète tracée dessus, ou simplement avec ',
        code('var(--su-bg)'),
        '. Le préréglage utilise Geist ou Inter, et Geist Mono, JetBrains Mono ou IBM Plex Mono, si la page les charge, sinon les polices du système ; il ne télécharge rien.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Vos propres couleurs'),
      p(
        code('theme()'),
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork. La palette primaire est l’encre — le bouton plein, une case cochée, une barre remplie, tout ce qui est choisi —, donc ',
        code('primary'),
        ' recolore le tout d’un coup. Les autres jetons sont propres au préréglage : ',
        code('--su-bp-accent'),
        ', le bleu qui trace le focus et repère un titre ; ',
        code('--su-bp-mark'),
        ', les croix de repérage, que ',
        code('transparent'),
        ' fait disparaître ; ',
        code('--su-bp-field'),
        ', le trait autour d’un champ ; ',
        code('--su-bp-track'),
        ', la glissière dans laquelle court une barre de progression ; ',
        code('--su-bp-grid'),
        ' et ',
        code('--su-bp-cell'),
        ', les traits du fond et la taille de ses carreaux ; et ',
        code('--su-bp-tracking'),
        ', l’espacement entre les capitales d’un libellé. Ici le bleu passe à un orange de signalisation, et les croix avec lui.',
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
