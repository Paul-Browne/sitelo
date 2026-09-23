import { h2, p } from 'javascript-to-html'
import { code, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Maket',
    description:
      'Tangkapan layar dalam sebuah bingkai — peramban, jendela, ponsel, atau terminal.',
    activeHref: '/id/ui/mockup',
    children: [
      p(
        'Untuk menampilkan produk di halaman pendaratan atau tangkapan layar di dokumentasi. Bingkainya adalah hiasan: titik-titiknya, bilah alamatnya, dan takiknya semuanya ber-',
        code('aria-hidden'),
        ', jadi pembaca layar mendapat isinya dan bukan uraian tentang hiasannya.',
      ),

      h2('Peramban'),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev' },
  div({ style: 'padding: 1.5rem; background: var(--su-surface-2)' },
    stack({ gap: 'sm' },
      text({ variant: 'h5', as: 'div' }, 'Halo dunia'),
      text({ variant: 'small', tone: 'muted' }, 'Dirender saat build, disajikan sebagai berkas statis.'),
    ),
  ),
)`, { align: 'stretch' }),

      h2('Jendela'),
      p('Bingkai yang sama tanpa bilah alamat, untuk apa pun yang bukan halaman web.'),
      demo(`mockup({ variant: 'window' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Jendela tanpa URL.'),
  ),
)`, { align: 'stretch' }),

      h2('Lampu lalu lintas'),
      p(
        'Tombolnya mengikuti tema secara bawaan. ',
        code("dots: 'mac'"),
        ' mewarnainya dengan merah, kuning, dan hijau ala macOS — ketiganya sama di kedua tema, karena justru dikenali itulah gunanya.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev', dots: 'mac' },
  div({ style: 'padding: 1.5rem' },
    text({ variant: 'small' }, 'Jendela yang pernah Anda lihat sebelumnya.'),
  ),
)`, { align: 'stretch' }),

      h2('Terminal'),
      p(
        'Varian ',
        code('code'),
        ' berwarna gelap di kedua tema, sebagaimana terminal.',
      ),
      demo(`mockup({ variant: 'code' },
  '<div>$ npm install -D sitelo</div>' +
  '<div>$ npx sitelo build</div>' +
  '<div style="opacity: .7">✓ dibangun dalam 1,09 dtk</div>' +
  '<div style="opacity: .7">  204 halaman · 9,7 MB</div>',
)`, { align: 'stretch' }),

      h2('Ponsel'),
      p(
        'Ponsel masa kini: Dynamic Island yang mengambang terpisah dari bingkainya, bukan takik yang dipotong ke dalamnya. Sisakan ruang untuknya di bagian atas layar.',
      ),
      demo(`mockup({ variant: 'phone' },
  div({ style: 'padding: 3rem 1rem 1rem' },
    stack({ gap: 'md' },
      text({ variant: 'h6', as: 'div' }, 'sitelo'),
      text({ variant: 'caption', tone: 'muted' }, 'Situs statis, tanpa framework.'),
      button({ size: 'sm', block: true }, 'Mulai'),
    ),
  ),
)`),

      h2('Bingkai dan island'),
      p(
        code('frame'),
        ' mewarnai rel luarnya — warna CSS apa pun, jadi lapisan perangkatnya berupa nilai heksadesimal alih-alih nama yang harus didaftar pustaka ini. ',
        code('notch: false'),
        ' meniadakan island-nya untuk perangkat yang tidak punya.',
      ),
      demo(`stack({ direction: 'row', gap: 'md', wrap: true },
  mockup({ variant: 'phone', size: 'sm', frame: '#a8674a' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#2c3644' }, ''),
  mockup({ variant: 'phone', size: 'sm', frame: '#c9ced4', notch: false }, ''),
)`, { align: 'stretch' }),

      h2('Dengan tangkapan layar'),
      p(
        'Sebuah ',
        code('<img>'),
        ' di dalam badannya mengisi lebar bingkainya. Pasangkan dengan ',
        code('aspectRatio()'),
        ' jika gambarnya dimuat terlambat dan halamannya tidak boleh melompat.',
      ),
      demo(`mockup({ variant: 'browser', url: 'sitelo.dev/ui' },
  aspectRatio({ ratio: '16 / 9', style: 'background: var(--su-surface-2)' },
    '<img src="/logo.svg" alt="Galeri sitelo UI" style="object-fit: contain; padding: 3rem">',
  ),
)`, { align: 'stretch' }),

      h2('Ukuran'),
      p(
        'Maket mengisi wadahnya secara bawaan. ',
        code('size'),
        ' justru menyematkannya pada lebar tetap. Ponselnya punya tiga ukurannya sendiri — ponsel selebar 22rem sudah menjadi tablet — dan ia menjaga proporsinya pada ketiganya: sudut, rel, dan island-nya adalah pecahan dari lebarnya, bukan panjang tetap.',
      ),
      demo(`stack({ gap: 'md', align: 'flex-start' },
  mockup({ variant: 'window', size: 'sm' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'size: sm'))),
  mockup({ variant: 'window' }, div({ style: 'padding: 1rem' }, text({ variant: 'small' }, 'bawaan — lebar penuh'))),
)`, { align: 'stretch' }),

      h2('Di dalam hero'),
      p(
        'Pasangan yang menjadi alasan ini ada: berikan sebuah maket sebagai ',
        code('media'),
        ' milik hero.',
      ),
      demo(`hero({
  level: 2,
  align: 'start',
  title: 'Lihat ia berjalan',
  description: 'Sudah menjadi HTML statis saat tiba di peramban.',
  media: mockup({ variant: 'browser', url: 'example.com' },
    div({ style: 'padding: 1.25rem; background: var(--su-surface-2)' },
      text({ variant: 'small' }, 'Sebuah halaman, berbingkai.'),
    ),
  ),
}, button('Mulai'))`, { align: 'stretch' }),

      h2('Props'),
      propsTable([
        ['variant', "'browser' | 'window' | 'phone' | 'code'", "'browser'", 'Bingkai mana yang digambar.'],
        ['url', 'string', '', 'Ditampilkan di bilah alamat. Hanya varian browser.'],
        ['dots', "'mono' | 'mac'", "'mono'", 'Seperti apa ketiga tombolnya terlihat.'],
        ['frame', 'string', '', 'Mewarnai rel luarnya. Warna CSS apa pun. Hanya ponsel.'],
        ['notch', 'boolean', 'true', 'Menggambar Dynamic Island. Hanya ponsel.'],
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Lebar tetap. Sedang mengisi wadahnya.'],
      ]),
    ],
  })
