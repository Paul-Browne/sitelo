import { h2, p } from 'javascript-to-html'
import { fillableIcons, grid, icon, iconNames, stack, text } from 'sitelo/ui'

import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

/** Satu sel: glifnya pada ukuran yang terbaca, dengan nama yang diketikkan. */
const cell = (name) =>
  stack(
    {
      gap: 'xs',
      align: 'center',
      title: name,
      style:
        'padding: 0.85rem 0.5rem; border: 1px solid var(--su-border); border-radius: var(--su-radius-md); text-align: center; min-width: 0',
    },
    icon(name, { size: '1.5rem' }),
    text(
      {
        variant: 'caption',
        tone: 'muted',
        style: 'font-family: var(--su-font-mono); overflow-wrap: anywhere',
      },
      name,
    ),
  )

/* Alfabetis, langsung dari pustakanya, sehingga halamannya tidak bisa
 * tertinggal dari kumpulan yang didokumentasikannya. */
const gallery = () => grid({ min: '7.5rem', gap: 'sm' }, ...iconNames().map(cell))

/**
 * Glif yang diisi dengan mengecat jalurnya sendiri, dibandingkan yang
 * membawa gambar kedua — dibedakan lewat apakah kedua bentuknya adalah
 * markup yang sama, agar tidak ada demo yang tertinggal dari kumpulannya.
 */
const body = (html) => html.replace(/^<svg[^>]*>/, '')

const samePath = () =>
  fillableIcons().filter((name) => body(icon(name, { filled: true })) === body(icon(name)))

/**
 * Demo isian, ditulis lewat kode alih-alih didaftar manual — sumbernya
 * adalah apa yang dicetak halamannya, sehingga glif yang menjadi dapat
 * diisi muncul di sini tanpa ada yang perlu ingat menambahkannya.
 */
const fillDemo = ({ filled = false } = {}) => {
  const props = filled ? "{ filled: true, size: 'lg' }" : "{ size: 'lg' }"
  const calls = samePath().map((name) => `  icon('${name}', ${props}),`)

  return [
    "stack({ direction: 'row', gap: 'md', align: 'center' },",
    ...calls,
    ')',
  ].join('\n')
}

