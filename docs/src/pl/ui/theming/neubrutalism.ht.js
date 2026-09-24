import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Neobrutalizm',
    description:
      'Płaskie kolory, grube linie tuszu i twarde cienie: każdy komponent obrysowany i wciskany we własny cień.',
    activeHref: '/pl/ui/theming/neubrutalism',
    extraHead: [presetPreviewHead('neubrutalism')],
    children: [
      p(
        code('neubrutalism'),
        ' to płaski kolor i gruby tusz: każda powierzchnia ma obrys, a wszystko, co odstaje od strony, rzuca twardy cień bez rozmycia. Naciśnięcie wciska kontrolkę we własny cień, a włączony przełącznik tam zostaje. Miękkie wypełnienia to żywe pastele z ciemnym tekstem, pełne pozostają na tyle ciemne, by udźwignąć białą etykietę, a w trybie ciemnym tusz staje się kremowy, bo czarnego cienia nie byłoby widać na ciemnej stronie.',
      ),
      presetPreview('neubrutalism'),

      h2('Użycie'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'neubrutalism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neubrutalism-3f1a9c42.css">`, 'javascript'),
      p(
        'Pomaluj też stronę kolorem ',
        code('var(--su-bg)'),
        ', a przejmie kremowe tło presetu, na którym odcinają się białe powierzchnie.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Własne kolory'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork. Ten dodaje dwa własne tokeny: ',
        code('--su-nb-ink'),
        ' — kolor, którym rysowana jest każda linia i każdy cień, oraz ',
        code('--su-nb-lift'),
        ' — jak daleko wypukła kontrolka odstaje od strony, a więc o ile przesuwa ją naciśnięcie.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neubrutalism' }),
  theme({
    primary: { base: '#c2185b', hover: '#a8144e', active: '#8e1042', soft: '#ffb3d0', softFg: '#5c0a2a' },
    '--su-nb-lift': '6px',
  }),
)`, 'javascript'),
    ],
  })
