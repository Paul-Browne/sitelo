import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/it.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('it')

export default () =>
  docsLayout({
    title: 'Creare con l’IA',
    description:
      'Dai agli agenti di programmazione una conoscenza aggiornata di sitelo con llms.txt, regole di progetto e consigli pratici.',
    activeHref: '/it/docs/build-with-ai',
    children: [
      p(
        'Gli editor con IA e gli agenti di programmazione spesso tirano a indovinare su sitelo — ricorrono a schemi di React, Next o Astro che qui non valgono. Questa guida mostra come indirizzarli alla documentazione aggiornata di sitelo e mantenere il codice generato in linea con il modello.',
      ),
      h2('llms.txt'),
      p(
        'sitelo pubblica un riassunto del framework leggibile dalle macchine su ',
        a({ href: '/llms.txt' }, 'sitelo.dev/llms.txt'),
        '. Molti agenti sanno scaricare un URL; chiedi al tuo di leggere quel file (e la documentazione per umani) prima di scrivere codice sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(
          a({ href: '/llms.txt' }, 'https://sitelo.dev/llms.txt'),
          ' — API e convenzioni in forma compatta',
        ),
        li(a({ href: '/it/docs' }, 'https://sitelo.dev/docs'), ' — guide complete'),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README su GitHub'),
          ' — modello mentale e panoramica delle funzionalità',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — documentazione di ',
          code('javascript-to-html'),
          ' (consigliata per scrivere HTML in JS)',
        ),
      ),
      p(
        'A differenza di un server MCP per la documentazione, ',
        code('llms.txt'),
        ' non richiede installazioni — incolla l’URL nella chat, aggiungilo alle regole di progetto, oppure lascia che sia l’agente a scaricarlo.',
      ),
      h2('Regole di progetto'),
      p(
        'Se il tuo strumento supporta istruzioni persistenti (',
        code('AGENTS.md'),
        ', regole di Cursor, istruzioni di Copilot, …), aggiungi una breve regola su sitelo così ogni sessione parte con il modello mentale giusto. L’',
        a({ href: '/it/examples/basic' }, 'esempio di base'),
        ' contiene un ',
        code('AGENTS.md'),
        ' che puoi copiare:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Crea ',
        code('.cursor/rules/sitelo.mdc'),
        ' nel tuo progetto (oppure incolla lo stesso testo nell’interfaccia delle regole di progetto di Cursor):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Consigli per lavorare su sitelo con l’IA'),
      ul(
        { class: 'docs-list' },
        li(
          'Parti da un modello — chiedi all’agente di generare l’impalcatura da ',
          a({ href: '/it/examples/basic' }, 'examples/basic'),
          ' o ',
          a({ href: '/it/examples/wordpress' }, 'examples/wordpress'),
          ' invece di inventarsi un framework.',
        ),
        li(
          'Per il markup preferisci ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          '): funzioni-tag che restituiscono stringhe HTML, senza motori di template né React. Indirizza gli agenti a ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' così non si inventano alberi di componenti JSX.',
        ),
        li(
          'Le pagine sono funzioni che restituiscono HTML — ',
          code('export default () => `<html>…</html>`'),
          ' oppure composte con ',
          code('javascript-to-html'),
          '. JSX va bene finché compila in stringhe; un runtime React non serve.',
        ),
        li(
          'Usa la CLI di sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — non ',
          code('vite'),
          ' direttamente, a meno che tu non sappia di aver bisogno di una configurazione Vite personalizzata.',
        ),
        li(
          'Verifica le API rispetto a ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — in particolare ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ' e le ',
          a({ href: '/it/docs/islands' }, 'island server'),
          '.',
        ),
        li(
          'Zero JS per impostazione predefinita — collega uno ',
          code('<script>'),
          ' solo quando la pagina ha bisogno di codice client; i moduli non referenziati restano solo lato server.',
        ),
        li(
          'Rivedi ed esegui — dopo che l’agente ha modificato le pagine fai sempre ',
          code('sitelo build'),
          ' (o avvia il server di sviluppo); tratta il markup generato come una bozza.',
        ),
      ),
      p(
        a({ href: '/it/docs' }, 'Primi passi'),
        ' · ',
        a({ href: '/it/examples/basic' }, 'Esempio di base'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
