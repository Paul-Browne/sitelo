import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Neumorfizm',
    description:
      'Soft UI: każdy komponent wypukły nad stroną albo wciśnięty w nią, samym światłem i cieniem.',
    activeHref: '/pl/ui/theming/neumorphism',
    extraHead: [presetPreviewHead('neumorphism')],
    children: [
      p(
        code('neumorphism'),
        ' to soft UI: każda powierzchnia jest samą stroną, a kontrolka wyróżnia się wyłącznie światłem i cieniem — wypukła nad stroną albo wciśnięta w nią. Zachowuje dwie rzeczy, z których ten styl zwykle rezygnuje, tekst spełniający WCAG AA i obrys fokusu, i podąża za trybem ciemnym jak cała reszta. Wymaga za to, żeby tłem samej strony było ',
        code('var(--su-bg)'),
        ', bo cały efekt opiera się na tym, że oba mają ten sam kolor.',
      ),
      presetPreview('neumorphism'),

      h2('Użycie'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      codeBlock('src/styles.css', `body {
  background: var(--su-bg);
}`, 'css'),

      h2('Własne kolory'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork. Ten dodaje do każdej palety dziesiąte miejsce, ',
        code('glow'),
        ' — kolor, w który przechodzi koniec paska postępu albo przełącznika — żeby nowy kolor główny mógł przynieść własny.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
    ],
  })
