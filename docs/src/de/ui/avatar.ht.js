import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'
import { uiHead } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Avatar',
    description:
      'Eine Person oder eine Sache im Kreis — ein Bild, wenn es eines gibt, sonst die Initialen.',
    activeHref: '/de/ui/avatar',
    extraHead: uiHead(),
    children: [
      p(
        'Gib einem Avatar einen ',
        code('name'),
        ' und kein ',
        code('src'),
        ', und er zeigt die Initialen statt eines kaputten Bildes. Das ist der nützliche Rückfall für eine Mitwirkendenliste, in der nur manche ein Foto haben.',
      ),

      h2('Einfacher Avatar'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Ada Lovelace' }),
  avatar({ name: 'Grace Hopper' }),
  avatar({ name: 'Alan Turing' }),
)`),

      h2('Mit Bild'),
      p(
        'Ist ',
        code('src'),
        ' gesetzt, fällt ',
        code('alt'),
        ' auf den Namen zurück — ein Avatar ist also nie ein unbeschriftetes Bild.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ src: '/logo.svg', alt: 'sitelo', style: 'background: var(--su-surface-2)' }),
  avatar({ src: '/logo.svg', name: 'sitelo', square: true, style: 'background: var(--su-surface-2)' }),
)`),

      h2('Größen'),
      p('Die Schriftgröße skaliert mit dem Avatar, damit die Initialen im Verhältnis bleiben.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Klein Eins', size: 'sm' }),
  avatar({ name: 'Mittel Eins', size: 'md' }),
  avatar({ name: 'Groß Eins', size: 'lg' }),
)`),

      h2('Quadratisch'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ name: 'Projekt A', square: true }),
  avatar({ name: 'Projekt B', square: true, color: 'success' }),
)`),

      h2('Farben'),
      p('Ein Avatar ohne Bild bekommt einen weichen Hintergrund aus der Palette.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  avatar({ name: 'Primary', color: 'primary' }),
  avatar({ name: 'Neutral', color: 'neutral' }),
  avatar({ name: 'Success', color: 'success' }),
  avatar({ name: 'Warning', color: 'warning' }),
  avatar({ name: 'Danger', color: 'danger' }),
)`),

      h2('Icons und anderer Inhalt'),
      p('Kinder überschreiben die Initialen — für ein Icon oder ein einzelnes Zeichen.'),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  avatar({ color: 'neutral' },
    icon('user'),
  ),
  avatar({ color: 'primary' }, '?'),
)`),

      h2('Gruppen'),
      p(
        code('avatarGroup()'),
        ' überlappt seine Kinder und klappt alles jenseits von ',
        code('max'),
        ' zu einer Zahl zusammen.',
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

      h2('In einer Liste'),
      demo(`list(
  listItem({
    start: avatar({ name: 'Ada Lovelace', size: 'sm' }),
    title: 'Ada Lovelace',
    description: '3 Commits nach main gepusht',
  }),
  listItem({
    start: avatar({ name: 'Grace Hopper', size: 'sm', color: 'success' }),
    title: 'Grace Hopper',
    description: 'Hat einen Pull Request eröffnet',
  }),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Wird für die Initialen, das title und als Alt-Rückfall des Bildes genutzt.'],
        ['src', 'string', '', 'Bild, das statt der Initialen erscheint.'],
        ['alt', 'string', '', 'Alt-Text des Bildes; fällt auf name zurück.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Durchmesser und Schriftgröße der Initialen.'],
        ['square', 'boolean', 'false', 'Abgerundetes Rechteck statt Kreis.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", '', 'Palette für den Hintergrund der Initialen.'],
      ]),
      p(
        code('avatarGroup()'),
        ' nimmt ',
        code('max'),
        ' — wie viele gezeigt werden, bevor der Rest zu einer Zahl zusammenklappt — und ',
        code('size'),
        ', das nur für diese Zahl gilt.',
      ),
    ],
  })
