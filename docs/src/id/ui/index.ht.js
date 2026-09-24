import { a, div, h2, li, p, span, ul } from 'javascript-to-html'
import { code, uiLayout } from '../../lib/id.js'
import { preview } from '../../lib/ui-demo.js'
import { isDraft } from '../../lib/drafts.js'

/**
 * Satu kartu per halaman komponen, dikelompokkan persis seperti rujukan
 * komponennya. Tiap `demo` dirender langsung ke dalam kartunya.
 */
const GROUPS = [
  ['Tata letak', [
    ['/id/ui/container', 'Kontainer', 'Kolom halaman yang terpusat dan terbatas lebarnya.',
      `container({ size: 'sm', style: 'background: var(--su-surface-2); padding: 0.5rem; border-radius: 0.4rem' },
        text({ variant: 'caption', align: 'center' }, 'terpusat'))`],
    ['/id/ui/stack', 'Tumpukan', 'Baris atau kolom flex dengan token jarak untuk celahnya.',
      `stack({ direction: 'row', gap: 'sm' }, chip('satu'), chip('dua'), chip('tiga'))`],
    ['/id/ui/grid', 'Grid', 'Memuat sebanyak mungkin kolom yang muat, tanpa kueri media.',
      `grid({ min: '3.5rem', gap: 'xs' },
        chip({ size: 'sm' }, '1'), chip({ size: 'sm' }, '2'), chip({ size: 'sm' }, '3'), chip({ size: 'sm' }, '4'))`],
    ['/id/ui/divider', 'Pemisah', 'Garis di antara bagian, dengan atau tanpa label.',
      `div({ style: 'width: 100%' }, divider('atau'))`],
    ['/id/ui/aspect-ratio', 'Rasio aspek', 'Tahan sebuah kotak pada bentuk tetap, agar tidak ada yang bergeser saat dimuat.',
      `aspectRatio({ ratio: '16 / 9', style: 'width: 6rem; background: var(--su-surface-2); border-radius: 0.4rem' }, '')`],
    ['/id/ui/card', 'Kartu', 'Permukaan untuk konten yang dikelompokkan, dengan kepala, badan, dan kaki.',
      `card({ variant: 'flat', style: 'width: 100%' }, cardBody(text({ variant: 'small' }, 'Sebuah kartu')))`],
  ]],
  ['Tipografi', [
    ['/id/ui/typography', 'Tipografi', 'Skala huruf yang memilih elemennya sendiri.',
      `stack({ gap: 'none' }, text({ variant: 'h5', as: 'div' }, 'Judul'), text({ variant: 'caption', tone: 'muted' }, 'Keterangan'))`],
    ['/id/ui/prose', 'Prosa', 'Tata HTML mentah dari Markdown atau sebuah CMS.',
      `prose({ size: 'sm', style: 'text-align: left' }, '<p><strong>Sebuah judul</strong></p><p>Dan sebuah paragraf.</p>')`],
    ['/id/ui/link', 'Tautan', 'Jangkar bergaya, dengan atribut yang dibutuhkan tautan eksternal.',
      `text({ variant: 'small' }, 'Baca ', link({ href: '/docs' }, 'dokumentasinya'), '.')`],
    ['/id/ui/icons', 'Ikon', '99 glif pada satu kisi, diukur dan diwarnai oleh teks di sekitarnya.',
      `stack({ direction: 'row', gap: 'sm', align: 'center' },
        icon('check'), icon('search'), icon('heart'), icon('zap'), icon('settings'))`],
  ]],
  ['Masukan', [
    ['/id/ui/button', 'Tombol', 'Lima varian, lima warna, tiga ukuran.',
      `stack({ direction: 'row', gap: 'sm' }, button({ size: 'sm' }, 'Simpan'), button({ size: 'sm', variant: 'outline' }, 'Batal'))`],
    ['/id/ui/button-group', 'Grup tombol', 'Tombol yang disatukan menjadi satu kendali.',
      `buttonGroup({ label: 'Pratinjau' },
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Satu'),
        button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Dua'))`],
    ['/id/ui/text-field', 'Bidang teks', 'Label, kendali, teks bantuan, dan galat, tersambung satu sama lain.',
      `textField({ label: 'Email', name: 'g-email', size: 'sm', placeholder: 'ada@example.com' })`],
    ['/id/ui/select', 'Pilihan', 'Select bawaan peramban, ditata agar senada.',
      `selectField({ label: 'Tema', name: 'g-theme', size: 'sm', options: ['Terang', 'Gelap'], value: 'Gelap' })`],
    ['/id/ui/checkbox', 'Kotak centang', 'Masukan sungguhan, ditata dengan CSS alih-alih diganti.',
      `stack({ gap: 'sm' }, checkbox({ label: 'Peta situs', checked: true }), checkbox({ label: 'Umpan RSS' }))`],
    ['/id/ui/radio', 'Grup radio', 'Satu pilihan dari beberapa, sebagai radio yang berbagi satu nama.',
      `choiceGroup({ name: 'g-plan', direction: 'row', value: 'pro', options: ['free', 'pro'] })`],
    ['/id/ui/switch', 'Sakelar', 'Pengalih nyala/mati untuk pengaturan yang langsung berlaku.',
      `stack({ gap: 'sm' }, toggle({ label: 'Publik', checked: true }), toggle({ label: 'Draf' }))`],
    ['/id/ui/slider', 'Penggeser', 'Masukan range bawaan peramban, ditata agar senada.',
      `div({ style: 'width: 100%' }, slider({ value: 60, 'aria-label': 'Pratinjau' }))`],
    ['/id/ui/toggle-button', 'Tombol alih', 'Tombol yang tetap tertekan.',
      `stack({ direction: 'row', gap: 'xs' }, toggleButton({ size: 'sm', pressed: true }, 'Nyala'), toggleButton({ size: 'sm' }, 'Mati'))`],
    ['/id/ui/toggle-group', 'Grup alih', 'Kendali bersegmen, sebagai tombol atau sebagai tautan.',
      `toggleGroup({ size: 'sm', label: 'Pratinjau', value: 'b', items: ['a', 'b', 'c'] })`],
  ]],
  ['Tampilan data', [
    ['/id/ui/avatar', 'Avatar', 'Gambar bila ada, inisial bila tidak.',
      `avatarGroup({ max: 3 }, avatar({ name: 'Ada L' }), avatar({ name: 'Grace H' }), avatar({ name: 'Alan T' }), avatar({ name: 'Barbara L' }))`],
    ['/id/ui/badge', 'Lencana', 'Hitungan atau titik yang disematkan di sebuah sudut.',
      `badge({ content: 12 }, button({ size: 'sm', variant: 'soft', color: 'neutral' }, 'Kotak masuk'))`],
    ['/id/ui/chip', 'Chip', 'Sebuah tag, status, atau filter.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ color: 'success', dot: true }, 'lulus'), chip({ color: 'neutral' }, 'statis'))`],
    ['/id/ui/tooltip', 'Tooltip', 'Petunjuk saat disorot dan difokus, digambar sepenuhnya dengan CSS.',
      `tooltip({ content: 'Tidak butuh skrip' }, button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Sorot saya'))`],
    ['/id/ui/table', 'Tabel', 'Baris dan kolom dari data, dalam wadah gulir.',
      `table({ dense: true, columns: [{ key: 'p', header: 'Halaman' }, { key: 's', header: 'Ukuran', align: 'end' }],
        rows: [{ p: '/', s: '4,1 kB' }, { p: '/docs', s: '12,7 kB' }] })`],
    ['/id/ui/list', 'Daftar', 'Baris dengan sesuatu di kedua sisinya.',
      `list({ plain: true }, listItem({ title: 'Perutean', description: 'Berbasis berkas' }))`],
    ['/id/ui/figure', 'Gambar', 'Sebuah gambar dan keterangannya, sebagai satu kesatuan.',
      `figure({ src: '/logo.svg', alt: '', caption: 'Sebuah keterangan', style: 'width: 7rem' })`],
    ['/id/ui/carousel', 'Korsel', 'Slaid yang mengepas, dengan titik dan panah yang digambar peramban.',
      `div({ style: 'width: 100%' }, carousel({ perView: 2.4, gap: 'sm', arrows: false, items: ['1', '2', '3'].map((n) =>
        aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2); border-radius: 0.5rem' },
          div({ style: 'display: grid; place-items: center; color: var(--su-text-subtle)' }, n))) }))`],
  ]],
  ['Umpan balik', [
    ['/id/ui/alert', 'Peringatan', 'Pesan yang ikon dan peran ARIA-nya mengikuti warnanya.',
      `alert({ color: 'success' }, 'Diterapkan.')`],
    ['/id/ui/empty', 'Kosong', 'Seperti apa sebuah daftar sebelum ada isinya.',
      `empty({ title: 'Tidak ada apa-apa di sini', style: 'padding: 0' })`],
    ['/id/ui/progress', 'Progres', 'Bilah untuk pekerjaan yang diketahui, pemutar untuk sisanya.',
      `div({ style: 'width: 100%' }, progress({ value: 62 }))`],
    ['/id/ui/skeleton', 'Kerangka', 'Penampung berbentuk konten yang akan datang.',
      `div({ style: 'width: 100%' }, skeleton({ lines: 3 }))`],
    ['/id/ui/toast', 'Toast', 'Pesan sementara, ditambahkan dari skrip.',
      `stack({ direction: 'row', gap: 'xs' }, chip({ size: 'sm', color: 'success' }, 'Tersimpan.'))`],
  ]],
  ['Navigasi', [
    ['/id/ui/breadcrumbs', 'Remah roti', 'Jejak leluhur yang berakhir di halaman ini.',
      `breadcrumbs({ items: [{ label: 'Dokumentasi', href: '/docs' }, { label: 'UI' }] })`],
    ['/id/ui/pagination', 'Paginasi', 'Halaman bernomor, dijendelakan, sebagai tautan sungguhan.',
      `pagination({ page: 2, count: 5, href: (page) => '/id/ui#p' + page })`],
    ['/id/ui/tabs', 'Tab', 'Tautan, satu halaman per tab — atau panel yang bertukar di tempat.',
      `tabs({ variant: 'pills', items: [{ label: 'Satu', href: '/id/ui#t1', active: true }, { label: 'Dua', href: '/id/ui#t2' }] })`],
    ['/id/ui/app-bar', 'Bilah aplikasi', 'Merek di satu sisi, navigasi dan tindakan di sisi lain.',
      `appBar({ brand: 'sitelo', style: 'width: 100%; min-height: 2.5rem' }, appBarSpacer(), appBarActions(chip({ size: 'sm' }, 'v2')))`],
    ['/id/ui/theme-toggle', 'Pengalih tema', 'Terang dan gelap, tanpa kedipan saat masuk.',
      `themeToggle()`],
  ]],
  ['Lapisan', [
    ['/id/ui/modal', 'Modal', 'Dialog di atas API popover — tanpa skrip di mana pun.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Buka modal')`],
    ['/id/ui/drawer', 'Laci', 'Panel dari tepi, mekanika popover yang sama.',
      `button({ size: 'sm', variant: 'outline', color: 'neutral' }, 'Buka laci')`],
    ['/id/ui/menu', 'Menu', 'Menu tarik-turun di atas details, buka dan tutup secara cuma-cuma.',
      `chip({ color: 'neutral' }, 'Tindakan ▾')`],
    ['/id/ui/accordion', 'Akordeon', 'Bagian yang bisa diciutkan, termasuk mode eksklusif.',
      `div({ style: 'width: 100%' }, accordion({ items: [{ title: 'Sebuah pertanyaan' }] }))`],
    ['/id/ui/collapsible', 'Dapat diciutkan', 'Satu “tampilkan lebih banyak”, tanpa hiasan akordeon.',
      `collapsible({ trigger: 'Tampilkan lebih banyak' }, 'Tersembunyi sampai diminta.')`],
  ]],
  ['Bagian', [
    ['/id/ui/hero', 'Hero', 'Bagian atas halaman pendaratan: tajuk, kalimat, tindakan.',
      `stack({ gap: 'xs', align: 'center' }, text({ variant: 'h6', as: 'div' }, 'Sebuah tajuk'), text({ variant: 'caption', tone: 'muted' }, 'Dan sebuah kalimat.'))`],
    ['/id/ui/footer', 'Footer', 'Kolom-kolom tautan, dan satu baris di bawahnya.',
      `stack({ gap: 'xs', style: 'width: 100%' }, text({ variant: 'overline' }, 'Dokumentasi'), text({ variant: 'caption', tone: 'muted' }, 'Panduan · Komponen'))`],
    ['/id/ui/stat', 'Statistik', 'Angka yang layak dilihat, dan apa artinya.',
      `stat({ label: 'Halaman', value: '204', change: '+8', color: 'success' })`],
    ['/id/ui/steps', 'Langkah', 'Alur bernomor, dengan yang selesai ditandai selesai.',
      `div({ style: 'width: 100%' }, steps({ direction: 'vertical', current: 1, items: ['Pasang', 'Bangun'] }))`],
    ['/id/ui/timeline', 'Lini masa', 'Entri berurutan menyusuri sebuah garis.',
      `div({ style: 'width: 100%' }, timeline({ items: [{ time: 'v2.7', title: 'Bagian', color: 'primary' }] }))`],
    ['/id/ui/mockup', 'Maket', 'Tangkapan layar dalam peramban, jendela, ponsel, atau terminal.',
      `mockup({ variant: 'browser', url: 'sitelo.dev', style: 'width: 100%' }, div({ style: 'height: 2.5rem; background: var(--su-surface-2)' }))`],
  ]],
  ['Penataan', [
    ['/id/ui/theming', 'Tema', 'Setiap warna, radius, dan fon, dari satu panggilan.',
      `stack({ direction: 'row', gap: 'xs' },
        ...['primary', 'success', 'warning', 'danger'].map((color) =>
          div({ style: 'width: 1.5rem; height: 1.5rem; border-radius: 0.3rem; background: var(--su-' + color + ')' })))`],
  ]],
]

/** Satu kartu galeri. Pratinjaunya lembam, namanya adalah tautan yang meregang. */
const galleryCard = ([href, name, summary, source]) =>
  li(
    /*
     * Sebuah div, bukan jangkar: pratinjau ini berisi tombol dan masukan
     * sungguhan, dan konten interaktif tidak bisa bersarang di dalam
     * tautan. Sebagai gantinya jangkar namanya meregang menutupi seluruh
     * kartunya, dan `inert` mengeluarkan kendali demonya dari urutan tab
     * serta pohon aksesibilitas.
     */
    div(
      { class: 'ui-gallery-card' },
      div(
        { class: 'ui-gallery-preview', 'data-pagefind-ignore': '', inert: true },
        preview(source),
      ),
      a({ class: 'ui-gallery-name', href }, name),
      span({ class: 'ui-gallery-summary' }, summary),
    ),
  )

export default () =>
  uiLayout({
    title: 'sitelo UI',
    pageTitle: 'sitelo UI — komponen untuk sitelo',
    description:
      'Pustaka komponen untuk sitelo: tombol, kartu, formulir, tabel, dan modal, sebagai fungsi yang mengembalikan HTML.',
    activeHref: '/id/ui',
    children: [
      p(
        'sitelo-ui adalah pustaka komponen untuk sitelo. Setiap komponen adalah fungsi yang mengembalikan string HTML, jadi ia langsung bersarang ke dalam halaman yang sedang Anda tulis — tanpa kompiler, tanpa runtime, tanpa hidrasi.',
      ),
      p(
        'Setiap contoh di bagian ini dirender oleh build yang sama dengan yang merender halaman di sekelilingnya. Apa yang Anda lihat adalah apa yang dihasilkan kode di bawahnya, dan ia mengikuti tema terang dan gelap situs ini karena sitelo-ui membaca atribut ',
        code('data-theme'),
        ' yang sama dengan yang dibaca dokumentasinya.',
      ),

      ...GROUPS.flatMap(([group, components]) => [
        h2(group),
        ul({ class: 'ui-gallery' }, ...components.filter(([href]) => !isDraft(href)).map(galleryCard)),
      ]),

      h2('Menyiapkannya'),
      p(
        'Dua baris: impor komponennya, dan taruh ',
        code('styles()'),
        ' di dalam head. ',
        a({ href: '/id/docs/ui' }, 'Halaman Komponen di dokumentasi'),
        ' mencakup pemasangan, tema, konvensi pemanggilan, dan runtime klien yang opsional, serta mendaftar setiap ekspor dalam satu tabel.',
      ),
      p(
        'Direktori ',
        code('examples/ui'),
        ' di repositori merender keseluruhan kumpulannya dalam satu halaman.',
      ),

      h2('Tambahan'),
      p(
        'Tidak semuanya pantas berada dalam satu lembar gaya. Yang bertekstur dan yang dekoratif — dimulai dari butiran film — tinggal di ',
        a({ href: '/ui-extras' }, 'sitelo UI extras'),
        ', titik masuk kedua tempat tiap komponen membawa lembarnya sendiri, sehingga sebuah halaman hanya menautkan apa yang dipakainya.',
      ),
    ],
  })