export default () =>
  uiLayout({
    title: 'Ikon',
    description:
      'Kumpulan 99 glif pada satu kisi, dirender sebaris sehingga sebuah ikon mengambil warna dan ukuran teks di sekitarnya.',
    activeHref: '/id/ui/icons',
    children: [
      p(
        code('icon()'),
        ' mengembalikan sebuah ',
        code('<svg>'),
        ' sebaris. Setiap glif digambar pada kisi 24×24 yang sama sebagai goresan tanpa isian dalam ',
        code('currentColor'),
        ', jadi ia mewarisi warna dan ukuran fon dari apa pun yang ditumpanginya dan tidak butuh penataan sendiri.',
      ),

      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check'),
  icon('search'),
  icon('trash'),
  icon('settings'),
)`),

      h2('Di dalam sebuah komponen'),
      p(
        'Ikon adalah anak seperti yang lain. Karena ia mengukur dirinya dalam ',
        code('em'),
        ', ia cocok dengan label di sebelahnya tanpa diberi tahu seberapa besar label itu:',
      ),
      demo(`stack({ direction: 'row', gap: 'sm', align: 'center', wrap: true },
  button({ color: 'primary' }, icon('download'), 'Unduh'),
  button({ variant: 'outline' }, icon('external-link'), 'Buka'),
  button({ size: 'sm', variant: 'soft', color: 'danger' }, icon('trash'), 'Hapus'),
  iconButton({ label: 'Cari', variant: 'soft', icon: icon('search') }),
)`),

      h2('Ukuran'),
      p(
        'Bawaannya ',
        code('1em'),
        ' — ukuran teks di sekitarnya. ',
        code('size'),
        ' menerima sebuah token atau panjang CSS apa pun ketika Anda ingin lepas darinya:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('star', { size: 'sm' }),
  icon('star'),
  icon('star', { size: 'lg' }),
  icon('star', { size: '2rem' }),
  icon('star', { size: '3rem' }),
)`),

      h2('Warna'),
      p(
        'Tidak ada props warna. Ikon digambar dalam ',
        code('currentColor'),
        ', jadi ia mengambil warna konteksnya — dan itulah yang membuat satu kumpulan bekerja di dalam lima palet:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  text({ style: 'color: var(--su-primary)' }, icon('heart', { size: 'lg' })),
  text({ style: 'color: var(--su-success)' }, icon('check-circle', { size: 'lg' })),
  text({ style: 'color: var(--su-warning)' }, icon('alert-triangle', { size: 'lg' })),
  text({ style: 'color: var(--su-danger)' }, icon('x-circle', { size: 'lg' })),
  text({ tone: 'muted' }, icon('info', { size: 'lg' })),
)`),

      h2('Nama yang dapat diakses'),
      p(
        'Ikon ber-',
        code('aria-hidden'),
        ' secara bawaan, dan itu jauh lebih sering benar daripada tidak: ikon di samping kata “Hapus” tidak boleh diumumkan untuk kedua kalinya. Beri ia sebuah ',
        code('label'),
        ' hanya ketika ikonnya membawa seluruh maknanya, dan ia menjadi ',
        code('role="img"'),
        ' dengan nama itu.',
      ),
      codeBlock('', `icon('trash')                      // hiasan — disembunyikan
button(icon('trash'), 'Hapus')     // katanya yang berbicara

icon('trash', { label: 'Hapus' })  // diumumkan sebagai sebuah gambar

// Tombol yang hanya berikon memberi label pada tombolnya, bukan glif di dalamnya
iconButton({ label: 'Hapus', icon: icon('trash') })`, 'javascript'),

      h2('Terisi'),
      p(
        code('filled'),
        ' mengecat sebuah glif alih-alih menggariskannya. Jalurnya sama dalam kedua keadaan — hanya atribut ',
        code('fill'),
        '-nya yang berubah — jadi kedua bentuknya berbagi tepi luar yang persis sama dan tidak bisa saling melenceng.',
      ),
      demo(fillDemo()),
      p('Dan nama-nama yang sama dalam keadaan terisi:'),
      demo(fillDemo({ filled: true })),
      p(
        'Ia berupa props alih-alih kumpulan nama kedua karena keadaan terisi hampir selalu merupakan sebuah ',
        code('keadaan'),
        ' — tersimpan, disukai, dinilai — jadi ia menginginkan sebuah boolean, bukan string yang berbeda:',
      ),
      codeBlock('', `icon('heart', { filled: liked })
icon('bookmark', { filled: saved, label: saved ? 'Tersimpan' : 'Simpan' })

// alih-alih
icon(liked ? 'heart-filled' : 'heart')`, 'javascript'),
      p(
        'Glif status terisi dengan cara berbeda, karena tandanya berada ',
        code('di dalam'),
        ' bentuknya. Mengecat lingkarannya akan menelan centangnya, jadi tandanya justru dilubangkan keluar darinya:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('check-circle', { filled: true, size: 'lg' }),
  icon('x-circle', { filled: true, size: 'lg' }),
  icon('info', { filled: true, size: 'lg' }),
  icon('help', { filled: true, size: 'lg' }),
  icon('alert-triangle', { filled: true, size: 'lg' }),
)`),
      p(
        'Yang itu membawa gambar kedua — bentuk padat dengan tandanya dipotong keluar oleh ',
        code('fill-rule: evenodd'),
        ' — karena pelubangan tidak bisa diperoleh dari jalur garisnya dengan mengubah sebuah atribut. Bentuk luarnya digambar pada tepi luar garisnya, jadi kedua bentuknya tetap berakhir pada siluet yang sama. Props-nya sama dalam kedua keadaan; mekanisme mana yang dipakai sebuah glif adalah urusannya sendiri.',
      ),
      p(
        'Sebuah ok tidak punya bagian dalam untuk dicat sama sekali — ia adalah garis terbuka — jadi ia terisi menjadi segitiga yang digambarkan ketiga titiknya sendiri, sambil mempertahankan goresan yang membulatkan sudutnya:',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('chevron-up', { filled: true, size: 'lg' }),
  icon('chevron-down', { filled: true, size: 'lg' }),
  icon('chevron-left', { filled: true, size: 'lg' }),
  icon('chevron-right', { filled: true, size: 'lg' }),
)`),
      p(
        code('fillableIcons()'),
        ' mendaftar semua yang menanggapi ',
        code('filled'),
        '. Glif tanpa bentuk terisi mengabaikannya dan tetap bergaris — mengisi ',
        code('eye'),
        ' akan menghilangkan pupilnya dan ',
        code('tag'),
        ' lubangnya, jadi keduanya tidak berpura-pura bisa.',
      ),

      h2('Berputar'),
      p(
        code('spin'),
        ' memutar glifnya — dimaksudkan untuk ',
        code('spinner'),
        ', meski tidak ada yang menghalangi Anda memutar ',
        code('refresh'),
        ' selagi sesuatu dimuat ulang. Ia melambat sampai merayap alih-alih berhenti di bawah ',
        code('prefers-reduced-motion'),
        ', karena pemutar yang berhenti tampak rusak.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  icon('spinner', { spin: true, size: 'lg' }),
  icon('refresh', { spin: true, size: 'lg' }),
  button({ variant: 'soft' }, icon('spinner', { spin: true }), 'Menyimpan…'),
)`),

      h2('Kumpulannya'),
      p(
        'Namanya menjelaskan gambarnya alih-alih pekerjaan yang dilakukannya — ',
        code('x-circle'),
        ', bukan ',
        code('error'),
        ' — karena gambar yang sama dipakai untuk pekerjaan yang tidak berkaitan, dan nama yang menjelaskan gambarnya tetap benar ketika itu terjadi. Takaran alias di bawah ini mencakup maksud-maksud yang umum.',
      ),
      gallery(),

      h2('Merek'),
      p(
        'Delapan tanda merek hadir bersama kumpulannya — ',
        code('facebook'),
        ', ',
        code('google'),
        ', ',
        code('instagram'),
        ', ',
        code('linkedin'),
        ', ',
        code('tiktok'),
        ', ',
        code('whatsapp'),
        ', ',
        code('x-twitter'),
        ', dan ',
        code('youtube'),
        '. Mereka tetap menerima ',
        code('size'),
        ' dan ',
        code('label'),
        ' serta tetap digambar dalam ',
        code('currentColor'),
        ':',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center', wrap: true },
  icon('facebook', { size: 'lg' }),
  icon('instagram', { size: 'lg' }),
  icon('x-twitter', { size: 'lg' }),
  icon('youtube', { size: 'lg' }),
  icon('whatsapp', { size: 'lg' }),
  button({ variant: 'soft', color: 'neutral' }, icon('linkedin'), 'Bagikan'),
)`),
      p(
        'Mereka adalah reproduksi tanda milik orang lain alih-alih gambar bergaya pustaka ini, jadi mereka sengaja melanggar dua aturannya: mereka berupa bentuk padat alih-alih goresan, dan memang begitulah sebuah logo, dan proporsinya adalah proporsi mereknya alih-alih kisi ini. ',
        code('filled'),
        ' tidak berarti apa pun bagi mereka — mereka memang sudah begitu.',
      ),
      p(
        'Karyanya berasal dari Simple Icons, yang merilisnya di bawah CC0. Itu mencakup gambarnya, bukan mereknya: pakai ini untuk menunjuk hal yang mereka namai — tautan profil, tombol berbagi — dan bukan pada produk Anda sendiri.',
      ),
      p(
        'Namanya ',
        code('x-twitter'),
        ', bukan ',
        code('x'),
        ', karena ',
        code('x'),
        ' sudah menjadi alias ',
        code('close'),
        ' dan tombol tutup yang berubah menjadi logo akan menjadi kejutan yang tidak menyenangkan. ',
        code('twitter'),
        ' juga mengarah ke sana.',
      ),

      h2('Alias'),
      p('Masing-masing dari ini merender glif yang terdaftar di atas, dengan nama yang lebih mungkin Anda raih:'),
      grid(
        { min: '15rem', gap: 'xs' },
        ...[
          ['success', 'check-circle'],
          ['warning', 'alert-triangle'],
          ['danger, error', 'x-circle'],
          ['x, cross', 'close'],
          ['question', 'help'],
          ['loading', 'spinner'],
          ['cog, gears', 'gear'],
          ['delete, trash-can', 'trash'],
          ['pencil', 'edit'],
          ['notification', 'bell'],
          ['dots', 'more-horizontal'],
          ['bolt, lightning', 'zap'],
          ['arrow-back', 'arrow-left'],
          ['arrow-forward', 'arrow-right'],
          ['cart', 'shopping-cart'],
          ['bag', 'shopping-bag'],
          ['card', 'credit-card'],
          ['cash, money', 'banknote'],
          ['delivery, shipping', 'truck'],
          ['shop', 'store'],
          ['discount, sale', 'percent'],
          ['login, sign-in', 'log-in'],
          ['logout, sign-out', 'log-out'],
          ['map-pin, marker', 'location'],
          ['mobile', 'smartphone'],
          ['like', 'thumbs-up'],
          ['dislike', 'thumbs-down'],
          ['comment, message, chat', 'comment-bubble'],
          ['ai, magic', 'sparkles'],
          ['printer', 'print'],
          ['accessibility, a11y', 'universal-access'],
          ['twitter', 'x-twitter'],
        ].map(([alias, target]) =>
          text({ variant: 'small' }, code(alias), ' → ', code(target)),
        ),
      ),

      h2('Ikon Anda sendiri'),
      p(
        code('registerIcons()'),
        ' menambahkan sebuah glif, atau mengganti salah satu bawaannya. Markup-nya adalah isi dari ',
        code('<svg>'),
        '-nya — bentuk pada kisi 24×24 yang sama, dibiarkan tanpa isian agar ',
        code('currentColor'),
        ' menjangkaunya. Panggil sekali dari modul yang diimpor halaman Anda:',
      ),
      codeBlock('src/lib/icons.js', `import { registerIcons } from 'sitelo/ui'

