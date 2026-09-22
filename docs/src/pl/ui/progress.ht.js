import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Postęp',
    description:
      'Pasek dla pracy o znanym końcu, wirujący wskaźnik dla tej bez niego.',
    activeHref: '/pl/ui/progress',
    children: [
      p(
        'Używaj paska określonego zawsze, gdy wiesz, ile zostało — tylko on cokolwiek czytającemu mówi. Pomiń ',
        code('value'),
        ', a pasek zacznie się animować, co mówi „wciąż pracuję” i nic ponadto.',
      ),

      h2('Określony'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Nieokreślony'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Pasek bez ',
        code('label'),
        ' jest oznaczony jako ',
        code('aria-hidden'),
        ' — rola progressbar bez dostępnej nazwy nic czytnikowi ekranu nie mówi, więc pasek bez etykiety traktowany jest jak ozdoba. Etykietuj wszystko, co czytający ma śledzić.',
      ),

      h2('Etykiety'),
      p(
        'Etykieta nazywa to, co się dzieje; ',
        code('showValue'),
        ' dodaje procent po prawej.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Renderowanie stron', showValue: true }),
  progress({ value: 30, max: 60, label: 'Optymalizacja obrazów', showValue: true }),
  progress({ label: 'Czekanie na wdrożenie' }),
)`, { align: 'stretch' }),

      h2('Kolory i wysokość'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Zaliczone', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Pogorszone', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Niezaliczone', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Skala inna niż 100'),
      p(
        code('max'),
        ' pozwala podać surowe liczby — zbudowane strony z wszystkich stron — zamiast najpierw wyliczać procent.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 ze 169 stron', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Ruszanie nim z przeglądarki'),
      p(
        'Pasek to HTML wyrenderowany na serwerze: procent jest własną właściwością na wypełnieniu, a liczba siedzi w ',
        code('aria-valuenow'),
        ', i nic na stronie samo z siebie nie zmienia ani jednego, ani drugiego. Daj paskowi ',
        code('id'),
        ', a ',
        code('setProgress'),
        ' ruszy oba razem — wypełnienie, odczytywaną wartość i procent obok etykiety.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'Maksimum jest zapamiętywane, więc kolejne wywołania to już sama wartość. Albo sięgnij po moduł tak, jak sięgają po swoje komponenty, i pomiń paczkę całkowicie:',
      ),
      codeBlock('Gdziekolwiek', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Zakończ')`, 'javascript'),
      p(
        'Podanie ',
        code('null'),
        ' — albo czegokolwiek, co nie jest skończoną liczbą — oddaje pasek animacji nieokreślonej, więc praca, która przestaje raportować liczby, nie wymaga osobnego przypadku. ',
        code('getProgress()'),
        ' odczytuje bieżącą wartość z powrotem, we własnej skali paska.',
      ),

      h2('Spróbuj'),
      p('Ta strona ładuje runtime, więc przyciski poniżej naprawdę ruszają paskiem.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Wysyłanie', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Wyzeruj'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Gotowe'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Nieznane'),
  ),
)`, { align: 'stretch' }),
      p(
        'Pasek bez etykiety też jest ruszany, ale zostaje ',
        code('aria-hidden'),
        ' — wyrenderowano go bez nazwy celowo, a zapowiadanie teraz jego wartości wstawiłoby do drzewa dostępności bezimienny progressbar.',
      ),

      h2('Wirujący wskaźnik'),
      p(
        'Nie ma komponentu wskaźnika — wskaźnik to ikona, a ',
        code('spin'),
        ' jest tym, co ją obraca. Jak każda ikona wymiarowany jest w ',
        code('em'),
        ', więc pasuje do tekstu, przy którym stoi, bez podawania mu rozmiaru.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Wskaźnik w kontekście'),
      p(
        'Daj samodzielnemu wskaźnikowi ',
        code('label'),
        ', żeby był zapowiadany. Ten w przycisku jej nie potrzebuje — przycisk już mówi, co robi.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Ładowanie' }),
    text({ variant: 'small', tone: 'muted' }, 'Pobieranie ostatniego buildu…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Wdrażanie'),
    button({ variant: 'outline', loading: true }, 'Sprawdzanie odnośników'),
  ),
)`, { align: 'start' }),

      h2('Propsy'),
      p(code('progress()'), ' — eksportowany także jako ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'Jak daleko. Pomiń dla animacji nieokreślonej.'],
        ['max', 'number', '100', 'Jaka wartość liczy się jako ukończenie.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor wypełnienia.'],
        ['label', 'Child', '', 'Tekst nad paskiem; zarazem jego dostępna nazwa.'],
        ['showValue', 'boolean', 'false', 'Pokaż procent obok etykiety.'],
        ['height', 'Space', "'0.5rem'", 'Grubość paska.'],
      ]),
      p(code('setProgress()'), ' z ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'Pasek albo id paska. Jeśli żaden element nie ma tego id, próbowany jest selektor.'],
        ['value', 'number | null', '', 'Dokąd go przesunąć. null przywraca animację nieokreśloną.'],
        ['options.max', 'number', '100', 'Co liczy się jako ukończenie. Zapamiętywane dla kolejnych wywołań.'],
      ]),
      p(
        'Wskaźnik nie ma własnych propsów — to ',
        code("icon('spinner', { spin: true })"),
        ', i przyjmuje to, co przyjmuje ',
        code('icon()'),
        '.',
      ),
    ],
  })
