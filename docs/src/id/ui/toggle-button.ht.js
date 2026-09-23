import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tombol alih',
    description:
      'Tombol yang tetap tertekan — sebuah pengaturan yang ditampilkan sebagai tombol alih-alih kotak centang.',
    activeHref: '/id/ui/toggle-button',
    children: [
      p(
        'Tombol alih bisa nyala atau mati, dan ia menyatakannya lewat ',
        code('aria-pressed'),
        '. Tebal di editor teks, filter yang sedang diterapkan, panel yang sedang ditampilkan.',
      ),
      p(
        'Tidak ada masukan tersembunyi di baliknya: ',
        code('aria-pressed'),
        ' adalah keseluruhan keadaannya, jadi tombol alih yang dirender di server menampilkan sebuah pengaturan dan ',
        code('setPressed()'),
        ' yang mengubahnya. Raih ',
        code('checkbox()'),
        ' ketika ia berada di dalam formulir, dan ',
        code('toggle()'),
        ' — sakelarnya — ketika ia adalah pengaturan di dalam sebuah daftar.',
      ),

      h2('Tombol alih dasar'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true }, 'Tebal'),
  toggleButton('Miring'),
  toggleButton('Bergaris bawah'),
)`),

      h2('Varian'),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'outline', pressed: true }, 'Outline nyala'),
    toggleButton({ variant: 'outline' }, 'Outline mati'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'ghost', pressed: true }, 'Ghost nyala'),
    toggleButton({ variant: 'ghost' }, 'Ghost mati'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    toggleButton({ variant: 'soft', pressed: true }, 'Soft nyala'),
    toggleButton({ variant: 'soft' }, 'Soft mati'),
  ),
)`, { align: 'start' }),

      h2('Ukuran'),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center' },
  toggleButton({ size: 'sm', pressed: true }, 'Kecil'),
  toggleButton({ size: 'md', pressed: true }, 'Sedang'),
  toggleButton({ size: 'lg', pressed: true }, 'Besar'),
)`),

      h2('Dengan ikon'),
      p(
        'Tombol alih yang hanya berikon butuh nama yang dapat diakses — berikan ',
        code('aria-label'),
        ', yang jatuh ke tombolnya.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({
    pressed: true,
    'aria-label': 'Tebal',
    title: 'Tebal',
    startIcon: icon('bold'),
  }),
  toggleButton({
    'aria-label': 'Miring',
    title: 'Miring',
    startIcon: icon('italic'),
  }),
)`),

      h2('Dinonaktifkan'),
      demo(`stack({ direction: 'row', gap: 'sm' },
  toggleButton({ pressed: true, disabled: true }, 'Nyala, terkunci'),
  toggleButton({ disabled: true }, 'Mati, terkunci'),
)`),

      h2('Membuatnya melakukan sesuatu'),
      p(
        'Satu panggilan membalik atributnya; penataannya mengikuti. Di dalam ',
        code('toggleGroup()'),
        ' berpilihan tunggal, ia juga melepaskan saudara-saudaranya.',
      ),
      codeBlock('Di mana saja', `toggleButton({ onclick: "import('/su/pressed.js').then(m=>m.set(this))" }, 'Tebal')`, 'javascript'),
      p('Atau dari modul Anda sendiri, ketika sudah ada yang berjalan:'),
      codeBlock('src/main.js', `import { setPressed } from 'sitelo/ui/client'

setPressed('bold')`, 'javascript'),

      h2('Props'),
      propsTable([
        ['pressed', 'boolean', 'false', 'Menyetel aria-pressed. setPressed() mengubahnya setelahnya.'],
        ['variant', "'outline' | 'ghost' | 'soft'", "'outline'", 'Seperti apa rupa tombol yang tidak tertekan.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Skala yang sama dengan button().'],
        ['disabled', 'boolean', 'false', 'Menonaktifkan tombolnya.'],
      ]),
      p(
        'Selebihnya jatuh ke ',
        code('button()'),
        ' — ',
        code('startIcon'),
        ', ',
        code('endIcon'),
        ', ',
        code('onclick'),
        ', dan selebihnya. Untuk sekumpulan darinya, lihat ',
        code('toggleGroup()'),
        '.',
      ),
    ],
  })
