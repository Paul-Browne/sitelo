import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout, pageCodeTabs } from '../../lib/it.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('it')

export default () =>
  docsLayout({
    title: 'Caricamento dati',
    description:
      'data() in fase di build e fetchWithCache per siti statici alimentati da API.',
    activeHref: '/it/docs/data',
    children: [
      p(
        'Esporta una funzione ',
        code('data()'),
        ' e il suo risultato comparirà come ',
        code('ctx.data'),
        ' nella tua funzione di render. Gira in fase di build, e a ogni richiesta nel server di sviluppo.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Stai costruendo molte pagine contro la stessa API? Importa ',
        code('fetchWithCache'),
        ' da sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Opzioni'),
      ul(
        { class: 'docs-list' },
        li(
          code('maxAge'),
          ' — TTL della cache in secondi (predefinito ',
          code('3600'),
          ')',
        ),
        li(
          code('cacheKey'),
          ' — chiave personalizzata (predefinita: hash di URL + metodo + header + corpo)',
        ),
        li(code('forceRefresh'), ' — scavalca la cache'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Modalità di cache'),
      ul(
        { class: 'docs-list' },
        li(
          code('auto'),
          ' (predefinita) — memoria in sviluppo, filesystem nelle build di produzione',
        ),
        li(
          code('memory'),
          ' — dentro al processo, svuotata quando il processo termina',
        ),
        li(code('fs'), ' — persistita sotto ', code('node_modules/.cache/')),
        li(code('none'), ' — scarica sempre'),
      ),
      p(
        'Per impostazione predefinita vengono messe in cache solo le richieste ',
        code('GET'),
        ' (passa una ',
        code('cacheKey'),
        ' per mettere in cache altri metodi). Le risposte di errore non vengono mai messe in cache.',
      ),
      h2('File JSON locali'),
      p(
        'Nessuna API? Tieni i contenuti nel repository come JSON e leggili con ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'I percorsi relativi si risolvono dalla radice del progetto, quindi ',
        code('data/posts'),
        ' significa la stessa cosa da qualunque punto tu esegua la CLI. ',
        code('readJson'),
        ' restituisce un file analizzato; ',
        code('readJsonCollection'),
        ' restituisce un array di voci, ciascuna con uno ',
        code('slug'),
        ' — da una cartella di file ',
        code('.json'),
        ' (uno per voce, slug dal nome del file), oppure da un singolo file che contiene un array di voci o un oggetto indicizzato per slug.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Opzioni delle collezioni'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — nome di un campo o funzione; per impostazione predefinita il nome del file, la chiave dell’oggetto, oppure lo ',
          code('slug'),
          ' / ',
          code('id'),
          ' della voce stessa',
        ),
        li(
          code('sort'),
          ' — nome di un campo (',
          code("'date'"),
          ' crescente, ',
          code("'-date'"),
          ' decrescente) o una funzione di confronto',
        ),
        li(
          code('recursive'),
          ' — includi i file ',
          code('.json'),
          ' nelle sottocartelle, con slug ricavato dal loro percorso',
        ),
        li(code('root'), ' — cartella da cui si risolvono i percorsi relativi'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Le letture sono memoizzate per file, quindi una build da 500 pagine analizza ogni file una volta sola. Il server di sviluppo invece rivalida rispetto a mtime, e ricarica il browser quando cambia un file JSON che una pagina ha letto. Slug duplicati, file mancanti e JSON malformato fanno fallire la build, ciascuno indicato per percorso.',
      ),
    ],
  })
