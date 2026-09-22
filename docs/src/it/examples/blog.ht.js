import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, examplesLayout, pageCodeTabs } from '../../lib/it.js'
import { blogSnippets } from '../../lib/snippets/examples-blog.js'

const s = blogSnippets('it')

export default () =>
  examplesLayout({
    title: 'Blog in Markdown',
    description:
      'Una cartella di file markdown → un blog statico con feed RSS, costruito con sitelo e marked.',
    activeHref: '/it/examples/blog',
    children: [
      p(
        'Il caso d’uso per eccellenza dei siti statici: file markdown in una cartella, una pagina statica per articolo, un feed RSS e zero JavaScript lato client. Sorgente completa in ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/blog',
            rel: 'noopener',
          },
          'examples/blog',
        ),
        '.',
      ),
      h2('Cosa ottieni'),
      ul(
        { class: 'docs-list' },
        li('Una home page che elenca gli articoli, dal più recente'),
        li(
          code('/blog/[slug]'),
          ' — una pagina HTML statica per ogni file markdown, tramite ',
          code('generateStaticParams'),
        ),
        li(
          code('rss.xml'),
          ' — generato da sitelo a partire dalla configurazione ',
          code('rss'),
        ),
        li(code('sitemap.xml'), ' — abilitata impostando ', code('site')),
        li(
          'Zero JS pubblicato — l’analisi del markdown avviene in fase di build, in Node',
        ),
      ),
      h2('Struttura del progetto'),
      codeBlock('project', s.structure, 'bash'),
      codeBlock('sitelo.config.js', s.config, 'javascript'),
      h2('1. Scrivi gli articoli in markdown'),
      p(
        'Gli articoli vivono in ',
        code('content/'),
        ' — fuori da ',
        code('src/'),
        ', così sitelo non li tratta mai come pagine o risorse. Il frontmatter è fatto di semplici righe ',
        code('chiave: valore'),
        ':',
      ),
      codeBlock('content/hello-world.md', s.post, 'markdown'),
      h2('2. Leggili e renderizzali in Node'),
      p(
        'Un piccolo modulo destinato solo al server legge la cartella, analizza il frontmatter e renderizza il markdown con ',
        a({ href: 'https://marked.js.org', rel: 'noopener' }, 'marked'),
        '. Poiché nulla nell’HTML referenzia questo modulo, non arriva mai al browser.',
      ),
      codeBlock('src/lib/posts.js', s.lib, 'javascript'),
      h2('3. Elenca gli articoli in home page'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.indexTemplate,
        ht: s.indexHt,
        jsx: s.indexJsx,
      }),
      h2('4. Una pagina statica per articolo'),
      p(
        code('generateStaticParams'),
        ' restituisce ogni slug in fase di build; ',
        code('data()'),
        ' carica l’articolo corrispondente per ciascuna pagina.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.slugTemplate,
        ht: s.slugHt,
        jsx: s.slugJsx,
      }),
      h2('5. RSS in regalo'),
      p(
        'Con la configurazione ',
        code('rss'),
        ' qui sopra, ',
        code('sitelo build'),
        ' produce ',
        code('dist/rss.xml'),
        ' con un elemento per ogni pagina sotto ',
        code('/blog'),
        ' — senza codice aggiuntivo.',
      ),
      p(
        a({ href: '/it/docs/routing' }, 'Documentazione sul routing'),
        ' · ',
        a({ href: '/it/docs/data' }, 'Documentazione sul caricamento dati'),
        ' · ',
        a({ href: '/it/docs/configuration' }, 'Documentazione sulla configurazione'),
      ),
    ],
  })
