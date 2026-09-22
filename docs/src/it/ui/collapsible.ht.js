import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Comprimibile',
    description:
      'Un solo “mostra altro”, senza i bordi e il raggruppamento di una fisarmonica.',
    activeHref: '/it/ui/collapsible',
    children: [
      p(
        'Un comprimibile è un singolo ',
        code('<details>'),
        ' — lo stesso elemento con cui è costruita una fisarmonica, senza nulla della sua cornice. Usalo per un dettaglio facoltativo in mezzo a una pagina; usa ',
        code('accordion()'),
        ' quando ce n’è un insieme.',
      ),
      p(
        'Non ha bisogno di alcuno script, e poiché il contenuto resta nel documento si trova con la funzione “cerca nella pagina” del browser e dai motori di ricerca.',
      ),

      h2('Comprimibile di base'),
      demo(`collapsible({ trigger: 'Mostra la configurazione generata' },
  text({ variant: 'small' }, 'Tutto ciò che sitelo scrive quando esegui la build senza un tuo file di configurazione.'),
)`, { align: 'stretch' }),

      h2('Aperto per impostazione predefinita'),
      demo(`collapsible({ trigger: 'Perché esiste', open: true },
  text({ variant: 'small' }, 'Perché una pagina che nasconde la propria spiegazione dietro un clic è una pagina che nessuno legge.'),
)`, { align: 'stretch' }),

      h2('Contenuto ricco'),
      demo(`collapsible({ trigger: 'Mostra l’output completo' },
  stack({ gap: 'sm' },
    code('dist/index.html'),
    code('dist/404.html'),
    code('dist/sitemap.xml'),
  ),
)`, { align: 'stretch' }),

      h2('Dentro altre cose'),
      p(
        'Un comprimibile sta volentieri dentro una scheda, un avviso o la cella di una tabella.',
      ),
      demo(`stack({ gap: 'md' },
  card(
    cardHeader({ title: 'Build fallita', subtitle: '2 link rotti' }),
    cardBody(
      collapsible({ trigger: 'Mostra i link che non funzionano' },
        list({ plain: true },
          listItem({ title: '/docs/old-routing', description: 'collegato da /docs' }),
          listItem({ title: '/blog/draft', description: 'collegato da /blog' }),
        ),
      ),
    ),
  ),
  alert({ color: 'warning', title: 'Pagina lenta' },
    stack({ gap: 'sm' },
      text({ variant: 'small' }, 'Una pagina ha impiegato più di 500 ms per essere renderizzata.'),
      collapsible({ trigger: 'Mostra i tempi' },
        text({ variant: 'small' }, '/examples/wordpress — 512 ms'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('L’innesco'),
      p(
        'Tienilo a testo e icone. Un ',
        code('<summary>'),
        ' è già interattivo, quindi un pulsante o un link al suo interno annida due controlli dove c’è una sola azione — la stessa regola che segue ',
        code('menu()'),
        '.',
      ),

      h2('Comprimibile o fisarmonica?'),
      p(
        'Una sola rivelazione per conto suo: ',
        code('collapsible()'),
        '. Un insieme, con bordi e raggruppato, eventualmente con uno solo aperto per volta: ',
        code('accordion()'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['trigger', 'Child', '', 'Il contenuto del summary. Solo testo e icone.'],
        ['open', 'boolean', 'false', 'Se parte già espanso.'],
      ]),
    ],
  })
