import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Barre d’application',
    description:
      'La barre en haut d’un site : la marque d’un côté, la navigation et les actions de l’autre.',
    activeHref: '/fr/ui/app-bar',
    extraHead: uiHead(),
    children: [
      p(
        'Une barre d’application est un ',
        code('<header>'),
        ' contenant une ligne. Les pièces sont séparées pour que vous puissiez les arranger : ',
        code('appBarNav()'),
        ' pour les liens, ',
        code('appBarSpacer()'),
        ' pour pousser la suite à l’autre bout, et ',
        code('appBarActions()'),
        ' pour les boutons de fin.',
      ),

      h2('Barre de base'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Se connecter'),
  ),
)`, { align: 'stretch' }),

      h2('Avec navigation'),
      p(
        code('navLink()'),
        ' est le style de lien d’une barre ; ',
        code('current'),
        ' marque la page active avec ',
        code('aria-current'),
        ' en plus de la couleur.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Documentation'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Exemples'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Commencer'),
  ),
)`, { align: 'stretch' }),

      h2('Une marque avec un logo'),
      p(
        'La marque accepte n’importe quel balisage, et pointe vers ',
        code('/'),
        ' sauf si ',
        code('href'),
        ' en décide autrement.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Collante et floutée'),
      p(
        code('sticky'),
        ' épingle la barre en haut du conteneur de défilement ; ',
        code('blur'),
        ' la rend translucide pour que le contenu passe dessous. Les deux sont montrées ici dans une boîte défilante plutôt que sur la page elle-même.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Faites défiler — paragraphe ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Avec un tiroir sur petits écrans'),
      p(
        'Le schéma habituel : des liens dans la barre sur ordinateur, un bouton qui ouvre un ',
        code('drawer()'),
        ' sur téléphone. Le tiroir est un popover, donc le bouton n’a besoin d’aucun script.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Ouvrir la navigation',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Navigation' },
    navLink({ href: '#docs' }, 'Documentation'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Exemples'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('appBar()'), ' :'),
      propsTable([
        ['brand', 'Child', '', 'Contenu du lien de marque au début.'],
        ['href', 'string', "'/'", 'Vers où pointe la marque.'],
        ['sticky', 'boolean', 'false', 'Épingle la barre en haut au défilement.'],
        ['blur', 'boolean', 'false', 'Fond translucide avec flou d’arrière-plan.'],
        ['as', 'string', "'header'", 'Élément à rendre.'],
      ]),
      p('Les pièces :'),
      propsTable([
        ['appBarNav', '', '', 'Un élément nav qui porte les liens.'],
        ['appBarSpacer', '', '', 'Espace flexible ; tout ce qui suit part à l’autre bout.'],
        ['appBarActions', '', '', 'Groupe de boutons en fin de barre.'],
        ['navLink', 'href, current, color', '', 'Un lien stylé pour la barre ; current marque la page active.'],
      ], { headers: ['Pièce', 'Props', 'Défaut', 'Description'] }),
    ],
  })
