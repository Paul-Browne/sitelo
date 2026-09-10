import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Skeleton',
    description:
      'Ein Platzhalter in der Form des Inhalts, der noch nicht da ist.',
    activeHref: '/de/ui/skeleton',
    children: [
      p(
        'Ein Skeleton steht für Inhalt ein, während er lädt. Auf einer statischen Website ist das seltener als in einer App — das HTML ist ja schon da —, aber es ist meist genau das, was der ',
        code('fallback'),
        ' einer Island sein sollte, und das, was ein clientseitig gerenderter Bereich zeigt, bevor seine Daten eintreffen.',
      ),
      p(
        'Skeletons sind Dekoration: jedes ist ',
        code('aria-hidden'),
        ', damit einem Screenreader keine Liste leerer Kästchen vorgelesen wird.',
      ),

      h2('Formen'),
      demo(`stack({ gap: 'md' },
  skeleton({ height: '2.5rem' }),
  skeleton({ variant: 'text', width: '70%' }),
  skeleton({ variant: 'circle', width: '3rem', height: '3rem' }),
)`, { align: 'stretch' }),

      h2('Text'),
      p(
        code('lines'),
        ' rendert einen Absatz voll, mit kurzer letzter Zeile, damit es sich wie Fließtext liest und nicht wie ein Block.',
      ),
      demo(`stack({ gap: 'lg' },
  skeleton({ lines: 2 }),
  skeleton({ lines: 4 }),
)`, { align: 'stretch' }),

      h2('In der Form des Echten'),
      p(
        'Ein Skeleton überzeugt am meisten, wenn es dem Layout entspricht, das es ersetzt — dieselbe Karte, dieselben Zeilen, dieselben Größen.',
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
          text({ variant: 'caption', tone: 'muted' }, '3 Commits gepusht'),
        ),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Als Island-Fallback'),
      p(
        'Eine Server-Island liefert ihren Fallback im statischen HTML mit und tauscht zur Anfragezeit das gerenderte Fragment ein. Ein Skeleton in derselben Form wie das Fragment verhindert, dass die Seite bei dessen Ankunft springt.',
      ),
      demo(`card(
  cardHeader({ title: 'Kommentare' }),
  cardBody(
    stack({ gap: 'md' },
      skeleton({ lines: 2 }),
      divider({ spacing: 'xs' }),
      skeleton({ lines: 2 }),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Bewegung'),
      p(
        'Das Schimmern hört für alle auf, die ihrem System gesagt haben, Bewegung zu reduzieren — das erledigt das Stylesheet, ohne dass eine Prop zu setzen wäre.',
      ),

      h2('Props'),
      propsTable([
        ['variant', "'rect' | 'text' | 'circle'", "'rect'", 'Die Form des Platzhalters.'],
        ['width', 'string', '', 'Jede CSS-Breite.'],
        ['height', 'string', '', 'Jede CSS-Höhe.'],
        ['lines', 'number', '', 'So viele Textzeilen rendern, die letzte kurz.'],
      ]),
    ],
  })
