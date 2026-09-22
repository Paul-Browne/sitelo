import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Fisarmonica',
    description:
      'Sezioni comprimibili, usando il <details> del browser — modalità esclusiva compresa.',
    activeHref: '/it/ui/accordion',
    children: [
      p(
        'Ogni sezione è un ',
        code('<details>'),
        '. Apertura, chiusura, supporto da tastiera e ricerca nella pagina arrivano tutti dal browser, e la fisarmonica funziona con JavaScript disattivato — cosa che per una sezione di domande frequenti, l’uso più comune, conta.',
      ),

      h2('Fisarmonica di base'),
      demo(`accordion({
  items: [
    { title: 'Che cos’è sitelo?', content: 'Un generatore di siti statici costruito su Vite. Le pagine sono funzioni che restituiscono HTML.' },
    { title: 'Spedisce un runtime?', content: 'No. Niente raggiunge il browser se non colleghi tu uno script.' },
    { title: 'Posso usare TypeScript?', content: 'Sì — .ht.ts e .ht.tsx sono estensioni di pagina come tutte le altre.' },
  ],
})`, { align: 'stretch' }),

      h2('Aperta per impostazione predefinita'),
      demo(`accordion({
  items: [
    { title: 'Aperta all’arrivo', content: 'Questa ha open: true.', open: true },
    { title: 'Chiusa', content: 'Questa no.' },
  ],
})`, { align: 'stretch' }),

      h2('Una per volta'),
      p(
        'Un ',
        code('name'),
        ' condiviso rende le sezioni mutuamente esclusive — aprendone una si chiudono le altre. È il comportamento nativo del browser per ',
        code('<details name>'),
        ', non uno script.',
      ),
      demo(`accordion({
  name: 'demo-exclusive',
  items: [
    { title: 'Prima', content: 'Aprine un’altra e questa si chiude.', open: true },
    { title: 'Seconda', content: 'E si chiude anche questa.' },
    { title: 'Terza', content: 'Ne resta aperta sempre e solo una.' },
  ],
})`, { align: 'stretch' }),

      h2('Contenuto ricco'),
      p(
        'Costruisci le sezioni con ',
        code('accordionItem()'),
        ' quando il contenuto è più di un paragrafo.',
      ),
      demo(`accordion(
  accordionItem({ title: 'Installazione', open: true },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Aggiungi il pacchetto e il suo compagno per il markup:'),
      code('npm install sitelo javascript-to-html'),
    ),
  ),
  accordionItem({ title: 'Configurazione' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Facoltativa. Le opzioni di Vite stanno sotto la chiave vite.'),
      code('sitelo.config.js'),
    ),
  ),
  accordionItem({ title: 'Deploy' },
    stack({ gap: 'sm' },
      text({ variant: 'small', tone: 'muted' }, 'Pubblica la cartella di output su qualunque host statico.'),
      stack({ direction: 'row', gap: 'sm', wrap: true },
        chip({ size: 'sm' }, 'Netlify'),
        chip({ size: 'sm' }, 'Vercel'),
        chip({ size: 'sm' }, 'Cloudflare Pages'),
        chip({ size: 'sm' }, 'GitHub Pages'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Domande frequenti'),
      p(
        'La forma per cui questo componente esiste: contenuto che è già nell’HTML, compresso per poterlo scorrere, e trovabile da un motore di ricerca perché non ha mai lasciato la pagina.',
      ),
      demo(`return (() => {
  const faq = [
    ['È davvero senza configurazione?', 'Un progetto con un file in src/ e nessuna configurazione si costruisce. Tutto il resto è facoltativo.'],
    ['Come funzionano le rotte dinamiche?', 'Parentesi nei nomi dei file. generateStaticParams elenca cosa costruire.'],
    ['E la ricerca?', 'Imposta pagefind: true e la build indicizza ogni pagina.'],
  ]

  return accordion({
    name: 'demo-faq',
    items: faq.map(([title, content]) => ({ title, content })),
  })
})()`, { align: 'stretch' }),

      h2('Props'),
      p(code('accordion()'), ':'),
      propsTable([
        ['items', 'Array', '[]', 'Stringhe, oppure oggetti { title, content, open }.'],
        ['name', 'string', '', 'Un nome condiviso rende le sezioni mutuamente esclusive.'],
      ]),
      p(code('accordionItem()'), ':'),
      propsTable([
        ['title', 'Child', '', 'La riga del summary.'],
        ['open', 'boolean', 'false', 'Se parte già espansa.'],
        ['name', 'string', '', 'Stesso effetto che sul genitore, quando costruisci gli elementi a mano.'],
      ]),
    ],
  })
