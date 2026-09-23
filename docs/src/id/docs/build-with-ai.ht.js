import { a, h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, docsLayout } from '../../lib/id.js'
import { buildWithAiSnippets } from '../../lib/snippets/build-with-ai.js'

const s = buildWithAiSnippets('id')

export default () =>
  docsLayout({
    title: 'Membangun dengan AI',
    description:
      'Beri agen pengodean pengetahuan sitelo yang mutakhir lewat llms.txt, aturan proyek, dan kiat praktis.',
    activeHref: '/id/docs/build-with-ai',
    children: [
      p(
        'Editor AI dan agen pengodean sering menebak salah soal sitelo — mereka meraih pola React, Next, atau Astro yang tidak berlaku. Panduan ini menunjukkan cara mengarahkan mereka ke dokumentasi sitelo terkini dan menjaga kode hasil generasi tetap sesuai modelnya.',
      ),
      h2('llms.txt'),
      p(
        'sitelo menerbitkan ringkasan framework yang terbaca mesin di ',
        a({ href: '/llms.txt' }, 'sitelo.dev/llms.txt'),
        '. Banyak agen dapat mengambil URL; minta agen Anda membaca berkas itu (dan dokumentasi untuk manusia) sebelum menulis kode sitelo.',
      ),
      ul(
        { class: 'docs-list' },
        li(a({ href: '/llms.txt' }, 'https://sitelo.dev/llms.txt'), ' — API dan konvensi secara ringkas'),
        li(a({ href: '/id/docs' }, 'https://sitelo.dev/docs'), ' — panduan lengkap'),
        li(
          a({ href: 'https://github.com/paul-browne/sitelo' }, 'README GitHub'),
          ' — model berpikir dan ikhtisar fitur',
        ),
        li(
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'https://ht.js.org'),
          ' — dokumentasi ',
          code('javascript-to-html'),
          ' (disarankan untuk menulis HTML di JS)',
        ),
      ),
      p(
        'Berbeda dengan server MCP dokumentasi, ',
        code('llms.txt'),
        ' tidak perlu dipasang — tempelkan URL-nya ke obrolan, tambahkan ke aturan proyek, atau biarkan agen mengambilnya.',
      ),
      h2('Aturan proyek'),
      p(
        'Jika perkakas Anda mendukung instruksi permanen (',
        code('AGENTS.md'),
        ', aturan Cursor, instruksi Copilot, …), tambahkan aturan sitelo singkat agar setiap sesi dimulai dengan model berpikir yang benar. ',
        a({ href: '/id/examples/basic' }, 'Contoh dasar'),
        ' menyertakan ',
        code('AGENTS.md'),
        ' yang bisa Anda salin:',
      ),
      codeBlock('AGENTS.md', s.agents, 'markdown'),
      h3('Cursor'),
      p(
        'Buat ',
        code('.cursor/rules/sitelo.mdc'),
        ' di proyek Anda (atau tempelkan teks yang sama ke antarmuka aturan proyek Cursor):',
      ),
      codeBlock('.cursor/rules/sitelo.mdc', s.cursorRule, 'markdown'),
      h2('Kiat untuk kerja sitelo berbantuan AI'),
      ul(
        { class: 'docs-list' },
        li(
          'Mulailah dari templat — minta agen membuat kerangka dari ',
          a({ href: '/id/examples/basic' }, 'examples/basic'),
          ' atau ',
          a({ href: '/id/examples/wordpress' }, 'examples/wordpress'),
          ' alih-alih mengarang framework.',
        ),
        li(
          'Untuk markup, pilih ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'javascript-to-html'),
          ' (',
          code('ht.js'),
          ') — fungsi tag yang mengembalikan string HTML, tanpa mesin templat atau React. Arahkan agen ke ',
          a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js.org'),
          ' agar mereka tidak mengarang pohon komponen JSX.',
        ),
        li(
          'Halaman adalah fungsi yang mengembalikan HTML — ',
          code('export default () => `<html>…</html>`'),
          ' atau susun dengan ',
          code('javascript-to-html'),
          '. JSX tidak masalah selama dikompilasi menjadi string; runtime React tidak diperlukan.',
        ),
        li(
          'Gunakan CLI sitelo — ',
          code('sitelo'),
          ' / ',
          code('sitelo build'),
          ' — bukan ',
          code('vite'),
          ' langsung, kecuali Anda tahu butuh konfigurasi Vite khusus.',
        ),
        li(
          'Verifikasi API terhadap ',
          a({ href: '/llms.txt' }, 'llms.txt'),
          ' — terutama ',
          code('generateStaticParams'),
          ', ',
          code('fetchWithCache'),
          ', dan ',
          a({ href: '/id/docs/islands' }, 'island server'),
          '.',
        ),
        li(
          'Nol JS secara bawaan — tautkan ',
          code('<script>'),
          ' hanya bila halaman butuh kode klien; modul yang tidak dirujuk tetap khusus server.',
        ),
        li(
          'Tinjau dan jalankan — selalu ',
          code('sitelo build'),
          ' (atau server pengembangan) setelah agen menyunting halaman; anggap markup hasil generasi sebagai draf.',
        ),
      ),
      p(
        a({ href: '/id/docs' }, 'Memulai'),
        ' · ',
        a({ href: '/id/examples/basic' }, 'Contoh dasar'),
        ' · ',
        a({ href: '/llms.txt' }, 'llms.txt'),
      ),
    ],
  })
