import {
  a,
  button,
  code,
  div,
  h1,
  h2,
  h3,
  img,
  li,
  p,
  span,
  ul,
} from 'javascript-to-html'
import { landingLayout } from '../lib/id.js'
import { arrowIcon, icons } from '../lib/landing-icons.js'
import { gettingStartedSnippets } from '../lib/snippets/getting-started.js'

const { install } = gettingStartedSnippets('id')

const features = [
  [
    'routing',
    'Perutean',
    'src/about.ht.js → /about, plus [slug] dan catch-all',
    '/id/docs/routing',
  ],
  [
    'code',
    'JSX & TSX',
    'Tulis halaman sebagai .jsx / .tsx dengan perutean dan build yang sama',
    '/id/docs/pages#batasan-jsx',
  ],
  [
    'data',
    'Memuat data',
    'data() saat build, dengan cache fetch',
    '/id/docs/data',
  ],
  [
    'pipeline',
    'Pipeline aset',
    'JS/TS/CSS yang dirujuk akan dibundel; sisanya tetap khusus server',
    '/id/docs/assets',
  ],
  [
    'image',
    'Optimasi gambar',
    'Ubah ukuran, format, dan srcset — aktifkan dengan images: true (pasang sharp)',
    '/id/docs/images',
  ],
  [
    'components',
    'sitelo UI',
    'Tombol, kartu, formulir, tabel, dan modal — fungsi yang mengembalikan HTML, tanpa runtime',
    '/id/docs/ui',
  ],
  [
    'terminal',
    'Server dev + toolbar',
    'Render langsung saat diminta, plus berkas, parameter, jumlah island, dan pengalih viewport selama kamu bekerja',
    '/id/docs/cli',
  ],
  [
    'search',
    'Pencarian Pagefind',
    'Pencarian statis opsional — pasang pagefind, lalu sitelo build mengindeks ke dist/pagefind/',
    '/id/docs/configuration#pencarian-pagefind',
  ],
  [
    'layers',
    'Island server',
    'Halaman statis dengan bagian yang dirender di server saat permintaan datang',
    '/id/docs/islands',
  ],
  [
    'sparkles',
    'Siap untuk AI',
    'llms.txt, aturan proyek, dan kiat agar agen menulis sitelo — bukan React',
    '/id/docs/build-with-ai',
  ],
  [
    'lighthouse',
    'Audit Lighthouse',
    'Nilai build sungguhan terhadap ambang batas — jalankan sitelo lighthouse (pasang lighthouse)',
    '/id/docs/configuration#audit-lighthouse',
  ],
  [
    'gift',
    'Ekstra',
    '404.html, sitemap.xml, RSS, dan konfigurasi deploy sekali klik kalau kamu minta',
    '/id/docs/configuration',
  ],
]

export default () =>
  landingLayout({
    pageTitle: 'sitelo — Framework modern untuk situs web cepat',
    description:
      'sitelo mengubah satu folder halaman menjadi situs statis yang cepat. Pratinjau langsung sambil bekerja, satu perintah untuk rilis — tanpa framework berat.',
    children: [headerHero(), mainSections()],
  })

function headerHero() {
  return div(
    { class: 'hero' },
    div(
      { class: 'hero-center' },
      img({
        class: 'hero-logo',
        src: '/logo.svg',
        alt: 'sitelo',
        width: '280',
        height: '80',
        // Above the fold and the hero's first paint, so it should not queue
        // behind the page's other subresources.
        fetchpriority: 'high',
      }),
      h1(
        { class: 'hero-headline' },
        span(
          { class: 'hero-headline-text' },
          'Framework modern untuk ',
          span(
            {
              class: 'hero-typed',
              'data-phrases':
                'situs web cepat|blog|portofolio|halaman arahan|situs berbasis konten|situs e-commerce',
              'aria-live': 'polite',
            },
            'situs web cepat',
          ),
        ),
      ),
      p(
        { class: 'hero-lede' },
        'Tanpa konfigurasi. Build secepat kilat. Deploy ke mana saja — sekali pasang.',
      ),
      div(
        { class: 'hero-actions' },
        a({ class: 'btn', href: '/id/docs' }, 'Mulai'),
        div(
          { class: 'install-glow' },
          div(
            { class: 'install' },
            code({ class: 'install-cmd' }, install),
            button(
              {
                class: 'install-copy',
                type: 'button',
                'data-copy': install,
                'aria-label': 'Salin perintah pemasangan',
              },
              'Salin',
            ),
          ),
        ),
      ),
    ),
  )
}

function mainSections() {
  return div(
    { class: 'landing-sections' },
    sectionBlock(
      'Apa yang kamu dapat',
      ul(
        { class: 'feature-list' },
        ...features.map(([icon, name, detail, href]) => {
          const body = div(
            { class: 'feature-card-body' },
            span({ class: 'feature-chip' }, icons[icon]),
            h3(name),
            p(detail),
          )
          return li(
            href
              ? a({ class: 'feature-card', href }, body)
              : div({ class: 'feature-card' }, body),
          )
        }),
      ),
    ),
    sectionBlock(
      'Dokumentasi',
      p(
        'Panduan untuk perutean, pemuatan data, TypeScript, konfigurasi, dan CLI.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/id/docs' },
          'Baca dokumentasi',
          arrowIcon,
        ),
      ),
    ),
    sectionBlock(
      'Contoh',
      p(
        'Resep untuk penyiapan nyata — dimulai dari situs berbasis REST API WordPress.',
      ),
      p(
        a(
          { class: 'btn btn-inline', href: '/id/examples' },
          'Jelajahi contoh',
          arrowIcon,
        ),
      ),
    ),
  )
}

function sectionBlock(heading, ...children) {
  return div({ class: 'section' }, h2(heading), ...children)
}
