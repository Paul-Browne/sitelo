import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'
import { preview } from '../../lib/ui-demo.js'

export default () =>
  uiLayout({
    title: 'Toast',
    description:
      'Pesan sementara di sudut, ditambahkan dari skrip ke sebuah wilayah yang dirender halamannya.',
    activeHref: '/id/ui/toast',
    children: [
      p(
        'Toast adalah satu-satunya komponen di sini yang tidak bisa statis: ia muncul sebagai tanggapan atas sesuatu yang terjadi. Halamannya merender wilayah kosong dengan ',
        code('toasts()'),
        ', dan ',
        code('toast()'),
        ' dari ',
        code('sitelo/ui/client'),
        ' menambahkan ke sana.',
      ),
      p(
        'Wilayahnya adalah wilayah langsung yang sopan, jadi apa pun yang ditambahkan diumumkan tanpa merebut fokus.',
      ),

      h2('Menyiapkannya'),
      p('Taruh wilayahnya di mana saja di dalam body — ia berposisi tetap, jadi tempatnya tidak penting:'),
      codeBlock('src/index.ht.js', `import { toasts } from 'sitelo/ui'

body(
  // …halamannya…
  toasts(),
)`, 'javascript'),
      p(
        'Inilah satu-satunya bagian runtime yang tidak dipicu apa pun di halamannya untuk Anda, jadi inilah satu-satunya bagian yang Anda raih sendiri — dari sebuah atribut peristiwa, tanpa apa pun dibundel:',
      ),
      codeBlock('Di mana saja', `button({ onclick: "import('/su/toast.js').then(m=>m.toast('Tersimpan.',{color:'success'}))" }, 'Simpan')`, 'javascript'),
      p('Atau dari modul Anda sendiri, ketika sudah ada yang berjalan:'),
      codeBlock('src/main.js', `import { toast } from 'sitelo/ui/client'

toast('Tersimpan.', { color: 'success' })`, 'javascript'),

      h2('Cobalah'),
      p(
        'Halaman ini merender sebuah wilayah ',
        code('toasts()'),
        ' dan tombol di bawah mengambil runtime-nya sendiri, jadi mereka benar-benar memunculkan toast — di kanan bawah. Tidak ada yang dimuat sampai Anda menekan salah satunya.',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', wrap: true },
  button({
    variant: 'soft',
    color: 'success',
    onclick: "import('/su/toast.js').then(m=>m.toast('Tersimpan.',{color:'success'}))",
  }, 'Success'),
  button({
    variant: 'soft',
    color: 'warning',
    onclick: "import('/su/toast.js').then(m=>m.toast('Dua halaman tidak punya deskripsi meta.',{color:'warning'}))",
  }, 'Warning'),
  button({
    variant: 'soft',
    color: 'danger',
    onclick: "import('/su/toast.js').then(m=>m.toast('Build gagal. Periksa laporan tautannya.',{color:'danger'}))",
  }, 'Danger'),
  button({
    variant: 'soft',
    color: 'neutral',
    onclick: "import('/su/toast.js').then(m=>m.toast('Yang ini bertahan sampai Anda menutupnya.',{color:'neutral',duration:0}))",
  }, 'Sampai ditutup'),
)`),
      // Wilayah langsung tempat tombol halaman ini menambahkan. Berposisi
      // tetap, jadi ia dirender di sini tetapi muncul di sudut viewport.
      preview('toasts()'),

      h2('Opsi'),
      p(
        code('duration'),
        ' adalah berapa lama toast-nya bertahan, dalam milidetik; ',
        code('0'),
        ' menahannya sampai seseorang menutupnya. Setiap toast mendapat tombol tutup, tersambung ke penangan penutupan yang sama dengan yang dipakai peringatan.',
      ),
      codeBlock('Opsi', `toast('Tersimpan.', { color: 'success' })
toast('Masih bekerja…', { color: 'neutral', duration: 0 })
toast('Diterapkan dalam 1,7 dtk', { color: 'success', duration: 8000 })`, 'javascript'),

      h2('Apa yang direndernya'),
      p(
        'Toast adalah sebuah ',
        code('alert()'),
        ' di wilayah toast — markup yang sama, warna yang sama, tombol tutup yang sama. Tidak ada yang baru untuk dipelajari, dan tidak ada tambahan untuk ditata.',
      ),
      demo(`stack({ gap: 'sm', style: 'width: 100%; max-width: 24rem' },
  alert({ color: 'success', dismissible: true }, 'Tersimpan.'),
  alert({ color: 'danger', dismissible: true }, 'Build gagal. Periksa laporan tautannya.'),
)`, { align: 'stretch' }),

      h2('Kapan memakainya'),
      p(
        'Toast dipakai untuk menegaskan sesuatu yang baru saja dilakukan pembacanya. Ia adalah tempat yang salah untuk apa pun yang perlu mereka tindaklanjuti atau baca dengan saksama — ia menghilang, ia mudah terlewat, dan di situs statis sebagian besar pesan seharusnya berada di halamannya sendiri sebagai ',
        code('alert()'),
        '.',
      ),

      h2('Props'),
      p(code('toasts()'), ' tidak menerima props sendiri. ', code('toast()'), ' dari ', code('sitelo/ui/client'), ':'),
      propsTable([
        ['message', 'string', '', 'Teksnya. Disetel sebagai textContent, jadi ia tidak pernah diurai sebagai markup.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Palet mana yang dipakai.'],
        ['duration', 'number', '4000', 'Milidetik sebelum ia menghilang. 0 menahannya.'],
      ], { headers: ['Argumen', 'Tipe', 'Bawaan', 'Deskripsi'] }),
      p(
        'Ia mengembalikan elemen yang ditambahkannya, atau ',
        code('null'),
        ' ketika halamannya tidak punya wilayah ',
        code('toasts()'),
        '.',
      ),
    ],
  })
