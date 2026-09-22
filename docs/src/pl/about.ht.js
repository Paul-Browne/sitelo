import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/pl.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'O projekcie',
    description:
      'Dlaczego istnieje sitelo — od javascript-to-html przez vite-plugin-html-pages po kompletny zestaw narzędzi do stron statycznych.',
    activeHref: '/pl/about',
    children: [
      p(
        'sitelo nie zaczęło się jako framework. Zaczęło się od swędzenia, żeby pisać znaczniki w sposób, który w JavaScripcie wydaje się naturalny — i rosło, aż objęło całą drogę od pliku strony do opublikowanej witryny.',
      ),
      h2('javascript-to-html'),
      p(
        'Najpierw powstało ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (znane też jako ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): prosty i intuicyjny sposób generowania HTML-a w JavaScripcie, bez skomplikowanych silników szablonów i bez frameworków.',
      ),
      p(
        'Skoro frameworki z pełnym wyposażeniem, jak React, stały się wszechobecne, znalezienie prostego rozwiązania do szablonów, które nie ciągnie za sobą całego świata, okazało się zaskakująco trudne. Skupiając się wyłącznie na przekształcaniu JavaScriptu w HTML — w gruncie rzeczy na funkcjach zwracających ciągi znaków — ht.js pozostaje lekkie, łatwe w użyciu, elastyczne i rozszerzalne.',
      ),
      p(
        'Ta niewielka powierzchnia sprawia, że pasuje w wielu miejscach: bezpośrednio na froncie (w stylu SPA), w buildzie do tworzenia stron statycznych (SSG), a nawet do renderowania po stronie serwera (SSR).',
      ),
      h2('Nauczyć Vite wypuszczania HTML-a'),
      p(
        'To rozwiązywało pisanie. Kolejnym problemem był build: Vite traktuje ',
        code('.js'),
        ' i ',
        code('.ts'),
        ' jak skrypty, nie jak strony. Potrzebna była konwencja, w której pewne moduły są ',
        em('przeznaczone'),
        ' do stania się HTML-em.',
      ),
      p(
        'Pomysł był prosty: pliki nazwane ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ' i podobnie powinny być przetwarzane na HTML, zamiast trafiać do paczki jako JavaScript dla przeglądarki. Ta konwencja stała się ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — routing oparty na plikach, wczytywanie danych, zasoby i generowanie statyczne na bazie Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo zamyka Vite i tę wtyczkę w jednej instalacji i jednym CLI. Dostajesz całościowe, pierwszorzędne doświadczenie programisty: ',
        code('sitelo'),
        ' dla serwera na żywo, ',
        code('sitelo build'),
        ' dla produkcji, rozsądne ustawienia domyślne i model stron z wtyczki — bez składania łańcucha narzędzi samodzielnie.',
      ),
      p(
        'Ta sama myśl aż do samego dołu: strony to moduły zwracające HTML. sitelo jest warstwą, która sprawia, że ta myśl wydaje się dokończona.',
      ),
      h2('Jak wypada na tle innych'),
      p(
        'Dobrych narzędzi do publikowania stron statycznych jest już sporo. Nisza sitelo jest wąska z premedytacją: funkcje JavaScriptu (albo TypeScriptu) zwracające HTML, z doświadczeniem pracy Vite i z możliwie najmniejszą ilością frameworka.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Narzędzie'), th('Model'), th('Sięgnij po nie, gdy'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Funkcje JS/TS → HTML na Vite',
              'Chcesz HTML-a z JavaScriptu przy prawdziwym przepływie pracy Vite — bez frameworka komponentowego',
            ),
            comparisonRow(
              'Astro',
              'Komponenty + wyspy, własny kompilator',
              'Strony treściowe, które chcą wysp komponentowych i większego ekosystemu',
            ),
            comparisonRow(
              'Next.js',
              'Pełna aplikacja React (SSR / SSG / ISR)',
              'Budujesz aplikację w ekosystemie Reacta',
            ),
            comparisonRow(
              'Hugo',
              'Szablony Go, bardzo szybkie buildy',
              'Ogromne serwisy treściowe, a Ty dobrze czujesz się w narzędziach Go',
            ),
            comparisonRow(
              'Eleventy',
              'Języki szablonów → HTML',
              'Chcesz elastycznych szablonów (Nunjucks, Liquid, …) bez frameworka SPA',
            ),
          ),
        ),
      ),
      p(
        'Jeśli chcesz komponentów, hydratacji i frameworka — użyj frameworka. Jeśli chcesz plików HTML z funkcji JavaScriptu przy doświadczeniu Vite, sitelo jest najmniejszym narzędziem, które robi całą robotę.',
      ),
      p(
        a({ href: '/pl/docs' }, 'Przeczytaj dokumentację'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
