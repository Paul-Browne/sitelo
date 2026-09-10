import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Typografie',
    description:
      'Eine Typoskala, die ihr Element selbst wählt, damit die Dokumentgliederung der visuellen folgt.',
    activeHref: '/de/ui/typography',
    children: [
      p(
        code('text()'),
        ' rendert ein Stück Text in einer der Größen dieser Bibliothek. Die Variante wählt ein sinnvolles Element — ',
        code("variant: 'h2'"),
        ' rendert ein echtes ',
        code('<h2>'),
        ' —, sodass Überschriften in der Dokumentgliederung landen, ohne dass jemand darüber nachdenken muss.',
      ),

      h2('Varianten'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Überschrift 1'),
  text({ variant: 'h2' }, 'Überschrift 2'),
  text({ variant: 'h3' }, 'Überschrift 3'),
  text({ variant: 'h4' }, 'Überschrift 4'),
  text({ variant: 'h5' }, 'Überschrift 5'),
  text({ variant: 'h6' }, 'Überschrift 6'),
  text({ variant: 'lead' }, 'Lead — eine Stufe über dem Fließtext, für den Satz unter einem Titel.'),
  text({ variant: 'body' }, 'Body — der Standard.'),
  text({ variant: 'small' }, 'Small — Bildunterschriften, die noch Sätze sind.'),
  text({ variant: 'caption' }, 'Caption — das Kleingedruckte.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Überschriften'),
      p(
        code('heading()'),
        ' nimmt eine Gliederungs-',
        code('level'),
        ' und bemisst sich passend dazu. ',
        code('size'),
        ' entkoppelt beides: ein ',
        code('<h1>'),
        ', das wie ein h3 aussieht, bleibt für einen Screenreader ein h1.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Eine Überschrift der Ebene 2, passend bemessen'),
  heading({ level: 2, size: 'h5' }, 'Eine Überschrift der Ebene 2, bemessen wie ein h5'),
)`, { align: 'stretch' }),

      h2('Tonwert'),
      p('Drei Stufen der Betonung, vom vollen Kontrast bis zum leisesten noch lesbaren Grau.'),
      demo(`stack({ gap: 'xs' },
  text('Standard — die Farbe, in der Fließtext gesetzt ist.'),
  text({ tone: 'muted' }, 'Gedämpft — Nebentext, weiterhin bequem lesbar.'),
  text({ tone: 'subtle' }, 'Zurückhaltend — Beschriftungen und Metadaten.'),
)`, { align: 'stretch' }),

      h2('Ausrichtung'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Anfang'),
  text({ align: 'center' }, 'Mitte'),
  text({ align: 'end' }, 'Ende'),
)`, { align: 'stretch' }),

      h2('Kürzen und Zeilen begrenzen'),
      p(
        code('truncate'),
        ' schneidet eine einzelne Zeile mit Auslassungspunkten ab. ',
        code('lines'),
        ' begrenzt stattdessen auf eine Anzahl Zeilen — was eine Kartenzusammenfassung meist will.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Eine einzelne Zeile, die weit über die Breite ihres Containers hinausläuft und mit Auslassungspunkten abgeschnitten wird, statt umzubrechen.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Auf zwei Zeilen begrenzt. Dieser Absatz läuft eine Weile weiter, damit die Begrenzung überhaupt etwas zu schneiden hat, und dann noch ein Stück, über den Punkt hinaus, an dem die dritte Zeile begonnen hätte.'),
  )),
)`, { align: 'stretch' }),

      h2('Inline-Code und Tasten'),
      demo(`text(
  'Führe ', code('sitelo build'), ' aus oder drücke ', kbd('⌘'), ' ', kbd('K'), ' zum Suchen.',
)`, { align: 'stretch' }),
      p(
        'Kinder werden als HTML gerendert — genau das lässt Verschachtelung in dieser Bibliothek überall funktionieren, und ',
        code('code()'),
        ' ist keine Ausnahme. Ein Beispiel mit Tags braucht deshalb die Prop ',
        code('text'),
        ', die sie escaped:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Hallo</em>' }), ' — text: wird gezeigt, wie geschrieben'),
  text(code('<em>Hallo</em>'), ' — Kinder: werden als Markup geparst'),
)`, { align: 'stretch' }),
      p(
        'Beides ist nützlich. ',
        code('text'),
        ' ist für ein Codebeispiel, in dem ein Tag gelesen und nicht gebaut werden soll. Kinder sind für bereits hervorgehobene Ausgabe, bei der das Markup der ',
        code('Punkt'),
        ' ist — ein Ergebnis von Prism oder Shiki geht direkt hinein.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Zusammensetzen'),
      p(
        'Text nimmt Kinder, nicht bloß einen String — Links, Code und Hervorhebungen verschachteln sich darin genauso wie in HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'Seiten sind Funktionen, die ',
  code('HTML'),
  ' zurückgeben. Siehe die Anleitung ',
  link({ href: '/de/docs/pages' }, 'Seiten schreiben'),
  '.',
)`, { align: 'stretch' }),

      h2('Das Element wechseln'),
      p(
        code('as'),
        ' überschreibt das Element, ohne das Aussehen zu ändern — für eine visuelle Überschrift, die nicht in der Gliederung auftauchen darf, oder ein ',
        code('<span>'),
        ' mitten in einer Textzeile.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Sieht aus wie eine Überschrift, ist ein div'),
  text({ variant: 'caption', as: 'p' }, 'Caption-Gestaltung auf einem Absatz'),
)`, { align: 'stretch' }),

      h2('Visuell versteckt'),
      p(
        code('visuallyHidden()'),
        ' hält Inhalt im Accessibility-Baum, aber vom Bildschirm fern — die Beschriftung, die ein Screenreader braucht, dort, wo sehende Leserinnen sie aus dem Zusammenhang nehmen.',
      ),
      demo(`text(
  'Build-Status: ',
  chip({ color: 'success', dot: true }, 'bestanden'),
  visuallyHidden(' — der letzte Build war vor 4 Minuten erfolgreich'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Größe, Gewicht und Standardelement.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Wie viel Kontrast der Text trägt.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Textausrichtung.'],
        ['truncate', 'boolean', 'false', 'Eine Zeile, mit Auslassungspunkten abgeschnitten.'],
        ['lines', 'number', '', 'Auf so viele Zeilen begrenzen.'],
        ['as', 'string', '', 'Überschreibt das Element, das die Variante wählen würde.'],
      ]),
      p(
        code('heading()'),
        ' nimmt ',
        code('level'),
        ' (1–6) und ein optionales ',
        code('size'),
        '; alles andere ist gleich.',
      ),
    ],
  })
