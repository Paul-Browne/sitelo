import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Une console système : une seule police à chasse fixe sur fond noir, des panneaux au trait fin, des libellés en capitales grasses et un accent cyan, avec la sélection en vidéo inverse.',
    activeHref: '/fr/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' est une console système : une seule police à chasse fixe sur fond noir, des panneaux au trait fin dont l’en-tête est séparé par un filet, et chaque libellé — un bouton, l’intitulé d’un champ, un onglet, un en-tête de colonne — en capitales, le plus souvent grasses. Le cyan est l’accent : les grands titres, les titres de panneau, le bouton plein et le focus. Une sélection — une ligne de tableau survolée, un segment enfoncé, un onglet en pastille choisi, le numéro de la page courante, l’élément de menu sous le pointeur — est imprimée en vidéo inverse, sombre sur cyan, comme un terminal surligne une ligne. Les palettes de succès, d’avertissement et de danger sont ses couleurs d’état, vert, jaune et rouge, et un bouton à contour ou une étiquette est tracé dans sa couleur, trait et texte compris. Rien n’est arrondi sauf un bouton radio, et rien ne projette d’ombre. Le mode sombre est le rendu d’origine ; le mode clair garde chaque trait, chaque capitale et chaque angle droit et l’imprime en noir sur un blanc cassé.',
      ),
      presetPreview('terminal'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        'Composez aussi la page avec — son fond, sa couleur de texte et sa police — et les composants s’y posent comme ci-dessus. Le préréglage utilise JetBrains Mono, IBM Plex Mono ou Source Code Pro si la page en charge une, sinon la police à chasse fixe du système ; il ne télécharge rien.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Vos propres couleurs'),
      p(
        code('theme()'),
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork — ici l’accent passe à un ambre de phosphore, traits compris. Trois jetons sont propres au préréglage : ',
        code('--su-tm-tracking'),
        ', l’espacement entre les capitales d’un libellé ; ',
        code('--su-tm-track'),
        ', la glissière dans laquelle court une barre de progression ou un curseur ; et ',
        code('--su-tm-field'),
        ', le trait autour d’un champ, qui en mode sombre est le gris discret des panneaux — relevez-le pour des bords de champ plus marqués.',
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
