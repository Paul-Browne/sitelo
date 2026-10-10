import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Rysunek techniczny',
    description:
      'Rysunek techniczny: cienkie linie, ostre narożniki i znaczniki pasowania, etykiety wersalikami o stałej szerokości oraz tusz z jednym kreślarskim błękitem.',
    activeHref: '/pl/ui/theming/blueprint',
    extraHead: [presetPreviewHead('blueprint')],
    children: [
      p(
        code('blueprint'),
        ' to rysunek techniczny: cienkie linie na prawie czarnym arkuszu, ostre narożniki i znacznik pasowania — mały krzyżyk — na każdym rogu karty, okna dialogowego i rzędu statystyk. Wszystko, co coś nazywa albo czymś steruje — przycisk, etykieta pola, karta, tag, nagłówek kolumny, link na pasku — jest złożone krojem o stałej szerokości, rozstrzelonymi wersalikami, a nagłówki i tekst ciągły zostają w kroju groteskowym, złożonym ciasno. Linia ciągła to krawędź, a przerywana dzieli to, co w środku, tak jak rysunek oznacza krawędź niewidoczną: wiersze tabeli, separator, odcinek do kroku, który dopiero nadejdzie. Kolorów jest niewiele. Pełny przycisk, zaznaczone pole wyboru, wypełniony pasek i wszystko, co wybrane, to tusz, drukowany w negatywie; jeden kreślarski błękit oznacza fokus i etykietę nad nagłówkiem; sukces, ostrzeżenie i zagrożenie zachowują swoje barwy dla tego, co mówią. Nic nie rzuca cienia. Tryb ciemny to pierwotny wygląd; jasny zachowuje każdą linię i każdy znacznik i drukuje je tuszem na białym papierze.',
      ),
      presetPreview('blueprint'),

      h2('Użycie'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'blueprint' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/blueprint-4d1f8a20.css">`, 'javascript'),
      p(
        'Pomaluj stronę ',
        code('var(--su-bp-backdrop)'),
        ', a dostaniesz tło presetu z delikatną siatką wykreśloną na wierzchu, albo po prostu ',
        code('var(--su-bg)'),
        '. Preset używa Geist albo Inter oraz Geist Mono, JetBrains Mono albo IBM Plex Mono, jeśli strona je wczytuje, a w przeciwnym razie krojów systemowych; sam niczego nie pobiera.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bp-backdrop);
  color: var(--su-text);
  font-family: var(--su-font-sans);
}`, 'css'),

      h2('Własne kolory'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork. Paleta główna to tusz — pełny przycisk, zaznaczone pole wyboru, wypełniony pasek, wszystko, co wybrane — więc ',
        code('primary'),
        ' przemalowuje to wszystko naraz. Pozostałe tokeny należą do samego presetu: ',
        code('--su-bp-accent'),
        ', błękit, którym rysowany jest fokus i oznaczany nagłówek; ',
        code('--su-bp-mark'),
        ', znaczniki pasowania, które ',
        code('transparent'),
        ' usuwa; ',
        code('--su-bp-field'),
        ', linia wokół pola; ',
        code('--su-bp-track'),
        ', rynna, w której biegnie pasek postępu; ',
        code('--su-bp-grid'),
        ' i ',
        code('--su-bp-cell'),
        ', linie tła i rozmiar jego kratek; oraz ',
        code('--su-bp-tracking'),
        ', odstęp między wersalikami etykiety. Tutaj błękit zmienia się w sygnałowy pomarańcz, a znaczniki razem z nim.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'blueprint' }),
  theme(
    { bpAccent: '#c2410c', bpMark: '#c2410c' },
    { dark: { bpAccent: '#ff7a3d', bpMark: '#ff7a3d' } },
  ),
)`, 'javascript'),
    ],
  })
