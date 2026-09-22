import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/it.js'
import { cliSnippets } from '../../lib/snippets/cli.js'

const s = cliSnippets('it')

export default () =>
  docsLayout({
    title: 'CLI',
    description: 'sitelo dev, build, preview e i flag più comuni.',
    activeHref: '/it/docs/cli',
    children: [
      p(
        'La CLI ',
        code('sitelo'),
        ' racchiude il Vite incluso e inietta automaticamente il plugin delle pagine HTML.',
      ),
      h2('Comandi'),
      codeBlock('shell', s.commands, 'bash'),
      ul(
        { class: 'docs-list' },
        li(
          code('dev'),
          ' — vero render SSR su richiesta, rotte dinamiche comprese, più una piccola toolbar di sviluppo',
        ),
        li(
          code('build'),
          ' — HTML statico in ',
          code('dist/'),
          ' (o nella tua ',
          code('outDir'),
          ')',
        ),
        li(code('preview'), ' — servi la build di produzione in locale'),
        li(
          code('lighthouse'),
          ' — analizza la build di produzione (richiede la peer dependency ',
          code('lighthouse'),
          ')',
        ),
      ),
      p(
        'Disattiva la toolbar con ',
        code('devToolbar: false'),
        ' in ',
        code('sitelo.config.js'),
        ' — vedi ',
        a({ href: '/it/docs/configuration' }, 'Configurazione'),
        '.',
      ),
      h2('Flag utili'),
      codeBlock('shell', s.flags, 'bash'),
      ul(
        { class: 'docs-list' },
        li(code('--port'), ' / ', code('--host'), ' / ', code('--open'), ' — server'),
        li(
          code('--outDir'),
          ' / ',
          code('--emptyOutDir'),
          ' / ',
          code('--base'),
          ' — build',
        ),
        li(
          code('--root'),
          ' — radice del progetto (comoda per un sito in ',
          code('docs/'),
          ')',
        ),
        li(code('--config'), ' — file di configurazione Vite personalizzato'),
        li(code('--mode'), ' / ', code('--logLevel'), ' / ', code('--debug')),
      ),
      p(
        'Per tutto ciò che riutilizzi fra un comando e l’altro, preferisci le opzioni di Vite in ',
        code('sitelo.config.js'),
        ' sotto ',
        code('vite'),
        '.',
      ),
      h2('Trovare codice inutilizzato'),
      p(
        a({ href: 'https://knip.dev' }, 'knip'),
        ' trova file, export e dipendenze che nessuno usa. Su un progetto sitelo gli serve un suggerimento: pagine e island vengono scoperte dal filesystem, quindi nessuno le importa, e se non gli si dice altro knip segnala l’intero sito come file inutilizzati.',
      ),
      codeBlock('shell', s.knipInstall, 'bash'),
      codeBlock('knip.js', s.knip, 'javascript'),
      codeBlock('shell', s.knipRun, 'bash'),
      p(
        code('knipConfig()'),
        ' legge il tuo ',
        code('sitelo.config.js'),
        ' e segna pagine e island come punti di ingresso nello stesso modo in cui la build le scopre — valgono ',
        code('pagesDir'),
        ', ',
        code('pageExtensions'),
        ', ',
        code('include'),
        ' ed ',
        code('exclude'),
        '. Quel che resta nel report è codice che il sito davvero non raggiunge mai.',
      ),
      p(
        'C’è una cosa che non può vedere: uno script client che una pagina referenzia per URL invece che con un import, come ',
        code('<script src="/js/app.js">'),
        '. Elencali tu, e passa accanto qualunque altra cosa knip accetti — viene inclusa nel risultato. Il ',
        code('!'),
        ' finale è il marcatore di knip per il codice di produzione, ed è esattamente ciò che è uno script spedito al browser.',
      ),
      codeBlock('knip.js', s.knipEntry, 'javascript'),
    ],
  })
