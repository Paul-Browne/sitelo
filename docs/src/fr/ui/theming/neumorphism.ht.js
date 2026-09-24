import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Neumorphisme',
    description:
      'Soft UI : chaque composant en relief sur la page ou enfoncé dedans, par la seule lumière et l’ombre.',
    activeHref: '/fr/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' est de la soft UI : chaque surface est la page elle-même, et un contrôle ne se détache que par la lumière et l’ombre — en relief sur la page, ou enfoncé dedans. Il garde deux choses que ce style sacrifie d’habitude, un texte conforme à WCAG AA et le contour de focus, et il suit le mode sombre comme tout le reste. Il lui faut en revanche que le fond de la page elle-même soit ',
        code('var(--su-bg)'),
        ', car l’effet repose sur le fait que les deux soient de la même couleur.',
      ),
      presetPreview('neumorphism'),

      h2('L’utiliser'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Vos propres couleurs'),
      p(
        code('theme()'),
        ' fonctionne toujours par-dessus : un préréglage est un point de départ, pas un fork. Celui-ci ajoute un dixième emplacement à chaque palette, ',
        code('glow'),
        ' — la couleur dans laquelle une barre de progression ou un interrupteur se fond à son extrémité — pour qu’une nouvelle couleur primaire puisse apporter la sienne.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
