import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/pl.js'
import { preview } from '../../lib/ui-demo.js'

/**
 * Jedna karta na stronę komponentu, pogrupowane dokładnie tak jak
 * referencja komponentów. Każde `demo` renderuje się na żywo w swojej karcie.
 */
const GROUPS = [
  ['Układ', [
    ['/pl/ui/container', 'Kontener', 'Wyśrodkowana kolumna strony z ograniczoną szerokością.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'wyśrodkowane'))`],
    ['/pl/ui/stack', 'Stos', 'Rząd albo kolumna flex z tokenem odstępu na gap.',
      `stack({ direction: 'row', gap: 'sm' }, chip('jeden'), chip('dwa'), chip('trzy'))`],
    ['/pl/ui/grid', 'Siatka', 'Mieści tyle kolumn, ile się da, bez zapytań medialnych.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/pl/ui/divider', 'Separator', 'Linia między sekcjami, z etykietą albo bez.',
      `div({ style: 'width: 100%' }, divider('albo'))`],
    ['/pl/ui/aspect-ratio', 'Proporcje', 'Utrzymaj ramkę w stałym kształcie, żeby nic nie przeskoczyło przy ładowaniu.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/pl/ui/card', 'Karta', 'Powierzchnia dla zgrupowanej treści, z nagłówkiem, treścią i stopką.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Karta')))`],
  ]],
  ['Typografia', [
    ['/pl/ui/typography', 'Typografia', 'Skala typograficzna, która sama dobiera element.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Nagłówek'), text({ variant: 'caption', tone: 'muted' }, 'Podpis'))`],
    ['/pl/ui/prose', 'Proza', 'Ostyluj surowy HTML z Markdowna albo z CMS-a.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Nagłówek</strong></p><p>I akapit.</p>')`],
    ['/pl/ui/link', 'Odnośnik', 'Ostylowana kotwica z atrybutami, których potrzebuje odnośnik zewnętrzny.',
      `text({ variant: 'small' }, 'Przeczytaj ', link({ href: '/docs' }, 'dokumentację'), '.')`],
    ['/pl/ui/icons', 'Ikony', '99 glifów na jednej siatce, wymiarowane i kolorowane przez otaczający tekst.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Pola formularza', [
    ['/pl/ui/button', 'Przycisk', 'Pięć wariantów, pięć kolorów, trzy rozmiary.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Zapisz'), button({ size: 'sm', variant: 'outline' }, 'Anuluj'))`],
    ['/pl/ui/button-group', 'Grupa przycisków', 'Przyciski złączone w jedną kontrolkę.',
      `buttonGroup({ label: 'Podgląd' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Jeden'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Dwa'))`],
    ['/pl/ui/text-field', 'Pole tekstowe', 'Etykieta, kontrolka, tekst pomocy i błąd, połączone razem.',
      `textField({ label: 'E-mail', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/pl/ui/select', 'Lista wyboru', 'Natywny select, ostylowany pod resztę.',
      `selectField({ label: 'Motyw', name: 'g-theme', size: 'sm', options: ['Jasny', 'Ciemny'], value: 'Ciemny' })`],
    ['/pl/ui/checkbox', 'Pole wyboru', 'Prawdziwy input, ostylowany CSS-em, a nie podmieniony.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Mapa witryny', checked: true }), checkbox({ label: 'Kanał RSS' }))`],
    ['/pl/ui/radio', 'Grupa opcji', 'Jeden wybór z kilku, jako opcje radio dzielące nazwę.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['free', 'pro'] })`],
    ['/pl/ui/switch', 'Przełącznik', 'Włącznik dla ustawienia, które działa natychmiast.',
      `stack({ gap: 'sm' }, toggle({ label: 'Publiczna', checked: true }), toggle({ label: 'Szkice' }))`],
    ['/pl/ui/slider', 'Suwak', 'Natywne pole zakresu, ostylowane pod resztę.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Podgląd' }))`],
    ['/pl/ui/toggle-button', 'Przycisk przełączany', 'Przycisk, który zostaje wciśnięty.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Wł'), toggleButton({ size: 'sm' }, 'Wył'))`],
    ['/pl/ui/toggle-group', 'Grupa przełączników', 'Kontrolka segmentowa, jako przyciski albo odnośniki.',
      `toggleGroup({ size: 'sm', label: 'Podgląd', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Prezentacja danych', [
    ['/pl/ui/avatar', 'Awatar', 'Obraz, gdy jest, inicjały, gdy go nie ma.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/pl/ui/badge', 'Odznaka', 'Licznik albo kropka przypięta do rogu.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Skrzynka'))`],
    ['/pl/ui/chip', 'Żeton', 'Tag, status, filtr.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'zaliczony'), chip({ color: 'neutral' }, 'statyczne'))`],
    ['/pl/ui/tooltip', 'Podpowiedź', 'Wskazówka przy najechaniu i fokusie, w całości w CSS-ie.',
      `tooltip({ content: 'Skrypt niepotrzebny' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Najedź'))`],
    ['/pl/ui/table', 'Tabela', 'Wiersze i kolumny z danych, w przewijanym kontenerze.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Strona' }, { key: 's', header: 'Rozmiar', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/pl/ui/list', 'Lista', 'Wiersze z czymś po obu stronach.',
      `list({ plain: true }, listItem({ title: 'Routing', description: 'Oparty na plikach' }))`],
    ['/pl/ui/figure', 'Ilustracja', 'Obraz i jego podpis jako jedna ilustracja.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Podpis', style: 'width: 7rem' })`],
    ['/pl/ui/carousel', 'Karuzela', 'Przyciągające się slajdy, z kropkami i strzałkami rysowanymi przez przeglądarkę.',
      `div({ style: 'width: 100%' }, carousel({ perView: 2.4, gap: 'sm', arrows: false, items: ['1', '2', '3'].map((n) =>
        aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          div({ style: 'display: grid; place-items: center; color: var(--su-text-subtle)' }, n))) }))`],
  ]],
  ['Komunikaty', [
    ['/pl/ui/alert', 'Alert', 'Komunikat, którego ikona i rola ARIA idą za kolorem.',
      `alert({ color: 'success' }, 'Wdrożono.')`],
    ['/pl/ui/empty', 'Pusty stan', 'Jak wygląda lista, zanim cokolwiek się w niej znajdzie.',
      `empty({ title: 'Nic tu nie ma', style: 'padding: 0' })`],
    ['/pl/ui/progress', 'Postęp', 'Pasek dla pracy znanej, wskaźnik dla reszty.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/pl/ui/skeleton', 'Szkielet', 'Zastępnik w kształcie nadchodzącej treści.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/pl/ui/toast', 'Powiadomienie', 'Przelotny komunikat, dodawany ze skryptu.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Zapisano.'))`],
  ]],
  ['Nawigacja', [
    ['/pl/ui/breadcrumbs', 'Okruszki', 'Ślad przodków kończący się na tej stronie.',
      `breadcrumbs({ items: [{ label: 'Dokumentacja', href: '/docs' }, { label: 'UI' }] })`],
    ['/pl/ui/pagination', 'Paginacja', 'Numerowane strony w okienku, jako prawdziwe odnośniki.',
      `pagination({ page: 2, count: 5, href: (page) => '/ui#p' + page })`],
    ['/pl/ui/tabs', 'Zakładki', 'Odnośniki, jedna strona na zakładkę — albo panele podmieniane w miejscu.',
      `tabs({ variant: 'pills', items: [{ label: 'Jeden', href: '/ui#t1', active: true }, { label: 'Dwa', href: '/ui#t2' }] })`],
    ['/pl/ui/app-bar', 'Pasek aplikacji', 'Marka po jednej stronie, nawigacja i akcje po drugiej.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/pl/ui/theme-toggle', 'Przełącznik motywu', 'Jasny i ciemny, bez błysku przy wejściu.',
      `themeToggle()`],
  ]],
  ['Warstwy', [
    ['/pl/ui/modal', 'Okno modalne', 'Okno dialogowe na API popover — nigdzie żadnego skryptu.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Otwórz okno')`],
    ['/pl/ui/drawer', 'Szuflada', 'Panel od krawędzi, ta sama mechanika popovera.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Otwórz szufladę')`],
    ['/pl/ui/menu', 'Menu', 'Lista rozwijana na details, otwieranie i zamykanie za darmo.',
      `chip({ color: 'neutral' }, 'Akcje ▾')`],
    ['/pl/ui/accordion', 'Akordeon', 'Zwijane sekcje, łącznie z trybem wyłączności.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Pytanie' }] }))`],
    ['/pl/ui/collapsible', 'Zwijany panel', 'Jedno „pokaż więcej”, bez oprawy akordeonu.',
      `collapsible({ trigger: 'Pokaż więcej' }, 'Ukryte, dopóki nie poprosisz.')`],
  ]],
  ['Sekcje', [
    ['/pl/ui/hero', 'Hero', 'Góra strony docelowej: nagłówek, zdanie, akcje.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Nagłówek'), text({ variant: 'caption', tone: 'muted' }, 'I zdanie.'))`],
    ['/pl/ui/footer', 'Stopka', 'Kolumny odnośników i wiersz pod nimi.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Dokumentacja'), text({ variant: 'caption', tone: 'muted' }, 'Przewodnik · Komponenty'))`],
    ['/pl/ui/stat', 'Statystyka', 'Liczba warta spojrzenia i to, co znaczy.',
      `stat({ label: 'Strony', value: '204', change: '+8', color: 'success' })`],
    ['/pl/ui/steps', 'Kroki', 'Numerowany przebieg, ze zrobionym oznaczonym jako zrobione.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Instalacja', 'Build'] }))`],
    ['/pl/ui/timeline', 'Oś czasu', 'Wpisy po kolei, wzdłuż linii.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Sekcje', color: 'primary' }] }))`],
    ['/pl/ui/mockup', 'Makieta', 'Zrzut ekranu w przeglądarce, oknie, telefonie albo terminalu.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Stylowanie', [
    ['/pl/ui/theming', 'Motywy', 'Każdy kolor, promień i krój, jednym wywołaniem.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Jedna karta galerii. Podgląd jest bezwładny, a nazwa to rozciągnięty odnośnik. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Div, a nie kotwica: te podglądy zawierają prawdziwe przyciski i pola,
     * a treść interaktywna nie może zagnieżdżać się w odnośniku. Zamiast
     * tego kotwica nazwy rozciąga się na całą kartę, a `inert` wyjmuje
     * kontrolki demo z kolejności tabulacji i z drzewa dostępności.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — komponenty dla sitelo',
    description:
      'Biblioteka komponentów dla sitelo: przyciski, karty, formularze, tabele i okna modalne, jako funkcje zwracające HTML.',
    activeHref: '/pl/ui',
    children: [
      p(
        'sitelo-ui to biblioteka komponentów dla sitelo. Każdy komponent jest funkcją zwracającą ciąg HTML, więc zagnieżdża się wprost w stronie, którą już piszesz — bez kompilatora, bez runtime’u, bez hydratacji.',
      ),
      p(
        'Każdy przykład w tej sekcji renderuje ten sam build, który renderuje otaczającą go stronę. To, co widzisz, jest tym, co wyprodukował kod pod spodem, i idzie za jasnym i ciemnym motywem tej witryny, bo sitelo-ui czyta ten sam atrybut ',
        code('data-theme'),
        ' co dokumentacja.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.map(galleryCard)),
      ]),

      h2('Jak zacząć'),
      p(
        'Dwie linijki: zaimportuj komponenty i wstaw ',
        code('styles()'),
        ' do head. ',
        a({ href: '/pl/docs/ui' }, 'Strona Komponenty w dokumentacji'),
        ' obejmuje instalację, motywy, konwencję wywołania i opcjonalny runtime kliencki, a także wypisuje każdy eksport w jednej tabeli.',
      ),
      p(
        'Katalog ',
        code('examples/ui'),
        ' w repozytorium renderuje cały zestaw na jednej stronie.',
      ),

      h2('Dodatki'),
      p(
        'Nie wszystko należy do jednego arkusza stylów. To, co fakturowe i ozdobne — na początek ziarno filmowe — żyje pod ',
        a({ href: '/ui-extras' }, 'sitelo UI extras'),
        ', drugim punktem wejścia, gdzie każdy komponent przynosi własny arkusz, więc strona podlinkowuje tylko to, czego używa.',
      ),
    ],
  })
