import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, presetPreview, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Motywy',
    description:
      'Jak wprowadzić arkusz stylów na stronę i zmienić każdy kolor, promień i krój jednym wywołaniem.',
    activeHref: '/pl/ui/theming',
    children: [
      p(
        'Każdy komponent czyta te same właściwości własne, więc motyw to zestaw nadpisań na ',
        code(':root'),
        ' — bez kroku budowania, bez pliku konfiguracyjnego i bez komponentu, któremu trzeba by o tym powiedzieć.',
      ),

      h2('Wprowadzenie stylów'),
      p(
        code('styles()'),
        ' zwraca ',
        code('<link>'),
        ' do jednego pliku, który przeglądarka buforuje na wszystkich stronach witryny. Nie ma czego konfigurować ani kopiować: wtyczka sitelo serwuje go w dev i zapisuje do buildu, pod tą samą bazą co runtime komponentów.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles(),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">`, 'javascript'),
      p(
        'Nazwa niesie skrót treści, więc możesz serwować go jako ',
        code('immutable'),
        ' i wciąż wypuścić zmianę. Podaj ',
        code('{ hash: false }'),
        ' dla zwykłego ',
        code('/su/ui.css'),
        ' albo ',
        code('base'),
        ', żeby skierować odnośnik na kopię, którą hostujesz sam.',
      ),
      p(
        code('{ inline: true }'),
        ' wkłada zamiast tego cały arkusz w ',
        code('<style>'),
        ' — około 11 kB po gzipie na każdej stronie, ale bez dodatkowego żądania i bez niczego, co mogłoby zginąć z ',
        code('dist/'),
        '. To lepszy kompromis dla pojedynczej strony; odnośnik odrabia swoje żądanie na drugiej stronie, którą odwiedzający przeczyta.',
      ),
      codeBlock('src/index.ht.js', `head(
  title('Moja strona'),
  styles({ inline: true }),
)`, 'javascript'),
      p(
        'Reszta rodziny podaje Ci części. ',
        code('stylesheet()'),
        ' zwraca surowy CSS jako ciąg znaków — do hostowania arkusza tam, gdzie sitelo nie sięgnie, albo do zapisania go gdzieś samodzielnie — a ',
        code('stylesUrl()'),
        ' sam adres, do własnego elementu link.',
      ),

      h2('Presety'),
      p(
        'Preset zmienia cały wygląd za jednym razem. ',
        code("styles({ preset: 'neumorphism' })"),
        ' dołącza drugi arkusz zaraz po głównym — serwowany, hashowany i buforowany na tych samych zasadach — a każdy komponent na stronie za nim podąża, bez żadnej zmiany w znacznikach.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      presetPreview('neumorphism'),
      p(
        code('neumorphism'),
        ' to soft UI: każda powierzchnia jest samą stroną, a kontrolka wyróżnia się wyłącznie światłem i cieniem — wypukła nad stroną albo wciśnięta w nią. Zachowuje dwie rzeczy, z których ten styl zwykle rezygnuje, tekst spełniający WCAG AA i obrys fokusu, i podąża za trybem ciemnym jak cała reszta. Wymaga za to, żeby tłem samej strony było ',
        code('var(--su-bg)'),
        ', bo cały efekt opiera się na tym, że oba mają ten sam kolor.',
      ),
      p(
        code('glassmorphism'),
        ' to szkło matowe: każda powierzchnia jest półprzezroczystą taflą, która rozmywa to, co za nią, ze światłem na krawędzi. Szkło jest szkłem tylko nad czymś, więc ten preset wymaga, żeby tłem strony było ',
        code('var(--su-glass-ground)'),
        ' — kolor strony z trzema plamami koloru przypiętymi za nim. Tekst jest mierzony względem najjaśniejszego koloru, nad którym może leżeć tafla, wszystko, co unosi się nad tekstem strony, jest zmatowione niemal do nieprzezroczystości, a kto prosi o mniej przezroczystości, dostaje te same tafle na nieruchomym tle.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-glass-ground);
}`, 'css'),
      presetPreview('glassmorphism'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork. Oba dodają do każdej palety dziesiąte miejsce, ',
        code('glow'),
        ' — kolor, w który przechodzi koniec paska postępu albo przełącznika — żeby nowy kolor główny mógł przynieść własny.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
      p(
        code('inline'),
        ' wstawia oba arkusze inline, ',
        code('stylesheet({ preset })'),
        ' zwraca je jako jeden ciąg, a nazwa, która nie jest presetem, rzuca błąd z listą tych, które istnieją.',
      ),

      h2('Nadpisywanie tokenów'),
      p(
        code('theme()'),
        ' zapisuje nadpisania. Klucze to nazwy tokenów w camelCase, obiekty palet albo dosłowne właściwości własne — i idzie ',
        code('po'),
        ' ',
        code('styles()'),
        ', więc wygrywa.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Motywy ograniczone zakresem'),
      p(
        code('selector'),
        ' ogranicza nadpisania do poddrzewa zamiast do całej strony. Robią tak trzy panele poniżej — te same komponenty, trzy różne palety, jedna strona.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'indygo'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'różowy'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'zaokrąglony'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Tryb ciemny'),
      p(
        'Ciemny rozstrzyga się sam z ',
        code('prefers-color-scheme'),
        '. Jawny ',
        code('data-theme'),
        ' albo ',
        code('data-su-theme'),
        ' o wartości ',
        code('light'),
        ' lub ',
        code('dark'),
        ' na dowolnym przodku to nadpisuje — i tak właśnie dema na tej witrynie idą za przełącznikiem w górnym pasku.',
      ),
      p(
        'Podaj ',
        code('dark'),
        ' dla nadpisań, które mają działać tylko tam. Obejmuje naraz atrybut i zapytanie medialne.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Co da się nadpisać'),
      p(
        'Pięć palet po dziewięć miejsc każda, skala odstępów, krój, promienie, cienie i kolory powierzchni. Każde z nich jest właściwością własną — otwórz arkusz stylów albo inspektora przeglądarki, a wszystkie są na ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Nazewnictwo'),
      p(
        'Klucz w camelCase staje się właściwością w kebab-case: ',
        code('radiusMd'),
        ' to ',
        code('--su-radius-md'),
        ', a ',
        code('fontSans'),
        ' to ',
        code('--su-font-sans'),
        '. Zagnieżdżony obiekt rozwija się tak samo — ',
        code('{ primary: { softFg: … } }'),
        ' ustawia ',
        code('--su-primary-soft-fg'),
        ' — a klucz zaczynający się już od ',
        code('--'),
        ' używany jest dokładnie tak, jak go zapisano, co jest wyjściem awaryjnym na wszystko, czego odwzorowanie nie obejmuje.',
      ),
      p(
        'Paleta ma dziewięć miejsc: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ' i ',
        code('ring'),
        '. Ustaw tylko te, które zmieniasz.',
      ),

      h2('Kontrast'),
      p(
        'Dołączone palety spełniają WCAG AA względem powierzchni, na których siedzą, w obu motywach, a w repozytorium jest test, który przerywa build, gdy przestanie to być prawdą. Twój własny motyw nie jest nim objęty — sprawdź swoje ',
        code('fg'),
        ' względem swojego ',
        code('base'),
        ', zanim go opublikujesz.',
      ),

      h2('Propsy'),
      p(code('styles()'), ':'),
      propsTable([
        ['preset', "'glassmorphism' | 'neumorphism'", '', 'Zmienia wygląd każdego komponentu presetem, dołączonym albo wstawionym po głównym arkuszu.'],
        ['inline', 'boolean', 'false', 'Wypuść sam CSS zamiast odnośnika do niego.'],
        ['hash', 'boolean', 'true', 'Wstaw skrót treści w nazwę pliku. Tylko postać z odnośnikiem.'],
        ['base', 'string', "'/su/'", 'Skieruj adres gdzie indziej; tamtą kopię hostujesz Ty. Tylko postać z odnośnikiem.'],
        ['minify', 'boolean', 'true', 'Usuń komentarze i białe znaki. Tylko postać wbudowana.'],
        ['nonce', 'string', '', 'Nonce CSP dla wypuszczonego elementu.'],
      ]),
      p(
        code('stylesUrl()'),
        ' przyjmuje ',
        code('base'),
        ' i ',
        code('hash'),
        '; ',
        code('stylesheet()'),
        ' przyjmuje ',
        code('minify'),
        ' i ',
        code('preset'),
        '.',
      ),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Ogranicza nadpisania do poddrzewa.'],
        ['dark', 'object', '', 'Nadpisania stosowane tylko w trybie ciemnym.'],
        ['nonce', 'string', '', 'Nonce CSP.'],
      ]),
    ],
  })
