import { a, h2, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/id.js'
import { deploymentSnippets } from '../../lib/snippets/deployment.js'

const s = deploymentSnippets('id')

export default () =>
  docsLayout({
    title: 'Penerapan',
    description:
      'Terapkan situs sitelo ke Netlify, Vercel, Cloudflare Pages, AWS Amplify, GitHub Pages, atau hosting statis mana pun.',
    activeHref: '/id/docs/deployment',
    children: [
      p(
        'Build sitelo adalah berkas statis biasa: ',
        code('sitelo build'),
        ' menulis HTML, CSS, dan JS ke ',
        code('dist/'),
        '. Hosting statis mana pun bisa dipakai — konfigurasi di bawah hanya mengasumsikan ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'URL bersih adalah direktori berisi ',
        code('index.html'),
        ' (',
        code('/about/index.html'),
        ' → ',
        code('/about'),
        '), jadi URL rapi bekerja begitu saja tanpa aturan pengalihan. Sebuah ',
        code('404.html'),
        ' dihasilkan otomatis — konvensi yang dipahami Netlify, Cloudflare Pages, dan GitHub Pages.',
      ),
      p(
        'Versi siap salin dari semua ini tersedia di ',
        a({ href: '/id/examples/basic' }, 'contoh dasar'),
        ' (',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo/tree/main/examples/basic',
            rel: 'noopener',
          },
          'examples/basic',
        ),
        ' di repositori).',
      ),
      h2('Netlify'),
      codeBlock('netlify.toml', s.netlify, 'bash'),
      h2('Vercel'),
      codeBlock('vercel.json', s.vercel, 'javascript'),
      h2('Cloudflare Pages'),
      p(
        'Build lewat dasbor: setel perintah build ',
        code('npm run build'),
        ' dan direktori keluaran ',
        code('dist'),
        '. Atau terapkan dari CLI dengan ',
        code('npx wrangler pages deploy dist'),
        '.',
      ),
      codeBlock('wrangler.toml', s.wrangler, 'bash'),
      h2('AWS Amplify'),
      codeBlock('amplify.yml', s.amplify, 'bash'),
      p(
        'Untuk S3 + CloudFront biasa: ',
        code('npm run build'),
        ', lalu sinkronkan ',
        code('dist/'),
        ' ke bucket.',
      ),
      h2('GitHub Pages'),
      codeBlock('.github/workflows/deploy.yml', s.ghPages, 'bash'),
      p(
        'Menerapkan di bawah subjalur (',
        code('user.github.io/repo'),
        ')? Build dengan ',
        code('--base /repo/'),
        '.',
      ),
      h2('Sebelum menerbitkan'),
      ul(
        { class: 'docs-list' },
        li(
          'Setel ',
          code('site'),
          ' di ',
          code('sitelo.config.js'),
          ' agar ',
          code('sitemap.xml'),
          ' dihasilkan — lihat ',
          a({ href: '/id/docs/configuration' }, 'Konfigurasi'),
        ),
        li(
          'Tambahkan ',
          code('src/404.ht.js'),
          ' untuk halaman tidak-ditemukan bermerek (jika tidak, versi bawaan yang rapi akan dihasilkan)',
        ),
        li(
          code('sitelo preview'),
          ' menyajikan build produksi secara lokal untuk pemeriksaan terakhir',
        ),
      ),
    ],
  })
