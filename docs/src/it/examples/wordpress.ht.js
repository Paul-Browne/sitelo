import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/it.js'
import { wordpressSnippets } from '../../lib/snippets/examples-wordpress.js'

const s = wordpressSnippets('it')

export default () =>
  examplesLayout({
    title: 'WordPress',
    description:
      'Scarica un intero sito WordPress dalla REST API — migliaia di articoli, generati staticamente con sitelo.',
    activeHref: '/it/examples/wordpress',
    children: [
      p(
        'Tratta WordPress come un CMS headless e ',
        'scarica tutto il sito',
        ': percorri a pagine ',
        code('/wp-json/wp/v2/posts'),
        ', genera un file HTML per slug e metti in cache le risposte dell’API fra una build e l’altra.',
      ),
      h2('Cosa ottieni'),
      ul(
        { class: 'docs-list' },
        li('Una home page che elenca gli articoli recenti'),
        li(code('/blog'), ' — archivio completo di tutti gli articoli'),
        li(
          code('/blog/[slug]'),
          ' — una pagina HTML statica per articolo (regge migliaia di articoli)',
        ),
        li(
          code('fetchWithCache'),
          ' così le ricostruzioni riusano le risposte di WP invece di riscaricare tutto',
        ),
      ),
      h2('Struttura del progetto'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Punta al tuo sito WordPress'),
      p(
        'Nelle versioni moderne di WordPress la REST API è attiva per impostazione predefinita. Verificalo su ',
        code('https://your-site.com/wp-json/wp/v2/posts'),
        '.',
      ),
      p(
        'Imposta ',
        code('WP_URL'),
        ' nell’ambiente (oppure scrivilo nel codice mentre sperimenti):',
      ),
      codeBlock('.env', s.env, 'bash'),
      h2('2. Helper condivisi per WordPress'),
      p(
        code('getAllPosts()'),
        ' legge ',
        code('X-WP-TotalPages'),
        ' e percorre ogni pagina (WordPress limita ',
        code('per_page'),
        ' a 100). Salta ',
        code('_embed'),
        ' mentre raccogli gli slug — scarica gli embed solo per i singoli articoli.',
      ),
      codeBlock('src/lib/wordpress.js', s.wpLib, 'javascript'),
      h2('3. Home page'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.homeTemplate,
        ht: s.homeHt,
        jsx: s.homeJsx,
      }),
      h2('4. Indice del blog'),
      p(
        'Usa ',
        code('getAllPosts()'),
        ' così l’archivio non si ferma a 50–100 elementi.',
      ),
      pageCodeTabs({
        file: 'src/blog/index.ht.js',
        template: s.blogIndexTemplate,
        ht: s.blogIndexHt,
        jsx: s.blogIndexJsx,
      }),
      h2('5. Scarica ogni articolo in pagine statiche'),
      p(
        code('generateStaticParams'),
        ' deve restituire ',
        'ogni',
        ' slug che vuoi in ',
        code('dist/'),
        '. Qui paginare l’API è obbligatorio — non chiamare ',
        code('getPosts({ perPage: 100 })'),
        ' una volta sola e fermarti.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.blogPostTemplate,
        ht: s.blogPostHt,
        jsx: s.blogPostJsx,
      }),
      h2('6. Build'),
      codeBlock('shell', s.build, 'bash'),
      p(
        'La prima build passa da WordPress una volta e riempie la cache delle fetch. Le build successive riusano le risposte di elenco e dettaglio in cache (',
        code("cache: 'auto'"),
        ' → filesystem in produzione) finché ',
        code('maxAge'),
        ' non scade. Alza ',
        code('renderConcurrency'),
        ' in ',
        code('sitelo.config.js'),
        ' se stai renderizzando migliaia di pagine di articoli.',
      ),
      h2('Note'),
      h3('HTML da WordPress'),
      p(
        code('title.rendered'),
        ' e ',
        code('content.rendered'),
        ' sono stringhe HTML che arrivano da WP. Inseriscile nel tuo template così come sono (come qui sopra), oppure sanificale se non ti fidi del tutto del CMS.',
      ),
      h3('Contenuti privati'),
      p(
        'Le rotte REST pubbliche espongono solo gli articoli pubblicati. Per le bozze o per un’autenticazione personalizzata, passa gli header nel secondo argomento di ',
        code('fetchWithCache'),
        ' (il normale init di ',
        code('fetch'),
        ') e usa una ',
        code('cacheKey'),
        ' stabile.',
      ),
      p(
        a({ href: '/it/docs/data' }, 'Documentazione sul caricamento dati'),
        ' · ',
        a({ href: '/it/docs/routing' }, 'Documentazione sul routing'),
      ),
    ],
  })
