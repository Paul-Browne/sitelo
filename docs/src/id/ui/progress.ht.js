import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Progres',
    description:
      'Bilah untuk pekerjaan yang ujungnya diketahui, pemutar untuk yang tidak.',
    activeHref: '/id/ui/progress',
    children: [
      p(
        'Pakai bilah tentu setiap kali Anda tahu berapa banyak yang tersisa — hanya itulah yang mengatakan sesuatu kepada pembacanya. Lewati ',
        code('value'),
        ' dan bilahnya justru beranimasi, yang berkata “masih bekerja” dan tidak lebih.',
      ),

      h2('Tentu'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 25 }),
  progress({ value: 60 }),
  progress({ value: 100 }),
)`, { align: 'stretch' }),

      h2('Tak tentu'),
      demo(`progress()`, { align: 'stretch' }),
      p(
        'Bilah tanpa ',
        code('label'),
        ' ditandai ',
        code('aria-hidden'),
        ' — peran progressbar tanpa nama yang dapat diakses tidak mengatakan apa pun kepada pembaca layar, jadi bilah tak berlabel diperlakukan sebagai hiasan. Beri label pada apa pun yang memang dimaksudkan untuk diikuti pembacanya.',
      ),

      h2('Label'),
      p(
        'Label menamai apa yang sedang terjadi; ',
        code('showValue'),
        ' menambahkan persentasenya di sebelah kanan.',
      ),
      demo(`stack({ gap: 'lg' },
  progress({ value: 72, label: 'Merender halaman', showValue: true }),
  progress({ value: 30, max: 60, label: 'Mengoptimasi gambar', showValue: true }),
  progress({ label: 'Menunggu penerapan' }),
)`, { align: 'stretch' }),

      h2('Warna dan tinggi'),
      demo(`stack({ gap: 'lg' },
  progress({ value: 80, color: 'success', label: 'Lulus', showValue: true }),
  progress({ value: 45, color: 'warning', label: 'Menurun', showValue: true }),
  progress({ value: 20, color: 'danger', label: 'Gagal', showValue: true }),
  progress({ value: 60, color: 'neutral', height: 'xs' }),
  progress({ value: 60, color: 'primary', height: '1rem' }),
)`, { align: 'stretch' }),

      h2('Skala selain 100'),
      p(
        code('max'),
        ' memungkinkan Anda memberikan angka mentahnya — halaman yang sudah dibangun dari total halaman — alih-alih menghitung persentasenya lebih dulu.',
      ),
      demo(`progress({ value: 118, max: 169, label: '118 dari 169 halaman', showValue: true })`, {
        align: 'stretch',
      }),

      h2('Menggerakkannya dari peramban'),
      p(
        'Bilahnya adalah HTML yang dirender di server: persentasenya berupa properti kustom pada isiannya dan sebuah angka di ',
        code('aria-valuenow'),
        ', dan tidak ada di halaman itu yang mengubah keduanya sendiri. Beri bilahnya sebuah ',
        code('id'),
        ' dan ',
        code('setProgress'),
        ' memindahkan keduanya bersamaan — isiannya, nilai yang diumumkan, dan persentase di samping labelnya.',
      ),
      codeBlock('src/main.js', `import { setProgress } from 'sitelo/ui/client'

const request = new XMLHttpRequest()

