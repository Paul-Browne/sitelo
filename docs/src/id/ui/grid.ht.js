import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Grid',
    description:
      'Kisi responsif yang memuat sebanyak mungkin kolom yang muat — tanpa titik henti, tanpa kueri media.',
    activeHref: '/id/ui/grid',
    children: [
      p(
        'Tanpa ',
        code('columns'),
        ', sebuah kisi menyesuaikan diri dengan memuat sebanyak mungkin jalur selebar minimal ',
        code('min'),
        ' sebanyak yang diizinkan ruangnya, dan masing-masing membagi sisanya secara merata. Itulah perilaku yang diinginkan daftar kartu, dan ia tidak butuh titik henti: ubah ukuran halaman ini dan demo di bawah akan mengalir ulang sendiri.',
      ),

      h2('Menyesuaikan diri'),
      p('Bawaannya. Jalurnya selebar minimal 16rem.'),
      demo(`grid(
  ...['Perutean', 'Memuat data', 'Aset', 'Gambar', 'Island', 'Pencarian'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Lebar jalur'),
      p(
        code('min'),
        ' menyetel seberapa sempit sebuah jalur boleh menjadi sebelum kisinya turun ke jumlah kolom yang lebih sedikit. Makin kecil berarti makin banyak kolom.',
      ),
      demo(`grid({ min: '9rem' },
  ...['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Jumlah kolom tetap'),
      p(
        'Berikan sebuah angka ketika jumlahnya tidak boleh berubah mengikuti viewport. Tiap jalur mendapat bagian yang sama.',
      ),
      demo(`grid({ columns: 3 },
  ...['Satu', 'Dua', 'Tiga'].map((name) =>
    card({ variant: 'flat' }, cardBody(text({ variant: 'small', align: 'center' }, name))),
  ),
)`, { align: 'stretch' }),

      h2('Templat khusus'),
      p(
        'Sebuah string diteruskan langsung sebagai ',
        code('grid-template-columns'),
        ', untuk pembagian bilah samping dan konten atau apa pun lain yang bisa diungkapkan kisi CSS.',
      ),
      demo(`grid({ columns: '12rem 1fr', gap: 'lg' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Bilah samping'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Konten, mengambil sisa barisnya.'))),
)`, { align: 'stretch' }),

      h2('Celah dan perataan'),
      demo(`grid({ min: '10rem', gap: 'xl', align: 'center' },
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Pendek'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Kartu yang lebih tinggi, dengan dua baris teks di dalamnya, untuk menunjukkan apa yang dilakukan align terhadap tetangganya yang lebih pendek.'))),
  card({ variant: 'flat' }, cardBody(text({ variant: 'small' }, 'Pendek'))),
)`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['columns', 'number | string', '', 'Jumlah jalur tetap, atau nilai grid-template-columns mentah. Lewati agar menyesuaikan diri.'],
        ['min', 'string', "'16rem'", 'Lebar jalur minimum saat menyesuaikan diri.'],
        ['gap', 'Space', "'md'", 'Jarak antarjalur dan antarbaris.'],
        ['align', 'string', "'stretch'", 'Nilai align-items apa pun.'],
        ['as', 'string', "'div'", 'Elemen yang dirender.'],
      ]),
      p(
        'Sebuah jalur tidak pernah menjadi lebih lebar daripada kisinya sendiri, bahkan ketika ',
        code('min'),
        ' lebih besar daripada ruang yang tersedia — jadi minimum 16rem tidak menimbulkan bilah gulir mendatar di ponsel 320 piksel.',
      ),
    ],
  })
