import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Karuzela',
    description:
      'Slajdy, które przewijasz, przyciągając się po drodze — oraz kropki i strzałki, o narysowanie których arkusz stylów prosi przeglądarkę.',
    activeHref: '/pl/ui/carousel',
    children: [
      p(
        'Karuzela to tutaj przewijany kontener i rząd przyciągających się slajdów. Tyle każda przeglądarka już potrafi: przesuwanie palcem, gładzik, shift z kółkiem i strzałki działają od pierwszego malowania, bez niczego doładowanego i bez niczego do hydratacji.',
      ),
      p(
        'Tam, gdzie przeglądarka potrafi, kropki i strzałki wcale nie są znacznikami. To ',
        code('::scroll-marker'),
        ' na każdym slajdzie i ',
        code('::scroll-button()'),
        ' na torze — pseudoelementy, o które prosi arkusz stylów, a które przeglądarka potem rysuje, nazywa, podpina do pozycji przewinięcia, oznacza bieżący i wyłącza na końcach. W tym komponencie nie ma żadnego atrybutu ',
        code('data-'),
        ' ani modułu do zaimportowania: stanem jest przesunięcie przewinięcia, a przeglądarka już je ma.',
      ),
      p(
        'Tam, gdzie nie potrafi, przejmuje wyrenderowany rząd kropek: jeden odnośnik na slajd, który działa sam z siebie i który przy pierwszym przewinięciu albo pierwszym dotknięciu sięga po kilkaset bajtów skryptu, żeby zachowywać się jak kropki natywne — podążać za przewinięciem i ruszać torem bez ruszania strony.',
      ),

      h2('Po jednym naraz'),
      p(
        'Domyślne. Każdy slajd wypełnia tor, przyciąga się do początku i tam zostaje, zamiast lecieć trzy slajdy dalej.',
      ),
      demo(`carousel({
  items: ['Wybrzeże', 'Port', 'Pola', 'Stare miasto'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Po kilka naraz'),
      p(
        code('perView'),
        ' to liczba slajdów wypełniających tor, a ',
        code('min'),
        ' to dolna granica tego, jak wąski może się zrobić jeden. Ta granica zastępuje zapytanie medialne: gdy udział slajdu w torze spadnie poniżej niej, slajdy zostają tej szerokości, a mieści się ich mniej — ten sam trik, który ',
        code('grid()'),
        ' stosuje przy automatycznym dopasowaniu.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Routing', 'Dane', 'Zasoby', 'Obrazy', 'Wyspy', 'Wyszukiwanie'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Przewodnik'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Zerknięcie na następny'),
      p(
        'Ułamkowy ',
        code('perView'),
        ' zostawia widoczny skrawek następnego slajdu, co jest najtańszym sposobem powiedzenia „to się przewija” zupełnie bez obudowy.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Jeden', 'Dwa', 'Trzy'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Responsywność bez własnego breakpointu'),
      p(
        code('perView'),
        ' zapisany jest jako właściwość własna, więc zapytanie medialne może go zmienić bez dotykania znaczników — i bez tego, żeby komponent musiał znać Twoje breakpointy:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('Przyciąganie'),
      p(
        'Przyciąganie jest domyślnie ',
        code('mandatory'),
        ': przewinięcie zawsze zatrzymuje się na slajdzie. ',
        code("snap: 'proximity'"),
        ' przyciąga tylko wtedy, gdy kończy się blisko któregoś, a ',
        code('snap: false'),
        ' zostawia tor przewijany swobodnie — czego chce rząd małych rzeczy, gdzie zatrzymanie się między dwiema jest w porządku.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Gdzie idą kropki i strzałki'),
      p(
        'Jedne i drugie są opcjonalne i domyślnie włączone. Wyłączenie kropek przywraca pasek przewijania toru, bo karuzela bez jednych i drugich byłaby przewijanym obszarem bez niczego, co mówiłoby, że się przewija.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Same kropki', 'Drugi', 'Trzeci'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Same strzałki', 'Drugi', 'Trzeci'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Gdy przeglądarka nie ma znaczników przewijania'),
      p(
        'Wtedy kropki są prawdziwymi odnośnikami, po jednym na slajd, a każdy wskazuje na identyfikator swojego slajdu — dlatego każdy slajd go dostaje. Tyle działa bez niczego doładowanego: dotknięcie kropki przewija tor do jej slajdu, bo podążanie za fragmentem to rzecz, którą przeglądarka już robi.',
      ),
      p(
        'Przy pierwszym przewinięciu albo pierwszym dotknięciu tor i kropki sięgają po ',
        code('/su/carousel.js'),
        ' z własnych atrybutów zdarzeń — tak jak każdy komponent tutaj sięga po swój moduł, więc nic nie jest pobierane na stronie, której nikt nie dotknął, a tam, gdzie znaczniki natywne już są, nie jest pobierane nic w ogóle. Od tej chwili działa to w obie strony: kropki podążają za przewinięciem, cokolwiek nim ruszyło — palec, gładzik, strzałki, przeciągnięcie paska — a dotknięcie kropki przewija tor i zostawia stronę tam, gdzie była.',
      ),
      p(
        'Ta ostatnia rzecz jest tym, do czego skrypt naprawdę służy. Goły fragment przesuwa okno razem z torem, a karuzela, która wyrywa stronę spod kciuka, który ją dotyka, nie jest tym, co ktokolwiek rozumie przez kropkę. Kliknięcie odwoływane jest w atrybucie, a nie w środku importu, bo dynamiczny import rozstrzyga się chwilę później, a do tego czasu przeglądarka już podążyła za odnośnikiem. ',
        code('scrollMargin'),
        ' to miejsce, w którym ląduje okno w jedynym pozostałym przypadku: przy wyłączonym JavaScripcie, gdzie odnośnik jest wciąż tylko odnośnikiem.',
      ),
      p(
        'Identyfikatory, na które wskazują, biorą się z ',
        code('name'),
        ' albo z własnego ',
        code('id'),
        ' karuzeli, albo — gdy nie ma żadnego z nich — ze skrótu slajdów, więc dwie karuzele na jednej stronie nie zderzą się, choć żadnej nie powiedziano o drugiej. Daj elementowi własny ',
        code('id'),
        ', gdy do konkretnego slajdu warto odsyłać skądinąd.',
      ),

      h2('Nazywanie slajdów'),
      p(
        'Każda kropka nazywana jest po swoim slajdzie, bo kropka jest kontrolką, a kontrolka bez nazwy to przycisk, który czytnik ekranu potrafi nazwać tylko „przyciskiem”. Domyślnie nazwą jest numer slajdu. Podaj element jako obiekt, żeby nazwać go lepiej, albo ',
        code('slideLabel'),
        ', żeby ponumerować je własnymi słowami.',
      ),
      demo(`carousel({
  label: 'Zdjęcia produktu',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'Kuchnia', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Kuchnia'))) },
    { label: 'Taras', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Taras'))) },
    { label: 'Ogród', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Ogród'))) },
  ],
})`, { align: 'stretch' }),

      h2('Sterowanie samodzielne'),
      p(
        'Dwie funkcje na te razy, gdy karuzelą rusza strona — przycisk „zobacz zdjęcia”, krok formularza, odnośnik gdzie indziej na stronie:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // przewija do trzeciego slajdu i oznacza jego kropkę
getSlide('gallery')     // 2`, 'javascript'),
      p('Albo z atrybutu zdarzenia, zupełnie bez niczego w paczce strony:'),
      codeBlock('Gdziekolwiek', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Wróć na początek')`, 'javascript'),

      h2('Czego to nie robi'),
      p(
        'Nie zapętla się z powrotem do pierwszego slajdu i nie przesuwa się samo. Żadnej z tych rzeczy nie potrafi CSS, więc żadnej tu nie ma — karuzela zapętlona albo samoprzesuwna potrzebuje skryptu, a ten komponent wolałby nie być powodem, dla którego strona go ładuje. Automatyczne przesuwanie i tak warto stracić: rusza rzeczą, którą ktoś właśnie czyta, sprzed jego oczu.',
      ),
      p(
        'Przy wyłączonym JavaScripcie nie potrafi też oznaczyć, który slajd jest widoczny, gdy torem już przesunięto, ani sięgnąć do któregoś bez ruszania strony. Pierwsza kropka oznaczana jest podczas buildu, bo w spoczynku to właśnie ten slajd jest widoczny; utrzymanie tego prawdziwym później to jedyna rzecz, którą potrafi tylko skrypt. Palec, gładzik i klawisze działają tak czy inaczej.',
      ),

      h2('Dostępność'),
      p(
        'Tor jest nazwaną grupą z ',
        code('tabindex="0"'),
        ', więc klawiatura może dosięgnąć przewijanego obszaru i przejść go strzałkami w każdym silniku, nie tylko w tych, które same fokusują przewijane obszary. Nazwij go przez ',
        code('label'),
        ', gdy strona ma więcej niż jeden.',
      ),
      p(
        'Tam, gdzie rysuje je przeglądarka, kropki wystawiane są jako lista zakładek, a strzałki jako przyciski, które same wyłączają się na każdym końcu — buduje to wszystko przeglądarka, więc nic z tego nie może rozjechać się z faktycznie widocznym slajdem. To właśnie argument za tym kształtem zamiast skryptowego: nie ma drugiej kopii stanu, którą można by pomylić.',
      ),
      p(
        'Zapasowe kropki to odnośniki, każdy nazwany po swoim slajdzie i każdy o celu 24px, a nie 8px, na które kropka wygląda. Widoczny slajd niesie ',
        code('aria-current'),
        ', czyli zarazem to, co czyta czytnik ekranu, i to, co koloruje arkusz stylów — jeden kawałek stanu do utrzymania zamiast dwóch, które mogłyby się nie zgadzać. Renderowany jest na pierwszej kropce, bo w spoczynku to ten slajd jest widoczny, a stamtąd przesuwa się razem z przewinięciem. Tam, gdzie zastępują je znaczniki natywne, odnośniki mają ',
        code('display: none'),
        ', więc wychodzą z drzewa dostępności razem z obrazem, zamiast być czytane dwa razy.',
      ),

      h2('Propsy'),
      propsTable([
        ['items', 'Array', '[]', 'Slajdy. Dziecko albo { label, content } z dowolnymi innymi atrybutami dla slajdu. Dzieci też są slajdami i idą po items.'],
        ['perView', 'number', '1', 'Ile slajdów wypełnia tor. Ułamek zostawia zerknięcie na następny.'],
        ['min', 'string', '', 'Dolna granica szerokości slajdu, żeby wąski ekran pokazywał ich mniej, a nie węższe.'],
        ['gap', 'Space', "'md'", 'Między slajdami.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Gdzie zatrzymuje się slajd.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Jak stanowczo przewinięcie osiada na slajdzie.'],
        ['dots', 'boolean', 'true', 'Kropki pod torem — natywne znaczniki przewijania tam, gdzie przeglądarka je ma, a gdzie nie, jeden odnośnik na slajd, ulepszany małym modułem. Wyłączone przywracają pasek przewijania i nie proszą o żaden skrypt.'],
        ['arrows', 'boolean', 'true', 'Strzałki nad torem.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor kropki widocznego slajdu.'],
        ['label', 'string', "'Carousel'", 'Dostępna nazwa przewijanego obszaru.'],
        ['previousLabel', 'string', "'Previous slide'", 'Dostępna nazwa strzałki wstecz.'],
        ['nextLabel', 'string', "'Next slide'", 'Dostępna nazwa strzałki naprzód.'],
        ['slideLabel', '(index, count) => string', 'numer', 'Nazywa slajd, który sam się nie nazwał.'],
        ['name', 'string', 'id karuzeli, inaczej skrót', 'Przedrostek identyfikatorów slajdów, na które wskazują zapasowe kropki.'],
        ['scrollMargin', 'Space', "'lg'", 'Jak wysoko nad slajdem zatrzymuje się okno, gdy zabierze tam zapasowa kropka.'],
        ['as', 'string', "'div'", 'Element do wyrenderowania.'],
      ]),
    ],
  })
