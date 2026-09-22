import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Ilustracja',
    description:
      'Obraz i jego podpis jako jedna ilustracja — z miejscem trzymanym, zanim obraz dotrze.',
    activeHref: '/pl/ui/figure',
    children: [
      p(
        code('<figure>'),
        ' wiąże podpis z tym, co opisuje, czego akapit pod obrazem nie robi. Podaj ',
        code('src'),
        ' dla typowego przypadku albo dzieci dla czegokolwiek innego, co warto podpisać.',
      ),

      h2('Podstawowa ilustracja'),
      demo(`figure({
  src: '/logo.svg',
  alt: 'Znak słowny sitelo',
  caption: 'Znak słowny, tak jak wygląda w górnym pasku.',
  style: '--su-figure-bg: var(--su-surface-2)',
})`, { align: 'stretch' }),

      h2('Z utrzymanymi proporcjami'),
      p(
        code('ratio'),
        ' opakowuje obraz w ',
        code('aspectRatio()'),
        ', więc podpis nigdy nie zeskakuje w dół strony, gdy obraz się załaduje.',
      ),
      demo(`grid({ min: '13rem' },
  figure({ src: '/logo.svg', alt: '', ratio: '16 / 9', caption: 'ratio: 16 / 9' }),
  figure({ src: '/logo.svg', alt: '', ratio: '1 / 1', caption: 'ratio: 1 / 1' }),
)`, { align: 'stretch' }),

      h2('Podpisywanie czegoś innego'),
      p('Bez ', code('src'), ' treścią ilustracji są dzieci.'),
      demo(`figure({ caption: 'Tabela 1 — wynik domyślnego buildu.' },
  table({
    dense: true,
    columns: [{ key: 'file', header: 'Plik' }, { key: 'size', header: 'Rozmiar', align: 'end' }],
    rows: [
      { file: 'index.html', size: '4,1 kB' },
      { file: '404.html', size: '860 B' },
      { file: 'sitemap.xml', size: '155 B' },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Kod z podpisem'),
      p(
        'Zwróć uwagę na props ',
        code('text'),
        ' w ',
        code('code()'),
        ': w tej bibliotece dzieci renderują się wszędzie jako HTML, więc próbka zawierająca znaczniki wymaga ucieczki, inaczej przeglądarka ją zbuduje zamiast pokazać.',
      ),
      demo(`figure({ caption: 'Cała strona sitelo.' },
  code({ text: 'export default () => "<h1>Cześć</h1>"' }),
)`, { align: 'stretch' }),

      h2('Tekst alternatywny'),
      p(
        'Atrybut ',
        code('alt'),
        ' jest zapisywany zawsze, pusty, jeśli nic nie podasz — obraz zupełnie bez ',
        code('alt'),
        ' jest odczytywany nazwą pliku, co jest gorsze niż cisza. Podpis go nie zastępuje: podpis czytają wszyscy, a alt opisuje obraz temu, kto go nie widzi.',
      ),
      p(
        'Gdy podpis mówi już wszystko to, co obraz, ',
        code("alt: ''"),
        ' jest właściwą odpowiedzią.',
      ),

      h2('W prozie'),
      p(
        'Ilustracje wychodzące z renderera Markdowna są już ostylowane przez ',
        code('prose()'),
        '. Ten komponent jest do ilustracji, które budujesz sam.',
      ),

      h2('Propsy'),
      propsTable([
        ['src', 'string', '', 'Źródło obrazu. Pomiń i użyj dzieci.'],
        ['alt', 'string', "''", 'Tekst alternatywny. Zapisywany zawsze, nawet pusty.'],
        ['caption', 'Child', '', 'Element figcaption.'],
        ['ratio', 'string', '', 'Trzyma miejsce, zanim obraz się załaduje.'],
      ]),
    ],
  })
