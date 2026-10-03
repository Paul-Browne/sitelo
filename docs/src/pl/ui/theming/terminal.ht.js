import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Terminal',
    description:
      'Konsola systemowa: jeden krój o stałej szerokości na czerni, panele z cienkich linii, etykiety pogrubionymi wersalikami i cyjanowy akcent, a zaznaczenie w negatywie.',
    activeHref: '/pl/ui/theming/terminal',
    extraHead: [presetPreviewHead('terminal')],
    children: [
      p(
        code('terminal'),
        ' to konsola systemowa: jeden krój o stałej szerokości na czarnym tle, panele z cienkich linii z nagłówkiem odkreślonym linią i każda etykieta — przycisk, etykieta pola, zakładka, nagłówek kolumny — wersalikami, zwykle pogrubionymi. Cyjan jest akcentem: duże nagłówki, tytuły paneli, pełny przycisk i fokus. Zaznaczenie — wiersz tabeli pod kursorem, wciśnięty segment, wybrana zakładka typu pigułka, numer bieżącej strony, pozycja menu pod kursorem — jest drukowane w negatywie, ciemno na cyjanie, tak jak terminal podświetla wiersz. Palety sukcesu, ostrzeżenia i zagrożenia to jego kolory stanu, zielony, żółty i czerwony, a przycisk konturowy lub tag rysuje się w swoim kolorze — i linię, i tekst. Nic nie jest zaokrąglone poza przyciskiem opcji i nic nie rzuca cienia. Tryb ciemny to oryginalny wygląd; jasny zachowuje każdą linię, każdy wersalik i każdy prosty narożnik i drukuje je czernią na prawie bieli.',
      ),
      presetPreview('terminal'),

      h2('Użycie'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'terminal' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/terminal-06767808.css">`, 'javascript'),
      p(
        'Złóż w nim także samą stronę — jej tło, kolor tekstu i krój — a komponenty ułożą się na niej jak powyżej. Preset używa JetBrains Mono, IBM Plex Mono albo Source Code Pro, jeśli strona wczytuje któryś z nich, a w przeciwnym razie systemowego kroju o stałej szerokości; sam niczego nie pobiera.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
  color: var(--su-text);
  font-family: var(--su-font-mono);
}`, 'css'),

      h2('Własne kolory'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork — tutaj akcent zmienia się w bursztyn luminoforu, razem z liniami, którymi jest rysowany. Trzy tokeny należą do samego presetu: ',
        code('--su-tm-tracking'),
        ', odstęp między wersalikami etykiety; ',
        code('--su-tm-track'),
        ', rynna, w której biegnie pasek postępu albo suwak; oraz ',
        code('--su-tm-field'),
        ', linia wokół pola, w trybie ciemnym tej samej bladej szarości co panele — podnieś ją, jeśli krawędzie pól mają się wyraźniej odcinać.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'terminal' }),
  theme(
    {
      primary: {
        base: '#8a5200', hover: '#734400', active: '#5c3600',
        soft: '#f6e6cc', softHover: '#efd9b3', softFg: '#4d2e00',
        border: '#c9a066', ring: 'rgba(138, 82, 0, 0.3)',
      },
    },
    {
      dark: {
        primary: {
          base: '#ffb000', hover: '#ffd480', active: '#e69e00',
          soft: '#33260d', softHover: '#45330f', softFg: '#ffd480',
          border: '#d99600', ring: 'rgba(255, 176, 0, 0.4)',
        },
      },
    },
  ),
)`, 'javascript'),
    ],
  })
