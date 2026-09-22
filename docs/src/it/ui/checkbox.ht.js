import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Casella di controllo',
    description:
      'Una casella di controllo e la sua etichetta come un unico controllo — un input vero, stilizzato con il CSS invece che sostituito.',
    activeHref: '/it/ui/checkbox',
    children: [
      p(
        code('checkbox()'),
        ' renderizza una ',
        code('<label>'),
        ' che avvolge un vero ',
        code('<input type="checkbox">'),
        ' e la casella che vedi. L’input è nascosto visivamente ma c’è ancora, quindi riceve il focus, viene inviato, e tutta l’etichetta è un bersaglio cliccabile — il segno di spunta è disegnato a partire dallo stato ',
        code(':checked'),
        ' dell’input stesso, senza che entri in gioco alcuno script.',
      ),

      h2('Casella di base'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Mandami gli aggiornamenti via email', name: 'updates' }),
  checkbox({ label: 'Spuntata', name: 'checked', checked: true }),
)`),

      h2('Colori'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  checkbox({ label: 'Primary', checked: true, color: 'primary' }),
  checkbox({ label: 'Neutral', checked: true, color: 'neutral' }),
  checkbox({ label: 'Success', checked: true, color: 'success' }),
  checkbox({ label: 'Warning', checked: true, color: 'warning' }),
  checkbox({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Disattivata'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  checkbox({ label: 'Non disponibile', disabled: true }),
  checkbox({ label: 'Spuntata, e bloccata', checked: true, disabled: true }),
)`),

      h2('Etichette lunghe'),
      p(
        'La casella resta allineata alla prima riga invece di centrarsi rispetto a un paragrafo.',
      ),
      demo(`checkbox({
  label: 'Esegui un audit Lighthouse dopo ogni build, e fai fallire la build quando un punteggio scende sotto la sua soglia.',
  name: 'lighthouse',
  checked: true,
})`, { align: 'stretch' }),

      h2('Gruppi'),
      p(
        code('choiceGroup()'),
        ' costruisce dai dati un insieme di caselle, con legenda e nome condivisi. Passa un array come ',
        code('value'),
        ' per spuntarne diverse.',
      ),
      demo(`choiceGroup({
  legend: 'Genera',
  name: 'generate',
  type: 'checkbox',
  value: ['sitemap', 'rss'],
  options: [
    { value: 'sitemap', label: 'sitemap.xml' },
    { value: 'rss', label: 'rss.xml' },
    { value: 'pagefind', label: 'Indice Pagefind' },
  ],
  help: 'Ciascuno viene scritto in dist/ alla fine della build.',
})`, { align: 'stretch' }),

      h2('In riga'),
      demo(`choiceGroup({
  legend: 'Categorie',
  name: 'categories',
  type: 'checkbox',
  direction: 'row',
  value: ['performance'],
  options: ['performance', 'accessibility', 'seo'],
})`, { align: 'stretch' }),

      h2('Con un campo'),
      p(
        'Una singola casella raramente ha bisogno anche di un’etichetta sopra. Quando ne ha bisogno un gruppo, ',
        code('field()'),
        ' gli dà lo stesso trattamento di etichetta, aiuto ed errore di un campo di testo.',
      ),
      demo(`field({ label: 'Condizioni', error: 'Devi accettare le condizioni per proseguire.' },
  checkbox({ label: 'Accetto le condizioni', name: 'terms', color: 'danger' }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Testo accanto alla casella. Omettilo per un controllo nudo.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore quando è spuntata.'],
        ['checked', 'boolean', 'false', 'Se parte spuntata.'],
        ['name', 'string', '', 'Nome del campo del form.'],
        ['value', 'string | number', '', 'Valore inviato quando è spuntata.'],
        ['disabled', 'boolean', 'false', 'Disattiva l’input e attenua l’etichetta.'],
      ]),
      p(
        'Tutto il resto finisce sull’',
        code('<input>'),
        ', non sull’etichetta — quindi ',
        code('required'),
        ', ',
        code('onchange'),
        ' e ',
        code('data-*'),
        ' vanno dove ti aspetteresti. Usa ',
        code('class'),
        ' per dare stile all’etichetta stessa.',
      ),
      p(
        'Per un insieme costruito dai dati, vedi ',
        code('choiceGroup()'),
        ' nella pagina ',
        code('Gruppo di radio'),
        ' — accetta le stesse opzioni in entrambi i casi, commutate da ',
        code("type: 'checkbox'"),
        '.',
      ),
    ],
  })
