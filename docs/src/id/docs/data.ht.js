import { h2, h3, li, p, ul } from 'javascript-to-html'
import { code, codeBlock, pageCodeTabs, docsLayout } from '../../lib/id.js'
import { dataSnippets } from '../../lib/snippets/data.js'

const s = dataSnippets('id')

export default () =>
  docsLayout({
    title: 'Memuat data',
    description: 'data() saat build dan fetchWithCache untuk situs statis berbasis API.',
    activeHref: '/id/docs/data',
    children: [
      p(
        'Ekspor fungsi ',
        code('data()'),
        ' dan hasilnya muncul sebagai ',
        code('ctx.data'),
        ' di fungsi render Anda. Ia berjalan saat build, dan per permintaan di server pengembangan.',
      ),
      pageCodeTabs({
        file: 'src/blog/[slug].ht.js',
        template: s.dataTemplate,
        ht: s.dataHt,
        jsx: s.dataJsx,
      }),
      h2('fetchWithCache'),
      p(
        'Membangun banyak halaman dari API yang sama? Impor ',
        code('fetchWithCache'),
        ' dari sitelo:',
      ),
      codeBlock('src/blog/[slug].ht.js', s.cache, 'javascript'),
      h3('Opsi'),
      ul(
        { class: 'docs-list' },
        li(code('maxAge'), ' — masa berlaku singgahan dalam detik (bawaan ', code('3600'), ')'),
        li(code('cacheKey'), ' — kunci khusus (bawaan: hash dari URL + metode + header + body)'),
        li(code('forceRefresh'), ' — lewati singgahan'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'fs'"),
          ' | ',
          code("'none'"),
        ),
      ),
      h3('Mode singgahan'),
      ul(
        { class: 'docs-list' },
        li(code('auto'), ' (bawaan) — memori saat pengembangan, sistem berkas pada build produksi'),
        li(code('memory'), ' — dalam proses, dibersihkan saat proses berakhir'),
        li(code('fs'), ' — disimpan di bawah ', code('node_modules/.cache/')),
        li(code('none'), ' — selalu mengambil ulang'),
      ),
      p(
        'Secara bawaan hanya permintaan ',
        code('GET'),
        ' yang disinggahkan (berikan ',
        code('cacheKey'),
        ' untuk menyinggahkan metode lain). Respons galat tidak pernah disinggahkan.',
      ),
      h2('Berkas JSON lokal'),
      p(
        'Tidak punya API? Simpan kontennya di repositori sebagai JSON dan baca dengan ',
        code('sitelo/data'),
        '.',
      ),
      codeBlock('project', s.jsonTree, 'bash'),
      codeBlock('src/blog/[slug].ht.js', s.jsonCollection, 'javascript'),
      p(
        'Jalur relatif diselesaikan dari akar proyek, jadi ',
        code('data/posts'),
        ' berarti hal yang sama dari mana pun Anda menjalankan CLI. ',
        code('readJson'),
        ' mengembalikan satu berkas terurai; ',
        code('readJsonCollection'),
        ' mengembalikan larik entri, masing-masing dengan ',
        code('slug'),
        ' — dari direktori berisi berkas ',
        code('.json'),
        ' (satu per entri, slug dari nama berkas), atau dari satu berkas berisi larik entri maupun objek berkunci slug.',
      ),
      codeBlock('src/blog/[slug].ht.js', s.jsonSources, 'javascript'),
      h3('Opsi koleksi'),
      ul(
        { class: 'docs-list' },
        li(
          code('slug'),
          ' — nama bidang atau fungsi; bawaannya nama berkas, kunci objek, atau ',
          code('slug'),
          ' / ',
          code('id'),
          ' milik entri itu sendiri',
        ),
        li(
          code('sort'),
          ' — nama bidang (',
          code("'date'"),
          ' menaik, ',
          code("'-date'"),
          ' menurun) atau fungsi pembanding',
        ),
        li(
          code('recursive'),
          ' — sertakan berkas ',
          code('.json'),
          ' di subdirektori, dengan slug dari jalurnya',
        ),
        li(code('root'), ' — direktori tempat jalur relatif diselesaikan'),
        li(
          code('cache'),
          ' — ',
          code("'auto'"),
          ' | ',
          code("'memory'"),
          ' | ',
          code("'none'"),
        ),
      ),
      p(
        'Pembacaan diingat per berkas, jadi build 500 halaman mengurai tiap berkas sekali saja. Server pengembangan justru memvalidasi ulang terhadap waktu ubah, dan memuat ulang peramban ketika berkas JSON yang dibaca sebuah halaman berubah. Slug ganda, berkas hilang, dan JSON rusak menggagalkan build, masing-masing disebut dengan jalurnya.',
      ),
    ],
  })
