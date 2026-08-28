import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/fr.js'
import { todoSnippets } from '../../lib/snippets/examples-todo.js'

const s = todoSnippets('fr')

export default () =>
  examplesLayout({
    title: 'Appli de tâches',
    description:
      'Du HTML statique avec des imports dynamiques en ligne — les gestionnaires chargent /js/todo.js à la demande.',
    activeHref: '/fr/examples/todo',
    children: [
      p(
        'Une interface interactive classique, sans framework frontend. sitelo construit la coquille de la page ; les attributs d’événement appellent ',
        code("import('/js/todo.js').then(…)"),
        ', si bien que le module ne se charge qu’au besoin. Source complète dans ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/todo',
            rel: 'noopener',
          },
          'examples/todo',
        ),
        '.',
      ),
      h2('Ce que vous obtenez'),
      ul(
        { class: 'docs-list' },
        li(
          'Du HTML statique avec des gestionnaires ',
          code('onsubmit'),
          ' / ',
          code('onload'),
          ' (et sur les éléments de la liste)',
        ),
        li(
          code('src/js/todo.js'),
          ' — exporte ',
          code('hydrate'),
          ', ',
          code('handleSubmit'),
          ', ',
          code('handleChange'),
          ' et ',
          code('handleRemove'),
        ),
        li(
          'sitelo repère les ',
          code("import('/…')"),
          ' littéraux dans le HTML et intègre le fichier dans ',
          code('dist/'),
          ' (voir ',
          a({ href: '/fr/docs/assets' }, 'Ressources'),
          ')',
        ),
      ),
      h2('Structure du projet'),
      codeBlock('project', s.structure, 'bash'),
      h2('1. Imports en ligne dans la page'),
      p(
        'Pas de ',
        code('<script type="module" src>'),
        '. Les gestionnaires sont des attributs HTML qui importent dynamiquement le module et appellent un export, en passant ',
        code('this'),
        ' (l’élément). Les modules de page restent ainsi exempts d’API navigateur (voir ',
        a({ href: '/fr/docs/pages#limites-de-jsx' }, 'limites de JSX'),
        ').',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('2. Gestionnaires exportés'),
      p(
        'Le module est un fichier ES ordinaire sous ',
        code('src/js/'),
        '. Les éléments de liste créés à l’exécution utilisent le même motif ',
        code("import('/js/todo.js').then(…)"),
        ' pour ',
        code('onchange'),
        ' et ',
        code('onclick'),
        '.',
      ),
      codeBlock('src/js/todo.js', s.todoJs, 'javascript'),
      h2('3. Lancer'),
      codeBlock('shell', s.run, 'bash'),
      p(
        'Ou bien ',
        code('npm run build'),
        ', puis hébergez ',
        code('dist/'),
        ' partout où des fichiers statiques sont servis.',
      ),
      p(
        a({ href: '/fr/docs/assets' }, 'Ressources et styles'),
        ' · ',
        a({ href: '/fr/docs/pages#limites-de-jsx' }, 'Limites de JSX'),
        ' · ',
        a({ href: '/fr/examples/basic' }, 'Site de base'),
      ),
    ],
  })
