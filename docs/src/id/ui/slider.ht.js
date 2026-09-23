import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Penggeser',
    description:
      'Masukan range bawaan peramban, ditata agar senada dengan kendali lain.',
    activeHref: '/id/ui/slider',
    children: [
      p(
        'Ini adalah ',
        code('<input type="range">'),
        ' sungguhan — tombol panah, Home dan End, serta pengumuman yang benar semuanya datang dari peramban. Hanya jalur dan tuasnya yang ditata.',
      ),

      h2('Penggeser dasar'),
      demo(`sliderField({ label: 'Kualitas', name: 'quality', value: 70 })`, { align: 'stretch' }),

      h2('Rentang dan langkah'),
      demo(`stack({ gap: 'lg' },
  sliderField({ label: 'Volume', name: 'volume', min: 0, max: 100, value: 40 }),
  sliderField({ label: 'Kolom', name: 'columns', min: 1, max: 6, step: 1, value: 3 }),
  sliderField({ label: 'Skala', name: 'scale', min: 0.5, max: 2, step: 0.25, value: 1 }),
)`, { align: 'stretch' }),

      h2('Menampilkan nilainya'),
      p(
        code('showValue'),
        ' menaruh sebuah ',
        code('<output>'),
        ' di samping jalurnya yang membawa nilai saat halamannya dibangun, dan masukannya mengambil penangannya sendiri pada seretan pertama, sehingga angkanya mengikuti tuasnya. Tidak ada yang perlu diimpor: nilai yang diam-diam menjadi basi akan lebih buruk daripada tidak ada nilai sama sekali, jadi yang satu ini tidak diserahkan kepada Anda.',
      ),
      demo(`sliderField({
  label: 'Kualitas gambar',
  name: 'jpeg-quality',
  min: 40,
  max: 100,
  value: 82,
  showValue: true,
  help: 'Makin tinggi makin besar dan makin lambat dibangun.',
})`, { align: 'stretch' }),

      h2('Menyetelnya dari kode Anda sendiri'),
      p(
        'Penggeser adalah kendali formulir, jadi pemiliknya adalah pembacanya — tetapi sebuah prasetel, tombol setel ulang, atau nilai yang datang lewat jaringan tetap harus bisa menggerakkannya. Beri ia sebuah ',
        code('id'),
        ' dan ',
        code('setSlider'),
        ' melakukannya, sambil membawa serta ',
        code('<output>'),
        '-nya.',
      ),
      codeBlock('src/main.js', `import { setSlider } from 'sitelo/ui/client'

setSlider('volume', 50)`, 'javascript'),
      p('Atau raih modulnya dengan cara yang sama seperti komponen meraih modulnya, dan lewati bundelnya sepenuhnya:'),
      codeBlock('Di mana saja', `button({ onclick: "import('/su/slider.js').then(m=>m.set('volume',50))" }, 'Setengah')`, 'javascript'),
      p(
        'Peramban membatasinya ke ',
        code('min'),
        ' dan ',
        code('max'),
        ' lalu mengepaskannya ke ',
        code('step'),
        ', jadi yang kembali adalah tempat penggesernya mendarat, bukan apa yang diberikan kepadanya. ',
        code('input'),
        ' dan ',
        code('change'),
        ' menyusul, karena pratinjau yang mendengarkan seretannya tidak punya cara lain untuk mendengar perpindahan yang bukan ia sebabkan. ',
        code('getSlider()'),
        ' membaca kembali nilainya.',
      ),

      h2('Cobalah'),
      p('Halaman ini memuat runtime-nya, jadi tombol di bawah benar-benar menggerakkan penggesernya.'),
      demo(`stack({ gap: 'md' },
  slider({ id: 'demo-slider', value: 40, showValue: true, 'aria-label': 'Demo' }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',0))" }, 'Min'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',50))" }, 'Setengah'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/slider.js').then(m=>m.set('demo-slider',100))" }, 'Maks'),
  ),
)`, { align: 'stretch' }),

      h2('Warna'),
      demo(`stack({ gap: 'lg' },
  slider({ value: 70, color: 'primary', 'aria-label': 'Primary' }),
  slider({ value: 55, color: 'success', 'aria-label': 'Success' }),
  slider({ value: 35, color: 'warning', 'aria-label': 'Warning' }),
  slider({ value: 20, color: 'danger', 'aria-label': 'Danger' }),
)`, { align: 'stretch' }),

      h2('Dinonaktifkan'),
      demo(`sliderField({ label: 'Terkunci', name: 'locked', value: 50, disabled: true })`, {
        align: 'stretch',
      }),

      h2('Tanpa label'),
      p(
        code('slider()'),
        ' telanjang adalah kendalinya sendiri — beri ia sebuah ',
        code('aria-label'),
        ' ketika tidak ada label terlihat yang menunjuknya.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ variant: 'small', tone: 'muted' }, 'Aa'),
  slider({ min: 12, max: 24, value: 16, 'aria-label': 'Ukuran teks' }),
  text({ tone: 'muted' }, 'Aa'),
)`, { align: 'stretch' }),

      h2('Di dalam formulir'),
      demo(`card(
  cardBody(
    stack({ gap: 'lg' },
      sliderField({ label: 'Lebar gambar maksimum', name: 'max-width', min: 640, max: 2560, step: 160, value: 1280, showValue: true }),
      sliderField({ label: 'Kualitas', name: 'q', min: 40, max: 100, value: 82, showValue: true }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ type: 'submit' }, 'Simpan'),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['min', 'number | string', '0', 'Batas bawah.'],
        ['max', 'number | string', '100', 'Batas atas.'],
        ['step', 'number | string', '', 'Kelipatan. Lewati untuk bawaan peramban, yaitu 1.'],
        ['value', 'number | string', '', 'Nilai awal.'],
        ['showValue', 'boolean', 'false', 'Menambahkan <output> berisi nilai saat build.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna tuasnya.'],
        ['name', 'string', '', 'Nama bidang formulir; id-nya diturunkan darinya.'],
        ['disabled', 'boolean', 'false', 'Menonaktifkan kendalinya.'],
      ]),
      p(
        code('sliderField()'),
        ' tambahan menerima ',
        code('label'),
        ', ',
        code('help'),
        ', ',
        code('error'),
        ', dan ',
        code('required'),
        ' — lihat ',
        code('textField()'),
        '.',
      ),
    ],
  })
