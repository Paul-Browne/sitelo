import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Hinweis',
    description:
      'Eine Meldung über den Zustand von etwas — Icon und Ankündigungsrolle richten sich nach der Farbe.',
    activeHref: '/de/ui/alert',
    children: [
      p(
        'Ein Hinweis sagt der Leserin etwas über die Seite oder über eine gerade ausgeführte Aktion. Die Farbe wählt Icon und ARIA-Rolle gemeinsam: ',
        code('danger'),
        ' und ',
        code('warning'),
        ' melden sich als ',
        code('role="alert"'),
        ', alles Ruhigere ist ein höfliches ',
        code('role="status"'),
        '.',
      ),

      h2('Farben'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', title: 'Übrigens' }, 'Eine neue Version von sitelo ist verfügbar.'),
  alert({ color: 'success', title: 'Deployt' }, '169 Seiten in 1,7 Sekunden veröffentlicht.'),
  alert({ color: 'warning', title: 'Langsame Seite' }, 'Eine Seite brauchte über 500 ms zum Rendern.'),
  alert({ color: 'danger', title: 'Build fehlgeschlagen' }, 'Zwei interne Links zeigen auf Seiten, die es nicht gibt.'),
  alert({ color: 'neutral', title: 'Hinweis' }, 'Islands sind in diesem Projekt deaktiviert.'),
)`, { align: 'stretch' }),

      h2('Ohne Titel'),
      p('Ein einzeiliger Hinweis braucht keine Überschrift über dem Satz.'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'success' }, 'Gespeichert.'),
  alert({ color: 'danger' }, 'Diese E-Mail-Adresse wird bereits verwendet.'),
)`, { align: 'stretch' }),

      h2('Varianten'),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'warning', variant: 'soft', title: 'Soft' }, 'Der Standard — eine getönte Fläche.'),
  alert({ color: 'warning', variant: 'outline', title: 'Outline' }, 'Transparent, mit farbigem Rahmen.'),
  alert({ color: 'warning', variant: 'solid', title: 'Solid' }, 'Die volle Palettenfarbe, für alles, was nicht übersehen werden darf.'),
)`, { align: 'stretch' }),

      h2('Icons'),
      p(
        'Jede Farbe hat ein Standard-Icon. Übergib eigenes Markup als ',
        code('icon'),
        ', oder ',
        code('icon: false'),
        ' für keines.',
      ),
      demo(`stack({ gap: 'sm' },
  alert({ color: 'primary', icon: false, title: 'Ohne Icon' }, 'Nur der Text.'),
  alert({
    color: 'primary',
    title: 'Ein eigenes Icon',
    icon: icon('star'),
  }, 'Jedes SVG funktioniert — Icons sind Markup, keine Abhängigkeit.'),
)`, { align: 'stretch' }),

      h2('Schließbar'),
      p('Der Schließen-Button bringt seinen eigenen Handler mit:'),
      codeBlock(
        'Erzeugtes Markup',
        `onclick="import('/su/alert.js').then(m=>m.dismiss(this))"`,
        'html',
      ),
      p(
        'Der Hinweis unten schließt sich also wirklich, ohne dass auf dieser Seite irgendetwas importiert wird. Kommt dieses Modul nie an, wird der Button gezeichnet und tut nichts — deshalb sollte ein Hinweis nie der einzige Ort sein, an dem eine Meldung erscheint.',
      ),
      demo(`alert({ color: 'primary', title: 'Schließbar', dismissible: true },
  'Klick auf das × — der Handler holt sich selbst beim ersten Klick.',
)`, { align: 'stretch' }),

      h2('Reicher Inhalt'),
      p('Hinweise nehmen beliebige Kinder auf, also kann eine Aktion oder eine Liste darin wohnen.'),
      demo(`alert({ color: 'danger', title: 'Linkprüfung fehlgeschlagen' },
  stack({ gap: 'sm' },
    text({ variant: 'small' }, 'Zwei Links zeigen auf Seiten, die nicht erzeugt wurden:'),
    list({ plain: true },
      listItem({ title: '/docs/old-routing', description: 'verlinkt von /docs' }),
      listItem({ title: '/blog/draft', description: 'verlinkt von /blog' }),
    ),
    stack({ direction: 'row', gap: 'sm' },
      button({ size: 'sm', color: 'danger' }, 'Details zeigen'),
      button({ size: 'sm', variant: 'ghost', color: 'danger' }, 'Ignorieren'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Wählt Palette, Standard-Icon und ARIA-Rolle.'],
        ['variant', "'soft' | 'outline' | 'solid'", "'soft'", 'Wie viel Gewicht der Hinweis trägt.'],
        ['title', 'Child', '', 'Fette erste Zeile.'],
        ['icon', 'Child | false', '', 'Eigenes Icon-Markup, oder false für keines.'],
        ['dismissible', 'boolean', 'false', 'Fügt einen Schließen-Button hinzu, der seinen Handler selbst importiert.'],
        ['dismissLabel', 'string', "'Dismiss'", 'Zugänglicher Name dieses Buttons.'],
      ]),
    ],
  })