request.upload.addEventListener('progress', (event) => {
  setProgress('upload', event.loaded, { max: event.total })
})`, 'javascript'),
      p(
        'Nilai maksimumnya diingat, jadi panggilan berikutnya cukup berupa sebuah nilai. Atau raih modulnya dengan cara yang sama seperti komponen meraih modulnya, dan lewati bundelnya sepenuhnya:',
      ),
      codeBlock('Di mana saja', `button({ onclick: "import('/su/progress.js').then(m=>m.set('upload',100))" }, 'Selesaikan')`, 'javascript'),
      p(
        'Memberikan ',
        code('null'),
        ' — atau apa pun yang bukan angka berhingga — mengembalikan bilahnya ke animasi tak tentu, jadi pekerjaan yang berhenti melaporkan angka tidak perlu ditangani secara khusus. ',
        code('getProgress()'),
        ' membaca kembali nilai saat ini, pada skala bilahnya sendiri.',
      ),

      h2('Cobalah'),
      p('Halaman ini memuat runtime-nya, jadi tombol di bawah benar-benar menggerakkan bilahnya.'),
      demo(`stack({ gap: 'md' },
  progress({ id: 'demo-progress', value: 0, label: 'Mengunggah', showValue: true }),
  stack({ direction: 'row', gap: 'sm', wrap: true },
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',0))" }, 'Setel ulang'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',35))" }, '35%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',80))" }, '80%'),
    button({ size: 'sm', variant: 'outline', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',100))" }, 'Selesai'),
    button({ size: 'sm', variant: 'ghost', onclick: "import('/su/progress.js').then(m=>m.set('demo-progress',null))" }, 'Tidak diketahui'),
  ),
)`, { align: 'stretch' }),
      p(
        'Bilah tak berlabel ikut digerakkan, tetapi ia tetap ',
        code('aria-hidden'),
        ' — ia sengaja dirender tanpa nama, dan mengumumkan sebuah nilai padanya sekarang akan menaruh progressbar tanpa nama di pohon aksesibilitas.',
      ),

      h2('Pemutar'),
      p(
        'Tidak ada komponen pemutar — pemutarnya adalah sebuah ikon, dan ',
        code('spin'),
        ' yang memutarnya. Seperti setiap ikon, ia diukur dalam ',
        code('em'),
        ', jadi ia cocok dengan teks apa pun di sebelahnya tanpa diberi tahu ukurannya.',
      ),
      demo(`stack({ direction: 'row', gap: 'lg', align: 'center' },
  icon('spinner', { spin: true, size: 'sm' }),
  icon('spinner', { spin: true }),
  icon('spinner', { spin: true, size: 'lg' }),
)`),

      h2('Pemutar dalam konteks'),
      p(
        'Beri pemutar yang berdiri sendiri sebuah ',
        code('label'),
        ' agar ia diumumkan. Yang di dalam tombol tidak membutuhkannya — tombolnya sudah menyatakan apa yang sedang dilakukannya.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', align: 'center' },
    icon('spinner', { spin: true, label: 'Memuat' }),
    text({ variant: 'small', tone: 'muted' }, 'Mengambil build terbaru…'),
  ),
  stack({ direction: 'row', gap: 'sm' },
    button({ loading: true }, 'Menerapkan'),
    button({ variant: 'outline', loading: true }, 'Memeriksa tautan'),
  ),
)`, { align: 'start' }),

      h2('Props'),
      p(code('progress()'), ' — diekspor juga sebagai ', code('progressBar'), ':'),
      propsTable([
        ['value', 'number', '', 'Sejauh mana ia berjalan. Lewati untuk animasi tak tentu.'],
        ['max', 'number', '100', 'Nilai mana yang dihitung sebagai selesai.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna isiannya.'],
        ['label', 'Child', '', 'Teks di atas bilahnya; sekaligus namanya yang dapat diakses.'],
        ['showValue', 'boolean', 'false', 'Menampilkan persentasenya di samping labelnya.'],
        ['height', 'Space', "'0.5rem'", 'Ketebalan bilahnya.'],
      ]),
      p(code('setProgress()'), ' dari ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['target', 'Element | string', '', 'Bilahnya, atau id salah satunya. Sebuah pemilih dicoba bila tidak ada elemen ber-id itu.'],
        ['value', 'number | null', '', 'Ke mana ia dipindahkan. null mengembalikannya ke animasi tak tentu.'],
        ['options.max', 'number', '100', 'Apa yang dihitung sebagai selesai. Diingat untuk panggilan sesudahnya.'],
      ]),
      p(
        'Pemutarnya tidak punya props sendiri — ia adalah ',
        code("icon('spinner', { spin: true })"),
        ', dan menerima apa pun yang diterima ',
        code('icon()'),
        '.',
      ),
    ],
  })
