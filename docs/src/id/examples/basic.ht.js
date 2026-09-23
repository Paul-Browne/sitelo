import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, examplesLayout } from '../../lib/id.js'
import { basicSnippets } from '../../lib/snippets/examples-basic.js'

const s = basicSnippets('id')

export default () =>
  examplesLayout({
    title: 'Situs dasar',
    description:
      'Proyek sitelo minimal dan konfigurasi penerapan statis untuk Netlify, Vercel, Cloudflare Pages, dan AWS Amplify.',
    activeHref: '/id/examples/basic',
    children: [
      p(
        'Situs sitelo terkecil yang berguna: satu halaman, satu lembar gaya, dan konfigurasi hosting yang menerbitkan ',
        code('dist/'),
        '. Salin konfigurasinya ke proyek sitelo mana pun — semuanya hanya mengasumsikan ',
        code('npm run build'),
        ' → ',
        code('dist/'),
        '.',
      ),
      p(
        'Salinan yang bisa dijalankan ada di repositori sitelo, di bawah ',
        code('examples/basic/'),
        '.',
      ),
      h2('Yang Anda dapat'),
      ul(
        { class: 'docs-list' },
        li('Situs statis satu halaman yang dibangun dengan sitelo'),
        li(
          code('netlify.toml'),
          ', ',
          code('vercel.json'),
          ', ',
          code('wrangler.toml'),
          ', dan ',
          code('amplify.yml'),
        ),
        li('Penerapan sekali klik / sambung-repo dari folder contohnya'),
      ),
      h2('Tata letak proyek'),
      codeBlock('project', s.structure, 'bash'),
      pageCodeTabs({
        file: 'src/index.ht.js',
        template: s.pageTemplate,
        ht: s.pageHt,
        jsx: s.pageJsx,
      }),
      h2('Build'),
      codeBlock('shell', s.build, 'bash'),
      h2('Penerapan'),
      p(
        'Dari monorepo sitelo, setel direktori akar/base platform ke ',
        code('examples/basic'),
        '.',
      ),
      h3('Netlify'),
      codeBlock('netlify.toml', s.netlifyToml, 'toml'),
      h3('Vercel'),
      codeBlock('vercel.json', s.vercelJson, 'json'),
      p(
        a(
          {
            href: 'https://vercel.com/new/clone?repository-url=https://github.com/paul-browne/sitelo&root-directory=examples/basic&project-name=sitelo-basic',
            rel: 'noopener',
          },
          'Terapkan ke Vercel',
        ),
        ' · ',
        a(
          {
            href: 'https://app.netlify.com/start/deploy?repository=https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'Terapkan ke Netlify',
        ),
        ' (setel direktori base ke ',
        code('examples/basic'),
        ' saat diminta).',
      ),
      h3('Cloudflare Pages'),
      p(
        'Dasbor: perintah build ',
        code('npm run build'),
        ', direktori keluaran ',
        code('dist'),
        '. Atau ',
        code('npx wrangler pages deploy dist'),
        ' setelah build lokal.',
      ),
      codeBlock('wrangler.toml', s.wranglerToml, 'toml'),
      h3('AWS Amplify'),
      p(
        'Sambungkan repositorinya di Amplify Hosting. Untuk S3 + CloudFront biasa, build secara lokal lalu sinkronkan ',
        code('dist/'),
        ' ke bucket.',
      ),
      codeBlock('amplify.yml', s.amplifyYml, 'yaml'),
      p(
        'Bekerja dengan Cursor, Copilot, atau agen lain? Salin ',
        code('AGENTS.md'),
        ' dari contoh ini (atau lihat ',
        a({ href: '/id/docs/build-with-ai' }, 'Membangun dengan AI'),
        ') agar perkakasnya tidak mengarang pola React/Next.',
      ),
      p(
        a({ href: '/id/docs' }, 'Memulai'),
        ' · ',
        a({ href: '/id/docs/build-with-ai' }, 'Membangun dengan AI'),
        ' · ',
        a({ href: '/id/examples/todo' }, 'Aplikasi todo'),
        ' · ',
        a({ href: '/id/examples/islands' }, 'Contoh Island server'),
      ),
    ],
  })
