import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Grupa przełączników',
    description:
      'Kontrolka segmentowa: przyciski przełączane złączone w jedno albo odnośniki, gdzie każdy segment to osobna strona.',
    activeHref: '/pl/ui/toggle-group',
    children: [
      p(
        'Grupa przełączników to rząd wyborów czytany jako jedna kontrolka. Zbuduj ją z ',
        code('items'),
        ' i powiedz przez ',
        code('value'),
        ', który jest włączony.',
      ),

      h2('Podstawowa grupa'),
      demo(`toggleGroup({
  label: 'Wyrównanie tekstu',
  value: 'center',
  items: [
    { value: 'left', label: 'Do lewej' },
    { value: 'center', label: 'Do środka' },
    { value: 'right', label: 'Do prawej' },
  ],
})`),

      h2('Zwykłe ciągi znaków'),
      demo(`toggleGroup({ label: 'Gęstość', value: 'wygodna', items: ['zwarta', 'wygodna', 'przestronna'] })`),

      h2('Odnośniki'),
      p(
        'Tej postaci zwykle chce witryna statyczna: każdy segment to strona. Elementy z ',
        code('href'),
        ' renderują się jako kotwice, a aktywny dostaje ',
        code('aria-current="page"'),
        ' — nie ',
        code('aria-pressed'),
        ', bo odnośnik nie jest wciśniętym przyciskiem.',
      ),
      demo(`toggleGroup({
  label: 'Sekcja',
  value: 'ui',
  items: [
    { value: 'docs', label: 'Dokumentacja', href: '/docs' },
    { value: 'ui', label: 'UI', href: '/ui' },
    { value: 'examples', label: 'Przykłady', href: '/examples' },
  ],
})`),

      h2('Więcej niż jeden włączony'),
      p(
        'Podaj tablicę jako ',
        code('value'),
        '. Kontener i tak jest zwykłą ',
        code('group'),
        ' — ',
        code('radiogroup'),
        ' byłoby błędem, bo to wciśnięte przyciski, a nie opcje radio.',
      ),
      demo(`toggleGroup({
  label: 'Formatowanie',
  value: ['bold', 'underline'],
  items: [
    { value: 'bold', label: 'Pogrubienie' },
    { value: 'italic', label: 'Kursywa' },
    { value: 'underline', label: 'Podkreślenie' },
  ],
})`),

      h2('Rozmiary i warianty'),
      demo(`stack({ gap: 'md' },
  toggleGroup({ size: 'sm', label: 'Mały', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'md', label: 'Średni', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ size: 'lg', label: 'Duży', value: 'a', items: ['a', 'b', 'c'] }),
  toggleGroup({ variant: 'ghost', label: 'Ghost', value: 'b', items: ['a', 'b', 'c'] }),
)`, { align: 'start' }),

      h2('Wyłączone elementy'),
      demo(`toggleGroup({
  label: 'Renderer',
  value: 'static',
  items: [
    { value: 'static', label: 'Statyczny' },
    { value: 'islands', label: 'Wyspy' },
    { value: 'ssr', label: 'SSR', disabled: true },
  ],
})`),

      h2('Na pasku narzędzi'),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true, align: 'center' },
  toggleGroup({ label: 'Wyrównanie', value: 'Do lewej', size: 'sm', items: ['Do lewej', 'Do środka', 'Do prawej'] }),
  divider({ orientation: 'vertical' }),
  toggleGroup({ label: 'Styl', value: ['Pogrubienie'], size: 'sm', items: ['Pogrubienie', 'Kursywa'] }),
)`),

      h2('Kiedy użyć czegoś innego'),
      p(
        'Jeśli wybór jest wysyłany formularzem, użyj ',
        code('choiceGroup()'),
        ' — prawdziwe opcje radio, bez potrzeby skryptu. Jeśli każdy segment to strona, wybierz postać z odnośnikami powyżej. Grupa przełączników jest dla wyboru, na który reaguje sama strona.',
      ),

      h2('Propsy'),
      propsTable([
        ['items', 'Array', '[]', 'Ciągi znaków albo obiekty { value, label, href, disabled }.'],
        ['value', 'string | number | Array', '', 'Który element jest włączony. Tablica, gdy może być ich kilka.'],
        ['label', 'string', '', 'Dostępna nazwa grupy.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Stosowany do każdego elementu.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Jak wygląda element wyłączony.'],
      ]),
    ],
  })
