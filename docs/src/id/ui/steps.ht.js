import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Langkah',
    description:
      'Alur bernomor, dengan langkah yang sudah Anda lewati ditandai selesai.',
    activeHref: '/id/ui/steps',
    children: [
      p(
        code('current'),
        ' adalah indeks langkah yang sedang berjalan. Semua sebelumnya sudah selesai dan mendapat tanda centang; semua sesudahnya masih akan datang. Yang sedang berjalan ditandai ',
        code('aria-current="step"'),
        ', jadi ia diumumkan sekaligus diwarnai.',
      ),

      h2('Langkah dasar'),
      demo(`steps({
  current: 1,
  items: [
    { title: 'Pasang' },
    { title: 'Tulis sebuah halaman' },
    { title: 'Bangun' },
    { title: 'Terapkan' },
  ],
})`, { align: 'stretch' }),

      h2('Dengan deskripsi'),
      demo(`steps({
  current: 2,
  items: [
    { title: 'Pasang', description: 'npm install -D sitelo' },
    { title: 'Tulis sebuah halaman', description: 'src/index.ht.js' },
    { title: 'Bangun', description: 'sitelo build' },
    { title: 'Terapkan', description: 'Terbitkan dist/' },
  ],
})`, { align: 'stretch' }),

      h2('Tegak'),
      p('Lebih baik ketika deskripsinya lebih panjang dari beberapa kata.'),
      demo(`steps({
  direction: 'vertical',
  current: 1,
  items: [
    { title: 'Tambahkan paketnya', description: 'sitelo membawa Vite-nya sendiri, jadi tidak ada lagi yang perlu dipasang.' },
    { title: 'Tulis fungsi yang mengembalikan HTML', description: 'Satu berkas di bawah src/ sudah menjadi satu situs utuh.' },
    { title: 'Terbitkan keluarannya', description: 'dist/ adalah berkas statis biasa — hosting mana pun menerimanya.' },
  ],
})`, { align: 'stretch' }),

      h2('Belum ada yang selesai'),
      demo(`steps({ current: 0, items: ['Pasang', 'Konfigurasi', 'Terapkan'] })`, { align: 'stretch' }),

      h2('Semuanya selesai'),
      p(
        'Setel ',
        code('current'),
        ' melewati indeks terakhirnya dan setiap langkah terbaca sebagai selesai.',
      ),
      demo(`steps({ current: 3, items: ['Pasang', 'Konfigurasi', 'Terapkan'] })`, { align: 'stretch' }),

      h2('Di ponsel'),
      p(
        'Baris mendatar tidak punya tempat untuk pergi di layar sempit, jadi ia berubah tegak sendiri di bawah 40rem — tanpa props apa pun. Sempitkan jendela ini untuk melihatnya.',
      ),

      h2('Memberinya label'),
      p(
        'Daftarnya adalah sebuah ',
        code('<ol>'),
        ', yang sudah membawa urutannya. Tambahkan ',
        code('label'),
        ' ketika halamannya punya lebih dari satu rangkaian langkah dan keduanya perlu dibedakan.',
      ),
      demo(`steps({
  label: 'Kemajuan penerapan',
  current: 1,
  items: ['Bangun', 'Unggah', 'Batalkan singgahan'],
})`, { align: 'stretch' }),

      h2('Memajukan alurnya'),
      p(
        'Keadaannya adalah tiga nama kelas dan satu ',
        code('aria-current'),
        ', tersebar di setiap langkah. ',
        code('setStep()'),
        ' memindahkan semuanya bersamaan, jadi wisaya yang maju di peramban cukup satu panggilan alih-alih sebuah perulangan.',
      ),
      p('Indeks yang melewati langkah terakhir membuat semuanya selesai, dan begitulah rupa alur yang tuntas. Atau dari sebuah atribut peristiwa, tanpa apa pun dibundel:'),
      codeBlock('Di mana saja', `button({ onclick: "import('/su/steps.js').then(m=>m.set('checkout',2))" }, 'Berikutnya')`, 'javascript'),
      p('Atau dari modul Anda sendiri, ketika sudah ada yang berjalan:'),
      codeBlock('src/main.js', `import { setStep } from 'sitelo/ui/client'

setStep('checkout', 2)`, 'javascript'),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'String, atau objek { title, description }.'],
        ['current', 'number', '0', 'Indeks langkah yang sedang berjalan.'],
        ['direction', "'horizontal' | 'vertical'", "'horizontal'", 'Tata letak. Yang mendatar berubah tegak di bawah 40rem.'],
        ['label', 'string', '', 'Nama yang dapat diakses untuk daftarnya.'],
      ]),
    ],
  })
