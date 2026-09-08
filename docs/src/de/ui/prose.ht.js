import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Prosa',
    description:
      'Gestalte einen HTML-Block, den du nicht geschrieben hast — Markdown-Ausgabe, ein CMS-Feld, eine RSS-Beschreibung.',
    activeHref: '/de/ui/prose',
    extraHead: uiHead(),
    children: [
      p(
        'Ein Markdown-Renderer gibt nackte Tags zurück: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — ohne Klassen zum Anpacken. ',
        code('prose()'),
        ' wickelt dieses HTML ein und gestaltet es.',
      ),
      p(
        'Das ist die eine bewusste Ausnahme dieser Bibliothek. Überall sonst ist Gestaltung auf ',
        code('su-'),
        '-Klassen beschränkt, genau damit sie nie Markup anfasst, für das du dich nicht entschieden hast; hier gibt es keine Klassen als Ziel, also greifen die Regeln auf nackte Tags — aber nur innerhalb der Hülle.',
      ),

      h2('Einfache Prosa'),
      demo(`prose(
  '<h2>Erste Schritte</h2>' +
  '<p>Schreibe eine Funktion, die HTML zurückgibt. Führe <code>sitelo build</code> aus. Veröffentliche <code>dist/</code>.</p>' +
  '<ul><li>Dateibasiertes Routing</li><li>Daten zur Build-Zeit</li><li>Kein Client-Runtime</li></ul>'
)`, { align: 'stretch' }),

      h2('Alles, was sie gestaltet'),
      demo(`prose(
  '<h3>Eine Überschrift</h3>' +
  '<p>Fließtext mit <a href="/de/docs">einem Link</a>, <strong>fett</strong> und <code>Inline-Code</code>.</p>' +
  '<blockquote><p>Ein herausgestelltes Zitat, abgesetzt vom Text ringsum.</p></blockquote>' +
  '<ol><li>Erstens</li><li>Zweitens<ul><li>Verschachtelt</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Hallo&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Option</th><th>Standard</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Drücke <kbd>⌘</kbd> <kbd>K</kbd> zum Suchen.</p>'
)`, { align: 'stretch' }),

      h2('Größen'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Klein</strong> — für eine Kartenzusammenfassung oder eine Seitenleiste.</p>'),
  prose('<p><strong>Mittel</strong> — der Standard, für den Fließtext eines Artikels.</p>'),
  prose({ size: 'lg' }, '<p><strong>Groß</strong> — für eine kurze, herausgehobene Einleitung.</p>'),
)`, { align: 'stretch' }),

      h2('Mit einem Markdown-Blog'),
      p(
        'Die Form, die das Blog-Beispiel will: das Markdown zur Build-Zeit rendern, das Ergebnis einwickeln und ausliefern.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'de' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked liefert einen HTML-String ganz ohne Klassen
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Komponenten in der Prosa'),
      p(
        'Jede Prosa-Regel schließt Elemente mit einer ',
        code('su-'),
        '-Klasse aus, sodass eine Komponente mitten in einem Prosablock ihre eigene Gestaltung behält, statt Artikelabstände aufzuschnappen.',
      ),
      demo(`prose(
  '<p>Etwas gerendertes Markdown, und dann eine Komponente:</p>',
  alert({ color: 'warning', title: 'Immer noch ein normaler Hinweis' },
    'Der Prosablock ringsum gestaltet ihn nicht um.'),
  '<p>Und zurück zur Prosa.</p>',
)`, { align: 'stretch' }),

      h2('Ein Wort zum Vertrauen'),
      p(
        code('prose()'),
        ' rendert seine Kinder als HTML — das ist der ganze Sinn, und so arbeitet ',
        code('javascript-to-html'),
        ' überall. Kommt das HTML von irgendwo, das du nicht kontrollierst, säubere es, bevor es hierher gelangt. Ein Markdown-Renderer mit abgeschaltetem Roh-HTML genügt meist.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Basisschriftgröße; alles andere skaliert in em daraus.'],
        ['as', 'string', "'div'", 'Element, das gerendert wird, z. B. article.'],
      ]),
    ],
  })
