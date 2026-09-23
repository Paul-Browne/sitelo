import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Pengalih tema',
    description:
      'Sakelar terang/gelap, dengan skrip sebaris yang mencegah pilihan tersimpan berkedip saat masuk.',
    activeHref: '/id/ui/theme-toggle',
    children: [
      p(
        'sitelo-ui menyelesaikan mode gelap dari ',
        code('prefers-color-scheme'),
        ' dengan sendirinya — situs yang senang mengikuti sistem operasinya tidak butuh apa pun dari halaman ini. Pengalihnya ada untuk membiarkan pembaca menimpa itu.',
      ),
      p(
        'Ia salah satu dari lima komponen yang butuh skrip, karena pilihannya tinggal di ',
        code('localStorage'),
        ' dan hanya skrip yang bisa membacanya. Tombolnya mengambil skrip itu sendiri, pada tekanan pertama.',
      ),

      h2('Menyiapkannya'),
      p('Dua hal di dalam head, dan tombolnya di mana pun ia semestinya berada:'),
      codeBlock('src/index.ht.js', `import { styles, themeScript, themeToggle } from 'sitelo/ui'

head(
  themeScript(), // menerapkan pilihan tersimpan sebelum lukisan pertama
  styles(),
)

body(
  appBar({ brand: 'Situs saya' },
    appBarSpacer(),
    appBarActions(themeToggle()),
  ),
)`, 'javascript'),
      p(
        'Tidak ada berkas ketiga. ',
        code('themeScript()'),
        ' sengaja bersifat memblokir dan sebaris — apa pun yang ditunda akan melukis lebih dulu, dan itu persis kedipan gelap yang ingin dicegahnya — sedangkan pembaliknya sendiri menumpang pada tombolnya:',
      ),
      codeBlock('Markup hasil render', `<button data-su-theme-toggle
        onclick="import('/su/theme.js').then(m=>m.toggle(this))">`, 'html'),
      p(
        'Pasangkan keduanya. ',
        code('themeScript()'),
        ' juga yang menandai pengalihnya ',
        code('aria-pressed'),
        ' saat dimuat: belum ada yang ditekan, jadi tombolnya sendiri tidak bisa tahu tema mana yang terpilih.',
      ),

      h2('Pengalihnya'),
      p(
        'Ikonnya murni CSS, dibaca langsung dari atribut temanya — jadi ia sudah benar pada lukisan pertama, sebelum skrip apa pun berjalan. Ia menunjukkan akan beralih ke tema yang mana sebuah klik itu.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', align: 'center' },
  themeToggle(),
  themeToggle({ variant: 'soft' }),
  themeToggle({ variant: 'outline' }),
)`),
      p(
        'Tombol-tombol itu berfungsi — halaman ini memuat runtime-nya. Mengeklik salah satunya menyetel ',
        code('data-su-theme'),
        ' pada ',
        code('<html>'),
        ', yang merupakan atribut milik sitelo-ui sendiri, jadi hanya komponen sitelo-ui di halaman ini yang berubah. Sisa situs ini mengikuti ',
        code('data-theme'),
        '-nya sendiri, yang disetel pengalih di bilah atas. Di situs Anda hanya akan ada salah satunya.',
      ),

      h2('Di dalam bilah aplikasi'),
      demo(`appBar({ brand: 'sitelo' },
  appBarNav(navLink({ href: '#docs', current: true }, 'Dokumentasi')),
  appBarSpacer(),
  appBarActions(
    themeToggle(),
    button({ size: 'sm' }, 'Mulai'),
  ),
)`, { align: 'stretch' }),

      h2('Bagaimana temanya diselesaikan'),
      p(
        'Berurutan: ',
        code('data-theme'),
        ' atau ',
        code('data-su-theme'),
        ' yang eksplisit pada leluhur mana pun menang; jika tidak ada, ',
        code('prefers-color-scheme'),
        ' yang memutuskan. Kedua nama atribut itu dihormati agar sitelo-ui bisa duduk di dalam situs yang sudah punya sakelar temanya sendiri — dan itulah persis yang dilakukan dokumentasi ini.',
      ),

      h2('Menggerakkannya sendiri'),
      p(
        'Runtime-nya mengekspor fungsi yang sama dengan yang dipakai tombolnya, untuk kendali khusus, atau pemilih tiga arah terang / gelap / sistem.',
      ),
      codeBlock('src/main.js', `import { getTheme, setTheme, toggleTheme } from 'sitelo/ui/client'

getTheme()          // 'light' | 'dark' — hasil penyelesaian, bukan yang tersimpan
toggleTheme()       // balik
setTheme('dark')    // sematkan
setTheme('system')  // bersihkan penimpanya dan ikuti OS lagi`, 'javascript'),

      h2('Props'),
      propsTable([
        ['label', 'string', "'Toggle dark mode'", 'Nama yang dapat diakses dan tooltip-nya.'],
        ['variant', "'solid' | 'soft' | 'outline' | 'ghost' | 'link'", "'ghost'", 'Varian tombolnya.'],
        ['color', "'primary' | 'neutral' | 'success' | 'warning' | 'danger'", "'neutral'", 'Dari palet mana ia menimba.'],
      ]),
      p(
        code('themeScript()'),
        ' menerima ',
        code('nonce'),
        ' opsional, untuk situs dengan kebijakan keamanan konten.',
      ),
    ],
  })
