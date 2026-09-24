import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, presetPreview, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Tema',
    description:
      'Membawa lembar gayanya ke halaman, dan mengubah setiap warna, radius, serta fon dari satu panggilan.',
    activeHref: '/id/ui/theming',
    children: [
      p(
        'Setiap komponen membaca properti kustom yang sama, jadi sebuah tema adalah sekumpulan penimpa pada ',
        code(':root'),
        ' — tanpa langkah build, tanpa berkas konfigurasi, dan tanpa komponen yang perlu diberi tahu tentangnya.',
      ),

      h2('Membawa gayanya masuk'),
      p(
        code('styles()'),
        ' mengembalikan sebuah ',
        code('<link>'),
        ' ke satu berkas, yang disinggahkan peramban di seluruh halaman situsnya. Tidak ada yang perlu dikonfigurasi dan tidak ada yang perlu disalin: plugin sitelo menyajikannya saat pengembangan dan menulisnya ke dalam build, pada basis yang sama dengan runtime komponennya.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles(),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">`, 'javascript'),
      p(
        'Namanya membawa hash dari isinya, jadi Anda bisa menyajikannya sebagai ',
        code('immutable'),
        ' dan tetap menerbitkan perubahan. Berikan ',
        code('{ hash: false }'),
        ' untuk ',
        code('/su/ui.css'),
        ' biasa, atau ',
        code('base'),
        ' untuk mengarahkan tautannya ke salinan yang Anda hosting sendiri.',
      ),
      p(
        code('{ inline: true }'),
        ' justru menaruh seluruh lembarnya dalam sebuah ',
        code('<style>'),
        ' — sekitar 11 kB ter-gzip di setiap halaman, tetapi tanpa permintaan tambahan dan tanpa apa pun yang bisa hilang dari ',
        code('dist/'),
        '. Itu takaran yang lebih baik untuk satu halaman; tautannya menebus permintaannya kembali pada halaman kedua yang dibaca pengunjung.',
      ),
      codeBlock('src/index.ht.js', `head(
  title('Situs saya'),
  styles({ inline: true }),
)`, 'javascript'),
      p(
        'Sisa keluarganya menyerahkan potongan-potongannya kepada Anda. ',
        code('stylesheet()'),
        ' mengembalikan CSS mentahnya sebagai string — untuk menghosting lembarnya di tempat yang tidak bisa dijangkau sitelo, atau menulisnya sendiri ke suatu tempat — dan ',
        code('stylesUrl()'),
        ' hanya href-nya, untuk elemen link milik Anda sendiri.',
      ),

      h2('Preset'),
      p(
        'Preset mengubah seluruh tampilan sekaligus. ',
        code("styles({ preset: 'neumorphism' })"),
        ' menautkan lembar kedua tepat setelah lembar inti — disajikan, di-hash, dan di-cache dengan cara yang sama — dan setiap komponen di halaman mengikutinya, tanpa ada yang perlu diubah di markup.',
      ),
      codeBlock('src/index.ht.js', `import { styles } from 'sitelo/ui'

head(
  title('Situs saya'),
  styles({ preset: 'neumorphism' }),
)
// <link rel="stylesheet" href="/su/ui-c9428b65.css">
// <link rel="stylesheet" href="/su/neumorphism-5d0e7b91.css">`, 'javascript'),
      presetPreview('neumorphism'),
      p(
        code('neumorphism'),
        ' adalah soft UI: setiap permukaan adalah halaman itu sendiri, dan sebuah kontrol menonjol hanya lewat cahaya dan bayangan — terangkat dari halaman, atau tertekan ke dalamnya. Preset ini mempertahankan dua hal yang biasanya dikorbankan gaya ini, teks yang lolos WCAG AA dan garis fokus, dan mengikuti mode gelap seperti bagian lainnya. Namun ia membutuhkan latar halaman itu sendiri berupa ',
        code('var(--su-bg)'),
        ', karena efeknya bergantung pada keduanya yang berwarna sama.',
      ),
      p(
        code('glassmorphism'),
        ' adalah kaca buram: setiap permukaan adalah panel tembus cahaya yang mengaburkan apa pun di belakangnya, dengan cahaya di tepinya. Kaca hanya menjadi kaca di atas sesuatu, jadi preset ini membutuhkan latar halaman berupa ',
        code('var(--su-glass-ground)'),
        ' — warna halaman dengan tiga semburat warna yang terpasang di belakangnya. Teks diukur terhadap warna paling terang yang bisa berada di bawah panel, apa pun yang melayang di atas teks halaman dibuat buram hampir pekat, dan pembaca yang meminta transparansi dikurangi mendapat panel yang sama di atas latar yang diam.',
      ),
      codeBlock('src/styles.css', `body {
  background: var(--su-glass-ground);
}`, 'css'),
      presetPreview('glassmorphism'),
      p(
        code('theme()'),
        ' tetap bekerja di atasnya, jadi preset adalah titik awal, bukan fork. Kedua preset menambahkan slot kesepuluh ke setiap palet, ',
        code('glow'),
        ' — warna yang dituju ujung bilah kemajuan atau sakelar saat memudar — supaya warna primer yang baru bisa membawa miliknya sendiri.',
      ),
      codeBlock('src/index.ht.js', `head(
  styles({ preset: 'neumorphism' }),
  theme({
    primary: { base: '#7c3aed', hover: '#6d28d9', active: '#5b21b6', glow: '#e879f9' },
  }),
)`, 'javascript'),
      p(
        code('inline'),
        ' menyisipkan kedua lembar secara inline, ',
        code('stylesheet({ preset })'),
        ' mengembalikan keduanya sebagai satu string, dan nama yang bukan preset melempar galat berisi daftar preset yang ada.',
      ),

      h2('Menimpa token'),
      p(
        code('theme()'),
        ' menulis penimpanya. Kuncinya adalah nama token camelCase, objek palet, atau properti kustom harfiah — dan ia datang ',
        code('setelah'),
        ' ',
        code('styles()'),
        ', jadi ia menang.',
      ),
      codeBlock('src/index.ht.js', `import { styles, theme } from 'sitelo/ui'

head(
  styles(),
  theme({
    primary: { base: '#5b5bd6', hover: '#4a4ac4', active: '#3f3fb0', fg: '#ffffff' },
    radiusMd: '2px',
    fontSans: '"Inter", system-ui, sans-serif',
  }),
)`, 'javascript'),
      h2('Tema bercakupan'),
      p(
        'Sebuah ',
        code('selector'),
        ' membatasi penimpanya pada satu subpohon alih-alih seluruh halaman. Itulah yang dilakukan ketiga panel di bawah — komponen yang sama, tiga palet berbeda, satu halaman.',
      ),
      demo(`fragment(
  theme({ primary: { base: '#5b5bd6', hover: '#4a4ac4', fg: '#ffffff', soft: '#e6e6fa', softFg: '#33338f', border: '#b9b9ee' } }, { selector: '.theme-indigo' }),
  theme({ primary: { base: '#b0357a', hover: '#962e68', fg: '#ffffff', soft: '#fbe4f0', softFg: '#7d1f53', border: '#f0a9ce' } }, { selector: '.theme-pink' }),
  theme({ radiusMd: '999px', radiusLg: '1.5rem' }, { selector: '.theme-round' }),
  grid({ min: '11rem' },
    div({ class: 'theme-indigo' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'nila'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-pink' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'merah muda'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
    div({ class: 'theme-round' },
      card(cardBody(stack({ gap: 'sm' },
        text({ variant: 'caption', tone: 'muted' }, 'bulat'),
        button({ block: true }, 'Primary'),
        button({ variant: 'soft', block: true }, 'Soft'),
      ))),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Mode gelap'),
      p(
        'Gelap diselesaikan sendiri dari ',
        code('prefers-color-scheme'),
        '. Sebuah ',
        code('data-theme'),
        ' atau ',
        code('data-su-theme'),
        ' eksplisit bernilai ',
        code('light'),
        ' atau ',
        code('dark'),
        ' pada leluhur mana pun menimpanya — dan begitulah demo di situs ini mengikuti pengalih di bilah atas.',
      ),
      p(
        'Berikan ',
        code('dark'),
        ' untuk penimpa yang hanya boleh berlaku di sana. Ia mencakup atributnya dan kueri medianya sekaligus.',
      ),
      codeBlock('src/index.ht.js', `theme({
  primary: { base: '#5b5bd6' },
}, {
  dark: { primary: { base: '#8f8ff0' } },
})`, 'javascript'),

      h2('Apa saja yang bisa ditimpa'),
      p(
        'Lima palet yang masing-masing punya sembilan slot, sebuah skala jarak, tipografi, radius, bayangan, dan warna permukaan. Semuanya adalah properti kustom — buka lembar gayanya, atau inspektur peramban Anda, dan semuanya ada di ',
        code(':root'),
        '.',
      ),
      demo(`stack({ gap: 'md' },
  stack({ direction: 'row', gap: 'sm', wrap: true },
    ...['primary', 'neutral', 'success', 'warning', 'danger'].map((color) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: 3.5rem; height: 2rem; border-radius: 0.4rem; background: var(--su-' + color + ')' }),
        text({ variant: 'caption', tone: 'muted' }, color),
      ),
    ),
  ),
  stack({ direction: 'row', gap: 'sm', wrap: true, align: 'flex-end' },
    ...['xs', 'sm', 'md', 'lg', 'xl'].map((step) =>
      stack({ gap: 'xs', align: 'center' },
        div({ style: 'width: var(--su-space-' + step + '); height: 2rem; border-radius: 0.2rem; background: var(--su-neutral)' }),
        text({ variant: 'caption', tone: 'muted' }, step),
      ),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Penamaan'),
      p(
        'Kunci camelCase menjadi properti kebab-case: ',
        code('radiusMd'),
        ' adalah ',
        code('--su-radius-md'),
        ', ',
        code('fontSans'),
        ' adalah ',
        code('--su-font-sans'),
        '. Objek bersarang mengembang dengan cara yang sama — ',
        code('{ primary: { softFg: … } }'),
        ' menyetel ',
        code('--su-primary-soft-fg'),
        ' — dan kunci yang sudah diawali ',
        code('--'),
        ' dipakai persis seperti tertulis, dan itulah jalan keluar untuk apa pun yang tidak tercakup pemetaannya.',
      ),
      p(
        'Sebuah palet punya sembilan slot: ',
        code('base'),
        ', ',
        code('hover'),
        ', ',
        code('active'),
        ', ',
        code('fg'),
        ', ',
        code('soft'),
        ', ',
        code('softHover'),
        ', ',
        code('softFg'),
        ', ',
        code('border'),
        ', dan ',
        code('ring'),
        '. Setel hanya yang Anda ubah.',
      ),

      h2('Kontras'),
      p(
        'Palet yang disertakan lolos WCAG AA terhadap permukaan yang ditumpanginya, di kedua tema, dan ada sebuah pengujian di repositori yang menggagalkan build jika itu berhenti benar. Tema buatan Anda sendiri tidak tercakup olehnya — periksa ',
        code('fg'),
        ' Anda terhadap ',
        code('base'),
        ' Anda sebelum menerbitkannya.',
      ),

      h2('Props'),
      p(code('styles()'), ':'),
      propsTable([
        ['preset', "'glassmorphism' | 'neumorphism'", '', 'Menata ulang setiap komponen dengan sebuah preset, ditautkan atau disisipkan setelah lembar inti.'],
        ['inline', 'boolean', 'false', 'Menghasilkan CSS-nya sendiri alih-alih tautan kepadanya.'],
        ['hash', 'boolean', 'true', 'Memberi hash konten pada nama berkasnya. Hanya untuk yang bertautan.'],
        ['base', 'string', "'/su/'", 'Mengarahkan URL-nya ke tempat lain; salinan itu Anda yang menghosting. Hanya untuk yang bertautan.'],
        ['minify', 'boolean', 'true', 'Melucuti komentar dan spasi. Hanya untuk yang sebaris.'],
        ['nonce', 'string', '', 'Nonce CSP untuk elemen yang dihasilkan.'],
      ]),
      p(
        code('stylesUrl()'),
        ' menerima ',
        code('base'),
        ' dan ',
        code('hash'),
        '; ',
        code('stylesheet()'),
        ' menerima ',
        code('minify'),
        ' dan ',
        code('preset'),
        '.',
      ),
      p(code('theme(tokens, options)'), ':'),
      propsTable([
        ['selector', 'string', "':root'", 'Membatasi penimpanya pada satu subpohon.'],
        ['dark', 'object', '', 'Penimpa yang hanya berlaku di mode gelap.'],
        ['nonce', 'string', '', 'Nonce CSP.'],
      ]),
    ],
  })
