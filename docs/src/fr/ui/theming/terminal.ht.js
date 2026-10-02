import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Une console système : une seule police à chasse fixe sur fond noir, des panneaux au trait fin, des libellés en capitales grasses et un accent cyan, avec tout ce qui est sélectionné en vidéo inverse.',
    activeHref: '/fr/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' est une console système : une seule police à chasse fixe sur fond noir, des panneaux au trait fin dont l’en-tête est séparé par un filet, et chaque libellé — un bouton, l’intitulé d’un champ, un onglet, un en-tête de colonne — en capitales grasses et espacées. Le cyan est l’accent : titres, titres de panneau, bouton plein, focus et tout ce qui est sélectionné, imprimé en vidéo inverse, sombre sur cyan, comme un terminal surligne une ligne. Les autres palettes sont ses couleurs d’état, vert, jaune et rouge, et un bouton à contour ou une étiquette est tracé dans sa couleur, trait et texte compris. Rien n’est arrondi et rien ne projette d’ombre. Le mode sombre est le rendu d’origine ; le mode clair garde chaque trait, chaque capitale et chaque angle droit et l’imprime en noir sur un blanc cassé.',
      ),
      presetPreview('terminal'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-176ac9d8.css">`, 'javascript'),
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
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork — ici l’accent passe à un ambre de phosphore. Deux jetons sont propres au préréglage : ',
        code('--su-tm-tracking'),
        ', l’espacement d’un libellé en capitales, et ',
        code('--su-tm-track'),
        ', la glissière dans laquelle court une barre de progression ou un curseur.',
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
