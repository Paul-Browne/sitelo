import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Zakładki',
    description:
      'Trzy postaci: odnośniki, jedna strona na zakładkę; panele podmieniane w miejscu; albo panele sterowane adresem URL.',
    activeHref: '/pl/ui/tabs',
    children: [
      p(
        'Daj każdemu elementowi ',
        code('href'),
        ', a zakładki będą odnośnikami — jedna strona na zakładkę, bez skryptu, z ',
        code('aria-current'),
        ' na aktywnej. Daj każdemu ',
        code('panel'),
        ', a staną się grupą opcji radio, której panele podmieniają się w miejscu, wciąż bez skryptu.',
      ),
      p(
        'Na witrynie statycznej zwykle właściwa jest postać z odnośnikami: daje każdemu widokowi adres URL i przeżywa wyłączony JavaScript. Po panele sięgaj, gdy treści jest mało, a przełączenie nie powinno kosztować nawigacji.',
      ),

      h2('Zakładki-odnośniki'),
      p(
        'To naprawdę są odnośniki — kliknij jeden, a nawiguje. Podkreślenie bierze się z ',
        code('active'),
        ' albo ',
        code('value'),
        ' podczas buildu, a nie z kliknięcia, więc każda strona oznacza własną zakładkę. W zakładce-odnośniku nic samo nie reaguje na adres URL: do tego służą panele poniżej.',
      ),
      demo(`tabs({
  items: [
    { label: 'Okruszki', href: '/ui/breadcrumbs' },
    { label: 'Zakładki', href: '/ui/tabs', active: true },
    { label: 'Paginacja', href: '/ui/pagination' },
  ],
})`, { align: 'stretch' }),

      h2('Zakładki-panele'),
      p(
        'Zakładka to ',
        code('<label>'),
        ' dla opcji radio, którą arkusz stylów trzyma poza widokiem, a panel następujący po zaznaczonej opcji jest tym, który CSS pokazuje. Na tej stronie nic nie jest importowane: przełączanie i strzałki przechodzące między zakładkami to rzeczy, które grupa radio już robi.',
      ),
      demo(`tabs({
  value: 'install',
  items: [
    { id: 'install', label: 'Instalacja', panel: card({ variant: 'flat' }, cardBody(code('npm install sitelo javascript-to-html'))) },
    { id: 'use', label: 'Użycie', panel: card({ variant: 'flat' }, cardBody(code("import * as ui from 'sitelo/ui'"))) },
    { id: 'build', label: 'Build', panel: card({ variant: 'flat' }, cardBody(code('sitelo build'))) },
  ],
})`, { align: 'stretch' }),

      h2('Zakładki z własnym adresem'),
      p(
        'Daj elementom z panelami także ',
        code('href'),
        ' z fragmentem, a opcje radio ustąpią odnośnikom: adres URL nazywa zakładkę, ',
        code(':target'),
        ' ją wyłuskuje, panel za nią się pokazuje, a wybór przeżywa przeładowanie, udostępniony odnośnik i przycisk wstecz. Identyfikator jest na zakładce, a nie na panelu, bo przeglądarka przewija do góry okna to, co nazywa adres — nazwanie panelu zepchnęłoby z ekranu właśnie te zakładki, które przed chwilą kliknąłeś. W dokumencie tylko jeden element może być ',
        code(':target'),
        ', więc ta postać jest dla jednego zestawu zakładek na stronę. Samego przewinięcia nie da się odwołać: podążenie za fragmentem z definicji przesuwa okno. Strona może jedynie wybrać, do czego się przewinie i gdzie to wyląduje, i po to właśnie są identyfikator na zakładce oraz jej ',
        code('scroll-margin-block-start'),
        ' — ustaw go propsem ',
        code('scrollMargin'),
        ' i daj przyklejonemu nagłówkowi co najmniej jego własną wysokość.',
      ),
      demo(`tabs({
  items: [
    { id: 'setup', label: 'Przygotowanie', href: '#tab-setup', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Ten panel to #tab-setup — skopiuj adres, a wróci.'))) },
    { id: 'deploy', label: 'Wdrożenie', href: '#tab-deploy', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'A ten to #tab-deploy.'))) },
  ],
})`, { align: 'stretch' }),

      h2('Pigułki'),
      demo(`stack({ gap: 'lg' },
  tabs({
    variant: 'pills',
    items: [
      { label: 'Wszystko', href: '#all', active: true },
      { label: 'Przewodniki', href: '#guides' },
      { label: 'Przykłady', href: '#examples' },
    ],
  }),
  tabs({
    variant: 'pills',
    value: 'js',
    items: [
      { id: 'js', label: 'JavaScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.js'))) },
      { id: 'ts', label: 'TypeScript', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.ts'))) },
      { id: 'jsx', label: 'JSX', panel: card({ variant: 'flat' }, cardBody(code('src/index.ht.jsx'))) },
    ],
  }),
)`, { align: 'stretch' }),

      h2('Kolory'),
      demo(`stack({ gap: 'lg' },
  tabs({ color: 'primary', items: [{ label: 'Primary', href: '#p', active: true }, { label: 'Inne', href: '#p2' }] }),
  tabs({ color: 'neutral', items: [{ label: 'Neutral', href: '#n', active: true }, { label: 'Inne', href: '#n2' }] }),
  tabs({ color: 'danger', items: [{ label: 'Danger', href: '#d', active: true }, { label: 'Inne', href: '#d2' }] }),
)`, { align: 'stretch' }),

      h2('Wiele zakładek'),
      p(
        'Lista zakładek przewija się poziomo, zamiast zawijać, więc rząd zachowuje kształt na telefonie. Zakładki-panele zawijają się zamiast tego — każdy panel musi iść za własną zakładką, co nie zostawia żadnego elementu-rzędu do przewijania.',
      ),
      demo(`tabs({
  items: [
    'Przegląd', 'Routing', 'Dane', 'Zasoby', 'Obrazy', 'Wyspy', 'TypeScript', 'CLI', 'Wdrożenie',
  ].map((label, index) => ({ label, href: '#many-' + index, active: index === 0 })),
})`, { align: 'stretch' }),

      h2('Wyłączone'),
      demo(`tabs({
  value: 'now',
  items: [
    { id: 'now', label: 'Dostępne', panel: card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'To działa.'))) },
    { id: 'soon', label: 'Wkrótce', disabled: true, panel: card({ variant: 'flat' }, cardBody('')) },
  ],
})`, { align: 'stretch' }),

      h2('Dostępność'),
      p(
        'Postać z panelami to prawdziwa grupa radio: zakładki są elementami ',
        code('<label>'),
        ' dla opcji dzielących ',
        code('name'),
        ', więc czytnik ekranu zapowiada, która z ilu jest wybrana, a strzałki, Home i End działają bez niczego doładowanego. Postać z własnym adresem to natomiast zwykłe odnośniki i nie niesie żadnego ',
        code('aria-current'),
        ' — zapisano by go raz i byłby błędny po pierwszym kliknięciu. Celowo nie jest to lista zakładek ARIA: ',
        code('aria-selected'),
        ' zapisuje się raz, na serwerze, a CSS nie utrzyma go prawdziwym w miarę klikania. Postać z odnośnikami też nie jest listą zakładek: odnośniki, które nawigują, są odnośnikami, a nadanie im semantyki zakładek kłamałoby o tym, co robią.',
      ),

      h2('Propsy'),
      propsTable([
        ['items', 'Array', '[]', 'Ciągi znaków albo obiekty { id, label, href, panel, active, disabled }.'],
        ['value', 'string', '', 'Id aktywnego elementu. Wraca do active, potem do pierwszego.'],
        ['variant', "'underline' | 'pills'", "'underline'", 'Jak oznaczona jest aktywna zakładka.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor aktywnej zakładki.'],
        ['label', 'string', "'Tabs'", 'Dostępna nazwa grupy. Tylko postać z panelami.'],
        ['name', 'string', 'id pierwszego elementu', 'Nazwa grupy radio. Potrzebna tylko przy dwóch zestawach zakładek-paneli na jednej stronie.'],
        ['href', 'string', '', 'Na elemencie: strona do podlinkowania albo — obok panel — fragment, który go nazywa.'],
        ['scrollMargin', 'Space', "'lg'", 'Jak wysoko nad zakładką zatrzymuje się okno. Tylko postać :target.'],
      ]),
    ],
  })
