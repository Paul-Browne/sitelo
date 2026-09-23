import {
  a,
  div,
  em,
  h2,
  p,
  table,
  tbody,
  td,
  th,
  thead,
  tr,
} from 'javascript-to-html'
import { code, pageLayout } from '../lib/id.js'

function comparisonRow(tool, model, when) {
  return tr(td(tool), td(model), td(when))
}

export default () =>
  pageLayout({
    title: 'Tentang',
    description:
      'Mengapa sitelo ada — dari javascript-to-html ke vite-plugin-html-pages hingga perkakas situs statis yang lengkap.',
    activeHref: '/id/about',
    children: [
      p(
        'sitelo tidak dimulai sebagai framework. Ia dimulai dari keinginan untuk menulis markup dengan cara yang terasa wajar di JavaScript — dan terus tumbuh sampai seluruh jalur dari berkas halaman ke situs yang terbit tercakup.',
      ),
      h2('javascript-to-html'),
      p(
        'Mula-mula datang ',
        a(
          {
            href: 'https://www.npmjs.com/package/javascript-to-html',
            rel: 'noopener',
          },
          'javascript-to-html',
        ),
        ' (dikenal juga sebagai ',
        a({ href: 'https://ht.js.org', rel: 'noopener' }, 'ht.js'),
        '): cara sederhana dan intuitif untuk menghasilkan HTML di JavaScript, tanpa mesin templat atau framework yang rumit.',
      ),
      p(
        'Mengingat betapa lazimnya framework serba lengkap seperti React, menemukan solusi templat sederhana yang tidak membawa serta segalanya ternyata sulit. Dengan hanya berfokus pada mengubah JavaScript menjadi HTML — pada dasarnya fungsi yang mengembalikan string — ht.js tetap ringan, mudah dipakai, luwes, dan dapat diperluas.',
      ),
      p(
        'Permukaan yang kecil itu membuatnya cocok di banyak tempat: langsung di frontend (gaya SPA), dalam proses build untuk membuat situs statis (SSG), atau bahkan untuk perenderan sisi server (SSR).',
      ),
      h2('Mengajari Vite menghasilkan HTML'),
      p(
        'Itu menyelesaikan soal penulisan. Masalah berikutnya adalah build: Vite memperlakukan ',
        code('.js'),
        ' / ',
        code('.ts'),
        ' sebagai skrip, bukan halaman. Saya butuh konvensi yang menandai modul tertentu memang ',
        em('dimaksudkan'),
        ' menjadi HTML.',
      ),
      p(
        'Gagasannya lugas: berkas bernama ',
        code('*.ht.js'),
        ', ',
        code('*.html.js'),
        ', ',
        code('*.ht.ts'),
        ', dan sejenisnya harus diproses menjadi HTML alih-alih dibundel sebagai JavaScript klien. Konvensi itu menjadi ',
        a(
          {
            href: 'https://www.npmjs.com/package/vite-plugin-html-pages',
            rel: 'noopener',
          },
          'vite-plugin-html-pages',
        ),
        ' — perutean berbasis berkas, pemuatan data, aset, dan pembuatan statis di atas Vite.',
      ),
      h2('sitelo'),
      p(
        'sitelo membungkus Vite dan plugin itu menjadi satu pemasangan dan satu CLI. Anda mendapat pengalaman pengembang yang utuh dan kelas satu: ',
        code('sitelo'),
        ' untuk server langsung, ',
        code('sitelo build'),
        ' untuk produksi, nilai bawaan yang masuk akal, dan model halaman milik plugin tanpa perlu merakit rantai perkakasnya sendiri.',
      ),
      p(
        'Gagasan yang sama sampai ke bawah: halaman adalah modul yang mengembalikan HTML. sitelo adalah lapisan yang membuat gagasan itu terasa rampung.',
      ),
      h2('Perbandingannya'),
      p(
        'Sudah banyak perkakas bagus yang menerbitkan situs statis. Ceruk sitelo sengaja sempit: fungsi JavaScript (atau TypeScript) yang mengembalikan HTML, dengan pengalaman pengembangan Vite, dan sesedikit mungkin framework.',
      ),
      div(
        { class: 'docs-table-scroll' },
        table(
          { class: 'docs-table docs-table--wrap-last' },
          thead(tr(th('Perkakas'), th('Model'), th('Pilih saat'))),
          tbody(
            comparisonRow(
              'sitelo',
              'Fungsi JS/TS → HTML di atas Vite',
              'Anda ingin HTML dari JavaScript dengan alur kerja Vite sungguhan — tanpa perlu framework komponen',
            ),
            comparisonRow(
              'Astro',
              'Komponen + island, kompiler sendiri',
              'Situs konten yang menginginkan island komponen dan ekosistem lebih besar',
            ),
            comparisonRow(
              'Next.js',
              'Aplikasi React penuh (SSR / SSG / ISR)',
              'Anda membangun aplikasi di ekosistem React',
            ),
            comparisonRow(
              'Hugo',
              'Templat Go, build sangat cepat',
              'Situs konten raksasa dan Anda nyaman dengan rantai perkakas Go',
            ),
            comparisonRow(
              'Eleventy',
              'Bahasa templat → HTML',
              'Anda ingin templat yang luwes (Nunjucks, Liquid, …) tanpa framework SPA',
            ),
          ),
        ),
      ),
      p(
        'Jika Anda ingin komponen, hidrasi, dan framework — pakailah framework. Jika Anda ingin berkas HTML dari fungsi JavaScript dengan pengalaman Vite, sitelo adalah perkakas terkecil yang menuntaskan seluruh pekerjaannya.',
      ),
      p(
        a({ href: '/id/docs' }, 'Baca dokumentasi'),
        ' · ',
        a(
          {
            href: 'https://github.com/paul-browne/sitelo',
            rel: 'noopener',
          },
          'GitHub',
        ),
      ),
    ],
  })
