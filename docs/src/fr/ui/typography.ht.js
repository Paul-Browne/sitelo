import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/fr.js'

export default () =>
  uiLayout({
    title: 'Typographie',
    description:
      'Une échelle typographique qui choisit son élément, pour que le plan du document suive le plan visuel.',
    activeHref: '/fr/ui/typography',
    children: [
      p(
        code('text()'),
        ' rend un morceau de texte à l’une des tailles de la bibliothèque. La variante choisit un élément sensé — ',
        code("variant: 'h2'"),
        ' rend un vrai ',
        code('<h2>'),
        ' — si bien que les titres entrent dans le plan du document sans que personne ait à y penser.',
      ),

      h2('Variantes'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Titre 1'),
  text({ variant: 'h2' }, 'Titre 2'),
  text({ variant: 'h3' }, 'Titre 3'),
  text({ variant: 'h4' }, 'Titre 4'),
  text({ variant: 'h5' }, 'Titre 5'),
  text({ variant: 'h6' }, 'Titre 6'),
  text({ variant: 'lead' }, 'Lead — un cran au-dessus du corps de texte, pour la phrase sous un titre.'),
  text({ variant: 'body' }, 'Body — la valeur par défaut.'),
  text({ variant: 'small' }, 'Small — des légendes qui restent des phrases.'),
  text({ variant: 'caption' }, 'Caption — les petits caractères.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Titres'),
      p(
        code('heading()'),
        ' prend un ',
        code('level'),
        ' de plan et se dimensionne en conséquence. ',
        code('size'),
        ' découple les deux : un ',
        code('<h1>'),
        ' qui ressemble à un h3 reste un h1 pour un lecteur d’écran.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Un titre de niveau 2, dimensionné en conséquence'),
  heading({ level: 2, size: 'h5' }, 'Un titre de niveau 2, dimensionné comme un h5'),
)`, { align: 'stretch' }),

      h2('Ton'),
      p('Trois degrés d’insistance, du contraste plein au gris lisible le plus discret.'),
      demo(`stack({ gap: 'xs' },
  text('Par défaut — la couleur dans laquelle le corps de texte est composé.'),
  text({ tone: 'muted' }, 'Atténué — texte secondaire, encore confortablement lisible.'),
  text({ tone: 'subtle' }, 'Discret — libellés et métadonnées.'),
)`, { align: 'stretch' }),

      h2('Alignement'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Début'),
  text({ align: 'center' }, 'Centre'),
  text({ align: 'end' }, 'Fin'),
)`, { align: 'stretch' }),

      h2('Troncature et limite de lignes'),
      p(
        code('truncate'),
        ' coupe une seule ligne avec des points de suspension. ',
        code('lines'),
        ' limite plutôt à un nombre de lignes, ce que veut généralement le résumé d’une carte.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Une seule ligne qui continue bien au-delà de la largeur de son conteneur et se retrouve coupée par des points de suspension plutôt que de passer à la ligne.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Limité à deux lignes. Ce paragraphe continue un moment pour que la limite ait quelque chose à couper, puis continue encore un peu, au-delà du point où la troisième ligne aurait commencé.'),
  )),
)`, { align: 'stretch' }),

      h2('Code en ligne et touches'),
      demo(`text(
  'Lancez ', code('sitelo build'), ' ou appuyez sur ', kbd('⌘'), ' ', kbd('K'), ' pour rechercher.',
)`, { align: 'stretch' }),
      p(
        'Les enfants sont rendus comme du HTML — c’est ce qui fait fonctionner l’imbrication partout dans cette bibliothèque, et ',
        code('code()'),
        ' ne fait pas exception. Un extrait contenant des balises réclame donc la prop ',
        code('text'),
        ', qui les échappe :',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Bonjour</em>' }), ' — text : affiché tel qu’écrit'),
  text(code('<em>Bonjour</em>'), ' — enfants : interprétés comme du balisage'),
)`, { align: 'stretch' }),
      p(
        'Les deux servent. ',
        code('text'),
        ' est pour un extrait de code, où une balise doit être lue et non construite. Les enfants sont pour une sortie déjà colorisée, où le balisage ',
        code('est'),
        ' le propos — un résultat de Prism ou de Shiki entre directement.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Composer'),
      p(
        'Text accepte des enfants, pas seulement une chaîne — liens, code et emphase s’y imbriquent comme ils le feraient en HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'Les pages sont des fonctions qui renvoient du ',
  code('HTML'),
  '. Voyez le guide ',
  link({ href: '/fr/docs/pages' }, 'écrire des pages'),
  '.',
)`, { align: 'stretch' }),

      h2('Changer d’élément'),
      p(
        code('as'),
        ' remplace l’élément sans changer l’apparence — pour un titre visuel qui ne doit pas apparaître dans le plan, ou un ',
        code('<span>'),
        ' au fil d’une ligne de texte.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Ressemble à un titre, c’est un div'),
  text({ variant: 'caption', as: 'p' }, 'Style de légende sur un paragraphe'),
)`, { align: 'stretch' }),

      h2('Masqué visuellement'),
      p(
        code('visuallyHidden()'),
        ' garde le contenu dans l’arbre d’accessibilité mais hors de l’écran — le libellé dont un lecteur d’écran a besoin là où les lecteurs voyants le tirent du contexte.',
      ),
      demo(`text(
  'État du build : ',
  chip({ color: 'success', dot: true }, 'réussi'),
  visuallyHidden(' — le dernier build a réussi il y a 4 minutes'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Taille, graisse et élément par défaut.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Le contraste que porte le texte.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Alignement du texte.'],
        ['truncate', 'boolean', 'false', 'Une ligne, coupée par des points de suspension.'],
        ['lines', 'number', '', 'Limiter à ce nombre de lignes.'],
        ['as', 'string', '', 'Remplace l’élément que la variante aurait choisi.'],
      ]),
      p(
        code('heading()'),
        ' prend ',
        code('level'),
        ' (1–6) et un ',
        code('size'),
        ' facultatif ; tout le reste est identique.',
      ),
    ],
  })
