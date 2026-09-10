import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Groupe de bascules',
    description:
      'Un contrôle segmenté : des boutons bascules réunis en un seul, ou des liens où chaque segment est sa propre page.',
    activeHref: '/fr/ui/toggle-group',
    children: [
      p(
        'Un groupe de bascules est une rangée de choix qui se lit comme un contrôle unique. Construisez-le à partir d’',
        code('items'),
        ', et dites lequel est actif avec ',
        code('value'),
        '.',
      ),

      h2('Groupe de base'),
      demo(`toggleGroup({
  label: 'Alignement du texte',
  value: 'center',
  items: [
    { value: 'left', label: 'Gauche' },
    { value: 'center', label: 'Centre' },
    { value: 'right', label: 'Droite' },
  ],
})`),

      h2('Chaînes simples'),
      demo(`toggleGroup({ label: 'Densité', value: 'confortable', items: ['compacte', 'confortable', 'aérée'] })`),

      h2('Liens'),
      p(
        'C’est la forme qu’un site statique veut généralement : chaque segment est une page. Les éléments dotés d’un ',
        code('href'),
        ' sont rendus en ancres et l’actif est marqué ',
        code('aria-current="page"'),
        ' — pas ',
        code('aria-pressed'),
        ', puisqu’un lien n’est pas un bouton qu’on a enfoncé.',
      ),
      demo(`toggleGroup({
  label: 'Section',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Documentation', href: '/fr/docs' },
    { value: 'ui', label: 'UI', href: '/fr/ui' },
    { value: 'examples', label: 'Exemples', href: '/fr/examples' },
  ],
})`),

      h2('Plusieurs actifs'),
      p(
        'Passez un tableau en ',
        code('value'),
        '. Le conteneur reste un simple ',
        code('group'),
        ' dans les deux cas — un ',
        code('radiogroup'),
        ' serait faux, puisqu’il s’agit de boutons enfoncés et non de radios.',
      ),
      demo(`toggleGroup({
  label: 'Mise en forme',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Gras' },
    { value: 'italic', label: 'Italique' },
    { value: 'underline', label: 'Souligné' },
  ],
})`),

      h2('Tailles et variantes'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Petit', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Moyen', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Grand', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Éléments désactivés'),
      demo(`toggleGroup({
  label: 'Rendu',
  value: 'static',
  items: [
    { value: 'static', label: 'Statique' },
    { value: 'islands', label: 'Îlots' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('Dans une barre d’outils'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Alignement', value: 'Gauche', size: 'sm', items: ['Gauche', 'Centre', 'Droite'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Style', value: ['Gras'], size: 'sm', items: ['Gras', 'Italique'] }),
)`),

      h2('Quand prendre autre chose'),
      p(
        'Si le choix est soumis avec un formulaire, prenez ',
        code('choiceGroup()'),
        ' — de vrais radios, aucun script requis. Si chaque segment est une page, préférez la forme en liens ci-dessus. Un groupe de bascules sert à un choix sur lequel la page elle-même agit.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Des chaînes, ou des objets { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'L’élément actif. Un tableau quand plusieurs peuvent l’être.'],
        ['label', 'string', '', 'Nom accessible du groupe.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Appliqué à chaque élément.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'L’allure d’un élément inactif.'],
      ]),
    ],
  })
