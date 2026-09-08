import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Karte',
    description:
      'Eine Fläche für gruppierten Inhalt, mit Kopf, Körper, Fuß und Medien, die miteinander umgehen können.',
    activeHref: '/de/ui/card',
    extraHead: uiHead(),
    children: [
      p(
        'Eine Karte gruppiert zusammengehörigen Inhalt auf einer eigenen Fläche. Die Teile — ',
        code('cardHeader()'),
        ', ',
        code('cardMedia()'),
        ', ',
        code('cardBody()'),
        ', ',
        code('cardFooter()'),
        ' — sind eigene Funktionen statt Props, du nimmst also nur die, die du brauchst, in der Reihenfolge, die das Design will.',
      ),

      h2('Einfache Karte'),
      demo(`card(
  cardHeader({ title: 'Dateibasiertes Routing', subtitle: 'src/about.ht.js → /about' }),
  cardBody(text({ variant: 'small', tone: 'muted' }, 'Ordner werden zu Pfaden. Klammern werden zu Parametern. Es gibt keinen Router zu konfigurieren.')),
)`, { align: 'stretch' }),

      h2('Varianten'),
      p(
        'Outlined ist der Standard. Elevated tauscht den Rahmen gegen einen Schatten, und flat tönt die Fläche statt beidem.',
      ),
      demo(`grid({ min: '13rem' },
  card({ variant: 'outlined' }, cardBody(text({ variant: 'small' }, 'Outlined'))),
  card({ variant: 'elevated' }, cardBody(text({ variant: 'small' }, 'Elevated'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Flat'))),
)`, { align: 'stretch' }),

      h2('Mit Footer'),
      p(
        code('divided'),
        ' setzt die Haarlinie über den Footer. Der Footer wird nach unten gedrückt, sodass Karten in einer Reihe ihre Aktionen auf einer Linie halten, auch wenn der Text darüber unterschiedlich lang ist.',
      ),
      demo(`grid({ min: '14rem' },
  card(
    cardHeader({ title: 'Basis-Website' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Ein minimales Projekt plus Deploy-Konfigurationen.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Öffnen')),
  ),
  card(
    cardHeader({ title: 'Markdown-Blog' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Ein Ordner mit .md-Dateien, gerendert zu statischen Seiten, mit RSS-Feed und ganz ohne Client-JavaScript.')),
    cardFooter({ divided: true }, button({ size: 'sm', variant: 'soft' }, 'Öffnen')),
  ),
)`, { align: 'stretch' }),

      h2('Medien'),
      p(
        code('cardMedia()'),
        ' füllt den oberen Teil der Karte in festem Seitenverhältnis, sodass eine Reihe von Karten gleichmäßig bleibt, was auch immer die Quellbilder messen.',
      ),
      demo(`grid({ min: '13rem' },
  card(
    cardMedia({ src: '/logo.svg', alt: '', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'Standard 16 / 9')),
  ),
  card(
    cardMedia({ src: '/logo.svg', alt: '', ratio: '4 / 3', style: 'background: var(--su-surface-2); object-fit: contain; padding: 1rem' }),
    cardBody(text({ variant: 'small' }, 'ratio: 4 / 3')),
  ),
)`, { align: 'stretch' }),

      h2('Eine ganze Karte als Link'),
      p(
        'Gib der Karte ein ',
        code('href'),
        ', und die ganze Fläche wird zu einem Link, samt dem Anheben beim Überfahren. Setze in dieser Form keine Buttons oder weiteren Links in eine Karte — interaktiver Inhalt darf nicht in einem Link stecken. Nimm stattdessen einen Footer-Button auf einer normalen Karte.',
      ),
      demo(`grid({ min: '14rem' },
  card({ href: '/de/docs/routing' },
    cardHeader({ title: 'Routing', subtitle: 'Zur Anleitung' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'Dynamische Routen, Catch-alls und Routengruppen.')),
  ),
  card({ href: '/de/docs/data' },
    cardHeader({ title: 'Daten laden', subtitle: 'Zur Anleitung' }),
    cardBody(text({ variant: 'small', tone: 'muted' }, 'data() läuft zur Build-Zeit, mit Fetch-Caching.')),
  ),
)`, { align: 'stretch' }),

      h2('Innenabstand'),
      p(
        'Eine Prop setzt den Innenabstand für alle Teile der Karte auf einmal.',
      ),
      demo(`stack({ gap: 'md' },
  card({ padding: 'sm' }, cardBody(text({ variant: 'small' }, 'padding: sm'))),
  card({ padding: 'xl' }, cardBody(text({ variant: 'small' }, 'padding: xl'))),
)`, { align: 'stretch' }),

      h2('Freier Inhalt'),
      p(
        'Die Teile sind eine Bequemlichkeit, keine Pflicht — eine Karte nimmt beliebige Kinder, und ',
        code('cardHeader()'),
        ' nimmt neben dem Titel eigene Kinder auf, für einen Avatar oder einen Menü-Button rechts.',
      ),
      demo(`card(
  cardHeader(
    { title: 'Paul Browne', subtitle: 'Vor 4 Minuten deployt' },
    avatar({ name: 'Paul Browne', size: 'sm' }),
  ),
  cardBody(
    stack({ direction: 'row', gap: 'sm', wrap: true },
      chip({ color: 'success', dot: true }, 'Build erfolgreich'),
      chip({ color: 'neutral' }, '12 Seiten'),
      chip({ color: 'neutral' }, '4,1 kB'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      p(code('card()'), ':'),
      propsTable([
        ['variant', "'outlined' | 'elevated' | 'flat'", "'outlined'", 'Wie sich die Fläche von der Seite abhebt.'],
        ['href', 'string', '', 'Rendert die ganze Karte als Link.'],
        ['padding', 'Space', "'lg'", 'Innenabstand, den jedes Teil der Karte nutzt.'],
      ]),
      p('Die Teile:'),
      propsTable([
        ['cardHeader', 'title, subtitle', '', 'Titel und Untertitel, plus beliebige Kinder daneben.'],
        ['cardTitle', 'as', "'h3'", 'Der Titel für sich, wenn der Kopf von Hand gebaut wird.'],
        ['cardSubtitle', '', '', 'Die gedämpfte Zeile unter einem Titel.'],
        ['cardMedia', 'src, alt, ratio', "'16 / 9'", 'Ein Titelbild in festem Seitenverhältnis.'],
        ['cardBody', '', '', 'Der Hauptinhaltsbereich.'],
        ['cardFooter', 'divided', 'false', 'Untere Aktionsreihe; divided setzt die Haarlinie darüber.'],
      ], { headers: ['Teil', 'Props', 'Standard', 'Beschreibung'] }),
    ],
  })
