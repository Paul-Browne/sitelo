import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Makieta',
    description:
      'Zrzut ekranu w ramce — przeglądarka, okno, telefon albo terminal.',
    activeHref: '/pl/ui/mockup',
    children: [
      p(
        'Do pokazania produktu na stronie docelowej albo zrzutu w dokumentacji. Ramka jest ozdobą: kropki, pasek adresu i wycięcie mają ',
        code('aria-hidden'),
        ', więc czytnik ekranu dostaje to, co w środku, a nie opis obudowy.',
      ),

      h2('Przeglądarka'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Witaj świecie'),
      text({ variant: 'small', tone: 'muted' }, 'Wyrenderowane podczas buildu, serwowane jako plik statyczny.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Okno'),
      p('Ta sama ramka bez paska adresu, dla czegoś, co nie jest stroną internetową.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Okno bez adresu URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Światła'),
      p(
        'Domyślnie przyciski idą za motywem. ',
        code("dots: 'mac'"),
        ' maluje je zamiast tego na czerwono, żółto i zielono jak w macOS — te same trzy w obu motywach, bo ich sens polega na rozpoznawalności.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Okno, które już gdzieś widziałeś.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'Wariant ',
        code('code'),
        ' jest ciemny w obu motywach, tak jak terminal.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ zbudowano w 1,09s</div>' +
  '<div style="opacity: .7">  204 strony · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Telefon'),
      p(
        'Współczesny aparat: Dynamic Island unosząca się z dala od ramki, a nie wycięcie w nią wcięte. Zostaw jej miejsce u góry ekranu.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Strony statyczne, bez frameworka.'),
      button({ size: 'sm', block: true }, 'Zacznij'),
    ),
  ),
)`),

      h2('Ramka i wyspa'),
      p(
        code('frame'),
        ' barwi zewnętrzną obwódkę — dowolnym kolorem CSS, więc wykończenie urządzenia to szesnastkowy kod, a nie nazwa, której lista musiałaby być w tej bibliotece. ',
        code('notch: false'),
        ' pomija wyspę dla czegokolwiek, co jej nie ma.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Ze zrzutem ekranu'),
      p(
        code('<img>'),
        ' wewnątrz treści wypełnia szerokość ramki. Połącz go z ',
        code('aspectRatio()'),
        ', jeśli obraz ładuje się późno, a strona nie powinna podskoczyć.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="Galeria sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Rozmiary'),
      p(
        'Domyślnie makieta wypełnia swój kontener. ',
        code('size'),
        ' przypina ją zamiast tego do stałej szerokości. Telefon ma własne trzy — 22rem telefonu byłoby tabletem — i we wszystkich zachowuje proporcje: rogi, obwódka i wyspa są ułamkami szerokości, a nie stałymi długościami.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'domyślnie — pełna szerokość'))),
)`, { align: 'stretch' }),

      h2('W hero'),
      p(
        'Połączenie, dla którego to istnieje: podaj makietę jako ',
        code('media'),
        ' w hero.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Zobacz to w działaniu',
  description: 'Statyczny HTML, zanim dotrze do przeglądarki.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Strona w ramce.'),
    ),
  ),
}, button('Zacznij'))`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Którą ramkę narysować.'],
        ['url', 'string', '', 'Pokazywany w pasku adresu. Tylko wariant browser.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Jak wyglądają trzy przyciski.'],
        ['frame', 'string', '', 'Barwi zewnętrzną obwódkę. Dowolny kolor CSS. Tylko telefon.'],
        ['notch', 'boolean', 'true', 'Rysuje Dynamic Island. Tylko telefon.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Stała szerokość. Średnia wypełnia kontener.'],
      ]),
    ],
  })
