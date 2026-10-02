import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Une seule police à chasse fixe sur un fond bleu nuit, à la manière d’Advent of Code : des actions entre crochets, des liens verts et une lueur sur ce qui est allumé.',
    activeHref: '/fr/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' est une seule police à chasse fixe sur un fond bleu nuit, composée comme Advent of Code : du texte gris, des liens verts qui s’éclairent au survol, du blanc pour ce qui compte et une lueur de sa propre couleur sur les quelques éléments allumés. Une action est un mot entre crochets, ',
        code('[Enregistrer]'),
        ' ; une case à cocher est ',
        code('[ ]'),
        ' jusqu’à ce qu’elle devienne ',
        code('[X]'),
        ', et un titre de second niveau est encadré de tirets, ',
        code('--- Titre ---'),
        '. Rien n’est arrondi et rien ne flotte sur une ombre douce : un bord est une ligne, et une carte surélevée a un double trait. Le mode sombre est le rendu d’origine ; le mode clair garde la police, les crochets et les angles droits et les imprime en bleu nuit sur du papier pâle, sans la lueur.',
      ),
      presetPreview('terminal'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Composez aussi la page avec — son fond, son gris et sa police — et les composants s’y posent comme ci-dessus. Le préréglage utilise Source Code Pro si la page la charge, sinon la police à chasse fixe du système ; il ne télécharge rien.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Vos propres couleurs'),
      p(
        code('theme()'),
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork. La lueur est tracée dans la couleur du texte qui la porte, donc une palette que vous changez luit dans sa nouvelle couleur — ici le primaire passe à l’ambre, comme un terminal plus ancien. Le succès est l’or d’une étoile, comme la référence marque une énigme résolue ; donnez-lui un vert de la même façon si vous préférez. Deux jetons sont propres au préréglage : ',
        code('--su-tm-bright'),
        ', le blanc des titres et de tout ce qui est choisi, et ',
        code('--su-tm-glow'),
        ', l’ombre que porte ce qui est allumé, qui vaut ',
        code('none'),
        ' en mode clair.',
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
