import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/fr.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Prose',
    description:
      'Styler un bloc de HTML que vous n’avez pas écrit — sortie Markdown, champ de CMS, description d’un flux RSS.',
    activeHref: '/fr/ui/prose',
    extraHead: uiHead(),
    children: [
      p(
        'Un moteur Markdown renvoie des balises nues : ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — sans aucune classe à laquelle s’accrocher. ',
        code('prose()'),
        ' enveloppe ce HTML et le style.',
      ),
      p(
        'C’est l’unique exception délibérée de cette bibliothèque. Partout ailleurs le style est cantonné aux classes ',
        code('su-'),
        ' précisément pour ne jamais toucher un balisage que vous n’avez pas choisi ; ici il n’y a pas de classe à viser, donc les règles visent des balises nues — mais seulement à l’intérieur de l’enveloppe.',
      ),

      h2('Prose de base'),
      demo(`prose(
  '<h2>Démarrage</h2>' +
  '<p>Écrivez une fonction qui renvoie du HTML. Lancez <code>sitelo build</code>. Publiez <code>dist/</code>.</p>' +
  '<ul><li>Routage par fichiers</li><li>Données au build</li><li>Aucun runtime client</li></ul>'
)`, { align: 'stretch' }),

      h2('Tout ce qu’elle style'),
      demo(`prose(
  '<h3>Un titre</h3>' +
  '<p>Du corps de texte avec <a href="/fr/docs">un lien</a>, du <strong>gras</strong> et du <code>code en ligne</code>.</p>' +
  '<blockquote><p>Une citation mise à part du texte qui l’entoure.</p></blockquote>' +
  '<ol><li>Premier</li><li>Deuxième<ul><li>Imbriqué</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Salut&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Option</th><th>Défaut</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Appuyez sur <kbd>⌘</kbd> <kbd>K</kbd> pour rechercher.</p>'
)`, { align: 'stretch' }),

      h2('Tailles'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Petite</strong> — pour un résumé de carte ou une barre latérale.</p>'),
  prose('<p><strong>Moyenne</strong> — le défaut, pour le corps d’un article.</p>'),
  prose({ size: 'lg' }, '<p><strong>Grande</strong> — pour une courte introduction mise en avant.</p>'),
)`, { align: 'stretch' }),

      h2('Avec un blog en Markdown'),
      p(
        'La forme que veut l’exemple du blog : rendez le Markdown au build, enveloppez le résultat et publiez-le.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'fr' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked renvoie une chaîne de HTML sans aucune classe
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Des composants dans la prose'),
      p(
        'Chaque règle de prose exclut les éléments portant une classe ',
        code('su-'),
        ' : un composant déposé dans un bloc de prose garde donc son propre style au lieu de récupérer les marges d’un article.',
      ),
      demo(`prose(
  '<p>Un peu de Markdown rendu, puis un composant :</p>',
  alert({ color: 'warning', title: 'Toujours une alerte normale' },
    'Le bloc de prose autour d’elle ne la restyle pas.'),
  '<p>Et retour à la prose.</p>',
)`, { align: 'stretch' }),

      h2('Un mot sur la confiance'),
      p(
        code('prose()'),
        ' rend ses enfants comme du HTML — c’est tout l’intérêt, et c’est ainsi que fonctionne ',
        code('javascript-to-html'),
        ' partout. Si le HTML vient d’un endroit que vous ne contrôlez pas, assainissez-le avant qu’il arrive ici. Un moteur Markdown avec le HTML brut désactivé suffit généralement.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Taille de police de base ; tout le reste s’échelonne en em à partir d’elle.'],
        ['as', 'string', "'div'", 'Élément à rendre, par exemple article.'],
      ]),
    ],
  })
