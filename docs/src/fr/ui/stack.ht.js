import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Pile',
    description:
      'Une rangée ou une colonne flex avec un jeton d’espacement pour l’écart — la brique de mise en page dont sont faites la plupart des pages.',
    activeHref: '/fr/ui/stack',
    children: [
      p(
        'Stack met de l’espace entre les choses. C’est un conteneur flex avec une seule mission, et la réponse à la plupart des questions « comment j’espace ça » — verticalement par défaut, horizontalement avec ',
        code("direction: 'row'"),
        '.',
      ),
      p(
        'Les écarts viennent de l’échelle d’espacement : le rythme d’une page reste donc cohérent sans que personne ne choisisse de valeurs en pixels.',
      ),

      h2('Pile de base'),
      demo(`stack({ gap: 'md' },
  card(cardBody('Première')),
  card(cardBody('Deuxième')),
  card(cardBody('Troisième')),
)`, { align: 'stretch' }),

      h2('Direction'),
      demo(`stack({ direction: 'row', gap: 'md' },
  button('Un'),
  button({ variant: 'outline' }, 'Deux'),
  button({ variant: 'outline' }, 'Trois'),
)`),

      h2('Écart'),
      p(
        'Un nom de jeton (',
        code("'xs'"),
        ' … ',
        code("'3xl'"),
        '), un nombre d’unités d’espacement, ou une longueur CSS brute.',
      ),
      demo(`stack({ gap: 'lg' },
  stack({ direction: 'row', gap: 'xs' }, chip('xs'), chip('xs'), chip('xs')),
  stack({ direction: 'row', gap: 'md' }, chip('md'), chip('md'), chip('md')),
  stack({ direction: 'row', gap: 6 }, chip('6 unités'), chip('6 unités')),
  stack({ direction: 'row', gap: '3rem' }, chip('3rem'), chip('3rem')),
)`, { align: 'stretch' }),

      h2('Alignement'),
      p(
        code('align'),
        ' et ',
        code('justify'),
        ' prennent des valeurs flexbox brutes : tout ce que CSS comprend fonctionne.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', justify: 'space-between', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    chip('début'),
    chip('fin'),
  ),
  stack({ direction: 'row', gap: 'sm', justify: 'center', align: 'center', style: 'background: var(--su-surface-2); padding: 0.6rem; border-radius: 0.5rem' },
    button({ size: 'sm' }, 'Centré'),
    chip('et aligné'),
  ),
)`, { align: 'stretch' }),

      h2('Retour à la ligne'),
      p(
        'Une rangée de puces ou de boutons qui risque de ne pas tenir a besoin de ',
        code('wrap'),
        ' — sans lui, ils s’écrasent au lieu de passer à la ligne suivante.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  ...['routing', 'data', 'islands', 'images', 'pagefind', 'lighthouse', 'sitemap', 'rss'].map(
    (name) => chip({ color: 'neutral' }, name),
  ),
)`, { align: 'stretch' }),

      h2('En ligne'),
      p(
        code('inline'),
        ' fait de la pile un ',
        code('inline-flex'),
        ' : elle se pose dans une ligne de texte au lieu de prendre toute la largeur.',
      ),
      demo(`text(
  'Fait avec ',
  stack({ direction: 'row', gap: 'xs', inline: true, align: 'center' },
    chip({ color: 'primary', size: 'sm' }, 'sitelo'),
    chip({ color: 'neutral', size: 'sm' }, 'vite'),
  ),
  ' et rien d’autre.',
)`, { align: 'stretch' }),

      h2('Comme un autre élément'),
      demo(`stack({ as: 'nav', direction: 'row', gap: 'sm' },
  navLink({ href: '/fr/docs' }, 'Documentation'),
  navLink({ href: '/fr/ui', current: true }, 'UI'),
  navLink({ href: '/fr/examples' }, 'Exemples'),
)`),

      h2('Props'),
      propsTable([
        ['direction', "'row' | 'column'", "'column'", 'Axe principal.'],
        ['gap', 'Space', "'md'", 'Espace entre les enfants.'],
        ['align', 'string', "'stretch'", 'N’importe quelle valeur align-items.'],
        ['justify', 'string', "'flex-start'", 'N’importe quelle valeur justify-content.'],
        ['wrap', 'boolean | string', 'false', 'true pour passer à la ligne ; une chaîne est transmise comme flex-wrap.'],
        ['inline', 'boolean', 'false', 'Rendue en inline-flex.'],
        ['as', 'string', "'div'", 'Élément à rendre, par exemple nav ou ul.'],
      ]),
    ],
  })
