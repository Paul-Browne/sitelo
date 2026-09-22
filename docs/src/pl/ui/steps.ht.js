import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Kroki',
    description: 'Numerowany przebieg, z krokami za sobą oznaczonymi jako zrobione.',
    activeHref: '/pl/ui/steps',
    children: [
      p(
        code('current'),
        ' to indeks kroku w toku. Wszystko przed nim jest ukończone i dostaje ptaszka; wszystko po nim dopiero nadchodzi. Bieżący ma ',
        code('aria-current="step"'),
        ', więc jest nie tylko pokolorowany, ale i zapowiadany.',
      ),

      h2('Podstawowe kroki'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Instalacja' },
    { title: 'Napisz stronę' },
    { title: 'Build' },
    { title: 'Wdrożenie' },
  ],
})`, { align: 'stretch' }),

      h2('Z opisami'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Instalacja', description: 'npm install -D sitelo' },
    { title: 'Napisz stronę', description: 'src/index.ht.js' },
    { title: 'Build', description: 'sitelo build' },
    { title: 'Wdrożenie', description: 'Opublikuj dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Pionowo'),
      p('Lepsze, gdy opisy są dłuższe niż kilka słów.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Dodaj pakiet', description: 'sitelo przynosi własne Vite, więc nie ma nic więcej do instalowania.' },
    { title: 'Napisz funkcję zwracającą HTML', description: 'Jeden plik pod src/ to cała witryna.' },
    { title: 'Opublikuj wynik', description: 'dist/ to zwykłe pliki statyczne — weźmie je każdy hosting.' },
  ],
})`, { align: 'stretch' }),

      h2('Nic jeszcze nie zrobione'),
      demo(`steps({ current: 0, items: ['Instalacja', 'Konfiguracja', 'Wdrożenie'] })`, { align: 'stretch' }),

      h2('Wszystko gotowe'),
      p(
        'Ustaw ',
        code('current'),
        ' poza ostatni indeks, a każdy krok czyta się jako ukończony.',
      ),
      demo(`steps({ current: 3, items: ['Instalacja', 'Konfiguracja', 'Wdrożenie'] })`, { align: 'stretch' }),

      h2('Na telefonie'),
      p(
        'Poziomy rząd nie ma gdzie się podziać na wąskim ekranie, więc poniżej 40rem sam staje się pionowy — bez żadnego propsa. Zwęź to okno, żeby zobaczyć.',
      ),

      h2('Nazwanie'),
      p(
        'Lista jest elementem ',
        code('<ol>'),
        ', który niesie już kolejność. Dodaj ',
        code('label'),
        ', gdy strona ma więcej niż jeden zestaw kroków i trzeba je rozróżnić.',
      ),
      demo(`steps({
  label: 'Postęp wdrożenia',
  current: 1,
  items: ['Build', 'Wysyłka', 'Unieważnienie cache'],
})`, { align: 'stretch' }),

      h2('Posuwanie przebiegu'),
      p(
        'Stan to trzy nazwy klas i jedno ',
        code('aria-current'),
        ', rozsiane po wszystkich krokach. ',
        code('setStep()'),
        ' rusza je razem, więc kreator posuwający się w przeglądarce to jedno wywołanie, a nie pętla.',
      ),
      p(
        'Indeks poza ostatnim krokiem zostawia wszystkie ukończone, a tak właśnie wygląda zakończony przebieg. Albo z atrybutu zdarzenia, bez niczego w paczce:',
      ),
      codeBlock('Gdziekolwiek', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Dalej')`, 'javascript'),
      p('Albo z własnego modułu, gdy już jakiś działa:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Propsy'),
      propsTable([
        ['items', 'Array', '[]', 'Ciągi znaków albo obiekty { title, description }.'],
        ['current', 'number', '0', 'Indeks kroku w toku.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Układ. Poziomy poniżej 40rem staje się pionowy.'],
        ['label', 'string', '', 'Dostępna nazwa listy.'],
      ]),
    ],
  })
