import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Tooltip',
    description:
      'Ein kurzer Hinweis beim Überfahren und beim Fokus, vollständig in CSS gezeichnet.',
    activeHref: '/de/ui/tooltip',
    children: [
      p(
        'Der Tooltip-Text steckt in einem data-Attribut und wird von einem Pseudoelement gezeichnet — kein Skript, nichts, das zur Laufzeit positioniert werden müsste, und nichts, das im DOM zurückbleibt. Er erscheint beim Überfahren und beim Tastaturfokus, worum sich die ',
        code(':focus-within'),
        '-Hälfte der Regel kümmert.',
      ),

      h2('Einfacher Tooltip'),
      demo(`stack({ direction: 'row', gap: 'md' },
  tooltip({ content: 'In die Zwischenablage kopieren' },
    iconButton({
      label: 'Kopieren',
      variant: 'soft',
      color: 'neutral',
      icon: icon('copy'),
    }),
  ),
  tooltip({ content: 'Website neu bauen' },
    button({ variant: 'outline', color: 'neutral' }, 'Neu bauen'),
  ),
)`),

      h2('Platzierung'),
      p('Standardmäßig oberhalb, unterhalb, wenn oben kein Platz ist.'),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Über dem Auslöser' },
    button({ variant: 'soft', color: 'neutral' }, 'Oben'),
  ),
  tooltip({ content: 'Unter dem Auslöser', placement: 'bottom' },
    button({ variant: 'soft', color: 'neutral' }, 'Unten'),
  ),
)`),

      h2('Zugängliche Namen'),
      p(
        'Der Tooltip-Text ist Dekoration — er wird aus CSS-',
        code('content'),
        ' gezeichnet, was Screenreader nicht verlässlich ansagen. Das Steuerelement darin braucht weiterhin seinen eigenen zugänglichen Namen, und genau den liefert das ',
        code('label'),
        ' von ',
        code('iconButton()'),
        '. Sagt der Tooltip etwas, das der Name des Steuerelements nicht sagt, übergib ',
        code('label: true'),
        ', um es in einem visuell versteckten span zu wiederholen.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg' },
  tooltip({ content: 'Deployt sofort in die Produktion', label: true },
    button({ color: 'danger' }, 'Deployen'),
  ),
)`),

      h2('Auf Text'),
      p('Ein Tooltip umschließt Inline-Inhalt genauso bereitwillig wie einen Button.'),
      demo(`text(
  'Der Build schreibt nach ',
  tooltip({ content: 'Mit outDir konfigurierbar' }, code('dist/')),
  ' und sonst nirgendwohin.',
)`, { align: 'stretch' }),

      h2('Wann keiner'),
      p(
        'Tooltips erscheinen beim Tippen auf Touch gar nicht und verschwinden, sobald der Zeiger weggeht. Alles, was eine Leserin unbedingt braucht — eine Fehlermeldung, die Erklärung eines Pflichtfelds — gehört in den ',
        code('help'),
        '-Text am Feld selbst, nicht in einen Tooltip.',
      ),

      h2('Props'),
      propsTable([
        ['content', 'string', '', 'Der Hinweistext.'],
        ['placement', "'top' | 'bottom'", "'top'", 'Auf welcher Seite des Auslösers er erscheint.'],
        ['label', 'boolean', 'false', 'Den Text zusätzlich in einem versteckten span für Screenreader ausgeben.'],
      ]),
    ],
  })
