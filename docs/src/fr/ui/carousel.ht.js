import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Carrousel',
    description:
      'Des diapositives que l’on fait défiler et qui s’ancrent au passage — avec des puces et des flèches que la feuille de style demande au navigateur.',
    activeHref: '/fr/ui/carousel',
    children: [
      p(
        'Un carrousel, ici, c’est un conteneur de défilement et une rangée de diapositives qui s’ancrent. Cela, tous les navigateurs savent déjà le faire : le balayage, le pavé tactile, maj-molette et les touches fléchées fonctionnent dès le premier rendu, sans rien charger et sans rien hydrater.',
      ),
      p(
        'Là où le navigateur en est capable, les puces et les flèches ne sont pas du balisage du tout. Ce sont ',
        code('::scroll-marker'),
        ' sur chaque diapositive et ',
        code('::scroll-button()'),
        ' sur la piste — des pseudo-éléments que la feuille de style réclame et que le navigateur dessine, nomme, relie à la position de défilement, désigne comme courant et désactive aux extrémités. Ce composant ne porte aucun attribut ',
        code('data-'),
        ' ni module à importer : l’état, c’est le décalage de défilement, et le navigateur l’a déjà.',
      ),
      p(
        'Là où il ne l’est pas, une rangée de puces bien réelles prend le relais : un lien par diapositive, qui fonctionne déjà seul et qui, au premier défilement ou au premier toucher, va chercher quelques centaines d’octets de script pour se comporter comme les puces natives — suivre le défilement, et déplacer la piste sans emporter la page.',
      ),

      h2('Une à la fois'),
      p(
        'Le comportement par défaut. Chaque diapositive remplit la piste, s’ancre au début et y reste, au lieu de filer trois diapositives plus loin.',
      ),
      demo(`carousel({
  items: ['Côte', 'Port', 'Champs', 'Vieille ville'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Plusieurs à la fois'),
      p(
        code('perView'),
        ' dit combien de diapositives remplissent la piste, et ',
        code('min'),
        ' pose un plancher sur la largeur d’une diapositive. Ce plancher remplace une media query : dès que la part de piste qui revient à une diapositive passe dessous, les diapositives gardent cette largeur et il en tient moins — le tour que joue déjà ',
        code('grid()'),
        ' avec auto-fit.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Routage', 'Données', 'Assets', 'Images', 'Islands', 'Recherche'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Guide'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Un aperçu de la suivante'),
      p(
        'Un ',
        code('perView'),
        ' fractionnaire laisse dépasser un liseré de la diapositive suivante : la façon la moins coûteuse de dire « ça défile », sans le moindre bouton.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Une', 'Deux', 'Trois'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Adaptatif sans point de rupture à vous'),
      p(
        code('perView'),
        ' s’écrit comme une propriété personnalisée : une media query peut donc la changer sans toucher au balisage — et sans que le composant ait à connaître vos points de rupture :',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('L’ancrage'),
      p(
        'L’ancrage est ',
        code('mandatory'),
        ' par défaut : un défilement s’arrête toujours sur une diapositive. ',
        code("snap: 'proximity'"),
        ' ne l’attire que s’il finit près de l’une d’elles, et ',
        code('snap: false'),
        ' laisse la piste défiler librement — ce que veut une rangée de petites choses, où s’arrêter entre deux ne gêne personne.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Où vont les puces et les flèches'),
      p(
        'Les deux sont facultatives et activées par défaut. Retirer les puces ramène la barre de défilement de la piste : un carrousel sans l’un ni l’autre serait un conteneur qui défile sans que rien ne le dise.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Puces seules', 'Deuxième', 'Troisième'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Flèches seules', 'Deuxième', 'Troisième'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Quand le navigateur n’a pas de marqueurs de défilement'),
      p(
        'Alors les puces sont de vrais liens, un par diapositive, chacun pointant vers l’id de la sienne — c’est pourquoi chaque diapositive en reçoit un. Cela fonctionne déjà sans rien charger : toucher une puce fait défiler la piste jusqu’à sa diapositive, parce que suivre un fragment, un navigateur sait le faire tout seul.',
      ),
      p(
        'Au premier défilement ou au premier toucher, la piste et les puces vont chercher ',
        code('/su/carousel.js'),
        ' depuis leurs propres attributs d’événement — comme chaque composant ici va chercher son module. Sur une page que personne ne touche, rien n’est téléchargé ; là où les marqueurs natifs existent déjà, rien du tout. À partir de là, cela va dans les deux sens : les puces suivent le défilement, quoi qu’il l’ait provoqué — un balayage, le pavé tactile, les touches fléchées, une barre tirée — et toucher une puce fait défiler la piste en laissant la page où elle était.',
      ),
      p(
        'C’est pour cette dernière chose que le script existe vraiment. Un fragment nu déplace la fenêtre vers la diapositive en plus de la piste, et un carrousel qui retire la page sous le doigt qui le touche n’est pas ce qu’on entendait par une puce. Le clic est annulé dans l’attribut et non à l’intérieur de l’import, car un import dynamique arrive un instant plus tard et le navigateur a déjà suivi le lien. ',
        code('scrollMargin'),
        ' est l’endroit où la fenêtre atterrit dans le seul cas restant : JavaScript coupé, où le lien n’est qu’un lien.',
      ),
      p(
        'Les ids qu’elles visent viennent de ',
        code('name'),
        ', de l’',
        code('id'),
        ' du carrousel lui-même, ou — à défaut des deux — d’une empreinte des diapositives, pour que deux carrousels sur une page n’entrent pas en collision sans que l’un sache l’autre. Donnez à un élément son propre ',
        code('id'),
        ' quand une diapositive précise mérite d’être liée depuis ailleurs.',
      ),

      h2('Nommer les diapositives'),
      p(
        'Chaque puce porte le nom de sa diapositive, parce qu’une puce est une commande et qu’une commande sans nom est un bouton qu’un lecteur d’écran ne peut appeler que « bouton ». Par défaut, le nom est le numéro de la diapositive. Passez un élément sous forme d’objet pour le nommer mieux, ou ',
        code('slideLabel'),
        ' pour les compter dans vos propres mots.',
      ),
      demo(`carousel({
  label: 'Photos du produit',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'La cuisine', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Cuisine'))) },
    { label: 'La terrasse', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Terrasse'))) },
    { label: 'Le jardin', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Jardin'))) },
  ],
})`, { align: 'stretch' }),

      h2('Le piloter vous-même'),
      p(
        'Deux fonctions pour les cas où c’est la page qui déplace le carrousel — un bouton « voir les photos », une étape d’un formulaire, un lien ailleurs sur la page :',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // défile jusqu’à la troisième et marque sa puce
getSlide('gallery')     // 2`, 'javascript'),
      p('Ou depuis un attribut d’événement, sans rien empaqueter dans la page :'),
      codeBlock('N’importe où', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Revenir au début')`, 'javascript'),

      h2('Ce que cela ne fait pas'),
      p(
        'Il ne reboucle pas sur la première diapositive et il n’avance pas tout seul. Ni l’un ni l’autre n’est à la portée de CSS, donc ni l’un ni l’autre n’est là — un carrousel en boucle ou en lecture automatique demande un script, et ce composant préfère ne pas être la raison pour laquelle une page en charge un. L’avance automatique est de toute façon une perte heureuse : elle déplace ce que quelqu’un est en train de lire.',
      ),
      p(
        'JavaScript coupé, il ne peut pas non plus désigner la diapositive affichée une fois la piste balayée, ni en atteindre une sans déplacer la page. La première puce est marquée à la compilation, puisque au repos c’est bien la diapositive affichée ; la garder juste ensuite est la seule chose que seul le script sache faire. Le balayage, le pavé tactile et les touches fonctionnent dans les deux cas.',
      ),

      h2('Accessibilité'),
      p(
        'La piste est un groupe nommé avec ',
        code('tabindex="0"'),
        ', pour qu’un clavier atteigne la région défilante et la parcoure aux touches fléchées dans tous les moteurs, pas seulement dans ceux qui donnent le focus aux conteneurs d’eux-mêmes. Nommez-la avec ',
        code('label'),
        ' quand une page en compte plusieurs.',
      ),
      p(
        'Là où le navigateur les dessine, les puces sont exposées comme une liste d’onglets et les flèches comme des boutons qui se désactivent seuls à chaque extrémité — tout cela, c’est le navigateur qui le construit, donc rien ne peut se désynchroniser de la diapositive réellement affichée. C’est l’argument de cette forme face à une version scriptée : il n’y a pas de seconde copie de l’état à se tromper.',
      ),
      p(
        'Les puces de repli sont des liens, chacun nommé d’après sa diapositive et chacun une cible de 24px plutôt que les 8px que la puce semble mesurer. La diapositive affichée porte ',
        code('aria-current'),
        ', qui est à la fois ce qu’un lecteur d’écran annonce et ce que la feuille de style colore : un seul état à garder juste au lieu de deux qui pourraient se contredire. Il est rendu sur la première puce, puisque au repos c’est la diapositive affichée, et il suit ensuite le défilement. Là où les marqueurs natifs les remplacent, les liens sont en ',
        code('display: none'),
        ' : ils quittent donc l’arbre d’accessibilité avec l’image, au lieu d’être annoncés deux fois.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Les diapositives. Un enfant, ou { label, content } avec tout autre attribut pour la diapositive. Les enfants sont aussi des diapositives et suivent les items.'],
        ['perView', 'number', '1', 'Combien de diapositives remplissent la piste. Fractionnaire laisse voir la suivante.'],
        ['min', 'string', '', 'Plancher sur la largeur d’une diapositive, pour qu’un écran étroit en montre moins plutôt que de plus fines.'],
        ['gap', 'Space', "'md'", 'Entre les diapositives.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Où une diapositive vient se poser.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Avec quelle fermeté le défilement se pose sur une diapositive.'],
        ['dots', 'boolean', 'true', 'Puces sous la piste — marqueurs natifs là où le navigateur les a, sinon un lien par diapositive qu’un petit module vient améliorer. Les couper ramène la barre de défilement et ne demande aucun script.'],
        ['arrows', 'boolean', 'true', 'Flèches par-dessus la piste.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Couleur de la puce de la diapositive affichée.'],
        ['label', 'string', "'Carousel'", 'Nom accessible de la région défilante.'],
        ['previousLabel', 'string', "'Previous slide'", 'Nom accessible de la flèche arrière.'],
        ['nextLabel', 'string', "'Next slide'", 'Nom accessible de la flèche avant.'],
        ['slideLabel', '(index, count) => string', 'le numéro', 'Nomme une diapositive qui ne s’est pas nommée.'],
        ['name', 'string', 'l’id du carrousel, sinon une empreinte', 'Préfixe des ids de diapositive visés par les puces de repli.'],
        ['scrollMargin', 'Space', "'lg'", 'À quelle hauteur au-dessus d’une diapositive la fenêtre s’arrête quand une puce de repli y mène.'],
        ['as', 'string', "'div'", 'Élément à rendre.'],
      ]),
    ],
  })
