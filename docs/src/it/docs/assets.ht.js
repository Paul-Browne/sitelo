import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/it.js'
import { assetsSnippets } from '../../lib/snippets/assets.js'

const s = assetsSnippets('it')

export default () =>
  docsLayout({
    title: 'Risorse e stili',
    description:
      'Come sitelo compila JavaScript e CSS di frontend con Vite — e tiene fuori dal browser il codice destinato solo al server.',
    activeHref: '/it/docs/assets',
    children: [
      p(
        'sitelo è costruito su Vite, quindi JavaScript e CSS di frontend vengono compilati automaticamente. Metti script e fogli di stile sotto ',
        code('src/'),
        ' (per esempio ',
        code('src/js'),
        ' e ',
        code('src/css'),
        '), collegali dal tuo HTML con URL relativi alla radice, e sitelo pensa al resto — TypeScript, import CSS, bundling e minificazione.',
      ),
      h2('Struttura del progetto'),
      p(
        'Pagine e risorse condividono ',
        code('src/'),
        '. Cartelle come ',
        code('js/'),
        ' e ',
        code('css/'),
        ' sono convenzioni, non obblighi — a sitelo interessa ciò che il tuo HTML referenzia, non i nomi delle cartelle.',
      ),
      codeBlock('project', s.layout, 'bash'),
      h2('Collegare le risorse dall’HTML'),
      p(
        'Referenzia i file con percorsi relativi alla radice. Uno ',
        code('<script type="module">'),
        ' o un ',
        code('<link rel="stylesheet">'),
        ' è ciò che dice a sitelo di includere quel file nella build:',
      ),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      codeBlock('src/js/main.js', s.js, 'javascript'),
      codeBlock('src/css/styles.css', s.css, 'css'),
      h2('Cosa compila Vite'),
      ul(
        { class: 'docs-list' },
        li(
          code('.js'),
          ' / ',
          code('.ts'),
          ' / ',
          code('.jsx'),
          ' / ',
          code('.tsx'),
          ' — messi nel bundle come moduli ES, TypeScript rimosso, import incorporati',
        ),
        li(
          code('.css'),
          ' — elaborato e minificato; ',
          code('@import'),
          ' e i riferimenti ',
          code('url()'),
          ' relativi vengono risolti',
        ),
        li(
          'Tutto ciò che è importato da un punto di ingresso referenziato (come ',
          code('counter.ts'),
          ' qui sopra) viene tirato dentro lo stesso bundle',
        ),
        li(
          'Con ',
          code('sitelo'),
          ' (sviluppo) gli stessi URL passano dalla pipeline di trasformazione di Vite — nessuna build separata per provare TypeScript o CSS',
        ),
      ),
      p(
        'Ti servono PostCSS, Sass o altri plugin di Vite? Aggiungili sotto ',
        code('vite'),
        ' in ',
        a({ href: '/it/docs/configuration' }, 'sitelo.config.js'),
        '.',
      ),
      h2('Zero JS per impostazione predefinita'),
      ul(
        { class: 'docs-list' },
        li(
          'Il codice non referenziato non viene prodotto. Un helper importato solo da ',
          code('data()'),
          ' o da ',
          code('generateStaticParams'),
          ' resta fuori da ',
          code('dist/'),
          ' — i segreti destinati al server non finiscono mai online per sbaglio.',
        ),
        li(
          'Nessuno ',
          code('<script>'),
          ' nella pagina significa nessun JavaScript client nella build. HTML statico e CSS bastano per la maggior parte dei siti.',
        ),
        li(
          code('public/'),
          ' viene copiata pari pari (favicon, robots.txt, immagini statiche a cui non vuoi l’hash).',
        ),
        li(
          'Gli altri file referenziati (immagini, font, video, …) vengono copiati in ',
          code('dist/'),
          '.',
        ),
      ),
      h2('Validazione delle risorse mancanti'),
      p(
        'Uno ',
        code('<script src>'),
        ' o un ',
        code('href'),
        ' di foglio di stile che punta a un file che non esiste né in ',
        code('src/'),
        ' né in ',
        code('public/'),
        ' fa fallire la build. Preferisci un avviso?',
      ),
      codeBlock('sitelo.config.js', s.warn, 'javascript'),
    ],
  })
