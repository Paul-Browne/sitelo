import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/it.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'Informazioni',
    description:
      'Perché esiste sitelo — da javascript-to-html a vite-plugin-html-pages fino a un toolkit completo per siti statici.',
    activeHref: '/it/about',
    children: [
      p(
        'sitelo non è nato come framework. È nato dal desiderio di scrivere markup in un modo che risultasse naturale in JavaScript — e ha continuato a crescere finché non ha coperto tutto il percorso dal file di una pagina al sito pubblicato.',
      ),
      h2('javascript-to-html'),
      p(
        'Prima è arrivato ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (noto anche come ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): un modo semplice e intuitivo per generare HTML in JavaScript, senza motori di template o framework complessi.',
      ),
      p(
        'Vista quanto erano diventati onnipresenti framework completi come React, trovare una soluzione di templating semplice che non portasse con sé mezzo mondo era sorprendentemente difficile. Concentrandosi solo sulla trasformazione da JavaScript a HTML — in sostanza funzioni che restituiscono stringhe — ht.js resta leggero, facile da usare, flessibile ed estensibile.',
      ),
      p(
        'Quella superficie ridotta gli permette di stare in molti posti: direttamente nel frontend (in stile SPA), in una build per creare siti statici (SSG), o perfino per il rendering lato server (SSR).',
      ),
      h2('Insegnare a Vite a produrre HTML'),
      p(
        'Questo risolveva la scrittura. Il problema successivo era la build: Vite tratta ',
        code('.js'),
        ' e ',
        code('.ts'),
        ' come script, non come pagine. Serviva una convenzione in cui certi moduli fossero ',
        em('destinati'),
        ' a diventare HTML.',
      ),
      p(
        'L’idea era lineare: i file chiamati ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' e simili dovevano essere trasformati in HTML invece di finire nel bundle come JavaScript per il browser. Quella convenzione è diventata ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — routing basato sui file, caricamento dati, risorse e generazione statica sopra a Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo racchiude Vite e quel plugin in una sola installazione e una sola CLI. Ottieni un’esperienza di sviluppo completa e di primo livello: ',
        code('sitelo'),
        ' per un server dal vivo, ',
        code('sitelo build'),
        ' per la produzione, impostazioni predefinite sensate e il modello di pagina del plugin senza doverti assemblare la toolchain da solo.',
      ),
      p(
        'La stessa idea fino in fondo: le pagine sono moduli che restituiscono HTML. sitelo è lo strato che fa sembrare quell’idea finita.',
      ),
      h2('Come si colloca'),
      p(
        'Esistono già parecchi buoni strumenti per pubblicare siti statici. La nicchia di sitelo è volutamente stretta: funzioni JavaScript (o TypeScript) che restituiscono HTML, con l’esperienza di sviluppo di Vite e il minimo framework possibile.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Strumento'), th('Modello'), th('Scegli questo quando'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Funzioni JS/TS → HTML su Vite',
              'Vuoi HTML a partire da JavaScript con un vero flusso di lavoro Vite — senza bisogno di un framework a componenti',
            ),
            comparisonRow(
              'Astro',
              'Componenti + island, compilatore proprio',
              'Siti di contenuti che vogliono island a componenti e un ecosistema più ampio',
            ),
            comparisonRow(
              'Next.js',
              'App React completa (SSR / SSG / ISR)',
              'Stai costruendo un’applicazione nell’ecosistema React',
            ),
            comparisonRow(
              'Hugo',
              'Template Go, build velocissime',
              'Siti di contenuti enormi e ti trovi bene con la toolchain di Go',
            ),
            comparisonRow(
              'Eleventy',
              'Linguaggi di template → HTML',
              'Vuoi template flessibili (Nunjucks, Liquid, …) senza un framework SPA',
            ),
          ),
        ),
      ),
      p(
        'Se vuoi componenti, idratazione e un framework — usa un framework. Se vuoi file HTML a partire da funzioni JavaScript con l’esperienza di Vite, sitelo è lo strumento più piccolo che fa tutto il lavoro.',
      ),
      p(
        a({ href: '/it/docs' }, 'Leggi la documentazione'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
