import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Proza',
    description:
      'Ostyluj blok HTML-a, którego nie napisałeś — wynik Markdowna, pole z CMS-a, opis z kanału RSS.',
    activeHref: '/pl/ui/prose',
    children: [
      p(
        'Renderer Markdowna oddaje gołe znaczniki: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — bez klas, których można by się uchwycić. ',
        code('prose()'),
        ' opakowuje ten HTML i go stylizuje.',
      ),
      p(
        'To jedyny świadomy wyjątek w tej bibliotece. Wszędzie indziej style są ograniczone do klas ',
        code('su-'),
        ' właśnie po to, żeby nigdy nie dotykały znaczników, na które się nie zgodziłeś; tutaj nie ma klas do namierzenia, więc reguły dopasowują gołe znaczniki — ale tylko wewnątrz opakowania.',
      ),

      h2('Podstawowa proza'),
      demo(`prose(
  '<h2>Pierwsze kroki</h2>' +
  '<p>Napisz funkcję zwracającą HTML. Uruchom <code>sitelo build</code>. Opublikuj <code>dist/</code>.</p>' +
  '<ul><li>Routing oparty na plikach</li><li>Dane podczas buildu</li><li>Bez runtime’u po stronie klienta</li></ul>'
)`, { align: 'stretch' }),

      h2('Wszystko, co stylizuje'),
      demo(`prose(
  '<h3>Nagłówek</h3>' +
  '<p>Tekst główny z <a href="/docs">odnośnikiem</a>, <strong>pogrubieniem</strong> i <code>kodem liniowym</code>.</p>' +
  '<blockquote><p>Cytat wyróżniony, odsunięty od otaczającego tekstu.</p></blockquote>' +
  '<ol><li>Pierwszy</li><li>Drugi<ul><li>Zagnieżdżony</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Hej&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Opcja</th><th>Domyślnie</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Naciśnij <kbd>⌘</kbd> <kbd>K</kbd>, żeby wyszukać.</p>'
)`, { align: 'stretch' }),

      h2('Rozmiary'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Mały</strong> — na streszczenie w karcie albo panel boczny.</p>'),
  prose('<p><strong>Średni</strong> — domyślny, na tekst główny artykułu.</p>'),
  prose({ size: 'lg' }, '<p><strong>Duży</strong> — na krótkie, wyeksponowane wprowadzenie.</p>'),
)`, { align: 'stretch' }),

      h2('Z blogiem w Markdownie'),
      p(
        'Kształt, jakiego chce przykład bloga: wyrenderuj Markdown podczas buildu, opakuj wynik i opublikuj.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'pl' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked zwraca ciąg HTML bez żadnych klas
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Komponenty wewnątrz prozy'),
      p(
        'Każda reguła prozy pomija elementy noszące klasę ',
        code('su-'),
        ', więc komponent wrzucony w blok prozy zachowuje własny styl, zamiast łapać marginesy artykułu.',
      ),
      demo(`prose(
  '<p>Trochę wyrenderowanego Markdowna, a potem komponent:</p>',
  alert({ color: 'warning', title: 'Wciąż zwykły alert' },
    'Blok prozy wokół niego go nie przestylowuje.'),
  '<p>I wracamy do prozy.</p>',
)`, { align: 'stretch' }),

      h2('Słowo o zaufaniu'),
      p(
        code('prose()'),
        ' renderuje swoje dzieci jako HTML — o to właśnie chodzi i tak działa ',
        code('javascript-to-html'),
        ' w całości. Jeśli HTML pochodzi skądś, czego nie kontrolujesz, odkaź go, zanim tu trafi. Zwykle wystarczy renderer Markdowna z wyłączonym surowym HTML-em.',
      ),

      h2('Propsy'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Bazowy rozmiar czcionki; reszta skaluje się od niego w em.'],
        ['as', 'string', "'div'", 'Element do wyrenderowania, np. article.'],
      ]),
    ],
  })
