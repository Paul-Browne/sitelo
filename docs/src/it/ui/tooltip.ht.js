import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Tooltip',
    description:
      'Un breve suggerimento al passaggio del mouse e al focus, disegnato interamente in CSS.',
    activeHref: '/it/ui/tooltip',
    children: [
      p(
        'Il testo del tooltip vive in un attributo data ed è disegnato da uno pseudo-elemento, quindi non c’è alcuno script, niente da posizionare a runtime e niente che resti nel DOM. Compare al passaggio del mouse e al focus da tastiera, di cui si occupa la metà ',
        code(':focus-within'),
        ' della regola.',
      ),

      h2('Tooltip di base'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'Copia negli appunti' },
    iconButton({
      label: 'Copia',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Ricostruisci il sito' },
    button({ variant: 'outline', color: 'neutral' }, 'Ricostruisci'),
  ),
)`),

      h2('Posizionamento'),
      p(
        'Sopra per impostazione predefinita, sotto quando sopra non c’è spazio.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Sopra l’elemento' },
    button({ variant: 'soft', color: 'neutral' }, 'Sopra'),
  ),
  tooltip({ content: 'Sotto l’elemento', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Sotto'),
  ),
)`),

      h2('Nomi accessibili'),
      p(
        'Il testo del tooltip è decorazione — viene disegnato dalla proprietà CSS ',
        code('content'),
        ', che gli screen reader non annunciano in modo affidabile. Il controllo al suo interno ha comunque bisogno di un proprio nome accessibile, che è quello che fornisce la ',
        code('label'),
        ' di ',
        code('iconButton()'),
        '. Quando il tooltip dice qualcosa che il nome del controllo non dice, passa ',
        code('label: true'),
        ' per ripeterlo in uno span nascosto visivamente.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Pubblica subito in produzione', label: true },
    button({ color: 'danger' }, 'Pubblica'),
  ),
)`),

      h2('Sul testo'),
      p(
        'Un tooltip avvolge il contenuto inline con la stessa facilità con cui avvolge un pulsante.',
      ),
      demo(`text(
  'La build scrive in ',
  tooltip({ content: 'Configurabile con outDir' }, code('dist/')),
  ' e in nient’altro.',
)`, { align: 'stretch' }),

      h2('Quando non usarne uno'),
      p(
        'I tooltip non compaiono al tocco, e spariscono nel momento in cui il puntatore se ne va. Tutto ciò che chi legge deve assolutamente avere — un messaggio di errore, la spiegazione di un campo obbligatorio — va nel testo di ',
        code('help'),
        ' del campo stesso, non in un tooltip.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'Il testo del suggerimento.'],
        ['placement', "'top' | 'bottom'", "'top'", 'Su quale lato dell’elemento compare.'],
        ['label', 'boolean', 'false', 'Esponi il testo anche agli screen reader, in uno span nascosto.'],
      ]),
    ],
  })
