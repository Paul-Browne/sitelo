import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tipografi',
    description:
      'Skala huruf yang memilih elemennya sendiri, sehingga kerangka dokumennya mengikuti kerangka visualnya.',
    activeHref: '/id/ui/typography',
    children: [
      p(
        code('text()'),
        ' merender sepotong teks pada salah satu ukuran milik pustaka ini. Variannya memilih elemen yang masuk akal — ',
        code("variant: 'h2'"),
        ' merender ',
        code('<h2>'),
        ' sungguhan — jadi judulnya mendarat di kerangka dokumen tanpa siapa pun perlu memikirkannya.',
      ),

      h2('Varian'),
      demo(`stack({ gap: 'sm' },
  text({ variant: 'h1' }, 'Judul 1'),
  text({ variant: 'h2' }, 'Judul 2'),
  text({ variant: 'h3' }, 'Judul 3'),
  text({ variant: 'h4' }, 'Judul 4'),
  text({ variant: 'h5' }, 'Judul 5'),
  text({ variant: 'h6' }, 'Judul 6'),
  text({ variant: 'lead' }, 'Lead — satu tingkat di atas teks badan, untuk kalimat di bawah sebuah judul.'),
  text({ variant: 'body' }, 'Body — bawaannya.'),
  text({ variant: 'small' }, 'Small — keterangan yang masih berupa kalimat.'),
  text({ variant: 'caption' }, 'Caption — cetakan kecilnya.'),
  text({ variant: 'overline' }, 'Overline'),
)`, { align: 'stretch' }),

      h2('Judul'),
      p(
        code('heading()'),
        ' menerima ',
        code('level'),
        ' kerangka dan mengukur dirinya agar cocok. ',
        code('size'),
        ' memisahkan keduanya: sebuah ',
        code('<h1>'),
        ' yang tampak seperti h3 tetap h1 bagi pembaca layar.',
      ),
      demo(`stack({ gap: 'sm' },
  heading({ level: 2 }, 'Judul tingkat 2, diukur agar cocok'),
  heading({ level: 2, size: 'h5' }, 'Judul tingkat 2, diukur seperti h5'),
)`, { align: 'stretch' }),

      h2('Nada'),
      p('Tiga bobot penekanan, dari kontras penuh sampai kelabu paling tenang yang masih terbaca.'),
      demo(`stack({ gap: 'xs' },
  text('Bawaan — warna yang dipakai teks badan.'),
  text({ tone: 'muted' }, 'Redup — teks sekunder, masih nyaman dibaca.'),
  text({ tone: 'subtle' }, 'Halus — label dan metadata.'),
)`, { align: 'stretch' }),

      h2('Perataan'),
      demo(`stack({ gap: 'xs' },
  text({ align: 'start' }, 'Awal'),
  text({ align: 'center' }, 'Tengah'),
  text({ align: 'end' }, 'Akhir'),
)`, { align: 'stretch' }),

      h2('Pemotongan dan pembatasan'),
      p(
        code('truncate'),
        ' memotong satu baris dengan elipsis. ',
        code('lines'),
        ' justru membatasinya pada sejumlah baris, dan itulah yang biasanya diinginkan ringkasan kartu.',
      ),
      demo(`stack({ gap: 'md' },
  card({ variant: 'flat' }, cardBody(
    text({ truncate: true }, 'Satu baris yang terus berjalan jauh melewati lebar wadahnya lalu dipotong dengan elipsis alih-alih dibungkus ke baris berikutnya.'),
  )),
  card({ variant: 'flat' }, cardBody(
    text({ lines: 2, tone: 'muted' }, 'Dibatasi pada dua baris. Paragraf ini berjalan cukup lama agar ada sesuatu yang benar-benar bisa dipotong pembatasnya, lalu terus berjalan sedikit lebih jauh lagi, melewati titik tempat baris ketiga akan dimulai.'),
  )),
)`, { align: 'stretch' }),

      h2('Kode sebaris dan tombol'),
      demo(`text(
  'Jalankan ', code('sitelo build'), ' atau tekan ', kbd('⌘'), ' ', kbd('K'), ' untuk mencari.',
)`, { align: 'stretch' }),
      p(
        'Anak dirender sebagai HTML — itulah yang membuat penyarangan bekerja di mana pun di pustaka ini, dan ',
        code('code()'),
        ' bukan pengecualian. Jadi contoh yang berisi tag butuh props ',
        code('text'),
        ', yang mengaburkannya:',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: '<em>Halo</em>' }), ' — text: ditampilkan apa adanya'),
  text(code('<em>Halo</em>'), ' — anak: diurai sebagai markup'),
)`, { align: 'stretch' }),
      p(
        'Keduanya berguna. ',
        code('text'),
        ' untuk contoh kode, ketika sebuah tag harus dibaca alih-alih dibangun. Anak untuk keluaran yang sudah diberi sorotan sintaks, ketika markup-nya ',
        code('itulah'),
        ' intinya — hasil Prism atau Shiki langsung masuk.',
      ),
      demo(`stack({ gap: 'sm' },
  text(code({ text: 'sitelo build --root docs' })),
  text(code('<span style="color: var(--su-primary-soft-fg)">sitelo</span> build')),
)`, { align: 'stretch' }),

      h2('Menyusun'),
      p(
        'Teks menerima anak, bukan sekadar sebuah string — jadi tautan, kode, dan penekanan bersarang di dalamnya dengan cara yang sama seperti di HTML.',
      ),
      demo(`text({ variant: 'lead' },
  'Halaman adalah fungsi yang mengembalikan ',
  code('HTML'),
  '. Lihat panduan ',
  link({ href: '/docs/pages' }, 'menulis halaman'),
  '.',
)`, { align: 'stretch' }),

      h2('Mengganti elemennya'),
      p(
        code('as'),
        ' menimpa elemennya tanpa mengubah tampilannya — untuk judul visual yang tidak boleh muncul di kerangkanya, atau sebuah ',
        code('<span>'),
        ' di dalam satu baris teks.',
      ),
      demo(`stack({ gap: 'xs' },
  text({ variant: 'h4', as: 'div' }, 'Tampak seperti judul, tetapi sebuah div'),
  text({ variant: 'caption', as: 'p' }, 'Penataan keterangan pada sebuah paragraf'),
)`, { align: 'stretch' }),

      h2('Tersembunyi secara visual'),
      p(
        code('visuallyHidden()'),
        ' menjaga konten tetap berada di pohon aksesibilitas tetapi di luar layar — label yang dibutuhkan pembaca layar di tempat pembaca awas memperolehnya dari konteks.',
      ),
      demo(`text(
  'Status build: ',
  chip({ color: 'success', dot: true }, 'lulus'),
  visuallyHidden(' — build terakhir berhasil 4 menit lalu'),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'h1'…'h6' | 'lead' | 'body' | 'small' | 'caption' | 'overline'", "'body'", 'Ukuran, bobot, dan elemen bawaannya.'],
        ['tone', "'default' | 'muted' | 'subtle'", "'default'", 'Seberapa besar kontras yang dibawa teksnya.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Perataan teks.'],
        ['truncate', 'boolean', 'false', 'Satu baris, dipotong dengan elipsis.'],
        ['lines', 'number', '', 'Membatasi pada sebanyak ini baris.'],
        ['as', 'string', '', 'Menimpa elemen yang akan dipilih variannya.'],
      ]),
      p(
        code('heading()'),
        ' menerima ',
        code('level'),
        ' (1–6) dan sebuah ',
        code('size'),
        ' opsional; selebihnya sama.',
      ),
    ],
  })
