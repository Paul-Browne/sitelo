import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/de.js'

export default () =>
  uiLayout({
    title: 'Mockup',
    description:
      'Ein Screenshot in einem Rahmen — Browser, Fenster, Telefon oder Terminal.',
    activeHref: '/de/ui/mockup',
    children: [
      p(
        'Um ein Produkt auf einer Landing-Page oder einen Screenshot in der Dokumentation zu zeigen. Der Rahmen ist Dekoration: die Punkte, die Adressleiste und die Kerbe sind alle ',
        code('aria-hidden'),
        ', ein Screenreader bekommt also den Inhalt und keine Beschreibung des Beiwerks.',
      ),

      h2('Browser'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Hallo Welt'),
      text({ variant: 'small', tone: 'muted' }, 'Zur Build-Zeit gerendert, als statische Datei ausgeliefert.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Fenster'),
      p('Derselbe Rahmen ohne Adressleiste, für alles, was keine Webseite ist.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Ein Fenster ohne URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Ampelknöpfe'),
      p(
        'Die Knöpfe folgen standardmäßig dem Theme. ',
        code("dots: 'mac'"),
        ' malt sie stattdessen im macOS-Rot, -Gelb und -Grün — in beiden Themes dieselben drei, denn ihr Sinn ist, wiedererkennbar zu sein.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Ein Fenster, das du schon kennst.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'Die Variante ',
        code('code'),
        ' ist in beiden Themes dunkel, so wie ein Terminal es ist.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ gebaut in 1,09 s</div>' +
  '<div style="opacity: .7">  204 Seiten · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Telefon'),
      p(
        'Ein aktuelles Gerät: eine Dynamic Island, die frei von der Blende schwebt, statt einer hineingeschnittenen Kerbe. Lass ihr oben auf dem Bildschirm Platz.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Statische Seiten, ohne Framework.'),
      button({ size: 'sm', block: true }, 'Loslegen'),
    ),
  ),
)`),

      h2('Rahmen und Island'),
      p(
        code('frame'),
        ' tönt die äußere Schiene — jede CSS-Farbe, damit ein Geräte-Finish ein Hex-Wert ist und kein Name, über den diese Bibliothek Buch führen müsste. ',
        code('notch: false'),
        ' lässt die Island weg, für alles, was keine hat.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Mit einem Screenshot'),
      p(
        'Ein ',
        code('<img>'),
        ' im Körper füllt die Breite des Rahmens. Kombiniere es mit ',
        code('aspectRatio()'),
        ', wenn das Bild spät lädt und die Seite nicht springen soll.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="Die sitelo-UI-Galerie" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Größen'),
      p(
        'Ein Mockup füllt standardmäßig seinen Container. ',
        code('size'),
        ' heftet es stattdessen an eine feste Breite. Das Telefon hat seine eigenen drei — 22rem Telefon wäre ein Tablet — und behält bei allen seine Proportionen: Ecken, Schiene und Island sind Bruchteile der Breite statt fester Längen.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'Standard — volle Breite'))),
)`, { align: 'stretch' }),

      h2('In einem Hero'),
      p(
        'Die Paarung, für die es das gibt: übergib ein Mockup als ',
        code('media'),
        ' eines Heros.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Sieh es laufen',
  description: 'Statisches HTML, sobald es den Browser erreicht.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Eine Seite, gerahmt.'),
    ),
  ),
}, button('Loslegen'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Welcher Rahmen gezeichnet wird.'],
        ['url', 'string', '', 'Erscheint in der Adressleiste. Nur bei der Browser-Variante.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Wie die drei Knöpfe aussehen.'],
        ['frame', 'string', '', 'Tönt die äußere Schiene. Jede CSS-Farbe. Nur beim Telefon.'],
        ['notch', 'boolean', 'true', 'Die Dynamic Island zeichnen. Nur beim Telefon.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Feste Breite. Mittel füllt den Container.'],
      ]),
    ],
  })
