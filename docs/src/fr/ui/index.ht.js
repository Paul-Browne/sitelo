import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/fr.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * Une carte par page de composant, groupées exactement comme la référence
 * des composants. Chaque `demo` est rendue en direct dans sa carte.
 */
const GROUPS = [
  ['Mise en page', [
    ['/fr/ui/container', 'Conteneur', 'Une colonne de page centrée et de largeur limitée.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'centré'))`],
    ['/fr/ui/stack', 'Pile', 'Une rangée ou une colonne flex avec un jeton d’espacement pour l’écart.',
      `stack({ direction: 'row', gap: 'sm' }, chip('un'), chip('deux'), chip('trois'))`],
    ['/fr/ui/grid', 'Grille', 'Loge autant de colonnes qu’il en tient, sans media queries.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/fr/ui/divider', 'Séparateur', 'Un filet entre deux sections, avec ou sans libellé.',
      `div({ style: 'width: 100%' }, divider('ou'))`],
    ['/fr/ui/aspect-ratio', 'Rapport d’aspect', 'Fixe la forme d’une boîte, pour que rien ne bouge au chargement.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/fr/ui/card', 'Carte', 'Une surface pour du contenu groupé, avec en-tête, corps et pied.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Une carte')))`],
  ]],
  ['Typographie', [
    ['/fr/ui/typography', 'Typographie', 'Une échelle typographique qui choisit son élément.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Titre'), text({ variant: 'caption', tone: 'muted' }, 'Légende'))`],
    ['/fr/ui/prose', 'Prose', 'Styler du HTML brut venu de Markdown ou d’un CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Un titre</strong></p><p>Et un paragraphe.</p>')`],
    ['/fr/ui/link', 'Lien', 'Une ancre stylée, avec les attributs qu’un lien externe réclame.',
      `text({ variant: 'small' }, 'Lisez la ', link({ href: '/fr/docs' }, 'documentation'), '.')`],
    ['/fr/ui/icons', 'Icônes', '99 glyphes sur une grille, dimensionnés et colorés par le texte autour.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Champs', [
    ['/fr/ui/button', 'Bouton', 'Cinq variantes, cinq couleurs, trois tailles.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Enregistrer'), button({ size: 'sm', variant: 'outline' }, 'Annuler'))`],
    ['/fr/ui/button-group', 'Groupe de boutons', 'Des boutons réunis en un seul contrôle.',
      `buttonGroup({ label: 'Aperçu' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Un'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Deux'))`],
    ['/fr/ui/text-field', 'Champ de texte', 'Libellé, contrôle, aide et erreur, reliés entre eux.',
      `textField({ label: 'E-mail', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/fr/ui/select', 'Liste déroulante', 'Un select natif, stylé pour s’accorder.',
      `selectField({ label: 'Thème', name: 'g-theme', size: 'sm', options: ['Clair', 'Sombre'], value: 'Sombre' })`],
    ['/fr/ui/checkbox', 'Case à cocher', 'Un vrai input, stylé en CSS plutôt que remplacé.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Sitemap', checked: true }), checkbox({ label: 'Flux RSS' }))`],
    ['/fr/ui/radio', 'Groupe de boutons radio', 'Un choix parmi plusieurs, en radios partageant un name.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['gratuit', 'pro'] })`],
    ['/fr/ui/switch', 'Interrupteur', 'Une bascule pour un réglage qui s’applique tout de suite.',
      `stack({ gap: 'sm' }, toggle({ label: 'Public', checked: true }), toggle({ label: 'Brouillons' }))`],
    ['/fr/ui/slider', 'Curseur', 'Un input range natif, stylé pour s’accorder.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Aperçu' }))`],
    ['/fr/ui/toggle-button', 'Bouton bascule', 'Un bouton qui reste enfoncé.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Oui'), toggleButton({ size: 'sm' }, 'Non'))`],
    ['/fr/ui/toggle-group', 'Groupe de bascules', 'Un contrôle segmenté, en boutons ou en liens.',
      `toggleGroup({ size: 'sm', label: 'Aperçu', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Affichage de données', [
    ['/fr/ui/avatar', 'Avatar', 'Une image quand il y en a une, des initiales sinon.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/fr/ui/badge', 'Badge', 'Un compteur ou un point épinglé dans un coin.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Boîte'))`],
    ['/fr/ui/chip', 'Puce', 'Un tag, un statut, un filtre.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'réussi'), chip({ color: 'neutral' }, 'statique'))`],
    ['/fr/ui/tooltip', 'Infobulle', 'Une indication au survol et au focus, dessinée entièrement en CSS.',
      `tooltip({ content: 'Aucun script' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Survolez-moi'))`],
    ['/fr/ui/table', 'Tableau', 'Des lignes et des colonnes à partir de données, dans un conteneur défilant.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Page' }, { key: 's', header: 'Taille', align: 'end' }],
        rows: [{ p: '/', s: '4,1 ko' }, { p: '/docs', s: '12,7 ko' }] })`],
    ['/fr/ui/list', 'Liste', 'Des rangées avec quelque chose de chaque côté.',
      `list({ plain: true }, listItem({ title: 'Routage', description: 'Basé sur les fichiers' }))`],
    ['/fr/ui/figure', 'Figure', 'Une image et sa légende, en une seule figure.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Une légende', style: 'width: 7rem' })`],
    ['/fr/ui/carousel', 'Carrousel', 'Des diapositives qui s’ancrent, avec des puces et des flèches dessinées par le navigateur.',
      `div({ style: 'width: 100%' }, carousel({ perView: 2.4, gap: 'sm', arrows: false, items: ['1', '2', '3'].map((n) =>
        aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          div({ style: 'display: grid; place-items: center; color: var(--su-text-subtle)' }, n))) }))`],
  ]],
  ['Retour d’information', [
    ['/fr/ui/alert', 'Alerte', 'Un message dont l’icône et le rôle ARIA suivent la couleur.',
      `alert({ color: 'success' }, 'Déployé.')`],
    ['/fr/ui/empty', 'État vide', 'À quoi ressemble une liste avant d’avoir quoi que ce soit.',
      `empty({ title: 'Rien ici', style: 'padding: 0' })`],
    ['/fr/ui/progress', 'Progression', 'Une barre pour un travail connu, un spinner pour le reste.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/fr/ui/skeleton', 'Squelette', 'Un substitut à la forme du contenu à venir.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/fr/ui/toast', 'Toast', 'Un message éphémère, ajouté par script.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Enregistré.'))`],
  ]],
  ['Navigation', [
    ['/fr/ui/breadcrumbs', 'Fil d’Ariane', 'La trace des ancêtres qui se termine à cette page.',
      `breadcrumbs({ items: [{ label: 'Documentation', href: '/fr/docs' }, { label: 'UI' }] })`],
    ['/fr/ui/pagination', 'Pagination', 'Des pages numérotées, fenêtrées, en vrais liens.',
      `pagination({ page: 2, count: 5, href: (page) => '/fr/ui#p' + page })`],
    ['/fr/ui/tabs', 'Onglets', 'Des liens, une page par onglet — ou des panneaux qui s’échangent.',
      `tabs({ variant: 'pills', items: [{ label: 'Un', href: '/fr/ui#t1', active: true }, { label: 'Deux', href: '/fr/ui#t2' }] })`],
    ['/fr/ui/app-bar', 'Barre d’application', 'La marque d’un côté, la navigation et les actions de l’autre.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/fr/ui/theme-toggle', 'Bascule de thème', 'Clair et sombre, sans le flash à l’arrivée.',
      `themeToggle()`],
  ]],
  ['Superpositions', [
    ['/fr/ui/modal', 'Modale', 'Un dialogue sur l’API popover — aucun script nulle part.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Ouvrir la modale')`],
    ['/fr/ui/drawer', 'Tiroir', 'Un panneau depuis le bord, mêmes mécaniques de popover.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Ouvrir le tiroir')`],
    ['/fr/ui/menu', 'Menu', 'Un déroulant bâti sur details : ouverture et fermeture gratuites.',
      `chip({ color: 'neutral' }, 'Actions ▾')`],
    ['/fr/ui/accordion', 'Accordéon', 'Des sections repliables, mode exclusif compris.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Une question' }] }))`],
    ['/fr/ui/collapsible', 'Repliable', 'Un seul « voir plus », sans les ornements de l’accordéon.',
      `collapsible({ trigger: 'Voir plus' }, 'Caché jusqu’à ce qu’on le demande.')`],
  ]],
  ['Sections', [
    ['/fr/ui/hero', 'Hero', 'Le haut d’une page d’accueil : titre, phrase, actions.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Un titre'), text({ variant: 'caption', tone: 'muted' }, 'Et une phrase.'))`],
    ['/fr/ui/footer', 'Pied de page', 'Des colonnes de liens, et une ligne en dessous.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Documentation'), text({ variant: 'caption', tone: 'muted' }, 'Guide · Composants'))`],
    ['/fr/ui/stat', 'Statistique', 'Un chiffre qui mérite un regard, et ce qu’il signifie.',
      `stat({ label: 'Pages', value: '204', change: '+8', color: 'success' })`],
    ['/fr/ui/steps', 'Étapes', 'Un parcours numéroté, avec ce qui est fait marqué comme fait.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Installer', 'Construire'] }))`],
    ['/fr/ui/timeline', 'Chronologie', 'Des entrées dans l’ordre, le long d’une ligne.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Sections', color: 'primary' }] }))`],
    ['/fr/ui/mockup', 'Maquette', 'Une capture dans un navigateur, une fenêtre, un téléphone ou un terminal.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Styles', [
    ['/fr/ui/theming', 'Thématisation', 'Chaque couleur, rayon et police, depuis un seul appel.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Une carte de la galerie. L’aperçu est inerte, le nom est un lien étiré. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Un div, pas une ancre : ces aperçus contiennent de vrais boutons et
     * de vraies saisies, et le contenu interactif ne peut pas s’imbriquer
     * dans un lien. C’est l’ancre du nom qui s’étire sur toute la carte, et
     * `inert` retire les contrôles de la démo de l’ordre de tabulation et
     * de l’arbre d’accessibilité.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — des composants pour sitelo',
    description:
      'Une bibliothèque de composants pour sitelo : boutons, cartes, formulaires, tableaux et modales, sous forme de fonctions qui renvoient du HTML.',
    activeHref: '/fr/ui',
    children: [
      p(
        'sitelo-ui est une bibliothèque de composants pour sitelo. Chaque composant est une fonction qui renvoie une chaîne de HTML : il s’imbrique donc directement dans la page que vous écrivez déjà — pas de compilateur, pas de runtime, pas d’hydratation.',
      ),
      p(
        'Chaque exemple de cette section est rendu par le même build que la page qui l’entoure. Ce que vous voyez est ce que le code en dessous a produit, et cela suit les thèmes clair et sombre de ce site parce que sitelo-ui lit le même attribut ',
        code('data-theme'),
        ' que la documentation.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Mise en place'),
      p(
        'Deux lignes : importez les composants, et mettez ',
        code('styles()'),
        ' dans le head. La ',
        a({ href: '/fr/docs/ui' }, 'page Composants de la documentation'),
        ' couvre l’installation, la thématisation, la convention d’appel et le runtime client facultatif, et liste tous les exports dans un seul tableau.',
      ),
      p(
        'Le dossier ',
        code('examples/ui'),
        ' du dépôt rend l’ensemble complet sur une seule page.',
      ),
    ],
  })
