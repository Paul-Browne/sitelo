import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Lista wyboru',
    description:
      'Natywny select, ostylowany pod resztę pól, z opcjami budowanymi z danych.',
    activeHref: '/pl/ui/select',
    children: [
      p(
        'To prawdziwy ',
        code('<select>'),
        ' z własną listą rozwijaną przeglądarki — co oznacza, że działa bez JavaScriptu, otwiera się poprawnie na telefonie i da się go obsłużyć klawiaturą bez niczego z tej biblioteki.',
      ),
      p(
        code('select()'),
        ' to goła kontrolka; ',
        code('selectField()'),
        ' opakowuje ją w etykietę, tekst pomocy i komunikat błędu, tak samo jak robi to ',
        code('textField()'),
        '.',
      ),

      h2('Podstawowa lista'),
      p(
        'Opcje mogą być zwykłymi ciągami znaków — wtedy wartość i etykieta są takie same.',
      ),
      demo(`selectField({
  label: 'Motyw',
  name: 'theme',
  options: ['Jasny', 'Ciemny', 'Systemowy'],
})`, { align: 'stretch' }),

      h2('Wartości i etykiety'),
      p(
        'Podaj obiekty, gdy wysyłana wartość różni się od tekstu, który czyta człowiek. ',
        code('value'),
        ' oznacza wybraną opcję.',
      ),
      demo(`selectField({
  label: 'Wyjście',
  name: 'output',
  value: 'dist',
  options: [
    { value: 'dist', label: 'dist/ — domyślne' },
    { value: 'build', label: 'build/' },
    { value: 'public', label: 'public/', disabled: true },
  ],
})`, { align: 'stretch' }),

      h2('Tekst zastępczy'),
      p(
        'Tekst zastępczy renderuje się jako wyłączona pierwsza opcja, zaznaczona, gdy nie ma ',
        code('value'),
        ' — więc pole startuje puste, nie będąc przy tym poprawnym wyborem.',
      ),
      demo(`selectField({
  label: 'Cel wdrożenia',
  name: 'target',
  placeholder: 'Wybierz hosting…',
  options: ['Netlify', 'Vercel', 'Cloudflare Pages', 'GitHub Pages'],
})`, { align: 'stretch' }),

      h2('Grupy'),
      p(
        'Wpis z własną tablicą ',
        code('options'),
        ' staje się elementem ',
        code('<optgroup>'),
        '.',
      ),
      demo(`selectField({
  label: 'Rozszerzenie strony',
  name: 'ext',
  value: '.ht.js',
  options: [
    { label: 'JavaScript', options: ['.ht.js', '.html.js'] },
    { label: 'TypeScript', options: ['.ht.ts', '.html.ts'] },
    { label: 'JSX', options: ['.ht.jsx', '.ht.tsx'] },
  ],
})`, { align: 'stretch' }),

      h2('Rozmiary'),
      demo(`stack({ gap: 'md' },
  selectField({ label: 'Mały', name: 'sm', size: 'sm', options: ['Jeden', 'Dwa'] }),
  selectField({ label: 'Średni', name: 'md', size: 'md', options: ['Jeden', 'Dwa'] }),
  selectField({ label: 'Duży', name: 'lg', size: 'lg', options: ['Jeden', 'Dwa'] }),
)`, { align: 'stretch' }),

      h2('Pomoc, błąd i wyłączenie'),
      demo(`stack({ gap: 'lg' },
  selectField({
    label: 'Język',
    name: 'locale',
    options: ['pl', 'es', 'fr'],
    help: 'Używany w atrybucie lang elementu html.',
  }),
  selectField({
    label: 'Framework',
    name: 'framework',
    placeholder: 'Wybierz jeden…',
    options: ['sitelo'],
    error: 'Wybierz framework, żeby przejść dalej.',
  }),
  selectField({
    label: 'Plan',
    name: 'plan',
    options: ['Darmowy'],
    disabled: true,
  }),
)`, { align: 'stretch' }),

      h2('Z danych'),
      p(
        'Opcje to po prostu tablica, więc zwykle pochodzą z tego, co ',
        code('data()'),
        ' już wczytało dla strony.',
      ),
      demo(`return (() => {
  const posts = [
    { slug: 'hello-world', title: 'Witaj świecie' },
    { slug: 'static-first', title: 'Najpierw statyczne' },
    { slug: 'no-runtime', title: 'Bez runtime’u' },
  ]

  return selectField({
    label: 'Wyróżniony wpis',
    name: 'featured',
    value: 'static-first',
    options: posts.map((post) => ({ value: post.slug, label: post.title })),
  })
})()`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['options', 'SelectOption[]', '[]', 'Ciągi znaków, obiekty { value, label, disabled } albo { label, options } dla grupy.'],
        ['value', 'string | number', '', 'Która opcja jest wybrana.'],
        ['placeholder', 'string', '', 'Wyłączona pierwsza opcja, zaznaczona, gdy nie ma wartości.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Wysokość kontrolki i rozmiar tekstu.'],
        ['name', 'string', '', 'Nazwa pola formularza; z niej wyprowadzany jest id.'],
        ['invalid', 'boolean', 'false', 'Ustawia aria-invalid. selectField ustawia to za Ciebie na podstawie error.'],
        ['disabled', 'boolean', 'false', 'Wyłącza kontrolkę.'],
      ]),
      p(
        code('selectField()'),
        ' przyjmuje dodatkowo ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', ',
        code('required'),
        ' i ',
        code('fieldClass'),
        ' — zobacz ',
        code('textField()'),
        '. Dzieci dołączane są po wygenerowanych opcjach, więc możesz dopisać ręcznie te, których potrzebujesz.',
      ),
    ],
  })
