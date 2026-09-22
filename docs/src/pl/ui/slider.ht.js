import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Suwak',
    description: 'Natywne pole zakresu, ostylowane pod resztę kontrolek.',
    activeHref: '/pl/ui/slider',
    children: [
      p(
        'To prawdziwy ',
        code('<input type="range">'),
        ' — strzałki, Home i End oraz poprawne zapowiadanie pochodzą od przeglądarki. Ostylowane są tylko tor i uchwyt.',
      ),

      h2('Podstawowy suwak'),
      demo(`sliderField({ label: 'Jakość', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Zakres i krok'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Głośność', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Kolumny', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Skala', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Pokazywanie wartości'),
      p(
        code('showValue'),
        ' stawia obok toru element ',
        code('<output>'),
        ' niosący wartość, z którą strona została zbudowana, a pole samo pobiera swój handler przy pierwszym przeciągnięciu, więc liczba idzie za uchwytem. Nie ma czego importować: wartość, która po cichu stałaby się nieaktualna, byłaby gorsza niż jej brak, więc tego akurat nie zostawiono Tobie.',
      ),
      demo(`sliderField({
  label: 'Jakość obrazów',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Wyżej znaczy większe pliki i wolniejszy build.',
})`, { align: 'stretch' }),

      h2('Ustawianie z własnego kodu'),
      p(
        'Suwak to kontrolka formularza, więc należy do czytającego — ale ustawienie wstępne, przycisk resetu albo wartość przychodząca z sieci nadal muszą móc nim ruszyć. Daj mu ',
        code('id'),
        ', a ',
        code('setSlider'),
        ' to zrobi, zabierając ze sobą ',
        code('<output>'),
        '.',
      ),
      codeBlock('src/main.js', `import { setSlider } from 'sitelo/ui/client'

setSlider('volume', 50)`, 'javascript'),
      p(
        'Albo sięgnij po moduł tak, jak sięgają po swoje komponenty, i pomiń paczkę całkowicie:',
      ),
      codeBlock('Gdziekolwiek', `button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Połowa')`, 'javascript'),
      p(
        'Przeglądarka przycina wartość do ',
        code('min'),
        ' i ',
        code('max'),
        ' oraz przyciąga ją do ',
        code('step'),
        ', więc to, co wraca, jest miejscem, w którym suwak wylądował, a nie tym, co mu podano. Idą za tym zdarzenia ',
        code('input'),
        ' i ',
        code('change'),
        ', bo podgląd nasłuchujący przeciągnięcia nie ma innego sposobu, żeby usłyszeć ruch, którego sam nie wywołał. ',
        code('getSlider()'),
        ' odczytuje wartość z powrotem.',
      ),

      h2('Spróbuj'),
      p('Ta strona ładuje runtime, więc przyciski poniżej naprawdę ruszają suwakiem.'),
      demo(`stack({ gap: 'md' },
  slider({ id: 'demo-slider', value: 40, showValue: true, 'aria-label': 'Demo' }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',0))" }, 'Min'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',50))" }, 'Połowa'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',100))" }, 'Maks'),
  ),
)`, { align: 'stretch' }),

      h2('Kolory'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Wyłączony'),
      demo(`sliderField({ label: 'Zablokowany', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Bez etykiety'),
      p(
        'Goły ',
        code('slider()'),
        ' to sama kontrolka — daj mu ',
        code('aria-label'),
        ', gdy nie ma widocznej etykiety, która by go wskazywała.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Rozmiar tekstu' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('W formularzu'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Maksymalna szerokość obrazów', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Jakość', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Zapisz'),
  ),
)`, { align: 'stretch' }),

      h2('Propsy'),
      propsTable([
        ['min', 'number | string', '0', 'Dolna granica.'],
        ['max', 'number | string', '100', 'Górna granica.'],
        ['step', 'number | string', '', 'Przyrost. Pomiń dla domyślnego 1 z przeglądarki.'],
        ['value', 'number | string', '', 'Wartość początkowa.'],
        ['showValue', 'boolean', 'false', 'Dodaje <output> z wartością z buildu.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Kolor uchwytu.'],
        ['name', 'string', '', 'Nazwa pola formularza; z niej wyprowadzany jest id.'],
        ['disabled', 'boolean', 'false', 'Wyłącza kontrolkę.'],
      ]),
      p(
        code('sliderField()'),
        ' przyjmuje dodatkowo ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ' i ',
        code('required'),
        ' — zobacz ',
        code('textField()'),
        '.',
      ),
    ],
  })
