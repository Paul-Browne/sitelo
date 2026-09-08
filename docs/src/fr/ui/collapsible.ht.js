import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Repliable',
    description:
      'Un seul « voir plus », sans les bordures ni le regroupement d’un accordéon.',
    activeHref: '/fr/ui/collapsible',
    extraHead: uiHead(),
    children: [
      p(
        'Un repliable est un unique ',
        code('<details>'),
        ' — l’élément dont un accordéon est fait, sans aucun de ses ornements. Prenez-le pour un détail facultatif au milieu d’une page ; prenez ',
        code('accordion()'),
        ' quand il y en a toute une série.',
      ),
      p(
        'Il ne demande aucun script, et comme le contenu reste dans le document, il se trouve avec la recherche dans la page du navigateur comme avec un moteur de recherche.',
      ),

      h2('Repliable de base'),
      demo(`collapsible({ trigger: 'Voir la config générée' },
  text({ variant: 'small' }, 'Tout ce que sitelo écrit quand vous lancez le build sans fichier de config à vous.'),
)`, { align: 'stretch' }),

      h2('Ouvert par défaut'),
      demo(`collapsible({ trigger: 'Pourquoi ça existe', open: true },
  text({ variant: 'small' }, 'Parce qu’une page qui cache son explication derrière un clic est une page que personne ne lit.'),
)`, { align: 'stretch' }),

      h2('Contenu riche'),
      demo(`collapsible({ trigger: 'Voir la sortie complète' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('À l’intérieur d’autres choses'),
      p('Un repliable se loge sans peine dans une carte, une alerte ou une cellule de tableau.'),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Build échoué', subtitle: '2 liens cassés' }),
    cardBody(
      collapsible({ trigger: 'Voir les liens fautifs' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'lié depuis /docs' }),
          listItem({ title: '/blog/draft', description: 'lié depuis /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Page lente' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Une page a mis plus de 500 ms à se rendre.'),
      collapsible({ trigger: 'Voir les temps' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Le déclencheur'),
      p(
        'Tenez-vous-en au texte et aux icônes. Un ',
        code('<summary>'),
        ' est déjà interactif : un bouton ou un lien à l’intérieur imbrique deux contrôles là où il n’y a qu’une action — la même règle que suit ',
        code('menu()'),
        '.',
      ),

      h2('Repliable ou accordéon ?'),
      p(
        'Une seule révélation isolée : ',
        code('collapsible()'),
        '. Toute une série, encadrée et regroupée, éventuellement avec une seule ouverte à la fois : ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'Le contenu du résumé. Texte et icônes uniquement.'],
        ['open', 'boolean', 'false', 'S’il démarre déplié.'],
      ]),
    ],
  })