registerIcons({
  logo: '<path d="M4 20 12 4l8 16z"/>',
  // Nama yang sudah ada akan menggantikannya di mana-mana, dan begitulah
  // cara menata ulang bawaan tanpa mencabangkan pustakanya.
  check: '<path d="m5 13 4 4 10-11"/>',
  // Satu bentuk tertutup, agar ia bisa menanggapi \`filled\` seperti bawaannya.
  pin: { markup: '<path d="M12 21s7-6.3 7-11a7 7 0 1 0-14 0c0 4.7 7 11 7 11z"/>', fillable: true },
})`, 'javascript'),
      codeBlock('', `import { icon } from 'sitelo/ui'

icon('logo')                  // glif Anda
icon('check')                 // sekarang ini pun milik Anda

registerIcons({ check: null }) // dan kembali ke bawaannya`, 'javascript'),

      h2('Mengapa sebaris, dan bukan sprite'),
      p(
        'Ikon dirender ke dalam halamannya alih-alih ditarik dari sebuah ',
        code('icons.svg'),
        ' dengan ',
        code('<use>'),
        '. Sprite menghemat sekitar seratus bita HTML ter-gzip per halaman dan menukarnya dengan satu perjalanan bolak-balik — markup yang berulang justru kasus yang paling dikuasai gzip, jadi sebagian besar yang ingin diringkas sprite sudah diringkas lebih dulu. Sebaris juga berarti tidak ada berkas yang perlu dihasilkan, tidak ada jalur dasar yang perlu dikonfigurasi, dan tidak ada yang bisa hilang dari ',
        code('dist'),
        ' — takaran yang sama dengan yang diambil ',
        code('styles({ inline: true })'),
        '.',
      ),

      h2('Props'),
      propsTable([
        ['name', 'string', '', 'Glif yang mana. Bisa diberikan sebagai argumen pertama sebagai gantinya.'],
        ['size', "'sm' | 'md' | 'lg' | string", "'md'", 'Sebuah token, atau panjang CSS apa pun. Bawaannya 1em.'],
        ['label', 'string', '', 'Mengumumkannya sebagai gambar dengan nama ini, alih-alih menyembunyikannya.'],
        ['spin', 'boolean', 'false', 'Memutarnya terus-menerus.'],
        ['filled', 'boolean', 'false', 'Mengecat glifnya alih-alih menggariskannya. Diabaikan glif yang tidak bisa diisi.'],
      ]),
      p(
        'Nama yang tidak dikenal tidak merender apa pun alih-alih melempar galat — props yang sifatnya kosmetik seharusnya tidak bisa menggagalkan build. ',
        code('hasIcon(name)'),
        ' memberi tahu apakah salah satunya ada, ',
        code('iconNames()'),
        ' mendaftar semuanya, dan ',
        code('fillableIcons()'),
        ' yang menerima ',
        code('filled'),
        '.',
      ),
    ],
  })
