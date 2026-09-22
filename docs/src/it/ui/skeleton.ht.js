import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Scheletro',
    description:
      'Un segnaposto nella forma del contenuto che non è ancora arrivato.',
    activeHref: '/it/ui/skeleton',
    children: [
      p(
        'Uno scheletro sta al posto del contenuto mentre si carica. Su un sito statico serve meno spesso che in un’app — l’HTML c’è già — ma è quello che di solito dovrebbe essere il ',
        code('fallback'),
        ' di un’island, e quello che mostra una regione renderizzata dal client prima che arrivino i suoi dati.',
      ),
      p(
        'Gli scheletri sono decorativi: ognuno è ',
        code('aria-hidden'),
        ', così a uno screen reader non viene letto un elenco di riquadri vuoti.',
      ),

      h2('Forme'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Testo'),
      p(
        code('lines'),
        ' renderizza l’equivalente di un paragrafo, con l’ultima riga corta così si legge come prosa e non come un blocco.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('Nella forma della cosa vera'),
      p(
        'Uno scheletro è più convincente quando combacia con il layout che sostituisce — stessa scheda, stesse righe, stesse dimensioni.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardBody(
      stack({ gap: 'md' },
        stack({ direction: 'row', gap: 'sm', align: 'center' },
          skeleton({ variant: 'circle', width: '2.5rem', height: '2.5rem' }),
          stack({ gap: 'xs', style: 'flex: 1' },
            skeleton({ variant: 'text', width: '60%' }),
            skeleton({ variant: 'text', width: '40%' }),
          ),
        ),
        skeleton({ lines: 3 }),
      ),
    ),
  ),
  card(
    cardBody(
      stack({ direction: 'row', gap: 'sm', align: 'center' },
        avatar({ name: 'Ada Lovelace' }),
        stack({ gap: 'none' },
          text({ variant: 'small' }, 'Ada Lovelace'),
          text({ variant: 'caption', tone: 'muted' }, 'Ha pubblicato 3 commit'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Come contenuto di riserva di un’island'),
      p(
        'Un’island server pubblica il proprio contenuto di riserva nell’HTML statico e ci sostituisce il frammento renderizzato al momento della richiesta. Uno scheletro della stessa forma del frammento evita che la pagina salti quando arriva.',
      ),
      demo(`card(
  cardHeader({ title: 'Commenti' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Movimento'),
      p(
        'Il luccichio si ferma per chi ha chiesto al proprio sistema di ridurre il movimento — se ne occupa il foglio di stile, senza alcuna prop da impostare.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'La forma del segnaposto.'],
        ['width', 'string', '', 'Qualunque larghezza CSS.'],
        ['height', 'string', '', 'Qualunque altezza CSS.'],
        ['lines', 'number', '', 'Renderizza questo numero di righe di testo, l’ultima corta.'],
      ]),
    ],
  })
