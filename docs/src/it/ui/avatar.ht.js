import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/it.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Una persona o una cosa dentro un cerchio — un’immagine quando c’è, le iniziali quando non c’è.',
    activeHref: '/it/ui/avatar',
    children: [
      p(
        'Dai a un avatar un ',
        code('name'),
        ' e nessun ',
        code('src'),
        ' e renderizzerà le iniziali invece di un’immagine rotta. È il ripiego utile per un elenco di contributori in cui solo alcuni hanno una foto.',
      ),

      h2('Avatar di base'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Con un’immagine'),
      p(
        'Quando ',
        code('src'),
        ' è impostato, ',
        code('alt'),
        ' ripiega sul nome — così un avatar non è mai un’immagine senza etichetta.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Dimensioni'),
      p(
        'La dimensione del carattere scala con l’avatar, così le iniziali restano proporzionate.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Piccolo Uno', size: 'sm' }),
  avatar({ name: 'Medio Uno', size: 'md' }),
  avatar({ name: 'Grande Uno', size: 'lg' }),
)`),

      h2('Quadrato'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Progetto A', square: true }),
  avatar({ name: 'Progetto B', square: true, color: 'success' }),
)`),

      h2('Colori'),
      p(
        'Un avatar senza immagine prende uno sfondo dalla palette soft.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Icone e altri contenuti'),
      p('I figli scavalcano le iniziali, per un’icona o un singolo carattere.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Gruppi'),
      p(
        code('avatarGroup()'),
        ' sovrappone i propri figli e comprime in un conteggio tutto ciò che supera ',
        code('max'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  avatarGroup(
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
  ),
  avatarGroup({ max: 3 },
    avatar({ name: 'Ada Lovelace' }),
    avatar({ name: 'Grace Hopper' }),
    avatar({ name: 'Alan Turing' }),
    avatar({ name: 'Katherine Johnson' }),
    avatar({ name: 'Barbara Liskov' }),
    avatar({ name: 'Margaret Hamilton' }),
  ),
  avatarGroup({ max: 2, size: 'sm' },
    avatar({ name: 'Ada Lovelace', size: 'sm' }),
    avatar({ name: 'Grace Hopper', size: 'sm' }),
    avatar({ name: 'Alan Turing', size: 'sm' }),
  ),
)`, { align: 'start' }),

      h2('In un elenco'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: 'Ha pubblicato 3 commit su main',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Ha aperto una pull request',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Usato per le iniziali, il title e il ripiego dell’alt dell’immagine.'],
        ['src', 'string', '', 'Immagine da mostrare al posto delle iniziali.'],
        ['alt', 'string', '', 'Testo alternativo dell’immagine; ripiega su name.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Diametro, e dimensione del carattere delle iniziali.'],
        ['square', 'boolean', 'false', 'Rettangolo arrotondato invece di un cerchio.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Palette per lo sfondo delle iniziali.'],
      ]),
      p(
        code('avatarGroup()'),
        ' accetta ',
        code('max'),
        ' — quanti mostrarne prima di comprimere il resto in un conteggio — e ',
        code('size'),
        ', usata soltanto per quel conteggio.',
      ),
    ],
  })
