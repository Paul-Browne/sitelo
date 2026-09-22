import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Pulsante a due stati',
    description:
      'Un pulsante che resta premuto — un’impostazione mostrata come pulsante invece che come casella di controllo.',
    activeHref: '/it/ui/toggle-button',
    children: [
      p(
        'Un pulsante a due stati è acceso o spento, e lo dice con ',
        code('aria-pressed'),
        '. Il grassetto in un editor di testo, un filtro attivo, un pannello mostrato.',
      ),
      p(
        'Dietro non c’è alcun input nascosto: ',
        code('aria-pressed'),
        ' è tutto lo stato, quindi un pulsante renderizzato dal server mostra un’impostazione e ',
        code('setPressed()'),
        ' è ciò che la cambia. Ricorri a ',
        code('checkbox()'),
        ' quando sta in un form, e a ',
        code('toggle()'),
        ' — l’interruttore — quando è un’impostazione in un elenco.',
      ),

      h2('Pulsante di base'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Grassetto'),
  toggleButton('Corsivo'),
  toggleButton('Sottolineato'),
)`),

      h2('Varianti'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline acceso'),
    toggleButton({ variant: 'outline' }, 'Outline spento'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost acceso'),
    toggleButton({ variant: 'ghost' }, 'Ghost spento'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft acceso'),
    toggleButton({ variant: 'soft' }, 'Soft spento'),
  ),
)`, { align: 'start' }),

      h2('Dimensioni'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Piccolo'),
  toggleButton({ size: 'md', pressed: true }, 'Medio'),
  toggleButton({ size: 'lg', pressed: true }, 'Grande'),
)`),

      h2('Con icone'),
      p(
        'Un pulsante a due stati con la sola icona ha bisogno di un nome accessibile — passa ',
        code('aria-label'),
        ', che arriva fino al pulsante.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Grassetto',
    title: 'Grassetto',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Corsivo',
    title: 'Corsivo',
    startIcon: icon('italic'),
  }),
)`),

      h2('Disattivato'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Acceso, bloccato'),
  toggleButton({ disabled: true }, 'Spento, bloccato'),
)`),

      h2('Fargli fare qualcosa'),
      p(
        'Una sola chiamata gira l’attributo; lo stile la segue. Dentro un ',
        code('toggleGroup()'),
        ' a scelta singola lascia andare anche i fratelli.',
      ),
      codeBlock('Ovunque', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Grassetto')`, 'javascript'),
      p('Oppure dal tuo modulo, quando ne hai già uno in esecuzione:'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Imposta aria-pressed. setPressed() lo cambia dopo.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Che aspetto ha il pulsante non premuto.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Stessa scala di button().'],
        ['disabled', 'boolean', 'false', 'Disattiva il pulsante.'],
      ]),
      p(
        'Tutto il resto passa a ',
        code('button()'),
        ' — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' e via dicendo. Per un insieme di questi, vedi ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
