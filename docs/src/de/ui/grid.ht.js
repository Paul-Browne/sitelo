import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Grid',
    description:
      'Ein reagierendes Raster, das so viele Spalten einpasst, wie hineinpassen — ohne Breakpoints, ohne Media Queries.',
    activeHref: '/de/ui/grid',
    children: [
      p(
        'Ohne ',
        code('columns'),
        ' passt ein Grid so viele Spuren von mindestens ',
        code('min'),
        ' ein, wie der Platz erlaubt, und jede teilt sich den Rest gleichmäßig. Genau das will eine Kartenliste, und es braucht keine Breakpoints: ändere die Größe dieser Seite, und die Demos unten ordnen sich von selbst neu.',
      ),

      h2('Auto-Fit'),
      p('Der Standard. Spuren sind mindestens 16rem breit.'),
      demo(`grid(
  ...['Routing', 'Daten laden', 'Assets', 'Bilder', 'Islands', 'Suche'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Spurbreite'),
      p(
        code('min'),
        ' legt fest, wie schmal eine Spur werden darf, bevor das Raster auf weniger Spalten geht. Kleiner heißt mehr Spalten.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Eine feste Spaltenzahl'),
      p(
        'Übergib eine Zahl, wenn die Anzahl sich nicht mit dem Viewport ändern soll. Jede Spur bekommt einen gleichen Anteil.',
      ),
      demo(`grid({ columns: 3 },
  ...['Eins', 'Zwei', 'Drei'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Eine eigene Vorlage'),
      p(
        'Ein String wird unverändert als ',
        code('grid-template-columns'),
        ' durchgereicht — für eine Aufteilung aus Seitenleiste und Inhalt oder alles andere, was CSS Grid ausdrücken kann.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Seitenleiste'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Inhalt, der den Rest der Reihe nimmt.'))),
)`, { align: 'stretch' }),

      h2('Abstand und Ausrichtung'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Kurz'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Eine höhere Karte mit zwei Textzeilen, um zu zeigen, was align mit ihren kürzeren Nachbarn macht.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Kurz'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'Eine feste Spurenzahl oder ein roher grid-template-columns-Wert. Weglassen für Auto-Fit.'],
        ['min', 'string', "'16rem'", 'Mindestbreite einer Spur beim Auto-Fit.'],
        ['gap', 'Space', "'md'", 'Abstand zwischen Spuren und Zeilen.'],
        ['align', 'string', "'stretch'", 'Jeder align-items-Wert.'],
        ['as', 'string', "'div'", 'Element, das gerendert wird.'],
      ]),
      p(
        'Eine Spur wird nie breiter als das Raster selbst, auch wenn ',
        code('min'),
        ' größer ist als der verfügbare Platz — ein Minimum von 16rem erzeugt auf einem 320px-Telefon also keine horizontale Scrollleiste.',
      ),
    ],
  })
