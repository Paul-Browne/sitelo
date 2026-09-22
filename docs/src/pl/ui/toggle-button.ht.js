import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/pl.js'

export default () =>
  uiLayout({
    title: 'Przycisk przełączany',
    description:
      'Przycisk, który zostaje wciśnięty — ustawienie pokazane jako przycisk, a nie jako pole wyboru.',
    activeHref: '/pl/ui/toggle-button',
    children: [
      p(
        'Przycisk przełączany jest włączony albo wyłączony i mówi o tym przez ',
        code('aria-pressed'),
        '. Pogrubienie w edytorze tekstu, zastosowany filtr, pokazany panel.',
      ),
      p(
        'Nie stoi za nim żaden ukryty input: ',
        code('aria-pressed'),
        ' to cały stan, więc przycisk renderowany na serwerze pokazuje ustawienie, a ',
        code('setPressed()'),
        ' jest tym, co je zmienia. Po ',
        code('checkbox()'),
        ' sięgaj, gdy rzecz należy do formularza, a po ',
        code('toggle()'),
        ' — przełącznik — gdy jest ustawieniem na liście.',
      ),

      h2('Podstawowy przycisk'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Pogrubienie'),
  toggleButton('Kursywa'),
  toggleButton('Podkreślenie'),
)`),

      h2('Warianty'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline włączony'),
    toggleButton({ variant: 'outline' }, 'Outline wyłączony'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost włączony'),
    toggleButton({ variant: 'ghost' }, 'Ghost wyłączony'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft włączony'),
    toggleButton({ variant: 'soft' }, 'Soft wyłączony'),
  ),
)`, { align: 'start' }),

      h2('Rozmiary'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Mały'),
  toggleButton({ size: 'md', pressed: true }, 'Średni'),
  toggleButton({ size: 'lg', pressed: true }, 'Duży'),
)`),

      h2('Z ikonami'),
      p(
        'Przycisk z samą ikoną potrzebuje dostępnej nazwy — podaj ',
        code('aria-label'),
        ', który przechodzi na przycisk.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Pogrubienie',
    title: 'Pogrubienie',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Kursywa',
    title: 'Kursywa',
    startIcon: icon('italic'),
  }),
)`),

      h2('Wyłączony'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Włączony, zablokowany'),
  toggleButton({ disabled: true }, 'Wyłączony, zablokowany'),
)`),

      h2('Żeby coś robił'),
      p(
        'Jedno wywołanie przerzuca atrybut; styl idzie za nim. Wewnątrz jednokrotnego ',
        code('toggleGroup()'),
        ' puszcza też rodzeństwo.',
      ),
      codeBlock('Gdziekolwiek', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Pogrubienie')`, 'javascript'),
      p('Albo z własnego modułu, gdy już jakiś działa:'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Propsy'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Ustawia aria-pressed. setPressed() zmienia je później.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Jak wygląda przycisk niewciśnięty.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Ta sama skala co button().'],
        ['disabled', 'boolean', 'false', 'Wyłącza przycisk.'],
      ]),
      p(
        'Cała reszta przechodzi do ',
        code('button()'),
        ' — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' i tak dalej. Dla zestawu takich zobacz ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
