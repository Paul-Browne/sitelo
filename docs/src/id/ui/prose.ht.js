import { h2, p } from 'javascript-to-html'
import { code, codeBlock, demo, propsTable, uiLayout } from '../../lib/id.js'

export default () =>
  uiLayout({
    title: 'Prosa',
    description:
      'Tata sebongkah HTML yang bukan Anda tulis — keluaran Markdown, bidang CMS, deskripsi RSS.',
    activeHref: '/id/ui/prose',
    children: [
      p(
        'Perender Markdown mengembalikan tag telanjang: ',
        code('<h2>'),
        ', ',
        code('<p>'),
        ', ',
        code('<ul>'),
        ', ',
        code('<blockquote>'),
        ' — tanpa kelas untuk dikaitkan. ',
        code('prose()'),
        ' membungkus HTML itu dan menatanya.',
      ),
      p(
        'Inilah satu-satunya pengecualian yang disengaja di pustaka ini. Di tempat lain, penataan dibatasi pada kelas ',
        code('su-'),
        ' justru agar ia tidak pernah menyentuh markup yang tidak Anda pilih; di sini tidak ada kelas untuk disasar, jadi aturannya mencocokkan tag telanjang — tetapi hanya di dalam pembungkusnya.',
      ),

      h2('Prosa dasar'),
      demo(`prose(
  '<h2>Memulai</h2>' +
  '<p>Tulis fungsi yang mengembalikan HTML. Jalankan <code>sitelo build</code>. Terbitkan <code>dist/</code>.</p>' +
  '<ul><li>Perutean berbasis berkas</li><li>Data saat build</li><li>Tanpa runtime klien</li></ul>'
)`, { align: 'stretch' }),

      h2('Semua yang ditatanya'),
      demo(`prose(
  '<h3>Sebuah judul</h3>' +
  '<p>Teks badan dengan <a href="/docs">sebuah tautan</a>, <strong>tebal</strong>, dan <code>kode sebaris</code>.</p>' +
  '<blockquote><p>Kutipan menonjol, dipisahkan dari teks di sekitarnya.</p></blockquote>' +
  '<ol><li>Pertama</li><li>Kedua<ul><li>Bersarang</li></ul></li></ol>' +
  '<pre><code>export default () => "&lt;h1&gt;Hai&lt;/h1&gt;"</code></pre>' +
  '<table><thead><tr><th>Opsi</th><th>Bawaan</th></tr></thead>' +
  '<tbody><tr><td>cleanUrls</td><td>true</td></tr><tr><td>outDir</td><td>dist</td></tr></tbody></table>' +
  '<hr>' +
  '<p>Tekan <kbd>⌘</kbd> <kbd>K</kbd> untuk mencari.</p>'
)`, { align: 'stretch' }),

      h2('Ukuran'),
      demo(`stack({ gap: 'lg' },
  prose({ size: 'sm' }, '<p><strong>Kecil</strong> — untuk ringkasan kartu atau bilah samping.</p>'),
  prose('<p><strong>Sedang</strong> — bawaannya, untuk teks badan artikel.</p>'),
  prose({ size: 'lg' }, '<p><strong>Besar</strong> — untuk pembuka pendek yang menonjol.</p>'),
)`, { align: 'stretch' }),

      h2('Dengan blog Markdown'),
      p(
        'Bentuk yang diinginkan contoh blognya: render Markdown-nya saat build, bungkus hasilnya, lalu terbitkan.',
      ),
      codeBlock('src/blog/[slug].ht.js', `import { marked } from 'marked'
import { article, body, h1, html, head, title } from 'javascript-to-html'
import { container, prose, styles, text } from 'sitelo/ui'

export async function data({ params }) {
  return { post: await loadPost(params.slug) }
}

export default ({ data }) => html({ lang: 'id' },
  head(title(data.post.title), styles()),
  body(
    container({ size: 'sm' },
      h1(data.post.title),
      text({ variant: 'caption' }, data.post.date),
      // marked mengembalikan string HTML tanpa kelas apa pun padanya
      prose(marked.parse(data.post.markdown)),
    ),
  ),
)`, 'javascript'),

      h2('Komponen di dalam prosa'),
      p(
        'Setiap aturan prosa mengecualikan elemen yang membawa kelas ',
        code('su-'),
        ', jadi komponen yang dijatuhkan ke dalam sebongkah prosa mempertahankan penataannya sendiri alih-alih ikut memungut margin artikel.',
      ),
      demo(`prose(
  '<p>Sedikit Markdown yang sudah dirender, lalu sebuah komponen:</p>',
  alert({ color: 'warning', title: 'Tetap peringatan biasa' },
    'Ia tidak ditata ulang oleh blok prosa di sekelilingnya.'),
  '<p>Dan kembali ke prosa.</p>',
)`, { align: 'stretch' }),

      h2('Sepatah kata tentang kepercayaan'),
      p(
        code('prose()'),
        ' merender anaknya sebagai HTML — itulah seluruh intinya, dan begitulah ',
        code('javascript-to-html'),
        ' bekerja dari ujung ke ujung. Jika HTML-nya datang dari tempat yang tidak Anda kendalikan, bersihkan sebelum ia sampai ke sini. Perender Markdown dengan HTML mentah dimatikan biasanya sudah cukup.',
      ),

      h2('Props'),
      propsTable([
        ['size', "'sm' | 'md' | 'lg'", "'md'", 'Ukuran fon dasar; selebihnya berskala dalam em darinya.'],
        ['as', 'string', "'div'", 'Elemen yang dirender, misalnya article.'],
      ]),
    ],
  })
