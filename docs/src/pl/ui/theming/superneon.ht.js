import { h2, p } from 'javascript-to-html'
import { code, codeBlock, presetPreview, presetPreviewHead, uiLayout } from '../../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Superneon',
    description:
      'Niemal czarny fiolet, włosowate krawędzie i neonowe światło: ciemne przyciski-pigułki ze świecącym obrzeżem i nagłówki oświetlone z góry.',
    activeHref: '/pl/ui/theming/superneon',
    extraHead: [presetPreviewHead('superneon')],
    children: [
      p(
        code('superneon'),
        ' to niemal czarny fiolet z włosowatymi krawędziami i światłem, które płynie od środka. Pełny przycisk to ciemna pigułka, podświetlona wzdłuż wewnętrznych krawędzi i otoczona gradientem, który świeci poza jej obrys; duże nagłówki przechodzą od jasnego do lawendy, a wszystko, co wybrane lub włączone, dostaje poświatę. Blask jest zawsze tylko ozdobą, więc każda etykieta nadal leży na płaskim kolorze spełniającym WCAG AA. Tryb ciemny to oryginalny wygląd; jasny zachowuje ciemne pigułki i blask i kładzie je na bladej, lawendowej stronie.',
      ),
      presetPreview('superneon'),

      h2('Użycie'),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Moja strona'),
  styles({ preset: 'superneon' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/superneon-5b0e7d21.css">`, 'javascript'),
      p(
        'Ustaw tło strony na ',
        code('var(--su-sn-backdrop)'),
        ', by dostać tło presetu z fioletowym światłem padającym z góry, albo po prostu na ',
        code('var(--su-bg)'),
        '. Nagłówki używają Geist, jeśli strona go ładuje, a w przeciwnym razie kroju systemowego — preset niczego nie pobiera.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-sn-backdrop);
}`, 'css'),

      h2('Własne kolory'),
      p(
        code('theme()'),
        ' dalej działa na wierzchu, więc preset to punkt wyjścia, a nie fork. Ten daje każdej palecie dwa dodatkowe miejsca, ',
        code('glow'),
        ' i ',
        code('glowEnd'),
        ' — dwa końce gradientu, którym rysowane są jej obrzeże i poświata. Na blasku nic się nie czyta, więc mogą być tak jaskrawe, jak chcesz.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'superneon' }),
  theme({
    primary: { glow: '#00e5ff', glowEnd: '#7f6bff' },
  }),
)`, 'javascript'),
    ],
  })
