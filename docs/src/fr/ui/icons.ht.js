import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'

/** Une cellule : le glyphe à une taille lisible, avec le nom à taper. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Par ordre alphabétique, directement depuis la bibliothèque, pour que la
 * page ne puisse pas prendre du retard sur le jeu qu’elle documente. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Les glyphes remplis en peignant leur propre tracé, par opposition à ceux
 * qui portent un second dessin — distingués selon que les deux formes sont
 * le même balisage, si bien qu’aucune démo ne peut prendre du retard.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * La démo du remplissage, écrite plutôt que listée à la main — la source est
 * ce que la page imprime, donc un glyphe devenu remplissable apparaît ici
 * sans que personne pense à l’ajouter.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Icônes',
    description:
      'Un jeu de 99 glyphes sur une même grille, rendus en ligne pour qu’une icône prenne la couleur et la taille du texte qui l’entoure.',
    activeHref: '/fr/ui/icons',
    children: [
      p(
        code('icon()'),
        ' renvoie un ',
        code('<svg>'),
        ' en ligne. Chaque glyphe est dessiné sur la même grille 24×24, en traits non remplis en ',
        code('currentColor'),
        ' : il hérite donc de la couleur et de la taille de texte de son contexte et n’a besoin d’aucun style propre.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('Dans un composant'),
      p(
        'Une icône est un enfant comme un autre. Comme elle se dimensionne en ',
        code('em'),
        ', elle s’accorde au libellé voisin sans qu’on lui dise quelle taille il fait :',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Télécharger'),
  button({ variant: 'outline' }, icon('external-link'), 'Ouvrir'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Supprimer'),
  iconButton({ label: 'Rechercher', variant: 'soft', icon: icon('search') }),
)`),

      h2('Taille'),
      p(
        'Le défaut est ',
        code('1em'),
        ' — la taille du texte environnant. ',
        code('size'),
        ' prend un jeton ou n’importe quelle longueur CSS quand vous voulez vous en écarter :',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Couleur'),
      p(
        'Il n’y a pas de prop de couleur. Une icône est dessinée en ',
        code('currentColor'),
        ' : elle prend la couleur de son contexte — c’est ce qui permet à un seul jeu de fonctionner dans cinq palettes :',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Noms accessibles'),
      p(
        'Une icône est ',
        code('aria-hidden'),
        ' par défaut, ce qui est juste bien plus souvent qu’autrement : une icône à côté du mot « Supprimer » ne doit pas être annoncée une deuxième fois. Ne lui donnez un ',
        code('label'),
        ' que lorsqu’elle porte tout le sens ; elle devient alors ',
        code('role="img"'),
        ' avec ce nom.',
      ),
      codeBlock('', `icon('trash')                         // décorative — masquée
button(icon('trash'), 'Supprimer')    // c’est le mot qui parle

icon('trash', { label: 'Supprimer' }) // annoncée comme une image

// Un bouton-icône nomme le bouton, pas le glyphe qu’il contient
iconButton({ label: 'Supprimer', icon: icon('trash') })`, 'javascript'),

      h2('Rempli'),
      p(
        code('filled'),
        ' peint un glyphe au lieu de le tracer en contour. C’est le même tracé dans les deux cas — seul l’attribut ',
        code('fill'),
        ' change —, si bien que les deux formes partagent exactement le même bord extérieur et ne peuvent pas diverger.',
      ),
      demo(fillDemo()),
      p('Et les mêmes noms, remplis :'),
      demo(fillDemo({ filled: true })),
      p(
        'C’est une prop plutôt qu’un second jeu de noms parce que l’état rempli est presque toujours un ',
        code('état'),
        ' — enregistré, aimé, noté — et réclame donc un booléen, pas une chaîne différente :',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Enregistré' : 'Enregistrer' })

// plutôt que
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Les glyphes de statut se remplissent autrement, parce que leur marque se trouve ',
        code('à l’intérieur'),
        ' de la forme. Peindre le cercle avalerait la coche : la marque y est donc découpée à la place :',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Ceux-là portent un second dessin — la forme pleine avec la marque découpée par ',
        code('fill-rule: evenodd'),
        ' — parce qu’un tel évidement ne s’obtient pas du tracé de contour en changeant un attribut. La forme extérieure est dessinée au bord extérieur du contour, donc les deux versions se terminent sur la même silhouette. C’est la même prop dans les deux cas ; le mécanisme qu’un glyphe emploie ne regarde que lui.',
      ),
      p(
        'Un chevron n’a aucun intérieur à peindre — c’est une ligne ouverte — donc il se remplit jusqu’au triangle que décrivent ses trois points, en gardant le trait qui arrondit les angles :',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' liste tout ce qui répond à ',
        code('filled'),
        '. Un glyphe sans forme pleine l’ignore et reste en contour — remplir ',
        code('eye'),
        ' perdrait la pupille et ',
        code('tag'),
        ' son trou, donc ni l’un ni l’autre ne fait semblant.',
      ),

      h2('Rotation'),
      p(
        code('spin'),
        ' fait tourner le glyphe — prévu pour ',
        code('spinner'),
        ', même si rien ne vous empêche de faire tourner ',
        code('refresh'),
        ' pendant qu’une chose se recharge. Sous ',
        code('prefers-reduced-motion'),
        ' il ralentit à peine plus qu’un souffle au lieu de s’arrêter, parce qu’un spinner arrêté a l’air cassé.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Enregistrement…'),
)`),

      h2('Le jeu'),
      p(
        'Les noms décrivent le dessin plutôt que le rôle qu’il joue — ',
        code('x-circle'),
        ', pas ',
        code('error'),
        ' — parce que le même dessin sert à des rôles sans rapport, et qu’un nom décrivant l’image reste vrai quand cela arrive. Les alias ci-dessous couvrent les intentions courantes.',
      ),
      gallery(),

      h2('Marques'),
      p(
        'Huit logos de marque viennent avec le jeu — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' et ',
        code('youtube'),
        '. Ils acceptent toujours ',
        code('size'),
        ' et ',
        code('label'),
        ' et se dessinent toujours en ',
        code('currentColor'),
        ' :',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Partager'),
)`),
      p(
        'Ce sont des reproductions de marques appartenant à d’autres, pas des dessins au style de cette bibliothèque : ils enfreignent donc deux de ses règles à dessein — ce sont des formes pleines plutôt que des traits, ce qu’est un logo, et leurs proportions sont celles de la marque, pas celles de cette grille. ',
        code('filled'),
        ' ne leur dit rien — ils le sont déjà.',
      ),
      p(
        'Le dessin vient de Simple Icons, qui le publie sous CC0. Cela couvre le dessin, pas la marque déposée : servez-vous-en pour désigner la chose qu’ils nomment — un lien de profil, un bouton de partage — et pas sur un produit à vous.',
      ),
      p(
        'C’est ',
        code('x-twitter'),
        ', pas ',
        code('x'),
        ', parce que ',
        code('x'),
        ' est déjà un alias de ',
        code('close'),
        ' et qu’un bouton de fermeture se transformant en logo serait une vilaine surprise. ',
        code('twitter'),
        ' y mène aussi.',
      ),

      h2('Alias'),
      p('Chacun de ceux-ci rend un glyphe listé plus haut, sous le nom auquel vous penserez sans doute en premier :'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Vos propres icônes'),
      p(
        code('registerIcons()'),
        ' ajoute un glyphe, ou en remplace un fourni. Le balisage est le contenu du ',
        code('<svg>'),
        ' — des formes sur la même grille 24×24, laissées sans remplissage pour que ',
        code('currentColor'),
        ' les atteigne. Appelez-le une fois depuis un module que vos pages importent :',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Un nom qui existe déjà le remplace partout : c’est ainsi qu’on restyle
  // un glyphe fourni sans forker la bibliothèque.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Une seule forme fermée, pour qu’il réponde à \`filled\` comme les glyphes fournis.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                   // votre glyphe
icon('check')                  // désormais le vôtre aussi

registerIcons({ check: null }) // et retour à celui fourni`, 'javascript'),

      h2('Pourquoi en ligne, et pas un sprite'),
      p(
        'Les icônes sont rendues dans la page plutôt que tirées d’un ',
        code('icons.svg'),
        ' avec ',
        code('<use>'),
        '. Un sprite économise de l’ordre de cent octets gzippés de HTML par page et coûte un aller-retour pour cela — le balisage répété est justement le cas où gzip excelle, donc l’essentiel de ce qu’un sprite existe pour dédupliquer l’est déjà. En ligne, il n’y a aussi aucun fichier à émettre, aucun chemin de base à configurer, et rien qui puisse manquer dans ',
        code('dist'),
        ' — le même marché que fait ',
        code('styles({ inline: true })'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Quel glyphe. Peut être passé comme premier argument à la place.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Un jeton, ou n’importe quelle longueur CSS. Par défaut 1em.'],
        ['label', 'string', '', 'L’annoncer comme une image portant ce nom, au lieu de la masquer.'],
        ['spin', 'boolean', 'false', 'La faire tourner en continu.'],
        ['filled', 'boolean', 'false', 'Peindre le glyphe au lieu de le tracer. Ignoré par les glyphes non remplissables.'],
      ]),
      p(
        'Un nom inconnu ne rend rien du tout plutôt que de lever une erreur — une prop cosmétique ne devrait pas pouvoir faire échouer un build. ',
        code('hasIcon(name)'),
        ' vous dit si un glyphe existe, ',
        code('iconNames()'),
        ' les liste tous, et ',
        code('fillableIcons()'),
        ' donne ceux qui acceptent ',
        code('filled'),
        '.',
      ),
    ],
  })
