import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Interruttore',
    description:
      'Un acceso/spento per un’impostazione che ha effetto subito — sotto è una casella di controllo, con role="switch".',
    activeHref: '/it/ui/switch',
    children: [
      p(
        'Un interruttore è per un’impostazione che si applica appena viene mossa. Una casella di controllo è per una scelta che confermi dopo, con un pulsante di invio. Se il tuo controllo sta in un form con un Salva in fondo, è una casella di controllo.',
      ),
      p(
        'Il componente si chiama ',
        code('toggle()'),
        ' invece di ',
        code('switch()'),
        ' per un motivo noioso ma inevitabile: ',
        code('switch'),
        ' è una parola riservata, quindi non può essere un binding di import. Sotto è un vero ',
        code('<input type="checkbox">'),
        ' che porta ',
        code('role="switch"'),
        '.',
      ),

      h2('Interruttore di base'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Sito pubblico', name: 'public' }),
  toggle({ label: 'Acceso', name: 'on', checked: true }),
)`),

      h2('Colori'),
      demo(`stack({ direction: 'row', gap: 'lg', wrap: true },
  toggle({ label: 'Primary', checked: true, color: 'primary' }),
  toggle({ label: 'Neutral', checked: true, color: 'neutral' }),
  toggle({ label: 'Success', checked: true, color: 'success' }),
  toggle({ label: 'Warning', checked: true, color: 'warning' }),
  toggle({ label: 'Danger', checked: true, color: 'danger' }),
)`),

      h2('Disattivato'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  toggle({ label: 'Spento, e bloccato', disabled: true }),
  toggle({ label: 'Acceso, e bloccato', checked: true, disabled: true }),
)`),

      h2('Senza etichetta'),
      p(
        'Un interruttore senza etichetta visibile ha comunque bisogno di un nome accessibile. Passa ',
        code('aria-label'),
        ' — arriva fino all’input.',
      ),
      demo(`toggle({ 'aria-label': 'Attiva la ricerca Pagefind', checked: true })`),

      h2('Un elenco di impostazioni'),
      p(
        'La forma consueta: l’etichetta a sinistra, l’interruttore a destra, una riga per impostazione.',
      ),
      demo(`return list(
  [
    ['Ricerca Pagefind', 'Indicizza ogni pagina alla fine della build.', true],
    ['Ottimizzazione immagini', 'Ridimensiona e converte le immagini in fase di build. Richiede sharp.', true],
    ['Island server', 'Renderizza le regioni marcate al momento della richiesta.', false],
  ].map(([name, description, on]) =>
    listItem({
      title: name,
      description,
      end: toggle({ 'aria-label': name, checked: on }),
    }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['label', 'Child', '', 'Testo accanto all’interruttore. Usa aria-label quando non ce n’è.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Colore della barra quando è acceso.'],
        ['checked', 'boolean', 'false', 'Se parte acceso.'],
        ['name', 'string', '', 'Nome del campo del form.'],
        ['disabled', 'boolean', 'false', 'Disattiva l’input e attenua la riga.'],
      ]),
      p(
        'Tutto il resto passa all’',
        code('<input>'),
        ', che è dove stanno ',
        code('onchange'),
        ' e ',
        code('aria-*'),
        '.',
      ),
    ],
  })
