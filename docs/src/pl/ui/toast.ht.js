import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Powiadomienie',
    description:
      'Przelotny komunikat w rogu, dodawany ze skryptu do obszaru wyrenderowanego przez stronę.',
    activeHref: '/pl/ui/toast',
    children: [
      p(
        'Powiadomienie to jedyny komponent tutaj, który nie może być statyczny: pojawia się w reakcji na coś, co się stało. Strona renderuje pusty obszar przez ',
        code('toasts()'),
        ', a ',
        code('toast()'),
        ' z ',
        code('sitelo/ui/client'),
        ' do niego dopisuje.',
      ),
      p(
        'Obszar jest uprzejmym obszarem żywym, więc cokolwiek do niego dopisane zostaje zapowiedziane bez zabierania fokusu.',
      ),

      h2('Jak to ustawić'),
      p(
        'Umieść obszar gdziekolwiek w body — ma pozycję stałą, więc gdzie, nie ma znaczenia:',
      ),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …strona…
  toasts(),
)`, 'javascript'),
      p(
        'To jedyna część runtime’u, której nic na stronie nie uruchamia za Ciebie, więc jest jedyną, po którą sięgasz sam — z atrybutu zdarzenia, bez niczego w paczce:',
      ),
      codeBlock('Gdziekolwiek', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Zapisano.',{color:'success'}))" }, 'Zapisz')`, 'javascript'),
      p('Albo z własnego modułu, gdy już jakiś działa:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Zapisano.', { color: 'success' })`, 'javascript'),

      h2('Spróbuj'),
      p(
        'Ta strona renderuje obszar ',
        code('toasts()'),
        ', a przyciski poniżej same pobierają runtime, więc naprawdę wywołują powiadomienia — w prawym dolnym rogu. Nic nie jest ładowane, dopóki któregoś nie naciśniesz.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Zapisano.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('Dwie strony nie mają meta description.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('Build się nie powiódł. Sprawdź raport odnośników.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('To zostaje, dopóki go nie zamkniesz.',{color:'neutral',duration:0}))",
  }, 'Do zamknięcia'),
)`),
      // Obszar żywy, do którego dopisują przyciski tej strony. Ma pozycję
      // stałą, więc renderuje się tutaj, a pojawia w rogu okna.
      preview('toasts()'),

      h2('Opcje'),
      p(
        code('duration'),
        ' to czas, przez jaki powiadomienie zostaje, w milisekundach; ',
        code('0'),
        ' trzyma je, dopóki ktoś go nie zamknie. Każde dostaje przycisk zamykający, podpięty do tego samego handlera co alert.',
      ),
      codeBlock('Opcje', `toast('Zapisano.', { color: 'success' })
toast('Wciąż pracuję…', { color: 'neutral', duration: 0 })
toast('Wdrożono w 1,7s', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Co renderuje'),
      p(
        'Powiadomienie to ',
        code('alert()'),
        ' w obszarze powiadomień — te same znaczniki, te same kolory, ten sam przycisk zamykający. Nic nowego do nauczenia i nic dodatkowego do ostylowania.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Zapisano.'),
  alert({ color: 'danger', dismissible: true }, 'Build się nie powiódł. Sprawdź raport odnośników.'),
)`, { align: 'stretch' }),

      h2('Kiedy go używać'),
      p(
        'Powiadomienie służy do potwierdzenia czegoś, co czytający właśnie zrobił. To złe miejsce na cokolwiek, na co musi zareagować albo co musi uważnie przeczytać — znika, łatwo je przeoczyć, a na witrynie statycznej większość komunikatów należy do samej strony, jako ',
        code('alert()'),
        '.',
      ),

      h2('Propsy'),
      p(
        code('toasts()'),
        ' nie przyjmuje własnych propsów. ',
        code('toast()'),
        ' z ',
        code('sitelo/ui/client'),
        ':',
      ),
      propsTable([
        ['message', 'string', '', 'Tekst. Ustawiany jako textContent, więc nigdy nie jest interpretowany jako znaczniki.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Której palety użyć.'],
        ['duration', 'number', '4000', 'Milisekundy do zniknięcia. 0 je zatrzymuje.'],
      ], { headers: ['Argument', 'Typ', 'Domyślnie', 'Opis'] }),
      p(
        'Zwraca dodany element albo ',
        code('null'),
        ', gdy strona nie ma obszaru ',
        code('toasts()'),
        '.',
      ),
    ],
  })
