import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Thématisation',
    description:
      'Mettre la feuille de style sur la page, et changer chaque couleur, rayon et police depuis un seul appel.',
    activeHref: '/fr/ui/theming',
    extraHead: uiHead(),
    children: [
      p(
        'Tous les composants lisent les mêmes propriétés personnalisées : un thème n’est donc qu’un jeu de surcharges sur ',
        code(':root'),
        ' — pas d’étape de build, pas de fichier de configuration, et aucun composant à mettre au courant.',
      ),

      h2('Mettre les styles en place'),
      p(
        code('styles()'),
        ' renvoie un élément ',
        code('<style>'),
        ' contenant toute la feuille, minifiée — environ 7 ko gzippés. C’est le défaut parce qu’elle ne peut pas manquer dans ',
        code('dist/'),
        ' et ne coûte aucune requête supplémentaire.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Mon site'),
  styles(),
)`, 'javascript'),
      p(
        'Si vous préférez la lier une fois et laisser le navigateur la mettre en cache d’une page à l’autre, importez le CSS depuis un fichier d’entrée empaqueté et Vite l’émettra :',
      ),
      codeBlock('src/main.js', `import 'sitelo/ui/styles.css'`, 'javascript'),
      p(
        'Prenez l’un ou l’autre, pas les deux. ',
        code('stylesheet()'),
        ' renvoie le CSS brut sous forme de chaîne, pour l’écrire vous-même quelque part.',
      ),

      h2('Surcharger des jetons'),
      p(
        code('theme()'),
        ' écrit les surcharges. Les clés sont des noms de jetons en camelCase, des objets de palette, ou des propriétés personnalisées littérales — et cela vient ',
        code('après'),
        ' ',
        code('styles()'),
        ', donc cela l’emporte.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Thèmes délimités'),
      p(
        'Un ',
        code('selector'),
        ' limite les surcharges à un sous-arbre plutôt qu’à toute la page. C’est ce que font les trois panneaux ci-dessous — mêmes composants, trois palettes différentes, une seule page.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'indigo'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'rose'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'arrondi'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Mode sombre'),
      p(
        'Le sombre se résout tout seul depuis ',
        code('prefers-color-scheme'),
        '. Un ',
        code('data-theme'),
        ' ou ',
        code('data-su-theme'),
        ' explicite valant ',
        code('light'),
        ' ou ',
        code('dark'),
        ' sur n’importe quel ancêtre l’emporte — c’est ainsi que les démos de ce site suivent la bascule de la barre du haut.',
      ),
      p(
        'Passez ',
        code('dark'),
        ' pour des surcharges qui ne doivent s’appliquer que là. Cela couvre l’attribut et la media query d’un coup.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Ce qu’il y a à surcharger'),
      p(
        'Cinq palettes de neuf emplacements chacune, une échelle d’espacement, la typographie, les rayons, les ombres et les couleurs de surface. Chacun est une propriété personnalisée — ouvrez la feuille de style, ou l’inspecteur de votre navigateur, elles sont toutes sur ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Nommage'),
      p(
        'Une clé en camelCase devient une propriété en kebab-case : ',
        code('radiusMd'),
        ' donne ',
        code('--su-radius-md'),
        ', ',
        code('fontSans'),
        ' donne ',
        code('--su-font-sans'),
        '. Un objet imbriqué se développe de la même façon — ',
        code('{ primary: { softFg: … } }'),
        ' pose ',
        code('--su-primary-soft-fg'),
        ' — et une clé commençant déjà par ',
        code('--'),
        ' est utilisée telle quelle, ce qui est la porte de sortie pour tout ce que la correspondance ne couvre pas.',
      ),
      p(
        'Une palette a neuf emplacements : ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' et ',
        code('ring'),
        '. Ne définissez que ceux que vous changez.',
      ),

      h2('Contraste'),
      p(
        'Les palettes livrées passent le AA des WCAG face aux surfaces sur lesquelles elles se posent, dans les deux thèmes, et un test du dépôt fait échouer le build si cela cesse d’être vrai. Un thème à vous n’est pas couvert par ce test — vérifiez votre ',
        code('fg'),
        ' face à votre ',
        code('base'),
        ' avant de le publier.',
      ),

      h2('Props'),
      p(code('styles()'), ' et ', code('stylesheet()'), ' :'),
      propsTable([
        ['minify', 'boolean', 'true', 'Retire commentaires et espaces.'],
        ['nonce', 'string', '', 'Nonce CSP pour l’élément style émis. styles() uniquement.'],
      ]),
      p(code('theme(tokens, options)'), ' :'),
      propsTable([
        ['selector', 'string', "':root'", 'Limite les surcharges à un sous-arbre.'],
        ['dark', 'object', '', 'Surcharges appliquées uniquement en mode sombre.'],
        ['nonce', 'string', '', 'Nonce CSP.'],
      ]),
    ],
  })
