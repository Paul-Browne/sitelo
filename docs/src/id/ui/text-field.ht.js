import { h2, h3, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Bidang teks',
    description:
      'Masukan teks satu dan banyak baris, dengan label, teks bantuan, pesan galat, dan id yang sudah disambungkan untuk Anda.',
    activeHref: '/id/ui/text-field',
    children: [
      p(
        'Ada dua lapisan di sini. ',
        code('input()'),
        ' dan ',
        code('textarea()'),
        ' adalah kendali telanjangnya; ',
        code('textField()'),
        ' dan ',
        code('textareaField()'),
        ' membungkus salah satunya dalam label, teks bantuan, dan pesan galat, lalu menyambungkannya dengan ',
        code('for'),
        ' dan ',
        code('aria-describedby'),
        '. Raih yang kedua kecuali Anda membangun tata letaknya sendiri.',
      ),

      h2('Bidang teks dasar'),
      demo(`textField({ label: 'Nama', name: 'name', placeholder: 'Ada Lovelace' })`, {
        align: 'stretch',
      }),

      h2('Teks bantuan'),
      p(
        'Teks bantuan disambungkan dengan ',
        code('aria-describedby'),
        ', jadi pembaca layar membacanya sebagai bagian dari bidangnya alih-alih sebagai teks lepas sesudahnya.',
      ),
      demo(`textField({
  label: 'Email',
  name: 'email',
  type: 'email',
  help: 'Kami hanya memakainya untuk mengirim kabar build yang gagal.',
})`, { align: 'stretch' }),

      h2('Wajib dan galat'),
      p(
        'Sebuah ',
        code('error'),
        ' menandai bidangnya tidak sah, mewarnai batasnya, menyetel ',
        code('aria-invalid'),
        ', dan mengarahkan ',
        code('aria-describedby'),
        ' ke pesannya — satu props, keempatnya sekaligus.',
      ),
      demo(`stack({ gap: 'lg' },
  textField({ label: 'Proyek', name: 'project', required: true, value: '' }),
  textField({
    label: 'Situs',
    name: 'site',
    error: 'Itu bukan sebuah URL.',
    value: 'sitelo titik dev',
  }),
)`, { align: 'stretch' }),

      h2('Ukuran'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Kecil', name: 'small', size: 'sm', placeholder: 'sm' }),
  textField({ label: 'Sedang', name: 'medium', size: 'md', placeholder: 'md' }),
  textField({ label: 'Besar', name: 'large', size: 'lg', placeholder: 'lg' }),
)`, { align: 'stretch' }),

      h2('Hiasan'),
      p(
        'Awalan atau akhiran yang menempel pada kendalinya sendiri, untuk satuan dan potongan nilai yang tetap.',
      ),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Situs', name: 'url', startAdornment: 'https://', placeholder: 'example.com' }),
  textField({ label: 'Tenggat build', name: 'timeout', endAdornment: 'detik', value: '30' }),
)`, { align: 'stretch' }),

      h2('Dinonaktifkan dan hanya-baca'),
      demo(`stack({ gap: 'md' },
  textField({ label: 'Nonaktif', name: 'disabled', value: 'Tidak bisa disunting', disabled: true }),
  textField({ label: 'Hanya baca', name: 'readonly', value: 'dist/', readonly: true }),
)`, { align: 'stretch' }),

      h2('Banyak baris'),
      p(
        code('textareaField()'),
        ' adalah bidang yang sama di sekeliling sebuah ',
        code('<textarea>'),
        '. Nilainya adalah isi elemen alih-alih sebuah atribut, dan komponennya menangani itu untuk Anda.',
      ),
      demo(`textareaField({
  label: 'Deskripsi',
  name: 'description',
  rows: 4,
  help: 'Ditampilkan di hasil pencarian dan kartu sosial.',
  value: 'Pembuatan situs statis tanpa konfigurasi yang ditenagai Vite.',
})`, { align: 'stretch' }),

      h2('Di dalam formulir'),
      demo(`card(
  cardBody(
    stack({ gap: 'md' },
      textField({ label: 'Nama', name: 'contact-name', required: true }),
      textField({ label: 'Email', name: 'contact-email', type: 'email', required: true }),
      textareaField({ label: 'Pesan', name: 'message', rows: 3 }),
    ),
  ),
  cardFooter({ divided: true, style: 'justify-content: flex-end' },
    button({ variant: 'ghost', color: 'neutral' }, 'Batal'),
    button({ type: 'submit' }, 'Kirim'),
  ),
)`, { align: 'stretch' }),

      h2('Membangunnya sendiri'),
      p(
        code('field()'),
        ' adalah pembungkusnya sendiri — ia menerima kendali apa pun sebagai anak, jadi Anda bisa menaruh dua masukan dalam satu baris, atau sebuah kendali yang tidak dimiliki pustaka ini, di bawah perlakuan label dan galat yang sama.',
      ),
      p(
        'Satu label tidak bisa menamai dua kendali, jadi di sini tiap masukan butuh namanya sendiri yang dapat diakses. Itulah yang dilakukan ',
        code('aria-label'),
        ': label yang terlihat menamai pasangannya, dan tiap masukan menyatakan ia ujung yang mana.',
      ),
      demo(`field({ label: 'Rentang tanggal', help: 'Kedua ujungnya termasuk.' },
  stack({ direction: 'row', gap: 'sm' },
    input({ type: 'date', name: 'from', 'aria-label': 'Dari' }),
    input({ type: 'date', name: 'to', 'aria-label': 'Sampai' }),
  ),
)`, { align: 'stretch' }),

      h2('Props'),
      h3('textField dan textareaField'),
      propsTable([
        ['label', 'Child', '', 'Label bidangnya. Juga menurunkan id kendalinya ketika tidak ada name.'],
        ['name', 'string', '', 'Nama bidang formulir; id-nya diturunkan darinya.'],
        ['help', 'Child', '', 'Petunjuk di bawah kendalinya, disambungkan dengan aria-describedby.'],
        ['error', 'Child | false', '', 'Pesan galat. Juga menyetel aria-invalid pada kendalinya.'],
        ['required', 'boolean', 'false', 'Menandai label dan kendalinya.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Tinggi kendali dan ukuran teksnya.'],
        ['type', 'string', "'text'", 'Tipe masukan apa pun. Hanya textField.'],
        ['startAdornment', 'Child', '', 'Awalan yang menempel pada kendalinya. Hanya textField.'],
        ['endAdornment', 'Child', '', 'Akhiran yang menempel pada kendalinya. Hanya textField.'],
        ['value', 'string | number', '', 'Nilai awal.'],
        ['fieldClass', 'string', '', 'Kelas untuk pembungkusnya, bukan kendalinya.'],
      ]),
      p(
        'Id diturunkan dari ',
        code('name'),
        ' — atau dari ',
        code('label'),
        ' ketika tidak ada name — alih-alih dari sebuah pencacah, jadi halaman yang sama merender HTML yang sama pada setiap build. Berikan ',
        code('id'),
        ' untuk menimpanya.',
      ),
      h3('field'),
      propsTable([
        ['label', 'Child', '', 'Teks labelnya.'],
        ['help', 'Child', '', 'Petunjuk di bawah kendalinya.'],
        ['error', 'Child | false', '', 'Pesan galat; juga menambahkan keadaan tidak sah ke pembungkusnya.'],
        ['required', 'boolean', 'false', 'Menambahkan penanda wajib ke labelnya.'],
        ['for', 'string', '', 'Id kendali yang sedang diberi label.'],
      ]),
    ],
  })
