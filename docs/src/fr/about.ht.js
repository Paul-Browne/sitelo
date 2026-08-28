import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/fr.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'À propos',
    description:
      'Pourquoi sitelo existe — de javascript-to-html à vite-plugin-html-pages, jusqu’à une boîte à outils complète pour sites statiques.',
    activeHref: '/fr/about',
    children: [
      p(
        'sitelo n’a pas commencé comme un framework. C’est parti de l’envie d’écrire du balisage d’une manière qui semble naturelle en JavaScript — et cela n’a cessé de grandir jusqu’à couvrir tout le chemin, du fichier de page au site livré.',
      ),
      h2('javascript-to-html'),
      p(
        'Il y a d’abord eu ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (aussi connu sous le nom de ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        ') : une façon simple et intuitive de générer du HTML en JavaScript, sans moteur de gabarit complexe ni framework.',
      ),
      p(
        'Vu à quel point les frameworks complets comme React étaient devenus omniprésents, trouver une solution de gabarits simple qui n’embarque pas tout l’attirail était étonnamment difficile. En se concentrant uniquement sur la transformation de JavaScript en HTML — au fond, des fonctions qui renvoient des chaînes —, ht.js reste léger, facile à utiliser, souple et extensible.',
      ),
      p(
        'Cette surface réduite lui permet de s’insérer à bien des endroits : directement dans le frontend (façon SPA), dans un build pour créer des sites statiques (SSG), ou même pour du rendu côté serveur (SSR).',
      ),
      h2('Apprendre à Vite à produire du HTML'),
      p(
        'Cela réglait l’écriture. Le problème suivant était le build : Vite traite les ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' comme des scripts, pas comme des pages. Il fallait une convention où certains modules étaient ',
        em('destinés'),
        ' à devenir du HTML.',
      ),
      p(
        'L’idée était directe : les fichiers nommés ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' et consorts devraient être transformés en HTML plutôt qu’empaquetés comme du JavaScript client. Cette convention est devenue ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — routage par fichiers, chargement de données, ressources et génération statique par-dessus Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo réunit Vite et ce plugin en une seule installation et une seule CLI. Vous obtenez une expérience de développement complète et soignée : ',
        code('sitelo'),
        ' pour un serveur en direct, ',
        code('sitelo build'),
        ' pour la production, des valeurs par défaut sensées et le modèle de pages du plugin, sans avoir à assembler vous-même la chaîne d’outils.',
      ),
      p(
        'La même idée de bout en bout : les pages sont des modules qui renvoient du HTML. sitelo est la couche qui rend cette idée aboutie.',
      ),
      h2('Comment il se compare'),
      p(
        'Beaucoup de bons outils publient déjà des sites statiques. La niche de sitelo est étroite à dessein : des fonctions JavaScript (ou TypeScript) qui renvoient du HTML, avec l’expérience de développement de Vite, et le moins de framework possible.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Outil'), th('Modèle'), th('À choisir quand'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Fonctions JS/TS → HTML sur Vite',
              'Vous voulez du HTML issu de JavaScript avec un vrai flux de travail Vite — sans framework à composants',
            ),
            comparisonRow(
              'Astro',
              'Composants + îlots, compilateur maison',
              'Sites de contenu qui veulent des îlots de composants et un écosystème plus vaste',
            ),
            comparisonRow(
              'Next.js',
              'Application React complète (SSR / SSG / ISR)',
              'Vous construisez une application dans l’écosystème React',
            ),
            comparisonRow(
              'Hugo',
              'Gabarits Go, builds très rapides',
              'Très gros sites de contenu et vous êtes à l’aise avec l’outillage Go',
            ),
            comparisonRow(
              'Eleventy',
              'Langages de gabarits → HTML',
              'Vous voulez des gabarits souples (Nunjucks, Liquid, …) sans framework SPA',
            ),
          ),
        ),
      ),
      p(
        'Si vous voulez des composants, de l’hydratation et un framework — prenez un framework. Si vous voulez des fichiers HTML issus de fonctions JavaScript avec l’expérience Vite, sitelo est le plus petit outil qui fait tout le travail.',
      ),
      p(
        a({ href: '/fr/docs' }, 'Lire la documentation'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
