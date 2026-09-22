import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Pasek aplikacji',
    description:
      'Pasek na górze witryny: marka po jednej stronie, nawigacja i akcje po drugiej.',
    activeHref: '/pl/ui/app-bar',
    children: [
      p(
        'Pasek aplikacji to ',
        code('<header>'),
        ' z rzędem w środku. Części są osobne, żebyś mógł je układać: ',
        code('appBarNav()'),
        ' na odnośniki, ',
        code('appBarSpacer()'),
        ', żeby zepchnąć resztę na drugi koniec, i ',
        code('appBarActions()'),
        ' na przyciski na końcu.',
      ),

      h2('Podstawowy pasek'),
      demo(`appBar({ brand: 'sitelo' },
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'soft' }, 'Zaloguj się'),
  ),
)`, { align: 'stretch' }),

      h2('Z nawigacją'),
      p(
        code('navLink()'),
        ' to styl odnośnika dla paska; ',
        code('current'),
        ' oznacza aktywną stronę przez ',
        code('aria-current'),
        ', a nie tylko kolorem.',
      ),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(
    navLink({ href: '#docs', current: true }, 'Dokumentacja'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Przykłady'),
  ),
  appBarSpacer(),
  appBarActions(
    button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'GitHub'),
    button({ size: 'sm' }, 'Zacznij'),
  ),
)`, { align: 'stretch' }),

      h2('Marka ze znakiem'),
      p(
        'Marka przyjmuje dowolne znaczniki i prowadzi do ',
        code('/'),
        ', chyba że ',
        code('href'),
        ' powie inaczej.',
      ),
      demo(`appBar({
  href: '#home',
  brand: stack({ direction: 'row', gap: 'sm', inline: true, align: 'center' },
    avatar({ name: 'S', size: 'sm', square: true, color: 'primary' }),
    'sitelo',
  ),
},
  appBarSpacer(),
  appBarActions(chip({ size: 'sm', color: 'neutral' }, 'v2.6.3')),
)`, { align: 'stretch' }),

      h2('Przyklejony i rozmyty'),
      p(
        code('sticky'),
        ' przypina pasek do góry przewijanego kontenera; ',
        code('blur'),
        ' czyni go półprzezroczystym, żeby treść przechodziła pod nim. Oba pokazane są tu w przewijanym pudełku, a nie na samej stronie.',
      ),
      demo(`div({ style: 'height: 12rem; overflow: auto; border: 1px solid var(--su-border); border-radius: 0.6rem' },
  appBar({ brand: 'sitelo', sticky: true, blur: true },
    appBarSpacer(),
    appBarActions(chip({ size: 'sm', color: 'primary' }, 'sticky')),
  ),
  container({ size: 'sm', style: 'padding-block: 1rem' },
    stack({ gap: 'md' },
      ...Array.from({ length: 6 }, (unused, index) =>
        text({ variant: 'small', tone: 'muted' }, 'Przewiń mnie — akapit ' + (index + 1) + '.'),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Z szufladą na małych ekranach'),
      p(
        'Typowy wzorzec: odnośniki w pasku na desktopie, przycisk otwierający ',
        code('drawer()'),
        ' na telefonie. Szuflada jest popoverem, więc przycisk nie potrzebuje skryptu.',
      ),
      demo(`fragment(
  appBar({ brand: 'sitelo' },
    appBarSpacer(),
    appBarActions(
      themeToggle(),
      iconButton({
        label: 'Otwórz nawigację',
        variant: 'ghost',
        color: 'neutral',
        popovertarget: 'app-bar-drawer',
        icon: icon('menu'),
      }),
    ),
  ),
  drawer({ id: 'app-bar-drawer', title: 'Nawigacja' },
    navLink({ href: '#docs' }, 'Dokumentacja'),
    navLink({ href: '#ui' }, 'UI'),
    navLink({ href: '#examples' }, 'Przykłady'),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      p(code('appBar()'), ':'),
      propsTable([
        ['brand', 'Child', '', 'Treść odnośnika marki na początku.'],
        ['href', 'string', "'/'", 'Dokąd prowadzi marka.'],
        ['sticky', 'boolean', 'false', 'Przypina pasek do góry przy przewijaniu.'],
        ['blur', 'boolean', 'false', 'Półprzezroczyste tło z rozmyciem za nim.'],
        ['as', 'string', "'header'", 'Element do wyrenderowania.'],
      ]),
      p('Części:'),
      propsTable([
        ['appBarNav', '', '', 'Element nav mieszczący odnośniki.'],
        ['appBarSpacer', '', '', 'Elastyczna przerwa; wszystko po niej idzie na drugi koniec.'],
        ['appBarActions', '', '', 'Końcowa grupa przycisków.'],
        ['navLink', 'href, current, color', '', 'Odnośnik w stylu paska; current oznacza aktywną stronę.'],
      ], { headers: ['Część', 'Propsy', 'Domyślnie', 'Opis'] }),
    ],
  })
