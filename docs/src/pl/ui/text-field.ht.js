import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Pole tekstowe',
    description:
      'Jedno- i wielowierszowe pola tekstowe, z etykietą, tekstem pomocy, komunikatem błędu i identyfikatorami połączonymi za Ciebie.',
    activeHref: '/pl/ui/text-field',
    children: [
      p(
        'Są tu dwie warstwy. ',
        code('input()'),
        ' i ',
        code('textarea()'),
        ' to gołe kontrolki; ',
        code('textField()'),
        ' i ',
        code('textareaField()'),
        ' opakowują jedną w etykietę, tekst pomocy i komunikat błędu, i łączą je przez ',
        code('for'),
        ' oraz ',
        code('aria-describedby'),
        '. Sięgaj po te drugie, chyba że budujesz układ samodzielnie.',
      ),

      h2('Podstawowe pole'),
      demo(`textField({ label: 'Imię i nazwisko', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Tekst pomocy'),
      p(
        'Tekst pomocy jest powiązany przez ',
        code('aria-describedby'),
        ', więc czytnik ekranu czyta go jako część pola, a nie jako luźny tekst po nim.',
      ),
      demo(`textField({
  label: 'E-mail',
  name: 'email',
  type: 'email',
  help: 'Używamy go tylko do powiadomień o nieudanych buildach.',
})`, { align: 'stretch' }),

      h2('Wymagane i błąd'),
      p(
        code('error'),
        ' oznacza pole jako niepoprawne, koloruje obramowanie, ustawia ',
        code('aria-invalid'),
        ' i kieruje ',
        code('aria-describedby'),
        ' na komunikat — jeden props, wszystkie cztery rzeczy.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Projekt', name: 'project', required: true, value: '' }),
  textField({
    label: 'Witryna',
    name: 'site',
    error: 'To nie jest URL.',
    value: 'sitelo kropka dev',
  }),
)`, { align: 'stretch' }),

      h2('Rozmiary'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Małe', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Średnie', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Duże', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Ozdobniki'),
      p(
        'Przedrostek albo przyrostek dołączony do samej kontrolki, na jednostki i stałe fragmenty wartości.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Witryna', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Limit czasu buildu', name: 'timeout', endAdornment: 'sekund', value: '30' }),
)`, { align: 'stretch' }),

      h2('Wyłączone i tylko do odczytu'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Wyłączone', name: 'disabled', value: 'Nie do edycji', disabled: true }),
  textField({ label: 'Tylko do odczytu', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Wielowierszowe'),
      p(
        code('textareaField()'),
        ' to to samo pole wokół ',
        code('<textarea>'),
        '. Jego wartość jest treścią elementu, a nie atrybutem, czym komponent zajmuje się za Ciebie.',
      ),
      demo(`textareaField({
  label: 'Opis',
  name: 'description',
  rows: 4,
  help: 'Pokazywany w wynikach wyszukiwania i w kartach społecznościowych.',
  value: 'Generowanie stron statycznych bez konfiguracji, napędzane przez Vite.',
})`, { align: 'stretch' }),

      h2('W formularzu'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Imię i nazwisko', name: 'contact-name', required: true }),
      textField({ label: 'E-mail', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Wiadomość', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Anuluj'),
    button({ type: 'submit' }, 'Wyślij'),
  ),
)`, { align: 'stretch' }),

      h2('Budowanie samodzielnie'),
      p(
        code('field()'),
        ' to samo opakowanie — przyjmuje jako dzieci dowolną kontrolkę, więc możesz umieścić dwa pola w jednym wierszu albo kontrolkę, której ta biblioteka nie ma, pod tym samym potraktowaniem etykiety i błędu.',
      ),
      p(
        'Jedna etykieta nie może nazwać dwóch kontrolek, więc każde pole potrzebuje tu własnej dostępnej nazwy. Robią to właśnie atrybuty ',
        code('aria-label'),
        ': widoczna etykieta nazywa parę, a każde pole mówi, którym jest końcem.',
      ),
      demo(`field({ label: 'Zakres dat', help: 'Oba końce są wliczane.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Od' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Do' }),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      h3('textField i textareaField'),
      propsTable([
        ['label', 'Child', '', 'Etykieta pola. Gdy nie ma name, wyprowadzany jest z niej też id kontrolki.'],
        ['name', 'string', '', 'Nazwa pola formularza; z niej wyprowadzany jest id.'],
        ['help', 'Child', '', 'Wskazówka pod kontrolką, powiązana przez aria-describedby.'],
        ['error', 'Child | false', '', 'Komunikat błędu. Ustawia też aria-invalid na kontrolce.'],
        ['required', 'boolean', 'false', 'Oznacza etykietę i kontrolkę.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Wysokość kontrolki i rozmiar tekstu.'],
        ['type', 'string', "'text'", 'Dowolny typ pola. Tylko textField.'],
        ['startAdornment', 'Child', '', 'Przedrostek dołączony do kontrolki. Tylko textField.'],
        ['endAdornment', 'Child', '', 'Przyrostek dołączony do kontrolki. Tylko textField.'],
        ['value', 'string | number', '', 'Wartość początkowa.'],
        ['fieldClass', 'string', '', 'Klasa dla opakowania, a nie dla kontrolki.'],
      ]),
      p(
        'Identyfikatory wyprowadzane są z ',
        code('name'),
        ' — albo z ',
        code('label'),
        ', gdy nazwy nie ma — a nie z licznika, więc ta sama strona daje przy każdym buildzie ten sam HTML. Podaj ',
        code('id'),
        ', żeby je nadpisać.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Tekst etykiety.'],
        ['help', 'Child', '', 'Wskazówka pod kontrolką.'],
        ['error', 'Child | false', '', 'Komunikat błędu; dodaje też opakowaniu stan niepoprawności.'],
        ['required', 'boolean', 'false', 'Dodaje etykiecie znacznik wymagalności.'],
        ['for', 'string', '', 'Id opisywanej kontrolki.'],
      ]),
    ],
  })
