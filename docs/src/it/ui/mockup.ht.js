import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Mockup',
    description:
      'Una schermata dentro una cornice — browser, finestra, telefono o terminale.',
    activeHref: '/it/ui/mockup',
    children: [
      p(
        'Serve a mostrare un prodotto su una landing page o una schermata nella documentazione. La cornice è decorazione: i pallini, la barra degli indirizzi e la tacca sono tutti ',
        code('aria-hidden'),
        ', così uno screen reader riceve ciò che c’è dentro e non la descrizione di una cornice.',
      ),

      h2('Browser'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Ciao mondo'),
      text({ variant: 'small', tone: 'muted' }, 'Renderizzato in fase di build, servito come file statico.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Finestra'),
      p(
        'La stessa cornice senza barra degli indirizzi, per tutto ciò che non è una pagina web.',
      ),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Una finestra senza URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Semafori'),
      p(
        'Per impostazione predefinita i pulsanti seguono il tema. ',
        code("dots: 'mac'"),
        ' li dipinge invece del rosso, giallo e verde di macOS — gli stessi tre in entrambi i temi, visto che il loro scopo è essere riconoscibili.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Una finestra che hai già visto.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminale'),
      p(
        'La variante ',
        code('code'),
        ' è scura in entrambi i temi, come è un terminale.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ costruito in 1,09s</div>' +
  '<div style="opacity: .7">  204 pagine · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Telefono'),
      p(
        'Un apparecchio attuale: una Dynamic Island che galleggia staccata dalla cornice, invece di una tacca ritagliata dentro. Lasciale spazio in cima allo schermo.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Siti statici, senza framework.'),
      button({ size: 'sm', block: true }, 'Inizia'),
    ),
  ),
)`),

      h2('Cornice e island'),
      p(
        code('frame'),
        ' tinge il bordo esterno — qualunque colore CSS, così una finitura da dispositivo è un esadecimale invece che un nome di cui questa libreria dovrebbe tenere un elenco. ',
        code('notch: false'),
        ' lascia fuori l’island per tutto ciò che non ne ha.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Con una schermata'),
      p(
        'Un ',
        code('<img>'),
        ' dentro il corpo riempie la larghezza della cornice. Abbinalo ad ',
        code('aspectRatio()'),
        ' se l’immagine si carica tardi e la pagina non deve saltare.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="La galleria di sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Dimensioni'),
      p(
        'Per impostazione predefinita un mockup riempie il proprio contenitore. ',
        code('size'),
        ' lo fissa invece a una larghezza precisa. Il telefono ha le sue tre — 22rem di telefono sarebbero un tablet — e mantiene le proporzioni in tutte: gli angoli, il bordo e l’island sono frazioni della larghezza invece che lunghezze fisse.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'predefinito — piena larghezza'))),
)`, { align: 'stretch' }),

      h2('In un hero'),
      p(
        'L’abbinamento per cui questo esiste: passa un mockup come ',
        code('media'),
        ' di un hero.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Guardalo in funzione',
  description: 'HTML statico nel momento in cui raggiunge il browser.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Una pagina, incorniciata.'),
    ),
  ),
}, button('Inizia'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Quale cornice disegnare.'],
        ['url', 'string', '', 'Mostrato nella barra degli indirizzi. Solo per la variante browser.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Che aspetto hanno i tre pulsanti.'],
        ['frame', 'string', '', 'Tinge il bordo esterno. Qualunque colore CSS. Solo telefono.'],
        ['notch', 'boolean', 'true', 'Disegna la Dynamic Island. Solo telefono.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Larghezza fissa. Medium riempie il contenitore.'],
      ]),
    ],
  })
