import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

/** Jedna komórka: glif w czytelnym rozmiarze i nazwa do wpisania. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Alfabetycznie, prosto z biblioteki, żeby strona nie mogła zostać w tyle
 * za zestawem, który dokumentuje. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Glify wypełniane przez zamalowanie własnej ścieżki, w odróżnieniu od tych,
 * które niosą drugi rysunek — rozpoznawane po tym, czy obie postaci są tymi
 * samymi znacznikami, żeby żadne z dem nie zostało w tyle za zestawem.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * Demo wypełnienia, wypisane programowo, a nie ręcznie — źródłem jest to, co
 * strona drukuje, więc glif, który staje się wypełnialny, pojawia się tutaj
 * bez tego, żeby ktokolwiek pamiętał o dopisaniu go.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Ikony',
    description:
      'Zestaw 99 glifów na jednej siatce, renderowanych w treści, więc ikona bierze kolor i rozmiar otaczającego tekstu.',
    activeHref: '/pl/ui/icons',
    children: [
      p(
        code('icon()'),
        ' zwraca liniowy ',
        code('<svg>'),
        '. Każdy glif narysowany jest na tej samej siatce 24×24 jako niewypełnione kreski w ',
        code('currentColor'),
        ', więc dziedziczy kolor i rozmiar czcionki tego, w czym siedzi, i nie potrzebuje własnych stylów.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('W komponencie'),
      p(
        'Ikona jest dzieckiem jak każde inne. Ponieważ wymiaruje się w ',
        code('em'),
        ', pasuje do etykiety obok bez informowania jej, jak duża ta etykieta jest:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Pobierz'),
  button({ variant: 'outline' }, icon('external-link'), 'Otwórz'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Usuń'),
  iconButton({ label: 'Szukaj', variant: 'soft', icon: icon('search') }),
)`),

      h2('Rozmiar'),
      p(
        'Domyślnie ',
        code('1em'),
        ' — rozmiar otaczającego tekstu. ',
        code('size'),
        ' przyjmuje token albo dowolną długość CSS, gdy chcesz się od niego oderwać:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Kolor'),
      p(
        'Nie ma propsa koloru. Ikona rysowana jest w ',
        code('currentColor'),
        ', więc bierze kolor swojego kontekstu — i to właśnie sprawia, że jeden zestaw działa w pięciu paletach:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Dostępne nazwy'),
      p(
        'Ikona domyślnie ma ',
        code('aria-hidden'),
        ', co jest słuszne znacznie częściej niż nie: ikona obok słowa „Usuń” nie powinna być zapowiadana po raz drugi. Daj jej ',
        code('label'),
        ' tylko wtedy, gdy to ikona niesie całe znaczenie — wtedy staje się ',
        code('role="img"'),
        ' z tą nazwą.',
      ),
      codeBlock('', `icon('trash')                      // ozdobna — ukryta
button(icon('trash'), 'Usuń')      // to słowo mówi

icon('trash', { label: 'Usuń' })   // zapowiadana jako obraz

// Przycisk z samą ikoną nazywa przycisk, a nie glif w środku
iconButton({ label: 'Usuń', icon: icon('trash') })`, 'javascript'),

      h2('Wypełnione'),
      p(
        code('filled'),
        ' zamalowuje glif, zamiast go obrysowywać. To ta sama ścieżka w obu przypadkach — zmienia się tylko atrybut ',
        code('fill'),
        ' — więc obie postaci dzielą dokładnie tę samą krawędź zewnętrzną i nie mogą się rozjechać.',
      ),
      demo(fillDemo()),
      p('I te same nazwy wypełnione:'),
      demo(fillDemo({ filled: true })),
      p(
        'To props, a nie drugi zestaw nazw, bo stan wypełnienia jest niemal zawsze ',
        code('stanem'),
        ' — zapisane, polubione, ocenione — więc chce wartości logicznej, a nie innego ciągu znaków:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Zapisane' : 'Zapisz' })

// zamiast
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Glify statusu wypełniają się inaczej, bo ich znak siedzi ',
        code('wewnątrz'),
        ' kształtu. Zamalowanie koła połknęłoby ptaszka, więc znak jest z niego zamiast tego wycinany:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Te niosą drugi rysunek — kształt pełny ze znakiem wyciętym przez ',
        code('fill-rule: evenodd'),
        ' — bo wycięcia nie da się uzyskać ze ścieżki obrysu przez zmianę atrybutu. Zewnętrzny kształt rysowany jest na zewnętrznej krawędzi obrysu, więc obie postaci i tak kończą na tej samej sylwetce. Props jest ten sam w obu przypadkach; którego mechanizmu używa glif, to już jego sprawa.',
      ),
      p(
        'Szewron nie ma żadnego wnętrza do zamalowania — to linia otwarta — więc wypełnia się do trójkąta opisanego jego trzema punktami, zachowując kreskę zaokrąglającą rogi:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' wypisuje wszystko, co odpowiada na ',
        code('filled'),
        '. Glif bez postaci wypełnionej ignoruje go i zostaje obrysowany — wypełnienie ',
        code('eye'),
        ' straciłoby źrenicę, a ',
        code('tag'),
        ' swój otwór, więc żaden z nich nie udaje.',
      ),

      h2('Obrót'),
      p(
        code('spin'),
        ' obraca glif — pomyślany dla ',
        code('spinner'),
        ', choć nic nie stoi na przeszkodzie, żeby obracać ',
        code('refresh'),
        ', gdy coś się przeładowuje. Pod ',
        code('prefers-reduced-motion'),
        ' zwalnia do pełzania, zamiast się zatrzymać, bo zatrzymany wskaźnik wygląda na zepsuty.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Zapisywanie…'),
)`),

      h2('Zestaw'),
      p(
        'Nazwy opisują rysunek, a nie zadanie, które wykonuje — ',
        code('x-circle'),
        ', a nie ',
        code('error'),
        ' — bo ten sam rysunek bywa używany do niepowiązanych zadań, a nazwa opisująca obrazek zostaje wtedy prawdziwa. Aliasy poniżej pokrywają typowe intencje.',
      ),
      gallery(),

      h2('Marki'),
      p(
        'Z zestawem przychodzi osiem znaków marek — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ' i ',
        code('youtube'),
        '. Nadal przyjmują ',
        code('size'),
        ' i ',
        code('label'),
        ' i nadal rysują się w ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Udostępnij'),
)`),
      p(
        'To reprodukcje cudzych znaków, a nie rysunki w stylu tej biblioteki, więc celowo łamią dwie jej zasady: są pełnymi kształtami, a nie kreskami, czym logo jest, i mają proporcje marki, a nie tej siatki. ',
        code('filled'),
        ' nic dla nich nie znaczy — już takie są.',
      ),
      p(
        'Rysunki pochodzą z Simple Icons, które udostępnia je na CC0. To obejmuje rysunek, a nie znak towarowy: używaj ich, żeby wskazać rzecz, którą nazywają — odnośnik do profilu, przycisk udostępniania — a nie na własnym produkcie.',
      ),
      p(
        'Jest to ',
        code('x-twitter'),
        ', a nie ',
        code('x'),
        ', bo ',
        code('x'),
        ' jest już aliasem ',
        code('close'),
        ', a przycisk zamykania zmieniający się w logo byłby paskudną niespodzianką. ',
        code('twitter'),
        ' też się na nie rozwiązuje.',
      ),

      h2('Aliasy'),
      p(
        'Każdy z nich renderuje glif wypisany powyżej, pod nazwą, po którą prędzej sięgniesz:',
      ),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Własne ikony'),
      p(
        code('registerIcons()'),
        ' dodaje glif albo zastępuje wbudowany. Znacznikami jest zawartość ',
        code('<svg>'),
        ' — kształty na tej samej siatce 24×24, zostawione niewypełnione, żeby sięgnął do nich ',
        code('currentColor'),
        '. Wywołaj to raz z modułu, który importują Twoje strony:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Nazwa, która już istnieje, zastępuje ją wszędzie — tak przerysowuje
  // się wbudowany glif bez forkowania biblioteki.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Jeden zamknięty kształt, żeby mógł odpowiadać na \`filled\` jak wbudowane.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                  // Twój glif
icon('check')                 // teraz też Twój

registerIcons({ check: null }) // i z powrotem do wbudowanego`, 'javascript'),

      h2('Dlaczego w treści, a nie sprite'),
      p(
        'Ikony renderują się do strony, zamiast być pobierane z ',
        code('icons.svg'),
        ' przez ',
        code('<use>'),
        '. Sprite oszczędza rzędu setki bajtów HTML-a po gzipie na stronę i kosztuje za to jedną podróż do serwera — powtarzające się znaczniki to dokładnie ten przypadek, w którym gzip jest najlepszy, więc większość tego, co sprite miałby deduplikować, została już zdeduplikowana. W treści znaczy też, że nie ma pliku do wypuszczenia, ścieżki bazowej do skonfigurowania ani niczego, co mogłoby zginąć z ',
        code('dist'),
        ' — ten sam kompromis, który robi ',
        code('styles({ inline: true })'),
        '.',
      ),

      h2('Propsy'),
      propsTable([
        ['name', 'string', '', 'Który glif. Można podać jako pierwszy argument zamiast propsa.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Token albo dowolna długość CSS. Domyślnie 1em.'],
        ['label', 'string', '', 'Zapowiadaj ją jako obraz o tej nazwie, zamiast ją ukrywać.'],
        ['spin', 'boolean', 'false', 'Obracaj ją bez przerwy.'],
        ['filled', 'boolean', 'false', 'Zamaluj glif, zamiast go obrysowywać. Ignorowane przez glify, których nie da się wypełnić.'],
      ]),
      p(
        'Nieznana nazwa nie renderuje zupełnie nic, zamiast zgłaszać błąd — kosmetyczny props nie powinien móc przerwać buildu. ',
        code('hasIcon(name)'),
        ' mówi, czy dany istnieje, ',
        code('iconNames()'),
        ' wypisuje wszystkie, a ',
        code('fillableIcons()'),
        ' te, które przyjmują ',
        code('filled'),
        '.',
      ),
    ],
  })
