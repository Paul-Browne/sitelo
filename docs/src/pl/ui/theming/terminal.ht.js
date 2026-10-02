import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Jeden krój o stałej szerokości na ciemnogranatowym tle, na wzór Advent of Code: akcje w nawiasach kwadratowych, zielone linki i poświata na tym, co świeci.',
    activeHref: '/pl/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' to jeden krój o stałej szerokości na ciemnogranatowym tle, złożony tak jak Advent of Code: szary tekst, zielone linki, które jaśnieją po najechaniu, biel dla tego, co ważne, i poświata we własnym kolorze na nielicznych świecących elementach. Akcja to słowo w nawiasach kwadratowych, ',
        code('[Zapisz]'),
        '; pole wyboru to ',
        code('[ ]'),
        ', dopóki nie stanie się ',
        code('[X]'),
        ', a nagłówek drugiego poziomu jest odkreślony jako ',
        code('--- Tytuł ---'),
        '. Nic nie jest zaokrąglone i nic nie unosi się na miękkim cieniu: krawędź to linia, a podniesiona karta ma podwójną ramkę. Tryb ciemny to oryginalny wygląd; jasny zachowuje krój, nawiasy i proste narożniki i drukuje je granatem na bladym papierze, bez poświaty.',
      ),
      presetPreview('terminal'),

      h2('Użycie'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-9590922b.css">`, 'javascript'),
      p(
        'Złóż w nim także samą stronę — jej tło, jej szarość i jej krój — a komponenty ułożą się na niej jak powyżej. Preset używa Source Code Pro, jeśli strona go wczytuje, a w przeciwnym razie systemowego kroju o stałej szerokości; sam niczego nie pobiera.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Własne kolory'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork. Poświata jest rysowana kolorem tekstu, na którym leży, więc zmieniona paleta świeci swoim nowym kolorem — tutaj kolor główny staje się bursztynowy, jak w starszym terminalu. Sukces to złoto gwiazdy, tak jak wzór oznacza rozwiązaną zagadkę; jeśli wolisz, nadaj mu zieleń w ten sam sposób. Dwa tokeny należą do samego presetu: ',
        code('--su-tm-bright'),
        ', biel nagłówków i wszystkiego, co wybrane, oraz ',
        code('--su-tm-glow'),
        ', cień świecących elementów, który w trybie jasnym wynosi ',
        code('none'),
        '.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    { primary: { base: '#8a5200', hover: '#734400', active: '#5c3600', soft: '#f6e6cc', softFg: '#4d2e00' } },
    { dark: { primary: { base: '#ffb000', hover: '#ffd480', active: '#e69e00', soft: '#33260d', softFg: '#ffd480' } } },
  ),
)`, 'javascript'),
    ],
  })
