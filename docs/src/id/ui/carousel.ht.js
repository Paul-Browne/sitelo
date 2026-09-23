import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Korsel',
    description:
      'Slaid yang Anda gulir, mengepas sambil berjalan — beserta titik dan panah yang diminta lembar gayanya untuk digambar peramban.',
    activeHref: '/id/ui/carousel',
    children: [
      p(
        'Korsel di sini adalah sebuah wadah gulir dan sebaris slaid yang mengepas. Sebanyak itu sudah dikuasai setiap peramban: sapuan jari, papan sentuh, shift-roda, dan tombol panah semuanya bekerja pada lukisan pertama, tanpa apa pun dimuat dan tanpa apa pun yang perlu dihidrasi.',
      ),
      p(
        'Di tempat peramban mampu, titik dan panahnya sama sekali bukan markup. Mereka adalah ',
        code('::scroll-marker'),
        ' pada tiap slaid dan ',
        code('::scroll-button()'),
        ' pada jalurnya — pseudo-elemen yang diminta lembar gayanya, yang lalu digambar peramban, dinamai, disambungkan ke posisi gulirnya, ditandai mana yang sedang aktif, dan dinonaktifkan di ujung-ujungnya. Tidak ada atribut ',
        code('data-'),
        ' pada komponen ini dan tidak ada modul yang perlu diimpor: keadaannya adalah simpangan gulirnya, dan peramban sudah memilikinya.',
      ),
      p(
        'Di tempat ia tidak mampu, sebaris titik hasil render mengambil alih: satu tautan per slaid, yang bekerja sendiri, dan yang meraih beberapa ratus bita skrip pada gulir pertama atau ketukan pertama agar berperilaku seperti titik bawaan — mengikuti gulirannya, dan memindahkan jalurnya tanpa memindahkan halamannya.',
      ),

      h2('Satu per satu'),
      p(
        'Bawaannya. Tiap slaid mengisi jalurnya, mengepas ke awal, dan berhenti di sana alih-alih melesat tiga slaid ke depan.',
      ),
      demo(`carousel({
  items: ['Pesisir', 'Pelabuhan', 'Ladang', 'Kota tua'].map((name, index) =>
    aspectRatio({ ratio: '16 / 7', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' },
        text({ variant: 'h6', as: 'div' }, (index + 1) + '. ' + name)))),
})`, { align: 'stretch' }),

      h2('Beberapa sekaligus'),
      p(
        code('perView'),
        ' adalah berapa banyak slaid yang mengisi jalurnya, dan ',
        code('min'),
        ' adalah batas bawah seberapa sempit satu slaid boleh menjadi. Batas bawah itu menggantikan kueri media: begitu bagian sebuah slaid atas jalurnya jatuh di bawahnya, slaidnya tetap selebar itu dan lebih sedikit yang muat — muslihat yang sama yang dimainkan ',
        code('grid()'),
        ' dengan auto-fit.',
      ),
      demo(`carousel({
  perView: 3,
  min: '12rem',
  gap: 'md',
  items: ['Perutean', 'Data', 'Aset', 'Gambar', 'Island', 'Pencarian'].map((name) =>
    card({ variant: 'flat', style: 'height: 100%' },
      cardBody(stack({ gap: 'xs', align: 'center' },
        text({ variant: 'overline', tone: 'muted' }, 'Panduan'),
        text({ variant: 'h6', as: 'div' }, name))))),
})`, { align: 'stretch' }),

      h2('Mengintip yang berikutnya'),
      p(
        code('perView'),
        ' pecahan menyisakan sepotong tipis slaid berikutnya, dan itu cara termurah untuk berkata “ini bergulir” tanpa hiasan apa pun.',
      ),
      demo(`carousel({
  perView: 1.25,
  dots: false,
  arrows: false,
  items: ['Satu', 'Dua', 'Tiga'].map((name) =>
    aspectRatio({ ratio: '16 / 6', style: 'background: var(--su-primary-soft); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-primary-soft-fg)' }, name))),
})`, { align: 'stretch' }),

      h2('Responsif tanpa titik henti Anda sendiri'),
      p(
        code('perView'),
        ' ditulis sebagai properti kustom, jadi sebuah kueri media bisa mengubahnya tanpa menyentuh markup-nya — dan tanpa komponennya perlu tahu titik henti Anda:',
      ),
      codeBlock('src/gallery.ht.js', `carousel({ class: 'gallery', perView: 2, items })`, 'javascript'),
      codeBlock('src/styles.css', `@media (min-width: 48em) {
  .gallery {
    --su-carousel-per-view: 3;
  }
}`, 'css'),

      h2('Pengepasan'),
      p(
        'Pengepasan bawaannya ',
        code('mandatory'),
        ': sebuah guliran selalu berhenti pada sebuah slaid. ',
        code("snap: 'proximity'"),
        ' hanya menariknya masuk ketika ia berakhir dekat salah satunya, dan ',
        code('snap: false'),
        ' membiarkan jalurnya bergulir bebas — dan itulah yang diinginkan sebaris benda kecil, ketika mendarat di antara dua di antaranya tidak menjadi soal.',
      ),
      demo(`carousel({
  snap: false,
  perView: 4,
  min: '7rem',
  gap: 'sm',
  arrows: false,
  items: ['sitelo', 'vite', 'pagefind', 'sharp', 'lighthouse', 'rollup', 'esbuild'].map((name) =>
    chip({ size: 'lg', color: 'neutral', style: 'width: 100%; justify-content: center' }, name)),
})`, { align: 'stretch' }),

      h2('Ke mana titik dan panahnya pergi'),
      p(
        'Keduanya opsional dan keduanya menyala secara bawaan. Mematikan titiknya mengembalikan bilah gulir jalurnya, karena korsel tanpa keduanya akan menjadi penggulir yang tidak punya apa pun untuk menyatakan bahwa ia bergulir.',
      ),
      demo(`stack({ gap: 'lg' },
  carousel({ arrows: false, color: 'success', items: ['Hanya titik', 'Kedua', 'Ketiga'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
  carousel({ dots: false, items: ['Hanya panah', 'Kedua', 'Ketiga'].map((name) =>
    aspectRatio({ ratio: '16 / 5', style: 'background: var(--su-surface-2); border-radius: 0.6rem' },
      div({ style: 'display: grid; place-items: center; color: var(--su-text-muted)' }, name))) }),
)`, { align: 'stretch' }),

      h2('Ketika peramban tidak punya penanda gulir'),
      p(
        'Maka titiknya adalah tautan sungguhan, satu per slaid, masing-masing menunjuk id slaid itu — dan itulah sebabnya tiap slaid diberi satu. Sebanyak itu bekerja tanpa apa pun dimuat: mengetuk satu menggulirkan jalurnya ke slaidnya, karena mengikuti sebuah fragmen memang sudah dilakukan peramban.',
      ),
      p(
        'Pada gulir pertama atau ketukan pertama, jalurnya dan titiknya meraih ',
        code('/su/carousel.js'),
        ' dari atribut peristiwanya sendiri — cara yang sama dengan setiap komponen di sini meraih modulnya, jadi tidak ada yang diambil di halaman yang tidak disentuh siapa pun, dan tidak ada apa pun di tempat penanda bawaannya sudah ada. Sejak itu ia berjalan dua arah: titiknya mengikuti gulirannya, apa pun yang menggerakkannya — sapuan jari, papan sentuh, tombol panah, seretan bilah gulir — dan mengetuk sebuah titik menggulirkan jalurnya sambil meninggalkan halamannya di tempatnya.',
      ),
      p(
        'Bagian terakhir itulah gunanya skripnya. Fragmen telanjang memindahkan jendelanya ke slaid itu sekaligus jalurnya, dan korsel yang melompatkan halaman dari bawah ibu jari yang mengetuknya bukanlah yang dimaksud siapa pun dengan sebuah titik. Kliknya dibatalkan di dalam atributnya alih-alih di dalam impornya, karena impor dinamis baru selesai sesaat kemudian dan saat itu peramban sudah telanjur mengikuti tautannya. ',
        code('scrollMargin'),
        ' adalah tempat jendelanya mendarat pada satu kasus yang tersisa: JavaScript dimatikan, ketika tautannya tetap hanyalah sebuah tautan.',
      ),
      p(
        'Id yang ditunjuknya datang dari ',
        code('name'),
        ', atau dari ',
        code('id'),
        ' korselnya sendiri, atau — bila keduanya tidak ada — dari sebuah ringkasan slaidnya, sehingga dua korsel dalam satu halaman tidak berbenturan tanpa keduanya perlu diberi tahu satu sama lain. Beri sebuah item ',
        code('id'),
        '-nya sendiri ketika slaid tertentu layak ditaut dari tempat lain.',
      ),

      h2('Menamai slaidnya'),
      p(
        'Tiap titik dinamai menurut slaidnya, karena titik adalah sebuah kendali dan kendali tanpa nama adalah tombol yang hanya bisa disebut pembaca layar sebagai “tombol”. Secara bawaan namanya adalah nomor slaidnya. Berikan sebuah item sebagai objek untuk menamainya dengan lebih baik, atau ',
        code('slideLabel'),
        ' untuk menomorinya dengan kata-kata Anda sendiri.',
      ),
      demo(`carousel({
  label: 'Foto produk',
  perView: 2,
  min: '10rem',
  items: [
    { label: 'Dapurnya', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Dapur'))) },
    { label: 'Terasnya', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Teras'))) },
    { label: 'Tamannya', content: card({ variant: 'flat' }, cardBody(text({ align: 'center' }, 'Taman'))) },
  ],
})`, { align: 'stretch' }),

      h2('Menggerakkannya sendiri'),
      p(
        'Dua fungsi untuk saat-saat halamanlah yang menggerakkan sebuah korsel — tombol “lihat fotonya”, sebuah langkah dalam formulir, sebuah tautan di tempat lain di halaman itu:',
      ),
      codeBlock('src/main.js', `import { setSlide, getSlide } from 'sitelo/ui/client'

setSlide('gallery', 2)  // menggulir ke slaid ketiga, dan menandai titiknya
getSlide('gallery')     // 2`, 'javascript'),
      p(
        'Atau dari sebuah atribut peristiwa, tanpa apa pun dibundel ke halamannya sama sekali:',
      ),
      codeBlock('Di mana saja', `button({ onclick: "import('/su/carousel.js').then(m=>m.set('gallery',0))" }, 'Kembali ke awal')`, 'javascript'),

      h2('Yang tidak dilakukannya'),
      p(
        'Ia tidak berputar kembali ke slaid pertama, dan ia tidak maju sendiri. Keduanya bukan hal yang bisa dilakukan CSS, jadi keduanya tidak ada di sini — korsel yang berputar atau memutar sendiri butuh sebuah skrip, dan komponen ini lebih suka tidak menjadi alasan sebuah halaman memuat satu. Maju otomatis memang layak dilepaskan: ia memindahkan benda yang sedang dibaca seseorang, dari bawah pandangannya.',
      ),
      p(
        'Dengan JavaScript dimatikan ia juga tidak bisa menandai slaid mana yang sedang tampil setelah jalurnya disapu, atau mencapai satu slaid tanpa memindahkan halamannya. Titik pertama ditandai saat build, karena dalam keadaan diam itulah slaid yang tampil; menjaganya tetap benar setelah itu adalah satu-satunya hal yang hanya bisa dilakukan skripnya. Sapuan jari, papan sentuh, dan tombol tetap bekerja dalam kedua keadaan.',
      ),

      h2('Aksesibilitas'),
      p(
        'Jalurnya adalah grup berlabel dengan ',
        code('tabindex="0"'),
        ', jadi papan ketik bisa mencapai wilayah yang bergulir dan menyusurinya dengan tombol panah di setiap mesin, bukan hanya yang memfokuskan penggulir dengan sendirinya. Namai dengan ',
        code('label'),
        ' ketika sebuah halaman punya lebih dari satu.',
      ),
      p(
        'Di tempat peramban menggambarnya, titiknya dibuka sebagai daftar tab dan panahnya sebagai tombol yang menonaktifkan diri di tiap ujungnya — peramban membangun semua itu, jadi tidak satu pun darinya bisa melenceng dari slaid yang benar-benar tampil. Itulah alasan memilih bentuk ini ketimbang yang berskrip: tidak ada salinan kedua dari keadaannya yang bisa salah.',
      ),
      p(
        'Titik cadangannya adalah tautan, masing-masing dinamai menurut slaidnya, dan masing-masing menjadi sasaran 24 piksel alih-alih 8 piksel seperti rupa titiknya. Slaid yang tampil membawa ',
        code('aria-current'),
        ', yang sekaligus merupakan apa yang dibaca pembaca layar dan apa yang diwarnai lembar gayanya — satu keping keadaan untuk dijaga tetap benar alih-alih dua yang bisa saling bertentangan. Ia dirender pada titik pertama, karena dalam keadaan diam itulah slaid yang tampil, dan bergerak mengikuti gulirannya sejak itu. Di tempat penanda bawaan menggantikannya, tautannya menjadi ',
        code('display: none'),
        ', jadi mereka meninggalkan pohon aksesibilitas bersama gambarnya alih-alih dibacakan dua kali.',
      ),

      h2('Props'),
      propsTable([
        ['items', 'Array', '[]', 'Slaid. Sebuah anak, atau { label, content } dengan atribut lain apa pun untuk slaidnya. Anak juga merupakan slaid dan mengikuti item-nya.'],
        ['perView', 'number', '1', 'Berapa banyak slaid yang mengisi jalurnya. Pecahan menyisakan intipan slaid berikutnya.'],
        ['min', 'string', '', 'Batas bawah lebar sebuah slaid, jadi layar sempit menampilkan lebih sedikit alih-alih lebih tipis.'],
        ['gap', 'Space', "'md'", 'Di antara slaid.'],
        ['align', "'start' | 'center' | 'end'", "'start'", 'Di mana sebuah slaid berhenti.'],
        ['snap', "'mandatory' | 'proximity' | false", "'mandatory'", 'Seberapa erat gulirannya berhenti pada sebuah slaid.'],
        ['dots', 'boolean', 'true', 'Titik di bawah jalurnya — penanda gulir bawaan di tempat peramban memilikinya, satu tautan per slaid yang ditingkatkan modul kecil di tempat ia tidak. Mematikannya mengembalikan bilah gulirnya, dan tidak meminta skrip apa pun.'],
        ['arrows', 'boolean', 'true', 'Panah di atas jalurnya.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'primary'", 'Warna titik untuk slaid yang tampil.'],
        ['label', 'string', "'Carousel'", 'Nama yang dapat diakses untuk wilayah yang bergulir.'],
        ['previousLabel', 'string', "'Previous slide'", 'Nama yang dapat diakses untuk panah mundur.'],
        ['nextLabel', 'string', "'Next slide'", 'Nama yang dapat diakses untuk panah maju.'],
        ['slideLabel', '(index, count) => string', 'nomornya', 'Menamai slaid yang tidak menamai dirinya sendiri.'],
        ['name', 'string', 'id korselnya, atau sebuah ringkasan', 'Awalan untuk id slaid yang ditaut titik cadangannya.'],
        ['scrollMargin', 'Space', "'lg'", 'Seberapa jauh di atas sebuah slaid jendelanya berhenti ketika titik cadangan membawanya ke sana.'],
        ['as', 'string', "'div'", 'Elemen yang dirender.'],
      ]),
    ],
  })
