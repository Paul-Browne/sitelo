import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/tr.js'

export default () =>
  uiLayout({
    title: 'Geçiş düğmesi',
    description:
      'Basılı kalan bir düğme — onay kutusu yerine düğme olarak gösterilen bir ayar.',
    activeHref: '/tr/ui/toggle-button',
    children: [
      p(
        'Geçiş düğmesi açık ya da kapalıdır ve bunu ',
        code('aria-pressed'),
        ' ile söyler. Bir metin düzenleyicideki kalın, uygulanmış bir süzgeç, görünen bir panel.',
      ),
      p(
        'Arkasında gizli bir girdi yoktur: durumun tamamı ',
        code('aria-pressed'),
        ' değeridir, bu yüzden sunucuda işlenmiş bir geçiş bir ayarı gösterir ve onu değiştiren şey ',
        code('setPressed()'),
        ' olur. Bir forma aitse ',
        code('checkbox()'),
        ' işlevine, bir listedeki bir ayarsa ',
        code('toggle()'),
        ' — anahtar — işlevine uzanın.',
      ),

      h2('Temel geçiş'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Kalın'),
  toggleButton('Eğik'),
  toggleButton('Altı çizili'),
)`),

      h2('Türevler'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline açık'),
    toggleButton({ variant: 'outline' }, 'Outline kapalı'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost açık'),
    toggleButton({ variant: 'ghost' }, 'Ghost kapalı'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft açık'),
    toggleButton({ variant: 'soft' }, 'Soft kapalı'),
  ),
)`, { align: 'start' }),

      h2('Boyutlar'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Küçük'),
  toggleButton({ size: 'md', pressed: true }, 'Orta'),
  toggleButton({ size: 'lg', pressed: true }, 'Büyük'),
)`),

      h2('Simgelerle'),
      p(
        'Yalnızca simgeli bir geçişin erişilebilir bir ada ihtiyacı vardır — düğmeye düşen ',
        code('aria-label'),
        ' geçirin.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Kalın',
    title: 'Kalın',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Eğik',
    title: 'Eğik',
    startIcon: icon('italic'),
  }),
)`),

      h2('Devre dışı'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Açık, kilitli'),
  toggleButton({ disabled: true }, 'Kapalı, kilitli'),
)`),

      h2('Bir şey yaptırmak'),
      p(
        'Tek bir çağrı özniteliği çevirir; biçimlendirme onu izler. Tek seçimli bir ',
        code('toggleGroup()'),
        ' içinde kardeşlerini de bırakır.',
      ),
      codeBlock('Herhangi bir yer', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Kalın')`, 'javascript'),
      p('Ya da zaten çalışan bir modülünüz varsa kendi modülünüzden:'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Proplar'),
      propsTable([
        ['pressed', 'boolean', 'false', 'aria-pressed ayarlar. Sonrasında onu setPressed() değiştirir.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Basılı olmayan düğmenin görünüşü.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'button() ile aynı ölçek.'],
        ['disabled', 'boolean', 'false', 'Düğmeyi devre dışı bırakır.'],
      ]),
      p(
        'Geri kalan her şey ',
        code('button()'),
        ' işlevine düşer — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ' ve gerisi. Bunlardan bir küme için bkz. ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
