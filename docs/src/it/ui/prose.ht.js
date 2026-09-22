import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Prosa',
    description:
      'Dai stile a un blocco di HTML che non hai scritto tu — output di Markdown, un campo di un CMS, la descrizione di un feed RSS.',
    activeHref: '/it/ui/prose',
    children: [
      p(
        'Un renderer Markdown restituisce tag nudi: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — senza classi a cui agganciarsi. ',
        code('prose()'),
        ' avvolge quell’HTML e gli dà stile.',
      ),
      p(
        'È l’unica eccezione voluta in questa libreria. Dappertutto altrove lo stile è circoscritto alle classi ',
        code('su-'),
        ' proprio perché non tocchi mai markup a cui non hai aderito; qui non ci sono classi da prendere di mira, quindi le regole agganciano i tag nudi — ma solo dentro l’involucro.',
      ),

      h2('Prosa di base'),
      demo(`prose(
  '<h2>Primi passi</h2>' +
  '<p>Scrivi una funzione che restituisce HTML. Esegui <code>sitelo build</code>. Pubblica <code>dist/</code>.</p>' +
  '<ul><li>Routing basato sui file</li><li>Dati in fase di build</li><li>Nessun runtime lato client</li></ul>'
)`, { align: 'stretch' }),

      h2('Tutto ciò a cui dà stile'),
      demo(`prose(
  '<h3>Un’intestazione</h3>' +
  '<p>Testo corrente con <a href="/docs">un link</a>, <strong>grassetto</strong> e <code>codice inline</code>.</p>' +
  '<blockquote><p>Una citazione in evidenza, messa da parte rispetto al testo che la circonda.</p></blockquote>' +
  '<ol><li>Primo</li><li>Secondo<ul><li>Annidato</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Ciao&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Opzione</th><th>Predefinito</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Premi <kbd>⌘</kbd> <kbd>K</kbd> per cercare.</p>'
)`, { align: 'stretch' }),

      h2('Dimensioni'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Piccola</strong> — per il riassunto di una scheda o una barra laterale.</p>'),
  prose('<p><strong>Media</strong> — la predefinita, per il corpo di un articolo.</p>'),
  prose({ size: 'lg' }, '<p><strong>Grande</strong> — per un’introduzione breve e in evidenza.</p>'),
)`, { align: 'stretch' }),

      h2('Con un blog in Markdown'),
      p(
        'La forma che vuole l’esempio del blog: renderizza il Markdown in fase di build, avvolgi il risultato e pubblicalo.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'it' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked restituisce una stringa di HTML senza alcuna classe
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Componenti dentro la prosa'),
      p(
        'Ogni regola di prose esclude gli elementi che portano una classe ',
        code('su-'),
        ', così un componente lasciato cadere in un blocco di prosa si tiene il proprio stile invece di prendersi i margini da articolo.',
      ),
      demo(`prose(
  '<p>Un po’ di Markdown renderizzato, e poi un componente:</p>',
  alert({ color: 'warning', title: 'È ancora un avviso normale' },
    'Non viene ri-stilizzato dal blocco di prosa che lo circonda.'),
  '<p>E si torna alla prosa.</p>',
)`, { align: 'stretch' }),

      h2('Due parole sulla fiducia'),
      p(
        code('prose()'),
        ' renderizza i propri figli come HTML — è tutto il punto, ed è così che funziona ',
        code('javascript-to-html'),
        ' dappertutto. Se l’HTML viene da un posto che non controlli, sanificalo prima che arrivi qui. Un renderer Markdown con l’HTML grezzo disattivato di solito basta.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Dimensione di base del carattere; tutto il resto scala in em a partire da essa.'],
        ['as', 'string', "'div'", 'Elemento da renderizzare, per esempio article.'],
      ]),
    ],
  })
